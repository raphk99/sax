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
    <div class="title">Alto Saxophone Fingering</div>
    
    <div class="sax-container">
      <svg 
        viewBox="0 0 240 680" 
        class="sax-diagram"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Saxophone body outline (subtle background) -->
        <g class="body-outline">
          <!-- Upper bow/neck -->
          <line x1="120" y1="30" x2="120" y2="90" class="body-path" />
          <!-- Main body tube - straight vertical line through keys -->
          <line x1="120" y1="90" x2="120" y2="550" class="body-path" />
          <!-- Lower body -->
          <line x1="120" y1="550" x2="120" y2="630" class="body-path" />
        </g>

        <!-- Palm keys (top, small circles) - High register D, Eb, F -->
        <g class="palm-keys">
          <circle
            :class="['key', 'key-palm', { pressed: on('palmD') }]"
            cx="90"
            cy="50"
            r="9"
          >
            <title>Palm D</title>
          </circle>
          <circle
            :class="['key', 'key-palm', { pressed: on('palmEb') }]"
            cx="120"
            cy="45"
            r="9"
          >
            <title>Palm Eb</title>
          </circle>
          <circle
            :class="['key', 'key-palm', { pressed: on('palmF') }]"
            cx="150"
            cy="50"
            r="9"
          >
            <title>Palm F</title>
          </circle>
        </g>

        <!-- Octave key (left side, small oval) -->
        <ellipse
          :class="['key', 'key-octave', { pressed: on('octave') }]"
          cx="65"
          cy="115"
          rx="8"
          ry="13"
        >
          <title>Octave Key</title>
        </ellipse>

        <!-- Left hand main stack (3 large tone holes) -->
        <g class="left-hand-stack">
          <circle
            :class="['key', 'key-pearl', { pressed: on('lh1') }]"
            cx="120"
            cy="160"
            r="16"
          >
            <title>LH1 (B key)</title>
          </circle>
          <circle
            :class="['key', 'key-pearl', { pressed: on('lh2') }]"
            cx="120"
            cy="230"
            r="16"
          >
            <title>LH2 (A key)</title>
          </circle>
          <circle
            :class="['key', 'key-pearl', { pressed: on('lh3') }]"
            cx="120"
            cy="300"
            r="16"
          >
            <title>LH3 (G key)</title>
          </circle>
        </g>

        <!-- Bis Bb key (small, between lh1 and lh2) -->
        <circle
          :class="['key', 'key-aux', { pressed: on('bisBb') }]"
          cx="75"
          cy="195"
          r="7"
        >
          <title>Bis Bb</title>
        </circle>

        <!-- Left pinky cluster (G#, low C#, etc.) -->
        <g class="left-pinky-keys">
          <!-- G# key -->
          <ellipse
            :class="['key', 'key-spatula', { pressed: on('gSharp') }]"
            cx="70"
            cy="350"
            rx="10"
            ry="17"
          >
            <title>G# Key</title>
          </ellipse>
        </g>

        <!-- Right hand main stack (3 large tone holes, continuing vertical line) -->
        <g class="right-hand-stack">
          <circle
            :class="['key', 'key-pearl', { pressed: on('rh1') }]"
            cx="120"
            cy="400"
            r="16"
          >
            <title>RH1 (F key)</title>
          </circle>
          <circle
            :class="['key', 'key-pearl', { pressed: on('rh2') }]"
            cx="120"
            cy="470"
            r="16"
          >
            <title>RH2 (E key)</title>
          </circle>
          <circle
            :class="['key', 'key-pearl', { pressed: on('rh3') }]"
            cx="120"
            cy="540"
            r="16"
          >
            <title>RH3 (D key)</title>
          </circle>
        </g>

        <!-- Right side keys (spatulas on the right side) -->
        <g class="side-keys">
          <ellipse
            :class="['key', 'key-spatula', { pressed: on('sideBb') }]"
            cx="175"
            cy="390"
            rx="10"
            ry="16"
          >
            <title>Side Bb</title>
          </ellipse>
          <ellipse
            :class="['key', 'key-spatula', { pressed: on('sideC') }]"
            cx="180"
            cy="440"
            rx="10"
            ry="16"
          >
            <title>Side C</title>
          </ellipse>
          <ellipse
            :class="['key', 'key-spatula', { pressed: on('sideEb') }]"
            cx="175"
            cy="490"
            rx="10"
            ry="16"
          >
            <title>Side Eb</title>
          </ellipse>
        </g>

        <!-- Low pinky cluster (bottom spatulas - rightmost keys) -->
        <g class="low-pinky-cluster">
          <ellipse
            :class="['key', 'key-spatula', { pressed: on('lowC') }]"
            cx="70"
            cy="600"
            rx="10"
            ry="15"
          >
            <title>Low C</title>
          </ellipse>
          <ellipse
            :class="['key', 'key-spatula', { pressed: on('lowCsharp') }]"
            cx="95"
            cy="605"
            rx="10"
            ry="15"
          >
            <title>Low C#</title>
          </ellipse>
          <ellipse
            :class="['key', 'key-spatula', { pressed: on('lowB') }]"
            cx="120"
            cy="608"
            rx="10"
            ry="15"
          >
            <title>Low B</title>
          </ellipse>
          <ellipse
            :class="['key', 'key-spatula', { pressed: on('lowBb') }]"
            cx="145"
            cy="605"
            rx="10"
            ry="15"
          >
            <title>Low Bb</title>
          </ellipse>
        </g>

        <!-- Key labels (optional, subtle) -->
        <g class="key-labels">
          <text x="90" y="75" class="label">D</text>
          <text x="120" y="70" class="label">Eb</text>
          <text x="150" y="75" class="label">F</text>
          <text x="45" y="120" class="label">8va</text>
        </g>
      </svg>

      <div v-if="!keyStates" class="empty">
        Parse a score and press Play to see keys light up.
      </div>
    </div>
  </div>
</template>

<style scoped>
.shell {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.08);
  padding: 16px;
}

.title {
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
}

.sax-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.sax-diagram {
  max-width: 280px;
  width: 100%;
  height: auto;
}

/* Saxophone body outline */
.body-outline {
  opacity: 0.15;
}

.body-path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
}

/* Base key styles */
.key {
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 1.5;
  fill: rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
  cursor: default;
}

/* Pearl keys (main tone holes) */
.key-pearl {
  stroke-width: 2;
  stroke: rgba(255, 255, 255, 0.35);
}

/* Spatula keys */
.key-spatula {
  stroke: rgba(255, 255, 255, 0.3);
}

/* Palm keys (smaller) */
.key-palm {
  stroke-width: 1.5;
  stroke: rgba(255, 255, 255, 0.3);
}

/* Octave key */
.key-octave {
  stroke-width: 1.5;
}

/* Auxiliary keys */
.key-aux {
  stroke-width: 1.5;
}

/* Pressed state - bright green with glow */
.key.pressed {
  fill: rgba(34, 197, 94, 0.9);
  stroke: rgba(34, 197, 94, 1);
  stroke-width: 2;
  filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.6));
  transform-origin: center;
  animation: keyPress 0.15s ease;
}

@keyframes keyPress {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.12);
  }
  100% {
    transform: scale(1.08);
  }
}

/* Key labels */
.key-labels {
  opacity: 0.5;
  pointer-events: none;
}

.label {
  font-size: 9px;
  font-weight: 600;
  fill: currentColor;
  text-anchor: middle;
}

/* Empty state message */
.empty {
  opacity: 0.7;
  font-size: 13px;
  text-align: center;
  padding: 10px;
}

/* Light mode adaptations */
@media (prefers-color-scheme: light) {
  .shell {
    border-color: rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.7);
  }

  .body-outline {
    opacity: 0.2;
  }

  .key {
    stroke: rgba(0, 0, 0, 0.35);
    fill: rgba(0, 0, 0, 0.05);
  }

  .key-pearl {
    stroke: rgba(0, 0, 0, 0.4);
  }

  .key.pressed {
    fill: rgba(34, 197, 94, 0.85);
    stroke: rgba(34, 197, 94, 1);
    filter: drop-shadow(0 0 3px rgba(34, 197, 94, 0.5));
  }

  .key-labels {
    opacity: 0.6;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sax-diagram {
    max-width: 240px;
  }
}

@media (max-width: 480px) {
  .sax-diagram {
    max-width: 200px;
  }
  
  .key-labels {
    opacity: 0.3;
  }
}
</style>
