<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { SaxSynthConfig } from '../lib/saxSynth'
import {
  DEFAULT_SAX_CONFIG,
  BRIGHT_ALTO_CONFIG,
  TENOR_SAX_CONFIG,
  SOPRANO_SAX_CONFIG,
  SMOOTH_JAZZ_CONFIG,
  CLASSICAL_CONFIG,
} from '../lib/saxSynth'

interface Props {
  modelValue: SaxSynthConfig
}

interface Emits {
  (e: 'update:modelValue', value: SaxSynthConfig): void
  (e: 'playNote', midi: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localConfig = ref<SaxSynthConfig>({ ...props.modelValue })
const activeSection = ref<string>('harmonics')

// Watch for external config changes
watch(() => props.modelValue, (newVal) => {
  localConfig.value = { ...newVal }
}, { deep: true })

// Emit changes
function updateConfig() {
  emit('update:modelValue', { ...localConfig.value })
}

// Preset handling
function applyPreset(preset: Partial<SaxSynthConfig>) {
  localConfig.value = { ...localConfig.value, ...preset }
  updateConfig()
}

function resetToDefault() {
  localConfig.value = { ...DEFAULT_SAX_CONFIG }
  updateConfig()
}

// Test keyboard
const notes = [
  { key: '1', name: 'C', midi: 60 },
  { key: '2', name: 'D', midi: 62 },
  { key: '3', name: 'E', midi: 64 },
  { key: '4', name: 'F', midi: 65 },
  { key: '5', name: 'G', midi: 67 },
  { key: '6', name: 'A', midi: 69 },
  { key: '7', name: 'B', midi: 71 },
]

const activeKeys = ref<Set<string>>(new Set())

function playTestNote(midi: number, key: string) {
  emit('playNote', midi)
  activeKeys.value.add(key)
  setTimeout(() => activeKeys.value.delete(key), 400)
}

// Keyboard event listeners
function handleKeyDown(e: KeyboardEvent) {
  const note = notes.find(n => n.key === e.key)
  if (note && !activeKeys.value.has(note.key)) {
    playTestNote(note.midi, note.key)
  }
}

// Add keyboard listener on mount, remove on unmount
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="settingsPanel">
    <div class="settingsHeader">
      <h2>Saxophone Synthesizer Settings</h2>
    </div>

    <!-- Presets Section -->
    <div class="presetsSection">
      <h3>Presets</h3>
      <div class="presetButtons">
        <button @click="resetToDefault" class="presetBtn">Default Alto</button>
        <button @click="applyPreset(BRIGHT_ALTO_CONFIG)" class="presetBtn">Bright Alto</button>
        <button @click="applyPreset(TENOR_SAX_CONFIG)" class="presetBtn">Tenor Sax</button>
        <button @click="applyPreset(SOPRANO_SAX_CONFIG)" class="presetBtn">Soprano Sax</button>
        <button @click="applyPreset(SMOOTH_JAZZ_CONFIG)" class="presetBtn">Smooth Jazz</button>
        <button @click="applyPreset(CLASSICAL_CONFIG)" class="presetBtn">Classical</button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tabNav">
      <button 
        @click="activeSection = 'harmonics'" 
        :class="{ active: activeSection === 'harmonics' }"
      >
        Harmonics
      </button>
      <button 
        @click="activeSection = 'vibrato'" 
        :class="{ active: activeSection === 'vibrato' }"
      >
        Vibrato
      </button>
      <button 
        @click="activeSection = 'attack'" 
        :class="{ active: activeSection === 'attack' }"
      >
        Attack
      </button>
      <button 
        @click="activeSection = 'envelope'" 
        :class="{ active: activeSection === 'envelope' }"
      >
        Envelope
      </button>
      <button 
        @click="activeSection = 'breath'" 
        :class="{ active: activeSection === 'breath' }"
      >
        Breath
      </button>
      <button 
        @click="activeSection = 'formants'" 
        :class="{ active: activeSection === 'formants' }"
      >
        Formants
      </button>
    </div>

    <!-- Settings Content -->
    <div class="settingsContent">
      <!-- Harmonics Section -->
      <div v-show="activeSection === 'harmonics'" class="section">
        <h3>Harmonic Structure</h3>
        
        <div class="paramGroup">
          <label :title="'Minimum number of harmonics at low velocity (3-7)'">
            Min Harmonics: {{ localConfig.minHarmonics }}
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="3" max="7" step="1" 
                 v-model.number="localConfig.minHarmonics" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Maximum harmonics at high velocity - more = brighter (7-13)'">
            Max Harmonics: {{ localConfig.maxHarmonics }}
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="7" max="13" step="1" 
                 v-model.number="localConfig.maxHarmonics" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'High frequency rolloff - higher = brighter (0.7-0.95)'">
            Harmonic Rolloff: {{ localConfig.harmonicRolloff.toFixed(2) }}
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.7" max="0.95" step="0.01" 
                 v-model.number="localConfig.harmonicRolloff" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Velocity effect on brightness (0-0.2)'">
            Rolloff Velocity: {{ localConfig.harmonicRolloffVelocity.toFixed(2) }}
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0" max="0.2" step="0.01" 
                 v-model.number="localConfig.harmonicRolloffVelocity" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Overall harmonic volume (0.1-0.5)'">
            Mix Level: {{ localConfig.harmonicMixLevel.toFixed(2) }}
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.1" max="0.5" step="0.01" 
                 v-model.number="localConfig.harmonicMixLevel" @input="updateConfig" />
        </div>
      </div>

      <!-- Vibrato Section -->
      <div v-show="activeSection === 'vibrato'" class="section">
        <h3>Vibrato (LFO)</h3>
        
        <div class="paramGroup">
          <label :title="'Vibrato speed in Hz (4-7)'">
            Rate: {{ localConfig.vibratoRate.toFixed(1) }} Hz
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="4" max="7" step="0.1" 
                 v-model.number="localConfig.vibratoRate" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Vibrato depth in cents - 100 cents = 1 semitone (5-20)'">
            Depth: {{ localConfig.vibratoDepth }} cents
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="5" max="20" step="1" 
                 v-model.number="localConfig.vibratoDepth" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Delay before vibrato starts in seconds (0.05-0.3)'">
            Delay: {{ (localConfig.vibratoDelay * 1000).toFixed(0) }} ms
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.05" max="0.3" step="0.01" 
                 v-model.number="localConfig.vibratoDelay" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Time for vibrato to reach full depth (0.1-0.4)'">
            Ramp Time: {{ (localConfig.vibratoRampTime * 1000).toFixed(0) }} ms
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.1" max="0.4" step="0.01" 
                 v-model.number="localConfig.vibratoRampTime" @input="updateConfig" />
        </div>
      </div>

      <!-- Attack Section -->
      <div v-show="activeSection === 'attack'" class="section">
        <h3>Attack Transients</h3>
        
        <div class="paramGroup">
          <label :title="'Initial pitch bend amount in cents (5-40)'">
            Pitch Bend: {{ localConfig.attackPitchBend }} cents
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="5" max="40" step="1" 
                 v-model.number="localConfig.attackPitchBend" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Pitch bend duration in ms (20-60)'">
            Pitch Bend Time: {{ (localConfig.attackPitchBendTime * 1000).toFixed(0) }} ms
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.02" max="0.06" step="0.001" 
                 v-model.number="localConfig.attackPitchBendTime" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Key click duration in ms (5-25)'">
            Key Click Duration: {{ (localConfig.keyClickDuration * 1000).toFixed(0) }} ms
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.005" max="0.025" step="0.001" 
                 v-model.number="localConfig.keyClickDuration" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Key click high-pass filter frequency (1500-3500 Hz)'">
            Key Click Filter: {{ localConfig.keyClickFilterFreq }} Hz
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="1500" max="3500" step="50" 
                 v-model.number="localConfig.keyClickFilterFreq" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Key click volume (0.05-0.3)'">
            Key Click Gain: {{ localConfig.keyClickGain.toFixed(2) }}
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.05" max="0.3" step="0.01" 
                 v-model.number="localConfig.keyClickGain" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Breath attack duration in ms (30-100)'">
            Breath Attack Duration: {{ (localConfig.breathAttackDuration * 1000).toFixed(0) }} ms
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.03" max="0.1" step="0.001" 
                 v-model.number="localConfig.breathAttackDuration" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Breath attack filter center frequency (1500-2500 Hz)'">
            Breath Attack Filter: {{ localConfig.breathAttackFilterFreq }} Hz
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="1500" max="2500" step="50" 
                 v-model.number="localConfig.breathAttackFilterFreq" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Breath attack filter bandwidth (1-3)'">
            Breath Attack Q: {{ localConfig.breathAttackFilterQ.toFixed(1) }}
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="1" max="3" step="0.1" 
                 v-model.number="localConfig.breathAttackFilterQ" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Breath attack volume (0.1-0.4)'">
            Breath Attack Gain: {{ localConfig.breathAttackGain.toFixed(2) }}
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.1" max="0.4" step="0.01" 
                 v-model.number="localConfig.breathAttackGain" @input="updateConfig" />
        </div>
      </div>

      <!-- Envelope Section -->
      <div v-show="activeSection === 'envelope'" class="section">
        <h3>ADSR Envelope</h3>
        
        <div class="paramGroup">
          <label :title="'Attack time at high velocity in ms (10-30)'">
            Attack Min: {{ (localConfig.attackTimeMin * 1000).toFixed(0) }} ms
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.01" max="0.03" step="0.001" 
                 v-model.number="localConfig.attackTimeMin" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Attack time at low velocity in ms (20-60)'">
            Attack Max: {{ (localConfig.attackTimeMax * 1000).toFixed(0) }} ms
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.02" max="0.06" step="0.001" 
                 v-model.number="localConfig.attackTimeMax" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Decay time in ms (50-150)'">
            Decay: {{ (localConfig.decayTime * 1000).toFixed(0) }} ms
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.05" max="0.15" step="0.001" 
                 v-model.number="localConfig.decayTime" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Sustain level as % of peak (60-95%)'">
            Sustain: {{ (localConfig.sustainLevel * 100).toFixed(0) }}%
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.6" max="0.95" step="0.01" 
                 v-model.number="localConfig.sustainLevel" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Release time in ms (50-250)'">
            Release: {{ (localConfig.releaseTime * 1000).toFixed(0) }} ms
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.05" max="0.25" step="0.001" 
                 v-model.number="localConfig.releaseTime" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Peak gain at low velocity (0.1-0.3)'">
            Peak Gain Min: {{ localConfig.peakGainMin.toFixed(2) }}
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.1" max="0.3" step="0.01" 
                 v-model.number="localConfig.peakGainMin" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Peak gain at high velocity (0.3-0.8)'">
            Peak Gain Max: {{ localConfig.peakGainMax.toFixed(2) }}
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.3" max="0.8" step="0.01" 
                 v-model.number="localConfig.peakGainMax" @input="updateConfig" />
        </div>
      </div>

      <!-- Breath Section -->
      <div v-show="activeSection === 'breath'" class="section">
        <h3>Breathiness / Noise</h3>
        
        <div class="paramGroup">
          <label :title="'Breath noise filter center frequency (2000-3500 Hz)'">
            Filter Freq: {{ localConfig.breathNoiseFilterFreq }} Hz
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="2000" max="3500" step="50" 
                 v-model.number="localConfig.breathNoiseFilterFreq" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Breath noise filter bandwidth (1.5-3)'">
            Filter Q: {{ localConfig.breathNoiseFilterQ.toFixed(1) }}
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="1.5" max="3" step="0.1" 
                 v-model.number="localConfig.breathNoiseFilterQ" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Breath noise level during attack (0.08-0.25)'">
            Attack Level: {{ localConfig.breathNoiseLevelAttack.toFixed(2) }}
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.08" max="0.25" step="0.01" 
                 v-model.number="localConfig.breathNoiseLevelAttack" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Breath noise level during sustain (0.03-0.15)'">
            Sustain Level: {{ localConfig.breathNoiseLevelSustain.toFixed(2) }}
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.03" max="0.15" step="0.01" 
                 v-model.number="localConfig.breathNoiseLevelSustain" @input="updateConfig" />
        </div>

        <div class="paramGroup">
          <label :title="'Fade time from attack to sustain in ms (30-100)'">
            Fade Time: {{ (localConfig.breathNoiseFadeTime * 1000).toFixed(0) }} ms
            <span class="tooltip">ⓘ</span>
          </label>
          <input type="range" min="0.03" max="0.1" step="0.001" 
                 v-model.number="localConfig.breathNoiseFadeTime" @input="updateConfig" />
        </div>
      </div>

      <!-- Formants Section -->
      <div v-show="activeSection === 'formants'" class="section">
        <h3>Formants (Tone Color)</h3>
        
        <div class="formantGroup">
          <h4>Formant 1 (Low-Mid)</h4>
          <div class="paramGroup">
            <label :title="'First formant frequency - Alto: 800, Tenor: 600, Soprano: 1000 (600-1000 Hz)'">
              Frequency: {{ localConfig.formant1Freq }} Hz
              <span class="tooltip">ⓘ</span>
            </label>
            <input type="range" min="600" max="1000" step="10" 
                   v-model.number="localConfig.formant1Freq" @input="updateConfig" />
          </div>
          <div class="paramGroup">
            <label :title="'First formant bandwidth (3-6)'">
              Q: {{ localConfig.formant1Q.toFixed(1) }}
              <span class="tooltip">ⓘ</span>
            </label>
            <input type="range" min="3" max="6" step="0.1" 
                   v-model.number="localConfig.formant1Q" @input="updateConfig" />
          </div>
          <div class="paramGroup">
            <label :title="'First formant boost in dB (4-10)'">
              Gain: {{ localConfig.formant1Gain }} dB
              <span class="tooltip">ⓘ</span>
            </label>
            <input type="range" min="4" max="10" step="0.5" 
                   v-model.number="localConfig.formant1Gain" @input="updateConfig" />
          </div>
        </div>

        <div class="formantGroup">
          <h4>Formant 2 (Mid)</h4>
          <div class="paramGroup">
            <label :title="'Second formant frequency - Alto: 1500, Tenor: 1200, Soprano: 1800 (1200-1800 Hz)'">
              Frequency: {{ localConfig.formant2Freq }} Hz
              <span class="tooltip">ⓘ</span>
            </label>
            <input type="range" min="1200" max="1800" step="10" 
                   v-model.number="localConfig.formant2Freq" @input="updateConfig" />
          </div>
          <div class="paramGroup">
            <label :title="'Second formant bandwidth (2-4)'">
              Q: {{ localConfig.formant2Q.toFixed(1) }}
              <span class="tooltip">ⓘ</span>
            </label>
            <input type="range" min="2" max="4" step="0.1" 
                   v-model.number="localConfig.formant2Q" @input="updateConfig" />
          </div>
          <div class="paramGroup">
            <label :title="'Second formant boost in dB (4-9)'">
              Gain: {{ localConfig.formant2Gain }} dB
              <span class="tooltip">ⓘ</span>
            </label>
            <input type="range" min="4" max="9" step="0.5" 
                   v-model.number="localConfig.formant2Gain" @input="updateConfig" />
          </div>
        </div>

        <div class="formantGroup">
          <h4>Formant 3 (High-Mid)</h4>
          <div class="paramGroup">
            <label :title="'Third formant frequency - Alto: 2500, Tenor: 2000, Soprano: 3000 (2000-3000 Hz)'">
              Frequency: {{ localConfig.formant3Freq }} Hz
              <span class="tooltip">ⓘ</span>
            </label>
            <input type="range" min="2000" max="3000" step="10" 
                   v-model.number="localConfig.formant3Freq" @input="updateConfig" />
          </div>
          <div class="paramGroup">
            <label :title="'Third formant bandwidth (2-4)'">
              Q: {{ localConfig.formant3Q.toFixed(1) }}
              <span class="tooltip">ⓘ</span>
            </label>
            <input type="range" min="2" max="4" step="0.1" 
                   v-model.number="localConfig.formant3Q" @input="updateConfig" />
          </div>
          <div class="paramGroup">
            <label :title="'Third formant boost in dB (4-8)'">
              Gain: {{ localConfig.formant3Gain }} dB
              <span class="tooltip">ⓘ</span>
            </label>
            <input type="range" min="4" max="8" step="0.5" 
                   v-model.number="localConfig.formant3Gain" @input="updateConfig" />
          </div>
        </div>
      </div>
    </div>

    <!-- Test Keyboard -->
    <div class="testKeyboard">
      <h3>Test Keyboard (Press 1-7)</h3>
      <div class="keyboard">
        <button
          v-for="note in notes"
          :key="note.key"
          @click="playTestNote(note.midi, note.key)"
          :class="['key', { active: activeKeys.has(note.key) }]"
        >
          <span class="noteName">{{ note.name }}</span>
          <span class="keyHint">{{ note.key }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settingsPanel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  color: white;
  overflow: hidden;
}

.settingsHeader {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.settingsHeader h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.presetsSection {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.presetsSection h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.8;
}

.presetButtons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.presetBtn {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(59, 130, 246, 0.2);
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.presetBtn:hover {
  background: rgba(59, 130, 246, 0.4);
  border-color: rgba(59, 130, 246, 0.6);
}

.tabNav {
  display: flex;
  gap: 4px;
  padding: 12px 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
}

.tabNav button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.tabNav button:hover {
  color: rgba(255, 255, 255, 0.9);
}

.tabNav button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.settingsContent {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.section h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #3b82f6;
}

.section h4 {
  margin: 16px 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.paramGroup {
  margin-bottom: 20px;
}

.paramGroup label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
  cursor: help;
}

.tooltip {
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.3);
  font-size: 11px;
  margin-left: 8px;
}

.paramGroup input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  -webkit-appearance: none;
}

.paramGroup input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  transition: all 0.2s;
}

.paramGroup input[type="range"]::-webkit-slider-thumb:hover {
  background: #60a5fa;
  transform: scale(1.1);
}

.paramGroup input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.paramGroup input[type="range"]::-moz-range-thumb:hover {
  background: #60a5fa;
  transform: scale(1.1);
}

.formantGroup {
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 16px;
}

.testKeyboard {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
}

.testKeyboard h3 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.8;
}

.keyboard {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.key {
  position: relative;
  width: 60px;
  height: 100px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  color: #000;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.key:hover {
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.9) 0%, rgba(59, 130, 246, 0.7) 100%);
  border-color: rgba(59, 130, 246, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
}

.key.active {
  background: linear-gradient(180deg, rgba(34, 197, 94, 0.9) 0%, rgba(34, 197, 94, 0.7) 100%);
  border-color: rgba(34, 197, 94, 0.8);
  transform: translateY(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.noteName {
  font-size: 18px;
  font-weight: 700;
}

.keyHint {
  font-size: 11px;
  opacity: 0.6;
  font-weight: 600;
}

/* Light mode adjustments */
@media (prefers-color-scheme: light) {
  .settingsPanel {
    background: rgba(255, 255, 255, 0.98);
    color: #000;
  }

  .settingsHeader,
  .presetsSection,
  .tabNav,
  .testKeyboard {
    border-color: rgba(0, 0, 0, 0.1);
  }

  .presetBtn {
    border-color: rgba(0, 0, 0, 0.2);
    background: rgba(59, 130, 246, 0.1);
    color: #000;
  }

  .presetBtn:hover {
    background: rgba(59, 130, 246, 0.2);
  }

  .tabNav button {
    color: rgba(0, 0, 0, 0.6);
  }

  .tabNav button:hover {
    color: rgba(0, 0, 0, 0.9);
  }

  .formantGroup {
    background: rgba(0, 0, 0, 0.03);
  }

  .paramGroup input[type="range"] {
    background: rgba(0, 0, 0, 0.1);
  }

  .testKeyboard {
    background: rgba(0, 0, 0, 0.02);
  }
}
</style>
