"""Tests for MusicXML parsing functionality."""

import os
from pathlib import Path

import pytest

from app.musicxml.parse import parse_musicxml_to_payload


def get_test_file_path(filename: str) -> Path:
    """Get the path to a test MusicXML file."""
    return Path(__file__).parent / filename


def test_parse_scale():
    """Test parsing a simple scale."""
    file_path = get_test_file_path("test_scale.musicxml")
    with open(file_path, "rb") as f:
        raw_xml = f.read()
    
    result = parse_musicxml_to_payload(raw_xml)
    
    # Check structure
    assert "metadata" in result
    assert "events" in result
    assert "fingerings" in result
    assert "midiBase64" in result
    
    # Check metadata
    assert result["metadata"]["qpm"] == 100.0
    assert result["metadata"]["secondsPerQuarter"] == 0.6
    
    # Check events - should have 8 notes (C4 to C5)
    assert len(result["events"]) == 8
    assert result["events"][0]["spelling"] == "C4"
    assert result["events"][-1]["spelling"] == "C5"
    
    # Check fingerings match events
    assert len(result["fingerings"]) == 8
    assert all(f["eventIndex"] == i for i, f in enumerate(result["fingerings"]))
    
    # Check MIDI base64 is present
    assert isinstance(result["midiBase64"], str)
    assert len(result["midiBase64"]) > 0


def test_parse_rests():
    """Test parsing MusicXML with rests."""
    file_path = get_test_file_path("test_rests.musicxml")
    with open(file_path, "rb") as f:
        raw_xml = f.read()
    
    result = parse_musicxml_to_payload(raw_xml)
    
    # Should have 3 note events (E4, F4, G4) - rests are skipped
    assert len(result["events"]) == 3
    
    # Check that events are properly spaced (rests create gaps)
    events = result["events"]
    # E4 at t=0, F4 after rest, G4 after another rest
    assert events[0]["spelling"] == "E4"
    assert events[1]["spelling"] == "F4"
    assert events[2]["spelling"] == "G4"
    
    # Check timing - F4 should start after E4 + rest (0.5s + 0.5s = 1.0s at 120 bpm)
    assert events[1]["t0_sec"] > events[0]["t0_sec"] + events[0]["dur_sec"]
    
    # Check fingerings
    assert len(result["fingerings"]) == 3


def test_parse_ties():
    """Test parsing MusicXML with tied notes."""
    file_path = get_test_file_path("test_ties.musicxml")
    with open(file_path, "rb") as f:
        raw_xml = f.read()
    
    result = parse_musicxml_to_payload(raw_xml)
    
    # Tied notes should be merged into single events
    # C4 tied (2 quarters), D4 (1 quarter), E4 tied (3 quarters), F4 (2 quarters)
    # Total: 4 events
    assert len(result["events"]) == 4
    
    events = result["events"]
    
    # First event should be C4 with duration of 2 quarters (tied)
    assert events[0]["spelling"] == "C4"
    assert events[0]["ql"] == 2.0
    
    # Second event should be D4
    assert events[1]["spelling"] == "D4"
    assert events[1]["ql"] == 1.0
    
    # Third event should be E4 with duration of 3 quarters (tied across measures)
    assert events[2]["spelling"] == "E4"
    assert events[2]["ql"] == 3.0
    
    # Fourth event should be F4
    assert events[3]["spelling"] == "F4"
    assert events[3]["ql"] == 2.0
    
    # Check fingerings
    assert len(result["fingerings"]) == 4


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

