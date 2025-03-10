<template>
  <div class="vs">
    <div class="vs-circle">
      <span class="vs-text">VS</span>
    </div>
    <div class="vs-line vs-line-top"></div>
    <div class="vs-line vs-line-bottom"></div>
  </div>
</template>

<script setup>
// No script needed for this component
</script>

<style scoped>
.vs {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  position: relative;
  align-self: center;
  margin: 0 auto;
}

.vs-circle {
  width: 5rem;
  height: 5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 2;
}

.vs-text {
  font-size: 2.5rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.vs-line {
  position: absolute;
  left: 50%;
  width: 2px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
  transform: translateX(-50%);
  z-index: 1;
}

.vs-line-top {
  top: 0;
  height: 40%;
}

.vs-line-bottom {
  bottom: 0;
  height: 40%;
}

/* Responsive styles */
@media (max-width: 500px) {
  .vs-circle {
    width: 4rem;
    height: 4rem;
  }

  .vs-text {
    font-size: 2rem;
  }
}

@media (max-width: 375px) {
  .vs-circle {
    width: 3.5rem;
    height: 3.5rem;
  }

  .vs-text {
    font-size: 1.8rem;
  }
}
</style>