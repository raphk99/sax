from __future__ import annotations

import base64
import io
from dataclasses import asdict, dataclass
from typing import Any, Dict, List, Optional, Tuple

import mido
from music21 import converter, note, stream, tempo

from app.sax.fingering_alto import (
    fingering_for_written_midi,
    is_supported_written_midi,
    key_states_to_dict,
)


@dataclass(frozen=True)
class NoteEvent:
    idx: int
    t0_sec: float
    dur_sec: float
    ql: float
    midi_written: int
    midi_sounding: int
    spelling: str


def _first_tempo_qpm(s: stream.Stream) -> float:
    marks = list(s.recurse().getElementsByClass(tempo.MetronomeMark))
    for mm in marks:
        qpm = mm.getQuarterBPM()
        if qpm:
            return float(qpm)
    return 120.0


def _pick_part(s: stream.Score) -> stream.Stream:
    parts = list(s.parts) if hasattr(s, "parts") else []
    if not parts:
        return s
    # MVP: pick the first part with any notes in it.
    for p in parts:
        if p.recurse().notes:
            return p
    return parts[0]


def _extract_monophonic_events(
    part: stream.Stream, qpm: float, transpose_semitones: int
) -> Tuple[List[NoteEvent], Dict[str, Any]]:
    seconds_per_quarter = 60.0 / qpm
    meta: Dict[str, Any] = {
        "qpm": qpm,
        "secondsPerQuarter": seconds_per_quarter,
        "transposeSemitonesSounding": transpose_semitones,
        "warnings": [],
    }

    # Flatten to a single timeline; MVP assumes monophonic melody.
    flat = part.flat
    elements = list(flat.recurse().notesAndRests)

    events: List[NoteEvent] = []
    t0_sec = 0.0
    cur_tied_pitch: Optional[note.Note] = None
    cur_tied_dur_ql = 0.0

    def flush_tie_if_any():
        nonlocal cur_tied_pitch, cur_tied_dur_ql, t0_sec
        if cur_tied_pitch is None:
            return
        midi_written = int(cur_tied_pitch.pitch.midi)
        midi_sounding = midi_written + transpose_semitones
        spelling = cur_tied_pitch.pitch.nameWithOctave
        dur_sec = float(cur_tied_dur_ql * seconds_per_quarter)
        idx = len(events)
        events.append(
            NoteEvent(
                idx=idx,
                t0_sec=float(t0_sec),
                dur_sec=dur_sec,
                ql=float(cur_tied_dur_ql),
                midi_written=midi_written,
                midi_sounding=midi_sounding,
                spelling=spelling,
            )
        )
        t0_sec += dur_sec
        cur_tied_pitch = None
        cur_tied_dur_ql = 0.0

    for el in elements:
        # Chords are treated as polyphonic; pick highest pitch and warn.
        if el.isChord:
            meta["warnings"].append("Chords detected; using top note only (MVP).")
            el = el.sortAscending().pitches[-1]

        if isinstance(el, note.Rest):
            flush_tie_if_any()
            t0_sec += float(el.quarterLength * seconds_per_quarter)
            continue

        if not isinstance(el, note.Note):
            continue

        tie_type = el.tie.type if el.tie else None

        if tie_type in ("start", "continue"):
            if cur_tied_pitch is None:
                cur_tied_pitch = el
            cur_tied_dur_ql += float(el.quarterLength)
            continue

        if tie_type == "stop":
            if cur_tied_pitch is None:
                cur_tied_pitch = el
            cur_tied_dur_ql += float(el.quarterLength)
            flush_tie_if_any()
            continue

        # Normal untied note
        flush_tie_if_any()
        midi_written = int(el.pitch.midi)
        midi_sounding = midi_written + transpose_semitones
        spelling = el.pitch.nameWithOctave
        dur_sec = float(el.quarterLength * seconds_per_quarter)
        idx = len(events)
        events.append(
            NoteEvent(
                idx=idx,
                t0_sec=float(t0_sec),
                dur_sec=dur_sec,
                ql=float(el.quarterLength),
                midi_written=midi_written,
                midi_sounding=midi_sounding,
                spelling=spelling,
            )
        )
        t0_sec += dur_sec

    flush_tie_if_any()
    return events, meta


def _events_to_midi_base64(events: List[NoteEvent], qpm: float) -> str:
    mid = mido.MidiFile(ticks_per_beat=480)
    track = mido.MidiTrack()
    mid.tracks.append(track)

    track.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(qpm), time=0))
    track.append(mido.MetaMessage("time_signature", numerator=4, denominator=4, time=0))

    # Build absolute-tick messages then convert to deltas.
    abs_msgs: List[Tuple[int, mido.Message]] = []
    for ev in events:
        start_tick = int(round(ev.ql * 0))  # placeholder; computed below
        # We'll reconstruct absolute ticks using cumulative quarter-length.
        # Use t0_sec back to quarters via qpm for stable rounding.
        start_ql = ev.t0_sec / (60.0 / qpm)
        start_tick = int(round(start_ql * mid.ticks_per_beat))
        dur_tick = int(round(ev.ql * mid.ticks_per_beat))
        abs_msgs.append((start_tick, mido.Message("note_on", note=ev.midi_sounding, velocity=90, time=0)))
        abs_msgs.append((start_tick + max(dur_tick, 1), mido.Message("note_off", note=ev.midi_sounding, velocity=0, time=0)))

    abs_msgs.sort(key=lambda x: x[0])
    last_tick = 0
    for tick, msg in abs_msgs:
        delta = max(0, tick - last_tick)
        msg.time = delta
        track.append(msg)
        last_tick = tick

    buf = io.BytesIO()
    mid.save(file=buf)
    return base64.b64encode(buf.getvalue()).decode("ascii")


def parse_musicxml_to_payload(raw_musicxml: bytes) -> Dict[str, Any]:
    # music21 can parse raw MusicXML bytes via parseData.
    s = converter.parseData(raw_musicxml)
    if not isinstance(s, stream.Score):
        # music21 may return a Stream; wrap it into Score-like metadata.
        score = stream.Score()
        score.insert(0, s)
        s = score

    qpm = _first_tempo_qpm(s)
    part = _pick_part(s)

    # Alto sax sounds a major 6th lower than written: -9 semitones.
    transpose_semitones_sounding = -9

    events, meta = _extract_monophonic_events(part, qpm, transpose_semitones_sounding)
    midi_b64 = _events_to_midi_base64(events, qpm)

    fingerings = []
    unsupported: List[int] = []
    for ev in events:
        fing = fingering_for_written_midi(ev.midi_written)
        fingerings.append(
            {
                "eventIndex": ev.idx,
                "keyStates": key_states_to_dict(fing),
            }
        )
        if not is_supported_written_midi(ev.midi_written):
            unsupported.append(ev.midi_written)

    if unsupported:
        unique = sorted(set(unsupported))
        meta["warnings"].append(
            f"Unsupported written MIDI notes (no fingering mapping): {unique}. "
            "Visualization will show all keys up for these notes."
        )

    return {
        "metadata": meta,
        "events": [asdict(e) for e in events],
        "fingerings": fingerings,
        "midiBase64": midi_b64,
    }


