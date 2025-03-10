<template>
  <div class="team-section-wrapper">
    <div class="team-section team1-section">
      <h2 class="team-title">Team 1</h2>
    </div>
    <div class="divider-line"></div>
    <div class="team-section team2-section">
      <h2 class="team-title">Team 2</h2>
    </div>
  </div>
</template>

<script setup>
// No script needed for this component
</script>

<style scoped>
/* Team sections */
.team-section-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  pointer-events: none;
  z-index: 1;
}

.team-section {
  flex: 1;
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  position: relative;
  overflow: hidden;
}

.team-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: -1;
  border-radius: 20px;
}

.divider-line {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 20%,
    rgba(255, 255, 255, 0.3) 80%,
    rgba(255, 255, 255, 0) 100%);
  transform: translateX(-50%);
  z-index: 2;
  pointer-events: none;
}

.team-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  padding: 0.5rem 1.5rem;
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  transform: translateY(0);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #ffffff, #a0a0a0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  border-bottom: 2px solid transparent;
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
  transform: translateY(-3px);
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
}

.team-title:hover::before {
  left: 100%;
}

.team1-section .team-title {
  background: linear-gradient(90deg, #ffffff, #c0c0c0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.team2-section .team-title {
  background: linear-gradient(90deg, #c0c0c0, #ffffff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Responsive styles */
@media (max-width: 768px) {
  .team-title {
    font-size: 1.2rem;
    padding: 0.4rem 1rem;
  }
}

@media (max-width: 500px) {
  .team-title {
    font-size: 1rem;
    padding: 0.3rem 0.8rem;
  }
}

@media (max-width: 375px) {
  .team-title {
    font-size: 0.9rem;
    padding: 0.3rem 0.7rem;
  }
}
</style>