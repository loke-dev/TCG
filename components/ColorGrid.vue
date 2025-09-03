<template>
  <transition-group
    v-if="colors.length > 0"
    name="shuffle"
    class="colors-wrapper"
    tag="div"
  >
    <ColorCard
      v-for="(color, index) in [displayColors[0], displayColors[1]]"
      :key="color.id"
      :color="color"
      :is-shuffling="isShuffling"
      :team-class="`team1 team-card-${index + 1}`"
    />

    <VersusElement key="vs" class="versus-element" />
    1
    <ColorCard
      v-for="(color, index) in [displayColors[2], displayColors[3]]"
      :key="color.id"
      :color="color"
      :is-shuffling="isShuffling"
      :team-class="`team2 team-card-${index + 3}`"
    />
  </transition-group>
</template>

<script setup>
import { defineProps, ref, watch, computed } from "vue";
import ColorCard from "./ColorCard.vue";
import VersusElement from "./VersusElement.vue";

const props = defineProps({
  colors: {
    type: Array,
    required: true,
  },
  isShuffling: {
    type: Boolean,
    default: false,
  },
});

const displayColors = ref([...props.colors]);

watch(
  () => props.colors,
  (newColors) => {
    displayColors.value = [...newColors];
  },
  { deep: true }
);

watch(
  () => props.isShuffling,
  (newVal) => {}
);
</script>

<style scoped>
.colors-wrapper {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-areas:
    "team1-1 team1-1 versus team2-1 team2-1"
    "team1-2 team1-2 versus team2-2 team2-2";
  box-sizing: border-box;
  width: 100%;
  max-width: 900px;
  gap: 2rem 1.5rem;
  align-items: center;
  justify-items: center;
  position: relative;
  z-index: 2;
  margin: 0 auto;
  align-self: center;
  justify-self: center;
  padding: 1rem;
}

.team-card-1 {
  grid-area: team1-1;
}

.team-card-2 {
  grid-area: team1-2;
}

.versus-element {
  grid-area: versus;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.team-card-3 {
  grid-area: team2-1;
}

.team-card-4 {
  grid-area: team2-2;
}

.shuffle-move {
  transition: transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
  will-change: transform;
}

.shuffle-enter-active,
.shuffle-leave-active {
  transition: all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
  will-change: transform, opacity;
}

.shuffle-enter-from,
.shuffle-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 1200px) {
  .colors-wrapper {
    gap: 1.5rem 1.25rem;
    padding: 0.75rem;
  }
}

@media (max-width: 768px) {
  .colors-wrapper {
    gap: 0.75rem;
    padding: 0.5rem;
  }
}

@media (max-width: 500px) {
  .colors-wrapper {
    gap: 0.5rem;
    padding: 0.25rem;
  }
}

@media (max-width: 375px) {
  .colors-wrapper {
    gap: 0.25rem;
    padding: 0.25rem;
  }
}
</style>
