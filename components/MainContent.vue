<template>
  <div class="glass-panel content">
    <TeamSection />
    <ColorGrid :colors="colors" :is-shuffling="isShuffling" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import TeamSection from './TeamSection.vue';
import ColorGrid from './ColorGrid.vue';

defineProps({
  colors: {
    type: Array,
    required: true
  },
  isShuffling: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.content {
  box-sizing: border-box;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 1000px;
  min-height: 500px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1.5rem;
  margin: 1.5rem auto;
}

@media (max-width: 1200px) {
  .content {
    padding: 1.75rem;
    gap: 1.25rem;
    margin: 1.25rem auto;
    min-height: 475px;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 1.25rem;
    gap: 0.75rem;
    margin: 0.75rem auto;
    min-height: 400px;
  }
}

@media (max-width: 500px) {
  .content {
    min-height: 380px;
    padding: 1rem;
    gap: 0.5rem;
    margin: 0.5rem auto;
  }
}

@media (max-width: 375px) {
  .content {
    padding: 0.75rem;
    min-height: 350px;
    gap: 0.5rem;
    margin: 0.5rem auto;
  }
}
</style>