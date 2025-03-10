<template>
  <div class="background-effects">
    <div class="gradient-orb orb-1"></div>
    <div class="gradient-orb orb-2"></div>
    <div class="gradient-orb orb-3"></div>
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const particleCanvas = ref(null);
const isShuffling = ref(false);
let animationFrameId = null;
let particles = [];
const DEBUG_MODE = false;

// Store grid dimensions for reference
let gridSize = 0;
const PADDING = 80; // Increased padding from edges

// Particle class for managing individual particles
class Particle {
  constructor(x, y, size, color, ctx, canvasWidth, canvasHeight) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Initial slow movement
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.speedY = (Math.random() - 0.5) * 0.2;

    // Physics properties
    this.mass = this.size * 0.5; // Mass based on size
    this.friction = 0.995; // Very slight friction to gradually slow down
    this.minSpeed = 0.05; // Minimum speed to maintain some movement

    // Visual properties
    this.alpha = 0.7;
    this.targetAlpha = 0.7;
    this.baseSize = size;
    this.targetSize = size;

    // State
    this.isActive = false;
  }

  update() {
    // Apply friction to gradually slow down
    this.speedX *= this.friction;
    this.speedY *= this.friction;

    // Ensure particles never completely stop moving
    const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
    if (currentSpeed < this.minSpeed && !this.isActive) {
      // Add small random movement to maintain minimum speed
      const angle = Math.random() * Math.PI * 2;
      this.speedX = Math.cos(angle) * this.minSpeed;
      this.speedY = Math.sin(angle) * this.minSpeed;
    }

    // Update position
    this.x += this.speedX;
    this.y += this.speedY;

    // Gradually change alpha
    if (this.alpha < this.targetAlpha) {
      this.alpha += 0.01;
    } else if (this.alpha > this.targetAlpha) {
      this.alpha -= 0.01;
    }

    // Gradually change size
    if (this.size < this.targetSize) {
      this.size += 0.1;
    } else if (this.size > this.targetSize) {
      this.size -= 0.1;
    }

    // Bounce off edges with energy loss
    const padding = 20; // Keep particles away from the very edge
    if (this.x < padding + this.size || this.x > this.canvasWidth - padding - this.size) {
      this.speedX *= -0.85; // Lose some energy on bounce

      // Keep particle within bounds
      if (this.x < padding + this.size) this.x = padding + this.size;
      if (this.x > this.canvasWidth - padding - this.size) this.x = this.canvasWidth - padding - this.size;

      // Visual effect on bounce
      this.targetSize = this.baseSize * 1.5;
      setTimeout(() => {
        this.targetSize = this.baseSize;
      }, 100);
    }

    if (this.y < padding + this.size || this.y > this.canvasHeight - padding - this.size) {
      this.speedY *= -0.85; // Lose some energy on bounce

      // Keep particle within bounds
      if (this.y < padding + this.size) this.y = padding + this.size;
      if (this.y > this.canvasHeight - padding - this.size) this.y = this.canvasHeight - padding - this.size;

      // Visual effect on bounce
      this.targetSize = this.baseSize * 1.5;
      setTimeout(() => {
        this.targetSize = this.baseSize;
      }, 100);
    }
  }

  draw() {
    // Draw glow effect
    const glow = this.size * 2;
    const gradient = this.ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, glow
    );

    // Extract base color for glow
    const baseColor = this.color.replace(/[^,]+(?=\))/, '0.1');

    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, baseColor);

    this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, glow, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw main particle
    this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  fadeOut() {
    this.targetAlpha = 0;
  }

  fadeIn() {
    this.targetAlpha = 0.7;
  }

  activate() {
    this.isActive = true;

    // Schedule deactivation
    setTimeout(() => {
      this.isActive = false;
    }, 3000);
  }

  applyForce(forceX, forceY) {
    // Apply force based on mass (F = ma, so a = F/m)
    this.speedX += forceX / this.mass;
    this.speedY += forceY / this.mass;

    // Activate physics
    this.activate();
  }

  explodeFrom(centerX, centerY, force) {
    // Calculate direction from center
    const dx = this.x - centerX;
    const dy = this.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Avoid division by zero
    if (distance === 0) return;

    // Force decreases with distance
    const actualForce = force / (1 + distance * 0.1);

    // Apply force in direction away from center
    this.applyForce((dx / distance) * actualForce, (dy / distance) * actualForce);
  }

  setRandomVelocity(minSpeed, maxSpeed) {
    const angle = Math.random() * Math.PI * 2;
    const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);

    this.speedX = Math.cos(angle) * speed;
    this.speedY = Math.sin(angle) * speed;
    this.activate();
  }
}

onMounted(() => {
  // Initialize canvas
  initCanvas();

  // Animate gradient orbs
  animateGradientOrbs();

  // Add resize listener
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // Clean up animation frame
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  // Clean up resize listener
  window.removeEventListener('resize', handleResize);
});

function handleResize() {
  // Resize canvas
  if (particleCanvas.value) {
    const canvas = particleCanvas.value;
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update particle canvas dimensions and scale positions
    particles.forEach(particle => {
      // Scale position proportionally
      particle.x = (particle.x / oldWidth) * canvas.width;
      particle.y = (particle.y / oldHeight) * canvas.height;

      // Update canvas dimensions
      particle.canvasWidth = canvas.width;
      particle.canvasHeight = canvas.height;
    });
  }
}

function initCanvas() {
  if (!particleCanvas.value) return;

  const canvas = particleCanvas.value;
  const ctx = canvas.getContext('2d');

  // Set canvas dimensions to match window
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Create initial particles
  createParticles(ctx, canvas.width, canvas.height);

  // Start animation loop
  animate(ctx, canvas.width, canvas.height);

  // Add debug border if in debug mode
  if (DEBUG_MODE) {
    canvas.style.border = '2px solid red';
  }
}

function createParticles(ctx, width, height) {
  // Clear existing particles
  particles = [];

  // Colors for particles
  const colors = [
    'rgba(241, 87, 80, 0.7)',  // Red
    'rgba(255, 253, 118, 0.7)', // Yellow
    'rgba(5, 117, 230, 0.7)',   // Blue
    'rgba(160, 68, 255, 0.7)'   // Purple
  ];

  // Create particles distributed across the canvas
  const padding = 50; // Keep particles away from edges

  for (let i = 0; i < 150; i++) {
    // Random position with padding from edges
    const x = padding + Math.random() * (width - padding * 2);
    const y = padding + Math.random() * (height - padding * 2);

    const size = Math.random() * 3 + 2; // Slightly smaller particles
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Create particle
    const particle = new Particle(x, y, size, color, ctx, width, height);

    // Give it a small initial velocity
    particle.setRandomVelocity(0.1, 0.3);

    particles.push(particle);
  }
}

function animate(ctx, width, height) {
  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Update and draw particles
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  // Continue animation loop
  animationFrameId = requestAnimationFrame(() => animate(ctx, width, height));
}

function animateGradientOrbs() {
  const orbs = document.querySelectorAll('.gradient-orb');

  orbs.forEach((orb, index) => {
    const delay = index * 2000;
    const duration = 15000 + (index * 5000);

    setTimeout(() => {
      orb.style.animation = `float ${duration}ms ease-in-out infinite`;
    }, delay);
  });
}

// Expose methods to parent component
defineExpose({
  animateParticles,
  setShuffling: (value) => {
    isShuffling.value = value;
  }
});

function animateParticles() {
  if (!particleCanvas.value) return;

  // Set shuffling state
  isShuffling.value = true;

  const canvas = particleCanvas.value;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // First phase: Gather particles toward center
  particles.forEach(particle => {
    // Calculate direction to center
    const dx = centerX - particle.x;
    const dy = centerY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      // Apply force toward center
      const force = 5 + Math.random() * 5;
      particle.speedX = (dx / distance) * force;
      particle.speedY = (dy / distance) * force;
      particle.activate();
      particle.fadeIn();
    }
  });

  // Second phase: Explode with high energy
  setTimeout(() => {
    particles.forEach(particle => {
      // More powerful explosion
      particle.explodeFrom(centerX, centerY, 20 + Math.random() * 20);
    });
  }, 800);

  // Third phase: Random velocities
  setTimeout(() => {
    particles.forEach(particle => {
      // Give each particle a random velocity
      particle.setRandomVelocity(1, 8);
    });
  }, 1600);

  // Reset shuffling state after animation completes
  setTimeout(() => {
    isShuffling.value = false;
  }, 3000);
}
</script>

<style scoped>
/* Background effects container */
.background-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

/* Gradient orbs */
.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  z-index: 0;
  will-change: transform;
}

.orb-1 {
  width: 40vw;
  height: 40vw;
  top: -10%;
  left: -10%;
  background: radial-gradient(circle, rgba(241, 87, 80, 0.4) 0%, rgba(160, 68, 255, 0.2) 70%, rgba(0, 0, 0, 0) 100%);
}

.orb-2 {
  width: 50vw;
  height: 50vw;
  bottom: -20%;
  right: -10%;
  background: radial-gradient(circle, rgba(5, 117, 230, 0.4) 0%, rgba(160, 68, 255, 0.2) 70%, rgba(0, 0, 0, 0) 100%);
}

.orb-3 {
  width: 30vw;
  height: 30vw;
  top: 40%;
  left: 60%;
  background: radial-gradient(circle, rgba(255, 253, 118, 0.3) 0%, rgba(5, 117, 230, 0.2) 70%, rgba(0, 0, 0, 0) 100%);
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(0, 5px) rotate(0deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>