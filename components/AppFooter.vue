<template>
  <div class="links">
    <a href="https://loke.dev" target="_blank" class="button--glass" rel="noopener">Author</a>
    <a href="https://github.com/loke-dev/TCG" target="_blank" class="button--glass" rel="noopener">GitHub</a>
  </div>
</template>

<script setup>
// No script needed for this component
</script>

<style scoped>
.links {
  align-self: end;
  justify-self: end;
  padding: 1.5rem;
}

.button--glass {
  display: inline-block;
  color: #ffffff;
  text-decoration: none;
  padding: 0.7rem 1.5rem;
  margin-left: 1rem;
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.button--glass:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

/* Responsive styles */
@media (max-width: 500px) {
  .button--glass {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    margin-left: 0.5rem;
  }
}

@media (max-width: 375px) {
  .links {
    padding: 1rem;
  }

  .button--glass {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    margin-left: 0.4rem;
  }
}
</style>