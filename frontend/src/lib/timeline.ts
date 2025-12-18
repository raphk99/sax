export type NoteEvent = {
  idx: number
  t0_sec: number
  dur_sec: number
  midi_written: number
  midi_sounding: number
  spelling: string
}

export type TimelineState = {
  isPlaying: boolean
  startedAtPerfMs: number | null
  pausedAtSec: number
}

export function currentTimeSec(state: TimelineState, nowPerfMs = performance.now()): number {
  if (!state.isPlaying || state.startedAtPerfMs == null) return state.pausedAtSec
  return state.pausedAtSec + (nowPerfMs - state.startedAtPerfMs) / 1000
}

export function findActiveEventIndex(events: NoteEvent[], tSec: number): number | null {
  // Linear scan MVP; we can binary-search later.
  for (const ev of events) {
    if (tSec >= ev.t0_sec && tSec < ev.t0_sec + ev.dur_sec) return ev.idx
  }
  return null
}


