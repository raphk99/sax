# Saxophone Synthesizer Tuning Guide

This guide explains all the parameters you can tweak to customize the saxophone sound in `saxSynth.ts`.

## How to Use

### Method 1: Use a Preset Configuration
In `App.vue`, uncomment the preset imports and use them:

```typescript
import { SaxophoneSynthesizer, TENOR_SAX_CONFIG } from './lib/saxSynth'

// Then in ensureAudio():
synth.value = new SaxophoneSynthesizer(audioCtx.value, TENOR_SAX_CONFIG)
```

### Method 2: Customize Individual Parameters
```typescript
synth.value = new SaxophoneSynthesizer(audioCtx.value, {
  vibratoDepth: 15,        // More vibrato
  maxHarmonics: 11,        // Brighter tone
  breathNoiseLevelAttack: 0.2  // More breathiness
})
```

### Method 3: Update Config After Creation
```typescript
synth.value.updateConfig({ 
  vibratoRate: 6.0,
  harmonicRolloff: 0.9 
})
```

## Available Presets

### `DEFAULT_SAX_CONFIG` (Alto Saxophone)
Realistic alto saxophone tone - well-balanced and versatile

### `BRIGHT_ALTO_CONFIG`
Brighter, more aggressive alto sound
- More harmonics (11 vs 9)
- Less rolloff (brighter high end)
- More breath noise
- Boosted formants

### `TENOR_SAX_CONFIG`
Darker, mellower tenor saxophone
- Fewer harmonics (7)
- Lower formant frequencies
- Slower, subtler vibrato
- Less breath noise

### `SOPRANO_SAX_CONFIG`
Higher, brighter soprano tone
- Higher formant frequencies
- Faster, deeper vibrato
- More prominent key clicks

### `SMOOTH_JAZZ_CONFIG`
Less aggressive, smoother attack
- Slower attack times
- Minimal key clicks
- Less breath attack
- Subtle articulation

### `CLASSICAL_CONFIG`
Clean, controlled classical tone
- Minimal mechanical sounds
- Very subtle breathiness
- Delayed, light vibrato
- Precise attack

## Parameter Reference

### 🎵 Harmonic Structure (Timbre)

#### `minHarmonics` (default: 5)
- **Range**: 3-7
- **Effect**: Minimum number of harmonic overtones at low velocity
- **Increase** → Brighter minimum tone
- **Decrease** → Darker at soft playing

#### `maxHarmonics` (default: 9)
- **Range**: 7-13
- **Effect**: Maximum harmonics at high velocity
- **Increase** → Much brighter, more aggressive
- **Decrease** → Darker, mellower maximum tone

#### `harmonicRolloff` (default: 0.85)
- **Range**: 0.7-0.95
- **Effect**: How fast high harmonics decrease in volume
- **Increase** → Brighter (high harmonics louder)
- **Decrease** → Darker (high harmonics quieter)

#### `harmonicRolloffVelocity` (default: 0.1)
- **Range**: 0-0.2
- **Effect**: How much velocity affects brightness
- **Increase** → More dynamic brightness change
- **Decrease** → More consistent tone across velocities

#### `harmonicMixLevel` (default: 0.3)
- **Range**: 0.1-0.5
- **Effect**: Overall volume of harmonic oscillators
- **Increase** → Louder harmonics vs. noise
- **Decrease** → More noise-dominant, airier

---

### 🎭 Vibrato (LFO Modulation)

#### `vibratoRate` (default: 5.5 Hz)
- **Range**: 4-7 Hz
- **Effect**: How fast the pitch wobbles
- **Increase** → Nervous, intense vibrato
- **Decrease** → Slow, dramatic vibrato

#### `vibratoDepth` (default: 10 cents)
- **Range**: 5-20 cents
- **Effect**: How far the pitch varies
- **Increase** → More pronounced vibrato
- **Decrease** → Subtle, refined vibrato
- **Note**: 100 cents = 1 semitone

#### `vibratoDelay` (default: 0.15 sec)
- **Range**: 0.05-0.3 sec
- **Effect**: Time before vibrato starts
- **Increase** → More natural (players don't vibrate immediately)
- **Decrease** → Immediate vibrato (less natural)

#### `vibratoRampTime` (default: 0.2 sec)
- **Range**: 0.1-0.4 sec
- **Effect**: Time for vibrato to reach full depth
- **Increase** → Gradual vibrato onset
- **Decrease** → Sudden vibrato

---

### 💥 Attack Transients (Note Start)

#### `attackPitchBend` (default: 20 cents)
- **Range**: 5-40 cents
- **Effect**: How sharp the note starts before settling
- **Increase** → More pronounced "scoop" into pitch
- **Decrease** → Cleaner pitch attack

#### `attackPitchBendTime` (default: 0.03 sec)
- **Range**: 0.02-0.06 sec
- **Effect**: How fast pitch settles
- **Increase** → Slower pitch correction (more noticeable)
- **Decrease** → Faster pitch correction

#### `keyClickDuration` (default: 0.015 sec)
- **Range**: 0.005-0.025 sec
- **Effect**: Length of mechanical key sound
- **Increase** → Longer, more noticeable clicks
- **Decrease** → Shorter, subtler clicks

#### `keyClickFilterFreq` (default: 2000 Hz)
- **Range**: 1500-3500 Hz
- **Effect**: Tone of key click (high-pass cutoff)
- **Increase** → Thinner, sharper click
- **Decrease** → Fuller, rounder click

#### `keyClickGain` (default: 0.15)
- **Range**: 0.05-0.3
- **Effect**: Volume of key clicks
- **Increase** → More prominent mechanical sounds
- **Decrease** → Cleaner, less mechanical

#### `breathAttackDuration` (default: 0.05 sec)
- **Range**: 0.03-0.1 sec
- **Effect**: Length of breath attack noise
- **Increase** → Longer breath sound at start
- **Decrease** → Quicker articulation

#### `breathAttackFilterFreq` (default: 2000 Hz)
- **Range**: 1500-2500 Hz
- **Effect**: Center frequency of breath attack
- **Increase** → Brighter breath attack
- **Decrease** → Darker breath attack

#### `breathAttackFilterQ` (default: 1.5)
- **Range**: 1-3
- **Effect**: Bandwidth of breath filter
- **Increase** → Narrower, more focused
- **Decrease** → Wider, airier

#### `breathAttackGain` (default: 0.2)
- **Range**: 0.1-0.4
- **Effect**: Volume of breath attack
- **Increase** → More aggressive articulation
- **Decrease** → Softer articulation

---

### 📊 ADSR Envelope (Volume Shape)

#### `attackTimeMin` (default: 0.015 sec)
- **Range**: 0.01-0.03 sec
- **Effect**: Attack speed at high velocity
- **Increase** → Slower loud attacks
- **Decrease** → Snappier loud attacks

#### `attackTimeMax` (default: 0.03 sec)
- **Range**: 0.02-0.06 sec
- **Effect**: Attack speed at low velocity
- **Increase** → Slower soft attacks
- **Decrease** → Quicker soft attacks

#### `decayTime` (default: 0.08 sec)
- **Range**: 0.05-0.15 sec
- **Effect**: Time to reach sustain level
- **Increase** → Longer settle time
- **Decrease** → Quicker settle

#### `sustainLevel` (default: 0.8)
- **Range**: 0.6-0.95
- **Effect**: Sustain volume vs. peak
- **Increase** → Less dynamic drop-off
- **Decrease** → More pronounced envelope

#### `releaseTime` (default: 0.1 sec)
- **Range**: 0.05-0.25 sec
- **Effect**: Fade-out duration
- **Increase** → Longer tail
- **Decrease** → Shorter, more abrupt ending

#### `peakGainMin` (default: 0.2)
- **Range**: 0.1-0.3
- **Effect**: Volume at low velocity
- **Increase** → Louder soft notes
- **Decrease** → Quieter soft notes

#### `peakGainMax` (default: 0.5)
- **Range**: 0.3-0.8
- **Effect**: Volume at high velocity
- **Increase** → Louder loud notes (more dynamic range)
- **Decrease** → More compressed dynamics

---

### 🌬️ Breathiness / Air Noise

#### `breathNoiseFilterFreq` (default: 2500 Hz)
- **Range**: 2000-3500 Hz
- **Effect**: Center of breath noise band
- **Increase** → Brighter, thinner air sound
- **Decrease** → Darker, fuller air sound

#### `breathNoiseFilterQ` (default: 2)
- **Range**: 1.5-3
- **Effect**: Width of breath noise band
- **Increase** → Narrower (more tonal)
- **Decrease** → Wider (more noise-like)

#### `breathNoiseLevelAttack` (default: 0.15)
- **Range**: 0.08-0.25
- **Effect**: Breath noise during attack
- **Increase** → More airy attack
- **Decrease** → Cleaner attack

#### `breathNoiseLevelSustain` (default: 0.08)
- **Range**: 0.03-0.15
- **Effect**: Breath noise during sustain
- **Increase** → Airier sustained tone
- **Decrease** → Purer sustained tone

#### `breathNoiseFadeTime` (default: 0.05 sec)
- **Range**: 0.03-0.1 sec
- **Effect**: Transition time from attack to sustain
- **Increase** → Gradual breathiness reduction
- **Decrease** → Abrupt breathiness change

---

### 🎤 Formants (Tone Color)

Formants are resonant peaks that give the saxophone its characteristic "voice."

#### `formant1Freq` (default: 800 Hz)
- **Range**: 600-1000 Hz
- **Effect**: Low-mid resonance
- **Alto**: 800 Hz
- **Tenor**: 600 Hz
- **Soprano**: 1000 Hz

#### `formant1Q` (default: 4)
- **Range**: 3-6
- **Effect**: Sharpness of first formant peak
- **Increase** → More pronounced resonance
- **Decrease** → Broader, smoother

#### `formant1Gain` (default: 7 dB)
- **Range**: 4-10 dB
- **Effect**: Boost at first formant
- **Increase** → More body, fuller
- **Decrease** → Thinner

#### `formant2Freq` (default: 1500 Hz)
- **Range**: 1200-1800 Hz
- **Effect**: Mid resonance
- **Alto**: 1500 Hz
- **Tenor**: 1200 Hz
- **Soprano**: 1800 Hz

#### `formant2Q` (default: 3)
- **Range**: 2-4
- **Effect**: Sharpness of second formant
- **Increase** → More nasal quality
- **Decrease** → Smoother mids

#### `formant2Gain` (default: 6 dB)
- **Range**: 4-9 dB
- **Effect**: Presence and clarity
- **Increase** → More forward, present
- **Decrease** → More recessed

#### `formant3Freq` (default: 2500 Hz)
- **Range**: 2000-3000 Hz
- **Effect**: High-mid resonance
- **Alto**: 2500 Hz
- **Tenor**: 2000 Hz
- **Soprano**: 3000 Hz

#### `formant3Q` (default: 2.5)
- **Range**: 2-4
- **Effect**: Sharpness of third formant
- **Increase** → Edgier high end
- **Decrease** → Smoother highs

#### `formant3Gain` (default: 6 dB)
- **Range**: 4-8 dB
- **Effect**: Brightness and edge
- **Increase** → Brighter, cutting
- **Decrease** → Darker, mellower

---

## Tweaking Tips

### To Make It Brighter
```typescript
{
  maxHarmonics: 11,
  harmonicRolloff: 0.9,
  formant2Gain: 8,
  formant3Gain: 7
}
```

### To Make It Darker
```typescript
{
  maxHarmonics: 7,
  harmonicRolloff: 0.8,
  formant1Gain: 8,
  formant3Gain: 4
}
```

### To Make It More Aggressive
```typescript
{
  keyClickGain: 0.25,
  breathAttackGain: 0.3,
  attackTimeMin: 0.01,
  vibratoDepth: 15
}
```

### To Make It Smoother
```typescript
{
  keyClickGain: 0.05,
  breathAttackGain: 0.1,
  attackTimeMax: 0.05,
  vibratoDepth: 6
}
```

### To Make It More Realistic (Natural)
```typescript
{
  breathNoiseLevelAttack: 0.18,
  breathNoiseLevelSustain: 0.1,
  vibratoDelay: 0.2,
  attackPitchBend: 25
}
```

### To Make It More Synthetic (Clean)
```typescript
{
  keyClickGain: 0.02,
  breathNoiseLevelAttack: 0.03,
  breathNoiseLevelSustain: 0.01,
  attackPitchBend: 5
}
```

---

## Quick Reference: What Does What?

| Want More... | Increase These Parameters |
|--------------|---------------------------|
| **Brightness** | `maxHarmonics`, `harmonicRolloff`, `formant2Gain`, `formant3Gain` |
| **Warmth** | `formant1Gain`, decrease `harmonicRolloff` |
| **Breathiness** | `breathNoiseLevelAttack`, `breathNoiseLevelSustain` |
| **Vibrato** | `vibratoDepth`, `vibratoRate` |
| **Attack Snap** | Decrease `attackTimeMin`, increase `keyClickGain` |
| **Smoothness** | Decrease `keyClickGain`, increase `attackTimeMax` |
| **Realism** | `breathNoiseLevelAttack`, `attackPitchBend`, `vibratoDelay` |
| **Volume** | `peakGainMax`, `peakGainMin` |

---

## Example: Custom Blues Sax Config

```typescript
import { SaxophoneSynthesizer } from './lib/saxSynth'

// Custom blues tenor sax sound
const BLUES_SAX_CONFIG = {
  // Darker, grittier tenor tone
  minHarmonics: 6,
  maxHarmonics: 8,
  harmonicRolloff: 0.8,
  
  // Expressive vibrato
  vibratoRate: 5.0,
  vibratoDepth: 12,
  vibratoDelay: 0.12,
  
  // Aggressive attack
  attackPitchBend: 30,
  breathAttackGain: 0.25,
  keyClickGain: 0.18,
  
  // Tenor formants
  formant1Freq: 650,
  formant2Freq: 1250,
  formant3Freq: 2100,
  formant1Gain: 9,
  
  // More breath/grit
  breathNoiseLevelAttack: 0.2,
  breathNoiseLevelSustain: 0.12,
}

// Use it:
synth.value = new SaxophoneSynthesizer(audioCtx.value, BLUES_SAX_CONFIG)
```

Happy tweaking! 🎷

