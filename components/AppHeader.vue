<template>
  <div class="glass-panel header">
    <h1 class="title">TCG</h1>
    <p class="subtitle">Team Color Generator</p>
  </div>
</template>

<script setup>
// No script needed for this component
</script>

<style scoped>
.header {
  box-sizing: border-box;
  padding: 1.5rem 2rem;
  margin: 1.5rem auto 0;
  display: grid;
  place-items: center;
  text-align: center;
  width: 100%;
  max-width: 1000px;
  gap: 0.5rem;
}

/* Title styles */
.title {
  font-size: 4.5rem;
  font-weight: 900;
  margin: 0;
  line-height: 1;
  background: linear-gradient(to right, #f15750, #fffd76, #0575e6, #a044ff);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
  position: relative;
  animation: gradient-shift 8s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Subtitle styles */
.subtitle {
  font-size: 1.3rem;
  font-weight: 500;
  margin: 0.5rem 0 0;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
}

/* Responsive styles */
@media (max-width: 1200px) {
  .header {
    padding: 1.25rem 1.75rem;
    margin: 1rem auto 0;
    gap: 0.35rem;
  }

  .title {
    font-size: 3.75rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0.75rem 1.25rem;
    margin: 0.5rem auto 0;
    gap: 0.2rem;
  }

  .title {
    font-size: 3rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 500px) {
  .header {
    padding: 0.5rem 1rem;
    margin: 0.5rem auto 0;
    gap: 0.15rem;
  }

  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }
}

@media (max-width: 375px) {
  .header {
    padding: 0.5rem 0.75rem;
    margin: 0.25rem auto 0;
    gap: 0.1rem;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }
}
</style>