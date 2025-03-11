<template>
  <Head>
    <Title>Team Color Generator</Title>
    <Meta name="description" content="Generate team colors for playstation games."/>
  </Head>
  <div class="app-background">
    <BackgroundEffects ref="backgroundEffects" />
    <main @click="handleClick" class="container">
      <AppHeader />
      <MainContent :colors="colors" :is-shuffling="isShuffling" />
      <AppFooter />
    </main>
    <InfoMessage
      :show="showInfoMessage"
      :progress="progress"
      @close="hideInfoMessage"
      @pause="pauseCountdown"
      @resume="resumeCountdown"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useColors } from '~/composables/useColors';
import { useInfoMessage } from '~/composables/useInfoMessage';
import BackgroundEffects from '~/components/BackgroundEffects.vue';
import MainContent from '~/components/MainContent.vue';
import AppHeader from '~/components/AppHeader.vue';
import AppFooter from '~/components/AppFooter.vue';
import InfoMessage from '~/components/InfoMessage.vue';

// Set up head metadata
useHead({
  htmlAttrs: {
    lang: 'en',
  }
});

// Get color management functions
const { colors, isShuffling, initColors, animate } = useColors();
const backgroundEffects = ref(null);

// Get info message management
const {
  showInfoMessage,
  hasInteracted,
  progress,
  markInteracted,
  hideInfoMessage,
  pauseCountdown,
  resumeCountdown
} = useInfoMessage();

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
  // Mark that user has interacted with the page
  markInteracted();

  // Shuffle colors
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
  display: grid;
  place-items: center;
  background: radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0a 70%);
}

.container {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  padding: 1.5rem;
  box-sizing: border-box;
  z-index: 2;
  gap: 1.5rem;
}

@media (max-width: 1200px) {
  .container {
    padding: 1rem;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
    gap: 0.5rem;
  }
}

@media (max-width: 500px) {
  .container {
    padding: 0.5rem;
    gap: 0.5rem;
  }
}

@media (max-width: 375px) {
  .container {
    padding: 0.25rem;
    gap: 0.25rem;
  }
}
</style>