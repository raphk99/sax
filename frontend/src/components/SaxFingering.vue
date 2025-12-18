<script setup lang="ts">
const props = defineProps<{
  keyStates: Record<string, boolean> | null
}>()

function on(key: string): boolean {
  return !!props.keyStates?.[key]
}
</script>

<template>
  <div class="shell">
    <div class="title">Alto Sax Fingering (MVP)</div>
    <div class="grid">
      <div class="group">
        <div class="gTitle">Left hand</div>
        <div class="row"><span class="k">Octave</span><span class="dot" :class="{ on: on('octave') }" /></div>
        <div class="row"><span class="k">LH1</span><span class="dot" :class="{ on: on('lh1') }" /></div>
        <div class="row"><span class="k">LH2</span><span class="dot" :class="{ on: on('lh2') }" /></div>
        <div class="row"><span class="k">LH3</span><span class="dot" :class="{ on: on('lh3') }" /></div>
        <div class="row"><span class="k">G#</span><span class="dot" :class="{ on: on('gSharp') }" /></div>
        <div class="row"><span class="k">BisBb</span><span class="dot" :class="{ on: on('bisBb') }" /></div>
      </div>

      <div class="group">
        <div class="gTitle">Right hand</div>
        <div class="row"><span class="k">RH1</span><span class="dot" :class="{ on: on('rh1') }" /></div>
        <div class="row"><span class="k">RH2</span><span class="dot" :class="{ on: on('rh2') }" /></div>
        <div class="row"><span class="k">RH3</span><span class="dot" :class="{ on: on('rh3') }" /></div>
        <div class="row"><span class="k">SideEb</span><span class="dot" :class="{ on: on('sideEb') }" /></div>
        <div class="row"><span class="k">LowC#</span><span class="dot" :class="{ on: on('lowCsharp') }" /></div>
        <div class="row"><span class="k">LowBb</span><span class="dot" :class="{ on: on('lowBb') }" /></div>
      </div>

      <div class="group">
        <div class="gTitle">Palm keys</div>
        <div class="row"><span class="k">PalmD</span><span class="dot" :class="{ on: on('palmD') }" /></div>
        <div class="row"><span class="k">PalmEb</span><span class="dot" :class="{ on: on('palmEb') }" /></div>
        <div class="row"><span class="k">PalmF</span><span class="dot" :class="{ on: on('palmF') }" /></div>
      </div>
    </div>
    <div v-if="!keyStates" class="empty">Parse a score and press Play to see keys light up.</div>
  </div>
</template>

<style scoped>
.shell {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.08);
  padding: 12px;
}
.title {
  font-weight: 700;
  margin-bottom: 10px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.group {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px;
}
.gTitle {
  font-weight: 700;
  font-size: 13px;
  opacity: 0.85;
  margin-bottom: 8px;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
}
.k {
  opacity: 0.85;
}
.dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.15);
}
.dot.on {
  background: rgba(34, 197, 94, 0.9);
  border-color: rgba(34, 197, 94, 1);
}
.empty {
  margin-top: 10px;
  opacity: 0.7;
  font-size: 13px;
}
@media (max-width: 980px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
@media (prefers-color-scheme: light) {
  .shell,
  .group {
    border-color: rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.65);
  }
  .dot {
    border-color: rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.5);
  }
}
</style>


