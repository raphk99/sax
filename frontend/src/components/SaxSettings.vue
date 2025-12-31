<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SaxAudioConfig } from '../lib/saxAudio'
import {
  DEFAULT_SAX_CONFIG,
  JAZZ_PRESET,
  CLASSICAL_PRESET,
  SMOOTH_PRESET,
  BRIGHT_PRESET,
} from '../lib/saxAudio'

const props = defineProps<{
  config: SaxAudioConfig
  onConfigChange: (config: SaxAudioConfig) => void
  onClose: () => void
}>()

// Local copy of config for v-model binding
const localConfig = ref<SaxAudioConfig>({ ...props.config })

// Watch for changes and emit
watch(
  localConfig,
  (newConfig) => {
    props.onConfigChange(newConfig)
  },
  { deep: true }
)

// Preset management
function applyPreset(preset: SaxAudioConfig) {
  localConfig.value = { ...preset }
}

function resetToDefault() {
  localConfig.value = { ...DEFAULT_SAX_CONFIG }
}
</script>

<template>
  <div class="settingsOverlay" @click.self="onClose">
    <div class="settingsPanel">
      <div class="settingsHeader">
        <h2>Saxophone Audio Settings</h2>
        <button class="closeBtn" @click="onClose">✕</button>
      </div>

      <!-- Presets -->
      <div class="presetsSection">
        <div class="sectionTitle">Quick Presets</div>
        <div class="presetButtons">
          <button @click="resetToDefault" class="presetBtn">Default</button>
          <button @click="applyPreset(JAZZ_PRESET)" class="presetBtn">Jazz</button>
          <button @click="applyPreset(CLASSICAL_PRESET)" class="presetBtn">Classical</button>
          <button @click="applyPreset(SMOOTH_PRESET)" class="presetBtn">Smooth</button>
          <button @click="applyPreset(BRIGHT_PRESET)" class="presetBtn">Bright</button>
        </div>
      </div>

      <div class="settingsContent">
        <!-- Vibrato -->
        <div class="settingSection">
          <div class="sectionTitle">Vibrato</div>
          <div class="sectionContent">
            <div class="settingRow">
              <label title="Vibrato speed in Hz (4-8). Higher = faster wobble">
                Rate (Hz)
                <span class="value">{{ localConfig.vibratoRate.toFixed(1) }}</span>
              </label>
              <input type="range" v-model.number="localConfig.vibratoRate" min="4" max="8" step="0.1" />
            </div>

            <div class="settingRow">
              <label title="Vibrato depth in cents (3-15). Higher = more pronounced. 100 cents = 1 semitone">
                Depth (cents)
                <span class="value">{{ localConfig.vibratoDepth.toFixed(0) }}</span>
              </label>
              <input type="range" v-model.number="localConfig.vibratoDepth" min="3" max="15" step="1" />
            </div>
          </div>
        </div>

        <!-- Tone Brightness -->
        <div class="settingSection">
          <div class="sectionTitle">Tone Brightness</div>
          <div class="sectionContent">
            <div class="settingRow">
              <label title="Tone brightness (0-100). Lower = warmer/darker, Higher = brighter">
                Brightness
                <span class="value">{{ localConfig.brightness.toFixed(0) }}</span>
              </label>
              <input type="range" v-model.number="localConfig.brightness" min="0" max="100" step="1" />
            </div>
          </div>
        </div>

        <!-- Reverb -->
        <div class="settingSection">
          <div class="sectionTitle">Reverb</div>
          <div class="sectionContent">
            <div class="settingRow">
              <label title="Room reverb amount (0-100). Higher = more spacious sound">
                Amount
                <span class="value">{{ localConfig.reverbAmount.toFixed(0) }}</span>
              </label>
              <input type="range" v-model.number="localConfig.reverbAmount" min="0" max="100" step="1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settingsOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.settingsPanel {
  background: #1a1a1a;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.settingsHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.settingsHeader h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.closeBtn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 4px 8px;
  line-height: 1;
  border-radius: 4px;
  transition: all 0.2s;
}

.closeBtn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.presetsSection {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.presetsSection .sectionTitle {
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 13px;
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
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(59, 130, 246, 0.2);
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.presetBtn:hover {
  background: rgba(59, 130, 246, 0.35);
  border-color: rgba(59, 130, 246, 0.5);
}

.settingsContent {
  overflow-y: auto;
  padding: 16px 24px;
  flex: 1;
}

.settingSection {
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
}

.sectionTitle {
  font-weight: 600;
  font-size: 14px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 0.9;
}

.sectionContent {
  padding: 16px;
}

.settingRow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.settingRow label {
  flex: 0 0 180px;
  font-size: 12px;
  opacity: 0.9;
  cursor: help;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settingRow .value {
  font-weight: 600;
  color: #3b82f6;
  font-size: 11px;
  background: rgba(59, 130, 246, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 40px;
  text-align: center;
}

.settingRow input[type='range'] {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  -webkit-appearance: none;
}

.settingRow input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  transition: all 0.2s;
}

.settingRow input[type='range']::-webkit-slider-thumb:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.settingRow input[type='range']::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.settingRow input[type='range']::-moz-range-thumb:hover {
  background: #2563eb;
  transform: scale(1.1);
}

@media (prefers-color-scheme: light) {
  .settingsPanel {
    background: #ffffff;
    border-color: rgba(0, 0, 0, 0.15);
  }

  .settingsHeader {
    border-bottom-color: rgba(0, 0, 0, 0.1);
  }

  .presetsSection {
    background: rgba(0, 0, 0, 0.03);
    border-bottom-color: rgba(0, 0, 0, 0.1);
  }

  .presetBtn {
    border-color: rgba(0, 0, 0, 0.15);
    background: rgba(59, 130, 246, 0.1);
    color: #1e40af;
  }

  .presetBtn:hover {
    background: rgba(59, 130, 246, 0.2);
  }

  .settingSection {
    border-color: rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.02);
  }

  .sectionTitle {
    border-bottom-color: rgba(0, 0, 0, 0.08);
  }

  .settingRow input[type='range'] {
    background: rgba(0, 0, 0, 0.1);
  }

  .closeBtn {
    color: #666;
  }

  .closeBtn:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #000;
  }
}
</style>

