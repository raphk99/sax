/**
 * Saxophone Audio Processing Library
 * Provides audio effects and presets for realistic saxophone sound
 */

export interface SaxAudioConfig {
  vibratoRate: number // Hz, default 6
  vibratoDepth: number // cents, default 8
  brightness: number // 0-100, default 50
  reverbAmount: number // 0-100, default 20
}

export const DEFAULT_SAX_CONFIG: SaxAudioConfig = {
  vibratoRate: 6.0,
  vibratoDepth: 8,
  brightness: 50,
  reverbAmount: 20,
}

export const JAZZ_PRESET: SaxAudioConfig = {
  vibratoRate: 6.5,
  vibratoDepth: 10,
  brightness: 65,
  reverbAmount: 25,
}

export const CLASSICAL_PRESET: SaxAudioConfig = {
  vibratoRate: 5.0,
  vibratoDepth: 6,
  brightness: 40,
  reverbAmount: 30,
}

export const SMOOTH_PRESET: SaxAudioConfig = {
  vibratoRate: 5.5,
  vibratoDepth: 5,
  brightness: 35,
  reverbAmount: 15,
}

export const BRIGHT_PRESET: SaxAudioConfig = {
  vibratoRate: 6.2,
  vibratoDepth: 9,
  brightness: 75,
  reverbAmount: 18,
}

/**
 * Create a vibrato effect using LFO (Low Frequency Oscillator)
 * Returns the output gain node to connect to the next effect
 */
export function createVibratoEffect(
  audioCtx: AudioContext,
  config: SaxAudioConfig
): { input: GainNode; output: GainNode } {
  // Create nodes
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  
  // Create LFO (Low Frequency Oscillator) for vibrato
  const lfo = audioCtx.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = config.vibratoRate
  
  // Create gain to control vibrato depth
  // Convert cents to frequency ratio: cents/1200 gives semitones, 2^(semitones/12) gives ratio
  // For small values, we can approximate: depth_cents/1200 ≈ frequency deviation
  const vibratoDepthGain = audioCtx.createGain()
  // Depth in cents: 100 cents = 1 semitone
  // We want the LFO to modulate pitch by ±depth/2 cents
  // For a 440Hz note with 10 cents vibrato: 440 * 2^(10/1200) ≈ 442.5Hz
  // The detune parameter accepts cents directly
  const depthInCents = config.vibratoDepth / 2 // ±depth/2
  vibratoDepthGain.gain.value = depthInCents
  
  // Note: Web Audio API doesn't have a direct pitch shift for arbitrary audio
  // For soundfont output, vibrato would need to be applied per-note
  // This creates the LFO infrastructure that can be used when scheduling notes
  
  lfo.connect(vibratoDepthGain)
  lfo.start()
  
  // Pass through for now - vibrato will be applied in the play function
  inputGain.connect(outputGain)
  
  return {
    input: inputGain,
    output: outputGain,
  }
}

/**
 * Create a tone filter to adjust brightness
 * Returns a BiquadFilterNode
 */
export function createToneFilter(
  audioCtx: AudioContext,
  brightness: number
): BiquadFilterNode {
  const filter = audioCtx.createBiquadFilter()
  
  // Brightness 0-100 maps to different filter characteristics
  // Lower brightness = warmer (emphasize lows, cut highs)
  // Higher brightness = brighter (emphasize highs)
  
  if (brightness < 50) {
    // Warm tone: use lowpass filter
    filter.type = 'lowpass'
    // Map 0-50 to 1000-4000 Hz cutoff
    filter.frequency.value = 1000 + (brightness / 50) * 3000
    filter.Q.value = 1.0
  } else {
    // Bright tone: use highshelf to boost highs
    filter.type = 'highshelf'
    // Map 50-100 to 2000-4000 Hz
    filter.frequency.value = 2000 + ((brightness - 50) / 50) * 2000
    // Map 50-100 to 0-6 dB gain
    filter.gain.value = ((brightness - 50) / 50) * 6
  }
  
  return filter
}

/**
 * Create a simple reverb effect using delay-based approach
 * Returns the output gain node
 */
export function createReverbEffect(
  audioCtx: AudioContext,
  amount: number
): { input: GainNode; output: GainNode } {
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  
  // Map amount 0-100 to wet/dry mix
  const wetLevel = amount / 100
  dryGain.gain.value = 1.0
  wetGain.gain.value = wetLevel * 0.3 // Scale down to avoid overwhelming
  
  // Create multiple delays for reverb effect
  const delays = [
    { time: 0.023, gain: 0.7 },
    { time: 0.037, gain: 0.5 },
    { time: 0.053, gain: 0.4 },
    { time: 0.071, gain: 0.3 },
  ]
  
  // Dry path
  inputGain.connect(dryGain)
  dryGain.connect(outputGain)
  
  // Wet path with multiple delays
  delays.forEach(({ time, gain }) => {
    const delay = audioCtx.createDelay()
    delay.delayTime.value = time
    
    const delayGain = audioCtx.createGain()
    delayGain.gain.value = gain
    
    inputGain.connect(delay)
    delay.connect(delayGain)
    delayGain.connect(wetGain)
  })
  
  wetGain.connect(outputGain)
  
  return {
    input: inputGain,
    output: outputGain,
  }
}

/**
 * Apply the complete effects chain to an audio source
 * Note: For soundfont-player, we can't easily intercept individual notes,
 * so we'll apply effects to the instrument's output
 */
export function createEffectsChain(
  audioCtx: AudioContext,
  config: SaxAudioConfig
): { input: GainNode; output: GainNode } {
  const inputGain = audioCtx.createGain()
  
  // Create effects
  const toneFilter = createToneFilter(audioCtx, config.brightness)
  const reverb = createReverbEffect(audioCtx, config.reverbAmount)
  
  // Chain: input -> tone filter -> reverb -> output
  inputGain.connect(toneFilter)
  toneFilter.connect(reverb.input)
  
  return {
    input: inputGain,
    output: reverb.output,
  }
}

/**
 * Get vibrato LFO value at a given time
 * This can be used to modulate note playback
 */
export function getVibratoValue(
  time: number,
  config: SaxAudioConfig,
  noteStartTime: number
): number {
  const elapsed = time - noteStartTime
  // Simple sine wave LFO
  const lfoValue = Math.sin(2 * Math.PI * config.vibratoRate * elapsed)
  // Return detune in cents
  return lfoValue * (config.vibratoDepth / 2)
}




