<template>
  <div class="team-section-wrapper">
    <h2 class="team-title team1-title">Team 1</h2>
    <h2 class="team-title team2-title">Team 2</h2>
  </div>
</template>

<script setup>
// No script needed for this component
</script>

<style scoped>
/* Team sections */
.team-section-wrapper {
  width: 100%;
  height: 4rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  z-index: 1;
  padding: 0 1rem;
  position: relative;
}

.team-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  border-bottom: 2px solid transparent;
}

.team1-title {
  background: linear-gradient(90deg, #ffffff, #c0c0c0);
  -webkit-background-clip: text;
  background-clip: text;
  justify-self: center;
}

.team2-title {
  background: linear-gradient(90deg, #c0c0c0, #ffffff);
  -webkit-background-clip: text;
  background-clip: text;
  justify-self: center;
}

.team-title::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s ease;
}

.team-title:hover {
  transform: translateY(-2px);
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
}

.team-title:hover::before {
  left: 100%;
}

/* Responsive styles */
@media (max-width: 1200px) {
  .team-section-wrapper {
    height: 3.5rem;
  }

  .team-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .team-section-wrapper {
    height: 2.5rem;
    padding: 0 0.5rem;
  }

  .team-title {
    font-size: 1rem;
  }
}

@media (max-width: 500px) {
  .team-section-wrapper {
    height: 2rem;
    padding: 0 0.25rem;
  }

  .team-title {
    font-size: 0.9rem;
  }
}

@media (max-width: 375px) {
  .team-section-wrapper {
    height: 1.75rem;
    padding: 0 0.25rem;
  }

  .team-title {
    font-size: 0.8rem;
  }
}
</style>