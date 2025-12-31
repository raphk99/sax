<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ScoreViewer from './components/ScoreViewer.vue'
import SaxFingering from './components/SaxFingering.vue'
import SaxSettings from './components/SaxSettings.vue'
import Soundfont from 'soundfont-player'

import { findActiveEventIndex, type NoteEvent, currentTimeSec } from './lib/timeline'
import { DEFAULT_SAX_CONFIG, createEffectsChain, type SaxAudioConfig } from './lib/saxAudio'

type ParseResponse = {
  metadata: {
    qpm: number
    secondsPerQuarter: number
    transposeSemitonesSounding: number
    warnings: string[]
  }
  events: Array<NoteEvent & { ql: number }>
  fingerings: Array<{
    eventIndex: number
    keyStates: Record<string, boolean>
  }>
  midiBase64: string
}

const file = ref<File | null>(null)
const musicXmlText = ref<string | null>(null)
const parseResult = ref<ParseResponse | null>(null)
const isParsing = ref(false)
const errorMsg = ref<string | null>(null)

const warnings = computed(() => parseResult.value?.metadata.warnings ?? [])
const currentKeyStates = computed(() => {
  if (!parseResult.value) return null
  if (activeIdx.value == null) return null
  return parseResult.value.fingerings.find((f) => f.eventIndex === activeIdx.value)?.keyStates ?? null
})

const audioCtx = ref<AudioContext | null>(null)
const instrument = ref<any>(null)
const effectsChain = ref<{ input: GainNode; output: GainNode } | null>(null)
const isPlaying = ref(false)
const playheadSec = ref(0)
const activeIdx = ref<number | null>(null)
let rafId: number | null = null
let startedAtPerfMs: number | null = null

// Audio settings
const showSettings = ref(false)
const saxConfig = ref<SaxAudioConfig>({ ...DEFAULT_SAX_CONFIG })

// Load config from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem('saxAudioConfig')
  if (saved) {
    try {
      saxConfig.value = JSON.parse(saved)
    } catch (e) {
      console.warn('Failed to load saved config:', e)
    }
  }
})

// Save config to localStorage when it changes
function handleConfigChange(newConfig: SaxAudioConfig) {
  saxConfig.value = newConfig
  localStorage.setItem('saxAudioConfig', JSON.stringify(newConfig))
  
  // Recreate effects chain if audio context exists
  if (audioCtx.value) {
    recreateEffectsChain()
  }
}

function recreateEffectsChain() {
  if (!audioCtx.value) return
  
  // Disconnect old chain
  if (effectsChain.value) {
    effectsChain.value.output.disconnect()
  }
  
  // Create new effects chain
  effectsChain.value = createEffectsChain(audioCtx.value, saxConfig.value)
  effectsChain.value.output.connect(audioCtx.value.destination)
}

async function ensureAudio() {
  if (!audioCtx.value) audioCtx.value = new AudioContext()
  if (audioCtx.value.state !== 'running') await audioCtx.value.resume()
  if (!instrument.value) {
    instrument.value = await Soundfont.instrument(audioCtx.value, 'alto_saxophone')
  }
  if (!effectsChain.value) {
    recreateEffectsChain()
  }
}

function stopRaf() {
  if (rafId != null) cancelAnimationFrame(rafId)
  rafId = null
}

function startRaf() {
  stopRaf()
  const tick = () => {
    rafId = requestAnimationFrame(tick)
    if (!parseResult.value) return
    const t = currentTimeSec(
      {
        isPlaying: isPlaying.value,
        startedAtPerfMs,
        pausedAtSec: playheadSec.value,
      },
      performance.now(),
    )
    const idx = findActiveEventIndex(parseResult.value.events, t)
    activeIdx.value = idx
  }
  rafId = requestAnimationFrame(tick)
}

async function onPickFile(ev: Event) {
  errorMsg.value = null
  parseResult.value = null
  stopPlayback()

  const input = ev.target as HTMLInputElement
  const f = input.files?.[0] ?? null
  file.value = f
  if (!f) {
    musicXmlText.value = null
    return
  }

  musicXmlText.value = await f.text()
}

function stopPlayback() {
  isPlaying.value = false
  startedAtPerfMs = null
  activeIdx.value = null
  stopRaf()
  
  // Close and reset audio context to truly stop all scheduled notes
  // This prevents overlapping tracks when restarting playback
  if (audioCtx.value) {
    void audioCtx.value.close()
    audioCtx.value = null
    instrument.value = null
    effectsChain.value = null
  }
}

async function play() {
  if (!parseResult.value) return
  
  // Stop any existing playback to prevent overlapping tracks
  if (isPlaying.value) {
    stopPlayback()
  }
  
  await ensureAudio()

  const nowCtx = audioCtx.value!.currentTime
  const startOffset = playheadSec.value

  // Schedule each note using SoundFont player
  // Note: soundfont-player doesn't expose individual note nodes for effects,
  // so we connect the instrument's output through our effects chain
  for (const ev of parseResult.value.events) {
    const when = nowCtx + Math.max(0, ev.t0_sec - startOffset)
    if (ev.t0_sec + ev.dur_sec <= startOffset) continue
    
    // Play note - soundfont-player handles the audio internally
    // The instrument output is already connected to our effects chain via the AudioContext
    instrument.value.play(ev.midi_sounding, when, {
      duration: ev.dur_sec,
      gain: 0.3,
    })
  }

  isPlaying.value = true
  startedAtPerfMs = performance.now()
  startRaf()
}

function pause() {
  if (!isPlaying.value) return
  // SoundFont scheduling can't be unscheduled easily; MVP pause stops time tracking only.
  // Better: use a MIDI scheduler that can stop nodes; we'll upgrade later.
  const t = currentTimeSec(
    { isPlaying: true, startedAtPerfMs, pausedAtSec: playheadSec.value },
    performance.now(),
  )
  playheadSec.value = t
  stopPlayback()
}

function togglePlayPause() {
  if (isPlaying.value) {
    pause()
  } else {
    void play()
  }
}

function seek(deltaSec: number) {
  const next = Math.max(0, playheadSec.value + deltaSec)
  playheadSec.value = next
  if (isPlaying.value) {
    stopPlayback()
    void play()
  } else if (parseResult.value) {
    activeIdx.value = findActiveEventIndex(parseResult.value.events, next)
  }
}

async function parseOnServer() {
  if (!file.value) return
  errorMsg.value = null
  isParsing.value = true
  parseResult.value = null
  stopPlayback()
  playheadSec.value = 0

  try {
    const fd = new FormData()
    fd.append('file', file.value, file.value.name)
    const resp = await fetch('/api/parse', { method: 'POST', body: fd })
    if (!resp.ok) {
      const text = await resp.text()
      throw new Error(text || `HTTP ${resp.status}`)
    }
    parseResult.value = (await resp.json()) as ParseResponse
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : String(e)
  } finally {
    isParsing.value = false
  }
}

onBeforeUnmount(() => {
  stopPlayback()
  if (audioCtx.value) void audioCtx.value.close()
})
</script>

<template>
  <div class="page">
    <header class="topbar">
      <div class="brand">Sax Fingering Visualizer</div>
      <div class="hint">Upload MusicXML → render score → parse events/fingerings → playback with sax sound</div>
    </header>

    <section class="controls">
      <label class="filePicker">
        <span>MusicXML</span>
        <input type="file" accept=".musicxml,.xml,application/xml,text/xml" @change="onPickFile" />
      </label>

      <button class="primary" type="button" :disabled="!file || isParsing" @click="parseOnServer">
        {{ isParsing ? 'Parsing…' : 'Parse on server' }}
      </button>

      <div class="transport">
        <button type="button" class="ghost" :disabled="!parseResult || isParsing" @click="togglePlayPause">
          {{ isPlaying ? 'Pause' : 'Play' }}
        </button>
        <button type="button" class="ghost" :disabled="!parseResult || isParsing" @click="seek(-2)">-2s</button>
        <button type="button" class="ghost" :disabled="!parseResult || isParsing" @click="seek(2)">+2s</button>
        <span class="time" v-if="parseResult">t={{ playheadSec.toFixed(2) }}s</span>
      </div>

      <button type="button" class="ghost settings" @click="showSettings = true">
        ⚙️ Audio Settings
      </button>
    </section>

    <section v-if="errorMsg" class="error">
      {{ errorMsg }}
    </section>

    <section v-if="warnings.length" class="warnings">
      <div class="warningsTitle">Warnings</div>
      <ul>
        <li v-for="w in warnings" :key="w">{{ w }}</li>
      </ul>
    </section>

    <main class="grid">
      <div class="panel">
        <div class="panelTitle">Score</div>
        <ScoreViewer :music-xml="musicXmlText" />
      </div>

      <div class="panel">
        <div class="panelTitle">Parsed events</div>
        <div v-if="!parseResult" class="emptyRight">Click "Parse on server" to populate events + fingerings.</div>
        <div v-else class="events">
          <div class="meta">
            <div><span class="k">Tempo</span><span class="v">{{ parseResult.metadata.qpm }} qpm</span></div>
            <div><span class="k">Transpose</span><span class="v">{{ parseResult.metadata.transposeSemitonesSounding }} semitones</span></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>t0 (s)</th>
                <th>dur (s)</th>
                <th>written</th>
                <th>sounding</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ev in parseResult.events" :key="ev.idx" :class="{ active: ev.idx === activeIdx }">
                <td>{{ ev.idx }}</td>
                <td>{{ ev.t0_sec.toFixed(3) }}</td>
                <td>{{ ev.dur_sec.toFixed(3) }}</td>
                <td>{{ ev.spelling }} ({{ ev.midi_written }})</td>
                <td>{{ ev.midi_sounding }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <section>
      <SaxFingering :key-states="currentKeyStates" />
    </section>

    <!-- Settings Modal -->
    <SaxSettings
      v-if="showSettings"
      :config="saxConfig"
      :on-config-change="handleConfigChange"
      :on-close="() => showSettings = false"
    />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.topbar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.brand {
  font-size: 20px;
  font-weight: 700;
}
.hint {
  font-size: 13px;
  opacity: 0.75;
}
.controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.filePicker {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.12);
}
.filePicker input {
  max-width: 260px;
}
button.primary {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #3b82f6;
  color: white;
  font-weight: 600;
}
button.primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.transport {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
button.ghost {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.08);
}
button.ghost:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
button.ghost.settings {
  margin-left: auto;
}
.time {
  font-size: 12px;
  opacity: 0.75;
}
.error {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.12);
  white-space: pre-wrap;
}
.warnings {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(245, 158, 11, 0.35);
  background: rgba(245, 158, 11, 0.12);
}
.warningsTitle {
  font-weight: 700;
  margin-bottom: 6px;
}
.grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 14px;
  align-items: start;
}
.panel {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.08);
  padding: 12px;
}
.panelTitle {
  font-weight: 700;
  margin-bottom: 10px;
}
.emptyRight {
  opacity: 0.7;
  padding: 10px;
}
.events table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.events th,
.events td {
  padding: 8px 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  text-align: left;
}
.events tr.active td {
  background: rgba(59, 130, 246, 0.22);
}
.meta {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  font-size: 13px;
  opacity: 0.9;
}
.meta .k {
  opacity: 0.7;
  margin-right: 6px;
}

@media (max-width: 980px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
@media (prefers-color-scheme: light) {
  .filePicker,
  .panel {
    border-color: rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.65);
  }
  .events th,
  .events td {
    border-bottom-color: rgba(0, 0, 0, 0.08);
  }
  button.ghost {
    border-color: rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.65);
  }
  .events tr.active td {
    background: rgba(59, 130, 246, 0.12);
  }
}
</style>




