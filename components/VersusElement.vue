<template>
  <div class="vs">
    <div class="vs-circle">
      <span class="vs-text">VS</span>
    </div>
  </div>
</template>

<script setup>
// No script needed for this component
</script>

<style scoped>
.vs {
  display: grid;
  place-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  padding: var(--space-sm, 0.5rem);
}

.vs-circle {
  width: 5rem;
  height: 5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: grid;
  place-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 2;
}

.vs-circle::before,
.vs-circle::after {
  content: '';
  position: absolute;
  left: 50%;
  width: 2px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
  transform: translateX(-50%);
  z-index: 1;
}

.vs-circle::before {
  top: -35%;
  height: 35%;
}

.vs-circle::after {
  bottom: -35%;
  height: 35%;
}

.vs-text {
  font-size: 2.5rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

/* Responsive styles */
@media (max-width: 1200px) {
  .vs-circle {
    width: 4.5rem;
    height: 4.5rem;
  }

  .vs-text {
    font-size: 2.25rem;
  }
}

@media (max-width: 768px) {
  .vs-circle {
    width: 3.5rem;
    height: 3.5rem;
  }

  .vs-text {
    font-size: 1.75rem;
  }
}

@media (max-width: 500px) {
  .vs-circle {
    width: 3rem;
    height: 3rem;
  }

  .vs-text {
    font-size: 1.5rem;
  }
}

@media (max-width: 375px) {
  .vs-circle {
    width: 2.5rem;
    height: 2.5rem;
  }

  .vs-text {
    font-size: 1.25rem;
  }
}
</style>