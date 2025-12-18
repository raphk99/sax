from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Dict, Iterable, Set


class KeyId(str, Enum):
    # Core left hand
    octave = "octave"
    lh1 = "lh1"
    lh2 = "lh2"
    lh3 = "lh3"

    # Core right hand
    rh1 = "rh1"
    rh2 = "rh2"
    rh3 = "rh3"

    # Left-hand pinky / aux
    gSharp = "gSharp"
    bisBb = "bisBb"

    # Right-hand side / pinky
    sideBb = "sideBb"
    sideC = "sideC"
    sideEb = "sideEb"

    lowC = "lowC"
    lowB = "lowB"
    lowBb = "lowBb"
    lowCsharp = "lowCsharp"

    # Palm keys (upper register)
    palmD = "palmD"
    palmEb = "palmEb"
    palmF = "palmF"


ALL_KEYS = [k.value for k in KeyId]


@dataclass(frozen=True)
class Fingering:
    pressed: Set[KeyId]
    name: str = "standard"


def _pressed(*keys: KeyId, name: str = "standard") -> Fingering:
    return Fingering(pressed=set(keys), name=name)


def key_states_to_dict(f: Fingering) -> Dict[str, bool]:
    pressed = f.pressed
    return {k.value: (k in pressed) for k in KeyId}


def fingering_for_written_midi(midi_written: int) -> Fingering:
    """
    MVP mapping placeholder.

    This returns a best-effort fingering for common written alto sax notes.
    Notes outside the supported range return an empty (all-up) fingering.
    """
    return _FINGERINGS.get(midi_written, _pressed())

def is_supported_written_midi(midi_written: int) -> bool:
    return midi_written in _FINGERINGS


# MVP fingering table (written pitch for alto sax).
#
# Notes:
# - This is a pragmatic “standard fingering” mapping to drive the visualization.
# - Real sax fingerings have alternates; we can extend the API later to return
#   multiple options per pitch and let the user select.
_FINGERINGS: Dict[int, Fingering] = {
    # Low register (written Bb3..B3) - simplified LH+RH stack + RH pinky for low notes.
    # Written Bb3 (58): B fingering + lowBb (common)
    58: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2, KeyId.rh3, KeyId.lowBb),
    # Written B3 (59)
    59: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2, KeyId.rh3, KeyId.lowB),
    # Written C4 (60): typically all main keys up (but sax has “C” with some combinations);
    # for visualization MVP we keep it all-up.
    60: _pressed(),
    # Written C#4 (61): add lowCsharp (simplified)
    61: _pressed(KeyId.lowCsharp),

    # Middle register (written D4..G4)
    62: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2, KeyId.rh3),  # D4
    63: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2, KeyId.sideEb),  # Eb4 (simplified)
    64: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2),  # E4
    65: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1),  # F4
    66: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.sideEb),  # F#4 (approx)
    67: _pressed(KeyId.lh1, KeyId.lh2),  # G4
    68: _pressed(KeyId.lh1, KeyId.lh2, KeyId.gSharp),  # Ab4/G#4
    69: _pressed(KeyId.lh1),  # A4
    70: _pressed(KeyId.lh1, KeyId.bisBb),  # Bb4 (bis)
    71: _pressed(KeyId.lh1, KeyId.lh2),  # B4

    # Upper register (written C5..F5) use octave + base fingerings
    72: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3),  # C5
    73: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.lowCsharp),  # C#5
    74: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2, KeyId.rh3),  # D5
    75: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2, KeyId.sideEb),  # Eb5
    76: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2),  # E5
    77: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1),  # F5
    78: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.sideEb),  # F#5 (approx)
    79: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2),  # G5
    80: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.gSharp),  # Ab5/G#5
    81: _pressed(KeyId.octave, KeyId.lh1),  # A5
    82: _pressed(KeyId.octave, KeyId.lh1, KeyId.bisBb),  # Bb5 (bis)
    83: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2),  # B5

    # Palm-key region (very simplified for MVP)
    86: _pressed(KeyId.octave, KeyId.palmD),  # D6
    87: _pressed(KeyId.octave, KeyId.palmEb),  # Eb6
    89: _pressed(KeyId.octave, KeyId.palmF),  # F6
}


