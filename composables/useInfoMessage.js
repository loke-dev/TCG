import { ref, onMounted, onUnmounted } from 'vue';

export function useInfoMessage() {
  const showInfoMessage = ref(false);
  const hasInteracted = ref(false);
  const hasSeenInfoMessage = ref(false);
  const progress = ref(100);
  let infoMessageTimer = null;
  let progressInterval = null;
  let remainingTime = 10000; // 10 seconds
  let lastUpdateTime = null;
  const TOTAL_DISPLAY_TIME = 10000; // 10 seconds

  // Check if user has seen the info message before
  onMounted(() => {
    // Check localStorage for user preference
    if (localStorage.getItem('hasSeenInfoMessage') === 'true') {
      hasSeenInfoMessage.value = true;
    }

    // Set up timer to show info message after 15 seconds if user hasn't interacted
    if (!hasSeenInfoMessage.value) {
      infoMessageTimer = setTimeout(() => {
        if (!hasInteracted.value) {
          showInfoMessage.value = true;
          startProgressBar();
        }
      }, 15000);
    }
  });

  // Clean up timers on component unmount
  onUnmounted(() => {
    if (infoMessageTimer) {
      clearTimeout(infoMessageTimer);
    }
    stopProgressBar();
  });

  // Start the progress bar countdown
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
    }, 100); // Update every 100ms for smooth animation
  }

  // Stop the progress bar
  function stopProgressBar() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  // Pause the countdown
  function pauseCountdown() {
    stopProgressBar();
  }

  // Resume the countdown
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

  // Mark that user has interacted with the page
  function markInteracted() {
    hasInteracted.value = true;
    if (showInfoMessage.value) {
      hideInfoMessage();
    }
  }

  // Hide the info message and remember user preference
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