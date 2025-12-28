# Saxophone Settings Dashboard - User Guide

## Overview
The Saxophone Settings Dashboard provides a comprehensive, user-friendly interface to adjust all synthesizer parameters in real-time and test the sound.

## How to Access

Click the **⚙️ gear icon** in the top-right corner of the application to open the settings panel.

The settings panel will slide in from the right side of the screen. Click the **✕** button or click outside the panel to close it.

## Interface Layout

### 1. Preset Buttons (Top Section)
Quick-access buttons to load predefined saxophone configurations:
- **Default Alto** - Standard alto saxophone sound
- **Bright Alto** - Brighter, more aggressive alto
- **Tenor Sax** - Darker, mellower tenor sound
- **Soprano Sax** - Higher, brighter soprano tone
- **Smooth Jazz** - Soft, smooth articulation
- **Classical** - Clean, controlled classical style

### 2. Tab Navigation
The settings are organized into 6 categories:
- **Harmonics** - Brightness and tone color
- **Vibrato** - Pitch modulation settings
- **Attack** - Note start characteristics
- **Envelope** - Volume shape (ADSR)
- **Breath** - Air noise and breathiness
- **Formants** - Resonant peaks (saxophone body)

### 3. Parameter Sliders
Each parameter has:
- **Label** - Shows the parameter name and current value
- **ⓘ Info icon** - Hover to see a tooltip explaining what the parameter does
- **Slider** - Drag to adjust the value
- Changes are applied **immediately** in real-time

### 4. Test Keyboard (Bottom Section)
A visual piano keyboard with 7 white keys (C D E F G A B).

**Two ways to play:**
1. **Click** the keys with your mouse
2. **Press keyboard keys 1-7** (maps to C D E F G A B)

Keys light up green when pressed and play a short test note using your current settings.

## Parameter Categories

### 🎵 Harmonics
Controls the timbre and brightness of the tone:
- **Min/Max Harmonics** - Number of overtones (more = brighter)
- **Harmonic Rolloff** - High-frequency content (higher = brighter)
- **Rolloff Velocity** - How velocity affects brightness
- **Mix Level** - Overall harmonic volume

**Quick Tip:** For a brighter sound, increase Max Harmonics and Harmonic Rolloff.

### 🎭 Vibrato
Controls pitch modulation:
- **Rate** - Speed of vibrato (Hz)
- **Depth** - Amount of pitch variation (cents)
- **Delay** - Time before vibrato starts
- **Ramp Time** - How gradually vibrato increases

**Quick Tip:** Classical style uses less depth (6-8 cents), jazz uses more (10-15 cents).

### 💥 Attack
Controls how notes start:
- **Pitch Bend** - Initial pitch "scoop" effect
- **Pitch Bend Time** - Duration of pitch slide
- **Key Click Duration/Gain** - Mechanical key sound
- **Breath Attack Duration/Gain** - Initial breath noise
- **Filters** - Tone shaping for attack sounds

**Quick Tip:** For smoother playing, reduce Key Click Gain and increase Attack time.

### 📊 Envelope (ADSR)
Controls volume shape over time:
- **Attack** - How fast notes reach full volume
- **Decay** - Time to settle to sustain level
- **Sustain** - Held note volume (% of peak)
- **Release** - Fade-out time
- **Peak Gain Min/Max** - Dynamic range

**Quick Tip:** Faster attacks (lower Attack Min) sound more aggressive.

### 🌬️ Breath
Controls air noise and breathiness:
- **Filter Freq** - Tone of breath noise
- **Filter Q** - Bandwidth of noise
- **Attack Level** - Breathiness at note start
- **Sustain Level** - Breathiness during held notes
- **Fade Time** - Transition from attack to sustain

**Quick Tip:** More breath noise (0.15-0.2) sounds more realistic but less clean.

### 🎤 Formants
Controls resonant peaks that define saxophone character:
- **Formant 1** (Low-Mid) - Body and warmth
- **Formant 2** (Mid) - Presence and clarity
- **Formant 3** (High-Mid) - Brightness and edge

Each formant has:
- **Frequency** - Where the resonance occurs
- **Q** - Sharpness of the peak
- **Gain** - Boost amount (dB)

**Saxophone Type Frequencies:**
| Formant | Alto | Tenor | Soprano |
|---------|------|-------|---------|
| F1 | 800 Hz | 600 Hz | 1000 Hz |
| F2 | 1500 Hz | 1200 Hz | 1800 Hz |
| F3 | 2500 Hz | 2000 Hz | 3000 Hz |

**Quick Tip:** Adjust all three formant frequencies together to change sax type.

## Workflow Tips

### Starting Fresh
1. Click a **Preset** button that's closest to your desired sound
2. Switch to the relevant **Tab** for what you want to adjust
3. **Tweak sliders** while testing with the keyboard
4. **Iterate** until you like the sound

### Testing Changes
- Use the **Test Keyboard** to hear changes immediately
- Press keys **1-7** repeatedly to test attack characteristics
- Hold a key (click and hold) to test sustain and release

### Common Adjustments

**Make it Brighter:**
- Harmonics tab: Increase Max Harmonics to 10-11
- Harmonics tab: Increase Harmonic Rolloff to 0.90-0.95
- Formants tab: Increase Formant 2 & 3 Gain

**Make it Darker:**
- Harmonics tab: Decrease Max Harmonics to 6-7
- Harmonics tab: Decrease Harmonic Rolloff to 0.75-0.80
- Formants tab: Lower all Formant Frequencies

**Make it More Aggressive:**
- Attack tab: Increase Key Click Gain to 0.20-0.25
- Attack tab: Increase Breath Attack Gain to 0.25-0.30
- Envelope tab: Decrease Attack Min to 0.010-0.012
- Vibrato tab: Increase Depth to 12-15

**Make it Smoother:**
- Attack tab: Decrease Key Click Gain to 0.05-0.08
- Attack tab: Decrease Breath Attack Gain to 0.10-0.12
- Envelope tab: Increase Attack times
- Vibrato tab: Decrease Depth to 6-8

**Make it More Realistic:**
- Breath tab: Increase Attack Level to 0.15-0.18
- Breath tab: Increase Sustain Level to 0.10-0.12
- Attack tab: Increase Pitch Bend to 20-30
- Vibrato tab: Set Delay to 0.15-0.20

**Make it More Synthetic/Clean:**
- Attack tab: Set Key Click Gain to 0.02-0.05
- Breath tab: Set both levels to 0.03-0.05
- Attack tab: Decrease Pitch Bend to 5-10
- Vibrato tab: Decrease Depth to 5-6

## Keyboard Shortcuts

- **1-7** - Play test notes (C D E F G A B)
- **Esc** - Close settings panel (future enhancement)

## Technical Notes

- All changes are applied **immediately** - no "Apply" button needed
- Settings are **not saved** between sessions (future enhancement)
- The test keyboard plays at **middle C octave** (MIDI notes 60-71)
- Test notes play for **0.5 seconds** at velocity **80**

## Troubleshooting

**Keys not working:**
- Make sure the settings panel has focus (click inside it first)
- Try clicking a key instead of using keyboard
- Check browser console for errors

**Changes not audible:**
- Make sure you've clicked "Parse on server" on a MusicXML file first
- Try playing a test note with the keyboard
- Check that sliders are actually moving when you drag them

**Sound is distorted:**
- Too many harmonics or too much gain can cause clipping
- Try resetting to a preset and adjusting more gradually
- Reduce Peak Gain Max in the Envelope tab

## Future Enhancements

Planned features:
- Save/load custom presets
- Export/import preset JSON files
- A/B comparison mode
- Real-time waveform visualization
- Preset sharing
- MIDI keyboard support

---

Enjoy crafting your perfect saxophone sound! 🎷

