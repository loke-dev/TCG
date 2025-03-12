import { ref, onMounted, onUnmounted } from 'vue';

export function useInfoMessage() {
  const showInfoMessage = ref(false);
  const hasInteracted = ref(false);
  const hasSeenInfoMessage = ref(false);
  const progress = ref(100);
  let infoMessageTimer = null;
  let progressInterval = null;
  let remainingTime = 10000;
  let lastUpdateTime = null;
  const TOTAL_DISPLAY_TIME = 10000;

  onMounted(() => {
    if (localStorage.getItem('hasSeenInfoMessage') === 'true') {
      hasSeenInfoMessage.value = true;
    }

    if (!hasSeenInfoMessage.value) {
      infoMessageTimer = setTimeout(() => {
        if (!hasInteracted.value) {
          showInfoMessage.value = true;
          startProgressBar();
        }
      }, 15000);
    }
  });

  onUnmounted(() => {
    if (infoMessageTimer) {
      clearTimeout(infoMessageTimer);
    }
    stopProgressBar();
  });

  function startProgressBar() {
    remainingTime = TOTAL_DISPLAY_TIME;
    lastUpdateTime = Date.now();
    progress.value = 100;

    progressInterval = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - lastUpdateTime;
      lastUpdateTime = currentTime;

      remainingTime -= elapsed;
      progress.value = (remainingTime / TOTAL_DISPLAY_TIME) * 100;

      if (remainingTime <= 0) {
        hideInfoMessage();
      }
    }, 100);
  }

  function stopProgressBar() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  function pauseCountdown() {
    stopProgressBar();
  }

  function resumeCountdown() {
    if (showInfoMessage.value && !progressInterval) {
      lastUpdateTime = Date.now();
      progressInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = currentTime - lastUpdateTime;
        lastUpdateTime = currentTime;

        remainingTime -= elapsed;
        progress.value = (remainingTime / TOTAL_DISPLAY_TIME) * 100;

        if (remainingTime <= 0) {
          hideInfoMessage();
        }
      }, 100);
    }
  }

  function markInteracted() {
    hasInteracted.value = true;
    if (showInfoMessage.value) {
      hideInfoMessage();
    }
  }

  function hideInfoMessage() {
    showInfoMessage.value = false;
    hasSeenInfoMessage.value = true;
    localStorage.setItem('hasSeenInfoMessage', 'true');
    stopProgressBar();
  }

  return {
    showInfoMessage,
    hasInteracted,
    progress,
    markInteracted,
    hideInfoMessage,
    pauseCountdown,
    resumeCountdown
  };
}