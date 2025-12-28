<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import ScoreViewer from './components/ScoreViewer.vue'
import SaxFingering from './components/SaxFingering.vue'
import SaxSettings from './components/SaxSettings.vue'
import {
  SaxophoneSynthesizer,
  DEFAULT_SAX_CONFIG,
  type SaxSynthConfig,
} from './lib/saxSynth'

import { findActiveEventIndex, type NoteEvent, currentTimeSec } from './lib/timeline'

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
const synth = ref<SaxophoneSynthesizer | null>(null)
const isPlaying = ref(false)
const playheadSec = ref(0)
const activeIdx = ref<number | null>(null)
let rafId: number | null = null
let startedAtPerfMs: number | null = null

// Settings panel state
const showSettings = ref(false)
const currentConfig = ref<SaxSynthConfig>({ ...DEFAULT_SAX_CONFIG })

async function ensureAudio() {
  if (!audioCtx.value) audioCtx.value = new AudioContext()
  if (audioCtx.value.state !== 'running') await audioCtx.value.resume()
  if (!synth.value) {
    synth.value = new SaxophoneSynthesizer(audioCtx.value, currentConfig.value)
  }
}

function handleConfigChange(newConfig: SaxSynthConfig) {
  currentConfig.value = { ...newConfig }
  if (synth.value) {
    synth.value.config = { ...newConfig }
  }
}

async function playTestNote(midiNote: number) {
  await ensureAudio()
  const now = audioCtx.value!.currentTime
  synth.value!.playNote(midiNote, now, 0.5, 80)
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
    synth.value = null
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

  // Schedule each note using saxophone synthesizer
  for (const ev of parseResult.value.events) {
    const when = nowCtx + Math.max(0, ev.t0_sec - startOffset)
    if (ev.t0_sec + ev.dur_sec <= startOffset) continue
    synth.value!.playNote(ev.midi_sounding, when, ev.dur_sec, 80)
  }

  isPlaying.value = true
  startedAtPerfMs = performance.now()
  startRaf()
}

function pause() {
  if (!isPlaying.value) return
  // Note: Web Audio API nodes are scheduled and can't be easily unscheduled.
  // Pause stops playback by closing the audio context.
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
      <div class="topbarLeft">
        <div class="brand">Sax Fingering Visualizer</div>
        <div class="hint">Upload MusicXML → render score → parse events/fingerings → playback + animation</div>
      </div>
      <button class="settingsBtn" @click="showSettings = true" title="Synthesizer Settings">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m13.2 5.2l-4.2-4.2m0-6l-4.2-4.2"></path>
        </svg>
      </button>
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
        <div v-if="!parseResult" class="emptyRight">Click “Parse on server” to populate events + fingerings.</div>
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

    <!-- Settings Panel Overlay -->
    <Teleport to="body">
      <Transition name="settings">
        <div v-if="showSettings" class="settingsOverlay" @click="showSettings = false">
          <div class="settingsSidebar" @click.stop>
            <button class="closeBtn" @click="showSettings = false" title="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <SaxSettings 
              v-model="currentConfig" 
              @update:model-value="handleConfigChange"
              @play-note="playTestNote"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
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
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.topbarLeft {
  flex: 1;
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
.time {
  font-size: 12px;
  opacity: 0.75;
}
.settingsBtn {
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.08);
  color: currentColor;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.settingsBtn:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  transform: rotate(30deg);
}
.settingsOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}
.settingsSidebar {
  position: relative;
  width: min(600px, 90vw);
  height: 100vh;
  background: rgba(20, 20, 30, 0.98);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.closeBtn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.closeBtn:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.5);
}
.settings-enter-active,
.settings-leave-active {
  transition: opacity 0.3s ease;
}
.settings-enter-active .settingsSidebar,
.settings-leave-active .settingsSidebar {
  transition: transform 0.3s ease;
}
.settings-enter-from,
.settings-leave-to {
  opacity: 0;
}
.settings-enter-from .settingsSidebar {
  transform: translateX(100%);
}
.settings-leave-to .settingsSidebar {
  transform: translateX(100%);
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
  button.ghost,
  .settingsBtn {
    border-color: rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.65);
  }
  .events tr.active td {
    background: rgba(59, 130, 246, 0.12);
  }
  .settingsSidebar {
    background: rgba(250, 250, 250, 0.98);
  }
  .closeBtn {
    border-color: rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.8);
    color: #000;
  }
}
</style>
