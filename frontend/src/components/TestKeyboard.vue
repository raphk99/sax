<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = defineProps<{
  onPlayNote: (midiNote: number) => void
}>()

// C4 major scale: C=60, D=62, E=64, F=65, G=67, A=69, B=71
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

function handleKeyDown(event: KeyboardEvent) {
  const key = event.key
  const note = notes.find((n) => n.key === key)
  if (note && !activeKeys.value.has(key)) {
    activeKeys.value.add(key)
    props.onPlayNote(note.midi)
  }
}

function handleKeyUp(event: KeyboardEvent) {
  activeKeys.value.delete(event.key)
}

function handleMouseDown(note: typeof notes[0]) {
  activeKeys.value.add(note.key)
  props.onPlayNote(note.midi)
}

function handleMouseUp(note: typeof notes[0]) {
  activeKeys.value.delete(note.key)
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>

<template>
  <div class="keyboard">
    <div class="keyboardTitle">Test Keyboard (Press 1-7 or click)</div>
    <div class="keys">
      <button
        v-for="note in notes"
        :key="note.key"
        class="key"
        :class="{ active: activeKeys.has(note.key) }"
        @mousedown="handleMouseDown(note)"
        @mouseup="handleMouseUp(note)"
        @mouseleave="handleMouseUp(note)"
      >
        <span class="noteName">{{ note.name }}</span>
        <span class="keyNum">{{ note.key }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.keyboard {
  padding: 16px;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.keyboardTitle {
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 14px;
  opacity: 0.9;
}

.keys {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.key {
  flex: 1;
  min-width: 50px;
  height: 80px;
  background: linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%);
  border: 2px solid #333;
  border-radius: 8px;
  box-shadow: 0 4px 0 #999;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px;
  transition: all 0.1s;
  user-select: none;
}

.key:hover {
  background: linear-gradient(180deg, #f5f5f5 0%, #d0d0d0 100%);
  box-shadow: 0 3px 0 #999;
  transform: translateY(1px);
}

.key.active {
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 2px 0 #1d4ed8;
  transform: translateY(2px);
}

.key.active .noteName,
.key.active .keyNum {
  color: white;
}

.noteName {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.keyNum {
  font-size: 11px;
  opacity: 0.6;
  color: #666;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
}

@media (prefers-color-scheme: light) {
  .keyboard {
    background: rgba(255, 255, 255, 0.65);
    border-color: rgba(0, 0, 0, 0.1);
  }
}
</style>

