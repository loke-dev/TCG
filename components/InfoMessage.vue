<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="info-message glass-panel"
      @mouseenter="$emit('pause')"
      @mouseleave="$emit('resume')"
    >
      <div class="info-content">
        <p>Click anywhere to shuffle the team colors!</p>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
          1
        </div>
      </div>
      <button class="close-button" @click.stop="onClose">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: 100,
  },
});

const emit = defineEmits(["close", "pause", "resume"]);

function onClose() {
  emit("close");
}
</script>

<style scoped>
.info-message {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-content p {
  margin: 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.progress-bar-container {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  transition: width 0.1s linear;
}

.close-button {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

@media (max-width: 768px) {
  .info-message {
    bottom: 1.5rem;
    padding: 0.6rem 1.25rem;
  }

  .info-content p {
    font-size: 0.9rem;
  }

  .progress-bar-container {
    height: 1.5px;
  }
}

@media (max-width: 500px) {
  .info-message {
    bottom: 1rem;
    padding: 0.5rem 1rem;
  }

  .info-content p {
    font-size: 0.8rem;
  }
}
</style>
