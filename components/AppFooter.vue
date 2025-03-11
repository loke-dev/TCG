<template>
  <div class="footer">
    <div class="links">
      <a href="https://loke.dev" target="_blank" class="button--glass" rel="noopener">Author</a>
      <a href="https://github.com/loke-dev/TCG" target="_blank" class="button--glass" rel="noopener">GitHub</a>
    </div>
  </div>
</template>

<script setup>
// No script needed for this component
</script>

<style scoped>
.footer {
  width: 100%;
  display: grid;
  justify-content: end;
  padding: 1.5rem 0;
  margin: 0 auto;
}

.links {
  display: grid;
  grid-auto-flow: column;
  gap: 1.25rem;
  padding-right: 2rem;
}

.button--glass {
  display: inline-block;
  color: #ffffff;
  text-decoration: none;
  padding: 0.7rem 1.75rem;
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-align: center;
  font-size: 1rem;
}

.button--glass:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

/* Responsive styles */
@media (max-width: 1200px) {
  .footer {
    padding: 1rem 0;
  }

  .links {
    gap: 1rem;
    padding-right: 1.5rem;
  }

  .button--glass {
    padding: 0.6rem 1.5rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 0.5rem 0;
  }

  .links {
    gap: 0.5rem;
    padding-right: 0.75rem;
  }

  .button--glass {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 500px) {
  .footer {
    padding: 0.5rem 0;
  }

  .links {
    gap: 0.4rem;
    padding-right: 0.5rem;
  }

  .button--glass {
    padding: 0.3rem 0.75rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 375px) {
  .footer {
    padding: 0.25rem 0;
  }

  .links {
    gap: 0.3rem;
    padding-right: 0.5rem;
  }

  .button--glass {
    padding: 0.25rem 0.6rem;
    font-size: 0.75rem;
  }
}
</style>