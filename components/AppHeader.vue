<template>
  <div class="glass-panel header">
    <h1 class="title">TCG</h1>
    <p class="subtitle">Team Color Generator</p>
    <p class="notice text-glow">(Click anywhere to shuffle)</p>
  </div>
</template>

<script setup>
// No script needed for this component
</script>

<style scoped>
.header {
  box-sizing: border-box;
  padding: 1rem 2rem;
  margin: 0.5rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: -webkit-fill-available;
  max-width: 1000px;
}

/* Title styles */
.title {
  font-size: 4rem;
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

.title::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, #f15750, #fffd76, #0575e6, #a044ff);
  background-size: 300% 300%;
  border-radius: 3px;
  animation: gradient-shift 8s ease infinite;
}

.subtitle {
  font-size: 1.5rem;
  margin-top: 0.3rem;
  font-weight: 600;
  letter-spacing: 1px;
  background: linear-gradient(to right, #f15750, #fffd76, #0575e6, #a044ff);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
  animation: gradient-shift 8s ease infinite;
  animation-delay: 0.5s;
}

.subtitle::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, #f15750, #fffd76, #0575e6, #a044ff);
  background-size: 300% 300%;
  opacity: 0.7;
  border-radius: 1px;
  animation: gradient-shift 8s ease infinite;
  animation-delay: 0.5s;
}

.notice {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.3rem;
  font-family: 'Exo 2', sans-serif;
  letter-spacing: 0.5px;
}

.title, .subtitle, .notice {
  cursor: default;
  user-select: none;
}

/* Responsive styles */
@media (max-width: 1000px) {
  .header {
    margin: 0.5rem;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 3.5rem;
  }

  .subtitle {
    font-size: 1.3rem;
  }

  .header {
    padding: 0.8rem 1.5rem;
  }
}

@media (max-width: 500px) {
  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .header {
    padding: 0.7rem 1.2rem;
  }
}

@media (max-width: 375px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .notice {
    font-size: 0.7rem;
  }

  .header {
    padding: 0.6rem 1rem;
  }
}
</style>