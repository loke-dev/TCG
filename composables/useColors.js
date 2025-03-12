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

  function initColors() {
    if (localStorage.colors) {
      colors.value = JSON.parse(localStorage.colors);
    } else {
      colors.value = defaultColors;
    }
  }

  watch(colors, (newColors) => {
    localStorage.colors = JSON.stringify(newColors);
  });

  function sleep(milliseconds = 1000) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  async function shuffle() {
    colors.value = colors.value
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  async function animate(animateParticles) {
    isShuffling.value = true;

    if (typeof animateParticles === 'function') {
      animateParticles();
    }

    await sleep(100);

    await shuffle();
    await sleep(600);

    await shuffle();
    await sleep(600);

    await shuffle();
    await sleep(600);

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