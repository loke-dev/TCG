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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  perspective: 1000px;
  position: relative;
  overflow: hidden;
  margin: 1rem auto;
  width: -webkit-fill-available;
  max-width: 1000px;
}

@media (max-width: 1000px) {
  .content {
    margin: 1rem;
  }
}

@media (max-width: 500px) {
  .content {
    min-height: 450px;
    padding: 1.5rem;
  }
}

@media (max-width: 375px) {
  .content {
    padding: 1.5rem;
    min-height: 400px;
  }
}
</style>