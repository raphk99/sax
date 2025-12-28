/**
 * Configuration for saxophone synthesizer parameters
 * Tweak these values to get different saxophone tones!
 */
export interface SaxSynthConfig {
  // === HARMONIC STRUCTURE ===
  /** Minimum number of harmonics (more = brighter) */
  minHarmonics: number
  /** Maximum number of harmonics at full velocity */
  maxHarmonics: number
  /** Base harmonic rolloff factor (higher = brighter, 0.7-0.95) */
  harmonicRolloff: number
  /** Additional rolloff from velocity (0-0.2) */
  harmonicRolloffVelocity: number
  /** Overall harmonic mix level (0.1-0.5) */
  harmonicMixLevel: number
  
  // === VIBRATO (LFO) ===
  /** Vibrato rate in Hz (4-7 typical) */
  vibratoRate: number
  /** Vibrato depth in cents (5-15 typical) */
  vibratoDepth: number
  /** Delay before vibrato starts in seconds (0.1-0.3) */
  vibratoDelay: number
  /** Time for vibrato to reach full depth in seconds (0.1-0.3) */
  vibratoRampTime: number
  
  // === ATTACK TRANSIENTS ===
  /** Pitch bend amount at attack in cents (10-30) */
  attackPitchBend: number
  /** Pitch bend duration in seconds (0.02-0.05) */
  attackPitchBendTime: number
  /** Key click duration in seconds (0.005-0.02) */
  keyClickDuration: number
  /** Key click high-pass filter frequency in Hz (1500-3000) */
  keyClickFilterFreq: number
  /** Key click gain multiplier (0.05-0.25) */
  keyClickGain: number
  /** Breath attack duration in seconds (0.03-0.08) */
  breathAttackDuration: number
  /** Breath attack filter frequency in Hz (1500-2500) */
  breathAttackFilterFreq: number
  /** Breath attack filter Q (1-3) */
  breathAttackFilterQ: number
  /** Breath attack gain multiplier (0.1-0.3) */
  breathAttackGain: number
  
  // === ADSR ENVELOPE ===
  /** Minimum attack time in seconds at high velocity (0.01-0.03) */
  attackTimeMin: number
  /** Maximum attack time in seconds at low velocity (0.02-0.05) */
  attackTimeMax: number
  /** Decay time in seconds (0.05-0.15) */
  decayTime: number
  /** Sustain level as fraction of peak (0.6-0.9) */
  sustainLevel: number
  /** Release time in seconds (0.05-0.2) */
  releaseTime: number
  /** Minimum peak gain at low velocity (0.1-0.3) */
  peakGainMin: number
  /** Maximum peak gain at high velocity (0.3-0.7) */
  peakGainMax: number
  
  // === BREATHINESS/NOISE ===
  /** Breath noise filter center frequency in Hz (2000-3500) */
  breathNoiseFilterFreq: number
  /** Breath noise filter Q (1.5-3) */
  breathNoiseFilterQ: number
  /** Breath noise level during attack (0.1-0.25) */
  breathNoiseLevelAttack: number
  /** Breath noise level during sustain (0.05-0.15) */
  breathNoiseLevelSustain: number
  /** Breath noise fade time in seconds (0.03-0.08) */
  breathNoiseFadeTime: number
  
  // === FORMANTS ===
  /** First formant frequency in Hz (700-900) */
  formant1Freq: number
  /** First formant Q (3-5) */
  formant1Q: number
  /** First formant gain in dB (4-10) */
  formant1Gain: number
  /** Second formant frequency in Hz (1300-1700) */
  formant2Freq: number
  /** Second formant Q (2-4) */
  formant2Q: number
  /** Second formant gain in dB (4-8) */
  formant2Gain: number
  /** Third formant frequency in Hz (2200-2800) */
  formant3Freq: number
  /** Third formant Q (2-3.5) */
  formant3Q: number
  /** Third formant gain in dB (4-8) */
  formant3Gain: number
}

/**
 * Default configuration for alto saxophone sound
 * These values produce a realistic alto sax tone
 */
export const DEFAULT_SAX_CONFIG: SaxSynthConfig = {
  // Harmonic structure
  minHarmonics: 5,
  maxHarmonics: 9,
  harmonicRolloff: 0.85,
  harmonicRolloffVelocity: 0.1,
  harmonicMixLevel: 0.3,
  
  // Vibrato
  vibratoRate: 5.5,
  vibratoDepth: 10,
  vibratoDelay: 0.15,
  vibratoRampTime: 0.2,
  
  // Attack transients
  attackPitchBend: 20,
  attackPitchBendTime: 0.03,
  keyClickDuration: 0.015,
  keyClickFilterFreq: 2000,
  keyClickGain: 0.15,
  breathAttackDuration: 0.05,
  breathAttackFilterFreq: 2000,
  breathAttackFilterQ: 1.5,
  breathAttackGain: 0.2,
  
  // ADSR envelope
  attackTimeMin: 0.015,
  attackTimeMax: 0.03,
  decayTime: 0.08,
  sustainLevel: 0.8,
  releaseTime: 0.1,
  peakGainMin: 0.2,
  peakGainMax: 0.5,
  
  // Breathiness
  breathNoiseFilterFreq: 2500,
  breathNoiseFilterQ: 2,
  breathNoiseLevelAttack: 0.15,
  breathNoiseLevelSustain: 0.08,
  breathNoiseFadeTime: 0.05,
  
  // Formants (alto sax)
  formant1Freq: 800,
  formant1Q: 4,
  formant1Gain: 7,
  formant2Freq: 1500,
  formant2Q: 3,
  formant2Gain: 6,
  formant3Freq: 2500,
  formant3Q: 2.5,
  formant3Gain: 6,
}

/**
 * PRESET CONFIGURATIONS - Example tweaks you can try!
 * Use these as starting points and adjust values to taste
 */

/** Brighter, more aggressive alto sax sound */
export const BRIGHT_ALTO_CONFIG: Partial<SaxSynthConfig> = {
  maxHarmonics: 11, // More harmonics = brighter
  harmonicRolloff: 0.9, // Less rolloff = brighter high end
  vibratoDepth: 12, // Slightly more vibrato
  breathNoiseLevelAttack: 0.2, // More breath noise
  breathNoiseLevelSustain: 0.12,
  formant2Gain: 8, // Boost mid formant
  formant3Gain: 7, // Boost high formant
}

/** Darker, mellower tenor sax sound */
export const TENOR_SAX_CONFIG: Partial<SaxSynthConfig> = {
  maxHarmonics: 7, // Fewer harmonics = darker
  harmonicRolloff: 0.8, // More rolloff = darker
  vibratoRate: 5.0, // Slightly slower vibrato
  vibratoDepth: 8, // Less vibrato depth
  breathNoiseLevelAttack: 0.1, // Less breath noise
  breathNoiseLevelSustain: 0.05,
  formant1Freq: 600, // Lower formants for tenor
  formant2Freq: 1200,
  formant3Freq: 2000,
  formant1Gain: 8,
  formant2Gain: 7,
  formant3Gain: 5,
}

/** Soprano sax - higher, brighter tone */
export const SOPRANO_SAX_CONFIG: Partial<SaxSynthConfig> = {
  maxHarmonics: 10,
  harmonicRolloff: 0.88,
  vibratoRate: 6.0, // Faster vibrato
  vibratoDepth: 15, // More vibrato
  formant1Freq: 1000, // Higher formants
  formant2Freq: 1800,
  formant3Freq: 3000,
  keyClickGain: 0.2, // More prominent key clicks
  breathAttackGain: 0.25,
}

/** Smooth jazz style - less aggressive attack */
export const SMOOTH_JAZZ_CONFIG: Partial<SaxSynthConfig> = {
  attackTimeMin: 0.025, // Slower attack
  attackTimeMax: 0.05,
  keyClickGain: 0.08, // Less key click
  breathAttackGain: 0.12, // Less breath attack
  attackPitchBend: 10, // Less pitch bend
  vibratoDelay: 0.1, // Vibrato starts sooner
  breathNoiseLevelAttack: 0.08, // Less breathiness
  breathNoiseLevelSustain: 0.04,
}

/** Classical style - clean, controlled tone */
export const CLASSICAL_CONFIG: Partial<SaxSynthConfig> = {
  keyClickGain: 0.05, // Minimal key clicks
  breathAttackGain: 0.08,
  breathNoiseLevelAttack: 0.06,
  breathNoiseLevelSustain: 0.03,
  vibratoDepth: 6, // Subtle vibrato
  vibratoDelay: 0.2, // Later vibrato onset
  attackPitchBend: 8, // Minimal pitch bend
}

/**
 * Saxophone Synthesizer using Web Audio API
 * Implements realistic saxophone sound using additive synthesis,
 * envelope shaping, vibrato, breathiness, and formant filtering.
 */
export class SaxophoneSynthesizer {
  private ctx: AudioContext
  private masterGain: GainNode
  public config: SaxSynthConfig

  constructor(audioContext: AudioContext, config: Partial<SaxSynthConfig> = {}) {
    this.ctx = audioContext
    this.masterGain = this.ctx.createGain()
    this.masterGain.connect(this.ctx.destination)
    
    // Merge provided config with defaults
    this.config = { ...DEFAULT_SAX_CONFIG, ...config }
  }

  /**
   * Play a saxophone note
   * @param midi MIDI note number (0-127)
   * @param startTime Absolute time in AudioContext time
   * @param duration Duration in seconds
   * @param velocity MIDI velocity (0-127), affects brightness and volume
   */
  playNote(midi: number, startTime: number, duration: number, velocity: number = 80): void {
    const frequency = this.midiToFreq(midi)
    const normalizedVelocity = velocity / 127
    
    // Create note-specific gain node
    const noteGain = this.ctx.createGain()
    noteGain.connect(this.masterGain)
    
    // Apply formant filtering
    const formantOutput = this.createFormantFilters(noteGain)
    
    // Generate harmonics with additive synthesis
    this.createHarmonicOscillators(
      frequency,
      startTime,
      duration,
      normalizedVelocity,
      formantOutput
    )
    
    // Add breathiness/noise component
    this.createBreathNoise(startTime, duration, normalizedVelocity, formantOutput)
    
    // Add attack transients
    this.createAttackTransients(startTime, normalizedVelocity, formantOutput)
    
    // Apply ADSR envelope
    this.applyADSREnvelope(noteGain, startTime, duration, normalizedVelocity)
  }

  /**
   * Generate multiple harmonic oscillators (additive synthesis)
   */
  private createHarmonicOscillators(
    fundamental: number,
    startTime: number,
    duration: number,
    velocity: number,
    destination: AudioNode
  ): void {
    const harmonicGain = this.ctx.createGain()
    harmonicGain.gain.value = this.config.harmonicMixLevel
    harmonicGain.connect(destination)
    
    // Saxophone has strong odd harmonics
    // Number of harmonics increases with velocity (brightness)
    const numHarmonics = Math.floor(
      this.config.minHarmonics + velocity * (this.config.maxHarmonics - this.config.minHarmonics)
    )
    const harmonicNumbers = [1, 3, 5, 7, 9, 11, 13, 15, 17]
    
    const endTime = startTime + duration + 0.1 // Add release time
    
    for (let i = 0; i < Math.min(numHarmonics, harmonicNumbers.length); i++) {
      const harmonicNum = harmonicNumbers[i]
      if (!harmonicNum) continue // Safety check
      
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      
      // Set frequency for this harmonic
      osc.frequency.value = fundamental * harmonicNum
      osc.type = 'sine'
      
      // Amplitude decreases with harmonic number
      // Higher velocity = brighter tone (less rolloff for high harmonics)
      const rolloff = Math.pow(
        this.config.harmonicRolloff + velocity * this.config.harmonicRolloffVelocity,
        i
      )
      const amplitude = (1 / harmonicNum) * rolloff * (1 + velocity * 0.3)
      gain.gain.value = amplitude
      
      // Add vibrato via LFO
      this.addVibratoToOscillator(osc, startTime, duration)
      
      // Add pitch bend during attack (start slightly sharp)
      if (i === 0) { // Only on fundamental
        osc.detune.setValueAtTime(this.config.attackPitchBend, startTime)
        osc.detune.exponentialRampToValueAtTime(0.1, startTime + this.config.attackPitchBendTime)
      }
      
      osc.connect(gain)
      gain.connect(harmonicGain)
      
      osc.start(startTime)
      osc.stop(endTime)
    }
  }

  /**
   * Add vibrato to an oscillator using LFO
   */
  private addVibratoToOscillator(osc: OscillatorNode, startTime: number, duration: number): void {
    const lfo = this.ctx.createOscillator()
    const lfoGain = this.ctx.createGain()
    
    lfo.frequency.value = this.config.vibratoRate
    lfo.type = 'sine'
    
    lfoGain.gain.value = 0 // Start with no vibrato
    
    // Delay vibrato onset
    const vibratoStart = startTime + this.config.vibratoDelay
    if (vibratoStart < startTime + duration) {
      lfoGain.gain.setValueAtTime(0, vibratoStart)
      // Gradually increase vibrato depth
      lfoGain.gain.linearRampToValueAtTime(
        this.config.vibratoDepth,
        vibratoStart + this.config.vibratoRampTime
      )
    }
    
    lfo.connect(lfoGain)
    lfoGain.connect(osc.detune)
    
    lfo.start(startTime)
    lfo.stop(startTime + duration + 0.1)
  }

  /**
   * Create breath noise component for realism
   */
  private createBreathNoise(
    startTime: number,
    duration: number,
    velocity: number,
    destination: AudioNode
  ): void {
    // Create noise buffer
    const bufferSize = this.ctx.sampleRate * (duration + 0.1)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    
    // Fill with white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    
    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer
    
    // Band-pass filter for breath noise
    const bandpass = this.ctx.createBiquadFilter()
    bandpass.type = 'bandpass'
    bandpass.frequency.value = this.config.breathNoiseFilterFreq
    bandpass.Q.value = this.config.breathNoiseFilterQ
    
    const noiseGain = this.ctx.createGain()
    
    // Breath noise envelope: emphasize during attack
    const attackLevel = this.config.breathNoiseLevelAttack * velocity
    const sustainLevel = this.config.breathNoiseLevelSustain * velocity
    
    noiseGain.gain.setValueAtTime(attackLevel, startTime)
    noiseGain.gain.exponentialRampToValueAtTime(sustainLevel, startTime + this.config.breathNoiseFadeTime)
    noiseGain.gain.setValueAtTime(sustainLevel, startTime + duration)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration + 0.1)
    
    noise.connect(bandpass)
    bandpass.connect(noiseGain)
    noiseGain.connect(destination)
    
    noise.start(startTime)
  }

  /**
   * Create attack transients (key click and breath attack)
   */
  private createAttackTransients(
    startTime: number,
    velocity: number,
    destination: AudioNode
  ): void {
    // Key click: short high-frequency noise burst
    const clickBuffer = this.ctx.createBuffer(
      1,
      this.ctx.sampleRate * this.config.keyClickDuration,
      this.ctx.sampleRate
    )
    const clickData = clickBuffer.getChannelData(0)
    
    for (let i = 0; i < clickData.length; i++) {
      // Exponential decay envelope
      const env = Math.exp(-i / (this.ctx.sampleRate * this.config.keyClickDuration / 3))
      clickData[i] = (Math.random() * 2 - 1) * env
    }
    
    const click = this.ctx.createBufferSource()
    click.buffer = clickBuffer
    
    // High-pass filter for key click
    const highpass = this.ctx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = this.config.keyClickFilterFreq
    highpass.Q.value = 1
    
    const clickGain = this.ctx.createGain()
    clickGain.gain.value = this.config.keyClickGain * velocity
    
    click.connect(highpass)
    highpass.connect(clickGain)
    clickGain.connect(destination)
    
    click.start(startTime)
    
    // Breath attack: longer filtered noise
    const breathBuffer = this.ctx.createBuffer(
      1,
      this.ctx.sampleRate * this.config.breathAttackDuration,
      this.ctx.sampleRate
    )
    const breathData = breathBuffer.getChannelData(0)
    
    for (let i = 0; i < breathData.length; i++) {
      const env = Math.exp(-i / (this.ctx.sampleRate * this.config.breathAttackDuration / 2.5))
      breathData[i] = (Math.random() * 2 - 1) * env
    }
    
    const breath = this.ctx.createBufferSource()
    breath.buffer = breathBuffer
    
    // Band-pass for breath attack
    const breathFilter = this.ctx.createBiquadFilter()
    breathFilter.type = 'bandpass'
    breathFilter.frequency.value = this.config.breathAttackFilterFreq
    breathFilter.Q.value = this.config.breathAttackFilterQ
    
    const breathGain = this.ctx.createGain()
    breathGain.gain.value = this.config.breathAttackGain * velocity
    
    breath.connect(breathFilter)
    breathFilter.connect(breathGain)
    breathGain.connect(destination)
    
    breath.start(startTime)
  }

  /**
   * Apply ADSR envelope to note
   */
  private applyADSREnvelope(
    gainNode: GainNode,
    startTime: number,
    duration: number,
    velocity: number
  ): void {
    const peakGain = this.config.peakGainMin + velocity * (this.config.peakGainMax - this.config.peakGainMin)
    const sustainGain = peakGain * this.config.sustainLevel
    
    // Attack time varies with velocity (faster at higher velocity)
    const attackTime = this.config.attackTimeMax - velocity * (this.config.attackTimeMax - this.config.attackTimeMin)
    
    gainNode.gain.setValueAtTime(0.001, startTime)
    gainNode.gain.exponentialRampToValueAtTime(peakGain, startTime + attackTime)
    gainNode.gain.exponentialRampToValueAtTime(sustainGain, startTime + attackTime + this.config.decayTime)
    gainNode.gain.setValueAtTime(sustainGain, startTime + duration)
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration + this.config.releaseTime)
  }

  /**
   * Create formant filters for saxophone character
   */
  private createFormantFilters(destination: AudioNode): AudioNode {
    // Alto saxophone formants
    const formants = [
      { freq: this.config.formant1Freq, q: this.config.formant1Q, gain: this.config.formant1Gain },
      { freq: this.config.formant2Freq, q: this.config.formant2Q, gain: this.config.formant2Gain },
      { freq: this.config.formant3Freq, q: this.config.formant3Q, gain: this.config.formant3Gain },
    ]
    
    let currentNode: AudioNode = destination
    
    // Create filters in reverse order so they chain correctly
    for (let i = formants.length - 1; i >= 0; i--) {
      const formant = formants[i]
      if (!formant) continue // Safety check
      
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'peaking'
      filter.frequency.value = formant.freq
      filter.Q.value = formant.q
      filter.gain.value = formant.gain
      
      filter.connect(currentNode)
      currentNode = filter
    }
    
    return currentNode
  }

  /**
   * Convert MIDI note number to frequency in Hz
   */
  private midiToFreq(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12)
  }

  /**
   * Update synthesizer configuration
   * Merge new config values with existing config
   */
  updateConfig(newConfig: Partial<SaxSynthConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Reset to default configuration
   */
  resetConfig(): void {
    this.config = { ...DEFAULT_SAX_CONFIG }
  }

  /**
   * Set master volume
   */
  setVolume(gain: number): void {
    this.masterGain.gain.value = gain
  }
}

