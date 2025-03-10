<template>
  <transition-group v-if="colors.length > 0" name="shuffle" class="colors-wrapper" tag="div">
    <ColorCard
      v-for="(color, index) in [displayColors[0], displayColors[1]]"
      :key="color.id"
      :color="color"
      :is-shuffling="isShuffling"
      :team-class="`team1 lt-${index + 1}`"
    />

    <VersusElement key="vs" class="lt-0" />

    <ColorCard
      v-for="(color, index) in [displayColors[2], displayColors[3]]"
      :key="color.id"
      :color="color"
      :is-shuffling="isShuffling"
      :team-class="`team2 lt-${index + 3}`"
    />
  </transition-group>
</template>

<script setup>
import { defineProps, ref, watch, computed } from 'vue';
import ColorCard from './ColorCard.vue';
import VersusElement from './VersusElement.vue';

const props = defineProps({
  colors: {
    type: Array,
    required: true
  },
  isShuffling: {
    type: Boolean,
    default: false
  }
});

// Create a reactive copy of the colors array for display
const displayColors = ref([...props.colors]);

// Update displayColors when props.colors changes
watch(() => props.colors, (newColors) => {
  displayColors.value = [...newColors];
}, { deep: true });

// Watch for shuffle state changes - but don't actually change positions
// This allows the visual shuffle animation to play without changing card positions
watch(() => props.isShuffling, (newVal) => {
  // We don't modify displayColors here, so cards will animate but return to original positions
  // The visual shuffle effect comes from the CSS animation in ColorCard component
});
</script>

<style scoped>
/* Card grid layout */
.colors-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: "lt-1 lt-0 lt-3" "lt-2 lt-0 lt-4";
  padding: 20px;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  gap: 1rem;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.lt-1 { grid-area: lt-1; justify-self: end; }
.lt-2 { grid-area: lt-2; justify-self: end; }
.lt-0 { grid-area: lt-0; justify-self: center; }
.lt-3 { grid-area: lt-3; justify-self: start; }
.lt-4 { grid-area: lt-4; justify-self: start; }

@media (min-width: 800px) {
  .colors-wrapper {
    column-gap: 10%;
    row-gap: 2rem;
  }
}

/* Improved shuffle animation */
.shuffle-move {
  transition: transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
  will-change: transform;
}

.shuffle-enter-active, .shuffle-leave-active {
  transition: all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
  will-change: transform, opacity;
}

.shuffle-enter-from, .shuffle-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive styles */
@media (max-width: 768px) {
  .colors-wrapper {
    gap: 0.8rem;
    padding: 15px;
  }
}

@media (max-width: 500px) {
  .colors-wrapper {
    gap: 0.7rem;
    padding: 10px;
    margin: 0.5rem;
  }
}

@media (max-width: 375px) {
  .colors-wrapper {
    gap: 0.5rem;
    padding: 8px;
  }
}
</style>