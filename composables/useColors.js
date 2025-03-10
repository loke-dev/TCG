import { ref, watch } from 'vue';

export function useColors() {
  const defaultColors = [
    { id: 'red', name: 'Team 1' },
    { id: 'yellow', name: 'Team 2' },
    { id: 'blue', name: 'Team 3' },
    { id: 'purple', name: 'Team 4' },
  ];

  const colors = ref([]);
  const isShuffling = ref(false);

  // Initialize colors from localStorage or use defaults
  function initColors() {
    if (localStorage.colors) {
      colors.value = JSON.parse(localStorage.colors);
    } else {
      colors.value = defaultColors;
    }
  }

  // Save colors to localStorage when they change
  watch(colors, (newColors) => {
    localStorage.colors = JSON.stringify(newColors);
  });

  // Helper function to pause execution
  function sleep(milliseconds = 1000) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  // Shuffle the colors array
  async function shuffle() {
    // Shuffle the colors array
    colors.value = colors.value
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  // Animate the color shuffling with multiple shuffles
  async function animate(animateParticles) {
    // Set shuffling state to true
    isShuffling.value = true;

    // Create a subtle particle effect if the function is provided
    if (typeof animateParticles === 'function') {
      animateParticles();
    }

    // First shuffle with a clean animation
    await shuffle();
    await sleep(600);

    // Second shuffle
    await shuffle();
    await sleep(600);

    // Final shuffle
    await shuffle();

    // Allow animations to complete
    await sleep(800);

    // Reset shuffling state
    isShuffling.value = false;
  }

  return {
    colors,
    isShuffling,
    initColors,
    animate,
    shuffle
  };
}