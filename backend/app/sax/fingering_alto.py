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
# - This is a pragmatic "standard fingering" mapping to drive the visualization.
# - Real sax fingerings have alternates; we can extend the API later to return
#   multiple options per pitch and let the user select.
# - Based on standard Eb Alto Saxophone fingering chart
_FINGERINGS: Dict[int, Fingering] = {
    # Low register (written Bb3..C#4)
    # Written Bb3 (58): All 6 main keys + low Bb key
    58: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2, KeyId.rh3, KeyId.lowBb),
    # Written B3 (59): All 6 main keys + low B key
    59: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2, KeyId.rh3, KeyId.lowB),
    # Written C4 (60): All 6 main keys + low C key (or can be all keys up for some saxes)
    60: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2, KeyId.rh3, KeyId.lowC),
    # Written C#4 (61): lh1, lh2, lh3, rh1, rh2, rh3 + low C# key
    61: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2, KeyId.rh3, KeyId.lowCsharp),

    # Middle register (written D4..C5)
    # D4 (62): All 6 main keys
    62: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2, KeyId.rh3),
    # Eb4 (63): lh1, lh2, lh3, rh1, rh2 + side Eb
    63: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2, KeyId.sideEb),
    # E4 (64): lh1, lh2, lh3, rh1, rh2
    64: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2),
    # F4 (65): lh1, lh2, lh3, rh1
    65: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1),
    # F#4 (66): lh1, lh2, lh3 + side Eb (standard fingering)
    66: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.sideEb),
    # G4 (67): lh1, lh2, lh3
    67: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3),
    # Ab4/G#4 (68): lh1, lh2, lh3 + G# key
    68: _pressed(KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.gSharp),
    # A4 (69): lh1, lh2
    69: _pressed(KeyId.lh1, KeyId.lh2),
    # Bb4 (70): lh1 + bis Bb OR lh1 + side Bb (bis shown here)
    70: _pressed(KeyId.lh1, KeyId.bisBb),
    # B4 (71): lh1, lh2
    71: _pressed(KeyId.lh1, KeyId.lh2),
    # C5 (72): lh1
    72: _pressed(KeyId.lh1),
    # C#5 (73): lh1 + side Bb (or lh1 + low C#)
    73: _pressed(KeyId.lh1, KeyId.sideBb),

    # Upper register with octave key (written D5..C6)
    # D5 (74): octave + all 6 main keys
    74: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2, KeyId.rh3),
    # Eb5 (75): octave + lh1, lh2, lh3, rh1, rh2 + side Eb
    75: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2, KeyId.sideEb),
    # E5 (76): octave + lh1, lh2, lh3, rh1, rh2
    76: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1, KeyId.rh2),
    # F5 (77): octave + lh1, lh2, lh3, rh1
    77: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.rh1),
    # F#5 (78): octave + lh1, lh2, lh3 + side Eb
    78: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.sideEb),
    # G5 (79): octave + lh1, lh2, lh3
    79: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3),
    # Ab5/G#5 (80): octave + lh1, lh2, lh3 + G# key
    80: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.gSharp),
    # A5 (81): octave + lh1, lh2
    81: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2),
    # Bb5 (82): octave + lh1 + bis Bb
    82: _pressed(KeyId.octave, KeyId.lh1, KeyId.bisBb),
    # B5 (83): octave + lh1, lh2
    83: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2),
    # C6 (84): octave + lh1
    84: _pressed(KeyId.octave, KeyId.lh1),
    # C#6 (85): octave + lh1 + side Bb
    85: _pressed(KeyId.octave, KeyId.lh1, KeyId.sideBb),

    # Palm-key region (high altissimo)
    # D6 (86): octave + palm D (+ lh1, lh2, lh3 for support)
    86: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.palmD),
    # Eb6 (87): octave + palm Eb
    87: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.palmEb),
    # E6 (88): octave + palm Eb + lh2
    88: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.palmEb),
    # F6 (89): octave + palm F
    89: _pressed(KeyId.octave, KeyId.lh1, KeyId.lh2, KeyId.lh3, KeyId.palmF),
}


