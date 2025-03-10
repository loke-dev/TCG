<template>
  <Head>
    <Title>Team Color Generator</Title>
    <Meta name="description" content="Generate team colors for playstation games."/>
  </Head>
  <div class="app-background">
    <BackgroundEffects ref="backgroundEffects" />
    <section @click="handleClick" class="container">
      <MainContent :colors="colors" :is-shuffling="isShuffling" />
      <AppHeader />
      <AppFooter />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useColors } from '~/composables/useColors';
import BackgroundEffects from '~/components/BackgroundEffects.vue';
import MainContent from '~/components/MainContent.vue';
import AppHeader from '~/components/AppHeader.vue';
import AppFooter from '~/components/AppFooter.vue';

// Set up head metadata
useHead({
  htmlAttrs: {
    lang: 'en',
  }
});

// Get color management functions
const { colors, isShuffling, initColors, animate } = useColors();
const backgroundEffects = ref(null);

// Watch for shuffling state changes and update BackgroundEffects component
watch(isShuffling, (newValue) => {
  if (backgroundEffects.value) {
    backgroundEffects.value.setShuffling(newValue);
  }
});

// Initialize on component mount
onMounted(() => {
  // Initialize colors
  initColors();

  // Initial animation
  animate(animateParticles);
});

// Handle click to shuffle
function handleClick() {
  animate(animateParticles);
}

// Animate particles using the BackgroundEffects component
function animateParticles() {
  if (backgroundEffects.value) {
    backgroundEffects.value.animateParticles();
  }
}
</script>

<style>
@import '~/assets/css/global.css';

.app-background {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>