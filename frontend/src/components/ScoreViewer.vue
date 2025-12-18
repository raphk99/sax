<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay'

const props = defineProps<{
  musicXml: string | null
}>()

const containerEl = ref<HTMLDivElement | null>(null)
let osmd: OpenSheetMusicDisplay | null = null

async function render(xml: string) {
  if (!containerEl.value) return

  if (!osmd) {
    osmd = new OpenSheetMusicDisplay(containerEl.value, {
      autoResize: true,
      drawTitle: true,
      drawSubtitle: false,
      drawComposer: false,
      drawLyricist: false,
      drawPartNames: false,
    })
  }

  await osmd.load(xml)
  osmd.render()
  osmd.cursor?.show()
  osmd.cursor?.reset()
}

watch(
  () => props.musicXml,
  (xml) => {
    if (!xml) return
    void render(xml)
  },
)

onMounted(() => {
  if (props.musicXml) void render(props.musicXml)
})

onBeforeUnmount(() => {
  // OSMD doesn't expose a full destroy API; drop references for GC.
  osmd = null
})
</script>

<template>
  <div class="scoreShell">
    <div v-if="!musicXml" class="empty">Upload a MusicXML file to render the score.</div>
    <div ref="containerEl" class="score"></div>
  </div>
</template>

<style scoped>
.scoreShell {
  width: 100%;
}
.empty {
  padding: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.75);
}
.score {
  width: 100%;
  overflow: auto;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 8px;
}
@media (prefers-color-scheme: light) {
  .empty {
    border-color: rgba(0, 0, 0, 0.2);
    color: rgba(0, 0, 0, 0.65);
  }
  .score {
    background: rgba(255, 255, 255, 0.65);
    border-color: rgba(0, 0, 0, 0.08);
  }
}
</style>


