<template>
  <div class="card-container" :class="teamClass">
    <div
      class="card"
      :class="[color.id, {'is-flipping': isShuffling}]"
      :style="cardStyle"
    >
      <div class="card-face card-front">
        <div class="card-shine"></div>
      </div>
      <div class="card-face card-back"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  color: {
    type: Object,
    required: true
  },
  isShuffling: {
    type: Boolean,
    default: false
  },
  teamClass: {
    type: String,
    default: ''
  }
});

// Smooth 2D animation parameters
const rotationAngle = ref(Math.random() * 10 - 5); // Small random rotation between -5 and 5 degrees
const translateX = ref(Math.random() * 30 - 15); // Random X movement between -15px and 15px
const translateY = ref(Math.random() * 20 - 10); // Random Y movement between -10px and 10px
const scale = ref((0.92 + Math.random() * 0.16).toFixed(2)); // Random scale between 0.92 and 1.08
const animationDuration = ref((0.6 + Math.random() * 0.3).toFixed(2)); // Between 0.6s and 0.9s
const animationDelay = ref((Math.random() * 0.15).toFixed(2)); // Between 0s and 0.15s
const brightness = ref((1 + Math.random() * 0.08).toFixed(2)); // Reduced brightness boost (1.00-1.08)

// Store reference to card container for cleanup
const cardContainer = ref(null);

const cardStyle = computed(() => {
  return {
    '--rotation': `${rotationAngle.value}deg`,
    '--translate-x': `${translateX.value}px`,
    '--translate-y': `${translateY.value}px`,
    '--scale': scale.value,
    '--animation-duration': `${animationDuration.value}s`,
    '--animation-delay': `${animationDelay.value}s`,
    '--brightness': brightness.value
  };
});

watch(() => props.isShuffling, (newVal) => {
  if (newVal) {
    // Randomize shuffle parameters each time shuffling starts
    rotationAngle.value = Math.random() * 10 - 5; // Small random rotation between -5 and 5 degrees
    translateX.value = Math.random() * 30 - 15; // Random X movement between -15px and 15px
    translateY.value = Math.random() * 20 - 10; // Random Y movement between -10px and 10px
    scale.value = (0.95 + Math.random() * 0.1).toFixed(2); // Subtle scale between 0.95 and 1.05
    animationDuration.value = (0.7 + Math.random() * 0.2).toFixed(2); // Between 0.7s and 0.9s
    animationDelay.value = (Math.random() * 0.1).toFixed(2); // Between 0s and 0.1s
    brightness.value = (1 + Math.random() * 0.05).toFixed(2); // Subtle brightness boost (1.00-1.05)
  }
});

// Optimized event handlers with throttling
function throttle(func, limit) {
  let inThrottle;
  return function(e) {
    if (!inThrottle) {
      func(e);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const handleCardTilt = throttle((e) => {
  const card = e.currentTarget.querySelector('.card');
  if (!card) return;

  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  // Calculate tilt with smoother values and damping
  const maxTilt = 10; // Reduced maximum tilt angle
  const percentX = (x - centerX) / (rect.width / 2);
  const percentY = (y - centerY) / (rect.height / 2);

  // Apply damping for smoother effect
  const rotateX = percentY * maxTilt * 0.5; // Reduced vertical tilt
  const rotateY = -percentX * maxTilt * 0.7; // Reduced horizontal tilt
  const translateZ = 5; // Reduced depth effect for subtlety

  // Use CSS transform with easing for smoother transitions
  requestAnimationFrame(() => {
    card.style.transition = 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)';
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
  });
}, 16); // Increased throttle time for smoother performance

function resetCardTilt(e) {
  const card = e.currentTarget.querySelector('.card');
  if (!card) return;

  requestAnimationFrame(() => {
    card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
  });
}

const handleCardShine = throttle((e) => {
  const shine = e.currentTarget.querySelector('.card-shine');
  if (!shine) return;

  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Use a smoother gradient with better opacity values
  requestAnimationFrame(() => {
    shine.style.background = `radial-gradient(
      circle at ${x}px ${y}px,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.15) 25%,
      rgba(255, 255, 255, 0) 50%
    )`;
  });
}, 16); // Increased throttle time for smoother performance

onMounted(() => {
  // Add hover effects to cards
  cardContainer.value = document.querySelector(`.${props.color.id}`).parentElement;

  if (cardContainer.value) {
    cardContainer.value.addEventListener('mousemove', handleCardTilt);
    cardContainer.value.addEventListener('mouseleave', resetCardTilt);
    cardContainer.value.addEventListener('mousemove', handleCardShine);
  }
});

onBeforeUnmount(() => {
  // Clean up event listeners
  if (cardContainer.value) {
    cardContainer.value.removeEventListener('mousemove', handleCardTilt);
    cardContainer.value.removeEventListener('mouseleave', resetCardTilt);
    cardContainer.value.removeEventListener('mousemove', handleCardShine);
  }
});
</script>

<style scoped>
/* Card styles */
.card-container {
  perspective: 1000px;
  margin: 0.5rem;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: flex;
  justify-content: center;
  will-change: transform;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.card-container:hover {
  transform: translateY(-8px);
}

.card {
  position: relative;
  width: 10rem;
  height: 12rem;
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  border-radius: 1rem;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  will-change: transform, box-shadow, filter;
  transform: translate3d(0, 0, 0);
  overflow: hidden;
  backface-visibility: hidden;
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}

.card-front {
  z-index: 2;
}

.card-back {
  z-index: 1;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.card-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 1rem;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.card:hover .card-shine {
  opacity: 1;
}

/* Color-specific card styles */
.red .card-back {
  background-color: #f15750;
  box-shadow:
    0 10px 20px rgba(222, 7, 7, 0.3),
    0 0 40px rgba(222, 7, 7, 0.2),
    inset 0 0 15px rgba(255, 255, 255, 0.3);
}

.blue .card-back {
  background-color: #0575e6;
  box-shadow:
    0 10px 20px rgba(5, 117, 230, 0.3),
    0 0 40px rgba(5, 117, 230, 0.2),
    inset 0 0 15px rgba(255, 255, 255, 0.3);
}

.yellow .card-back {
  background-color: #fffd76;
  box-shadow:
    0 10px 20px rgba(255, 252, 0, 0.3),
    0 0 40px rgba(255, 252, 0, 0.2),
    inset 0 0 15px rgba(255, 255, 255, 0.3);
}

.purple .card-back {
  background-color: #a044ff;
  box-shadow:
    0 10px 20px rgba(160, 68, 255, 0.3),
    0 0 40px rgba(160, 68, 255, 0.2),
    inset 0 0 15px rgba(255, 255, 255, 0.3);
}

/* Color cards with enhanced gradients */
.red .card-front {
  background: linear-gradient(135deg, #ff8a80, #f15750, #c62828);
  box-shadow:
    0 10px 20px rgba(222, 7, 7, 0.3),
    0 0 40px rgba(222, 7, 7, 0.2),
    inset 0 0 15px rgba(255, 255, 255, 0.3);
}

.blue .card-front {
  background: linear-gradient(135deg, #82b1ff, #0575e6, #0d47a1);
  box-shadow:
    0 10px 20px rgba(5, 117, 230, 0.3),
    0 0 40px rgba(5, 117, 230, 0.2),
    inset 0 0 15px rgba(255, 255, 255, 0.3);
}

.yellow .card-front {
  background: linear-gradient(135deg, #ffff8d, #fffd76, #ffd600);
  box-shadow:
    0 10px 20px rgba(255, 252, 0, 0.3),
    0 0 40px rgba(255, 252, 0, 0.2),
    inset 0 0 15px rgba(255, 255, 255, 0.3);
}

.purple .card-front {
  background: linear-gradient(135deg, #b388ff, #a044ff, #6200ea);
  box-shadow:
    0 10px 20px rgba(160, 68, 255, 0.3),
    0 0 40px rgba(160, 68, 255, 0.2),
    inset 0 0 15px rgba(255, 255, 255, 0.3);
}

/* New 2D shuffle animation */
.card.is-flipping {
  animation-name: cardShuffle;
  animation-duration: var(--animation-duration, 0.7s);
  animation-delay: var(--animation-delay, 0s);
  animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  animation-fill-mode: forwards;
  will-change: transform, filter;
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset;
}

@keyframes cardShuffle {
  0% {
    transform: translateX(0) translateY(0) rotate(0deg) scale(1);
    filter: brightness(1) contrast(1);
    z-index: 1;
  }
  20% {
    transform: translateY(-15px) scale(1.03);
    filter: brightness(var(--brightness)) contrast(1.02);
    z-index: 10;
  }
  50% {
    transform: translateX(var(--translate-x))
               translateY(var(--translate-y))
               rotate(var(--rotation))
               scale(var(--scale));
    filter: brightness(var(--brightness)) contrast(1.02);
    z-index: 10;
  }
  80% {
    transform: translateY(-5px) scale(1.01);
    filter: brightness(1.02) contrast(1.01);
    z-index: 5;
  }
  100% {
    transform: translateX(0) translateY(0) rotate(0deg) scale(1);
    filter: brightness(1) contrast(1);
    z-index: 1;
  }
}

/* Responsive styles */
@media (max-width: 768px) {
  .card {
    width: 8rem;
    height: 10rem;
  }

  .card-container {
    margin: 0.7rem;
  }
}

@media (max-width: 500px) {
  .card {
    width: 6rem;
    height: 8rem;
  }

  .card-container {
    margin: 0.6rem;
  }
}

@media (max-width: 375px) {
  .card {
    width: 5.5rem;
    height: 7.5rem;
  }

  .card-container {
    margin: 0.4rem;
  }
}
</style>