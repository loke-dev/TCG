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

// Performance optimization: detect device capabilities
const getParticleCount = () => {
  const isMobile = window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

  if (isMobile || isLowEnd) {
    return { tiny: 20, small: 30, medium: 15, large: 5 }; // 70 total
  }
  return { tiny: 30, small: 40, medium: 20, large: 8 }; // 98 total (reduced from 150)
};

class Particle {
  constructor(x, y, size, color, ctx, canvasWidth, canvasHeight) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.speedX = (Math.random() - 0.5) * 0.2;
    this.speedY = (Math.random() - 0.5) * 0.2;

    this.mass = this.size * 0.5;
    this.friction = 0.997;
    this.minSpeed = 0.1;
    this.directionChangeTimer = 0;
    this.directionChangePeriod = Math.random() * 200 + 100;

    this.alpha = 0.7;
    this.targetAlpha = 0.7;
    this.baseSize = size;
    this.targetSize = size;
    this.sizeAnimationTimer = 0;
    this.sizeAnimationDuration = 0;

    this.isActive = false;

    // Performance: cache gradient and only recreate when needed
    this.cachedGradient = null;
    this.lastGradientX = null;
    this.lastGradientY = null;
    this.gradientRadius = 0;

  }

  update() {
    this.speedX *= this.friction;
    this.speedY *= this.friction;

    const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);

    if (!this.isActive) {
      this.directionChangeTimer++;

      if (this.directionChangeTimer >= this.directionChangePeriod) {
        this.directionChangeTimer = 0;
        this.directionChangePeriod = Math.random() * 200 + 100;

        const angle = Math.random() * Math.PI * 2;
        const nudgeStrength = 0.02;
        this.speedX += Math.cos(angle) * nudgeStrength;
        this.speedY += Math.sin(angle) * nudgeStrength;
      }

      if (currentSpeed < this.minSpeed) {
        const speedRatio = this.minSpeed / currentSpeed;
        this.speedX *= speedRatio;
        this.speedY *= speedRatio;
      }
    }

    this.x += this.speedX;
    this.y += this.speedY;

    // Smooth alpha transitions - use smaller increments for smoother animation
    const alphaDiff = this.targetAlpha - this.alpha;
    if (Math.abs(alphaDiff) > 0.001) {
      this.alpha += alphaDiff * 0.05; // Smooth interpolation
    } else {
      this.alpha = this.targetAlpha;
    }

    // Smooth size transitions with animation timer
    if (this.sizeAnimationTimer > 0) {
      this.sizeAnimationTimer--;
      if (this.sizeAnimationTimer === 0) {
        // Animation complete, smoothly return to base size
        // Don't set directly, let interpolation handle it
        this.targetSize = this.baseSize;
      }
    }

    // Smooth size interpolation - prevent sudden jumps
    // Use exponential easing for smoother transitions
    const sizeDiff = this.targetSize - this.size;
    if (Math.abs(sizeDiff) > 0.001) {
      // Exponential interpolation for smooth, natural motion
      const easingFactor = Math.abs(sizeDiff) > 0.5 ? 0.2 : 0.12;
      this.size += sizeDiff * easingFactor;
    } else {
      this.size = this.targetSize;
    }

    // Clamp size to prevent any extreme values
    if (this.size < this.baseSize * 0.5) this.size = this.baseSize * 0.5;
    if (this.size > this.baseSize * 2) this.size = this.baseSize * 2;

    const padding = 20;
    if (this.x < padding + this.size || this.x > this.canvasWidth - padding - this.size) {
      this.speedX *= -0.85;

      if (this.x < padding + this.size) this.x = padding + this.size;
      if (this.x > this.canvasWidth - padding - this.size) this.x = this.canvasWidth - padding - this.size;

      // Smooth size animation on collision - use frame-based timer instead of setTimeout
      // Only trigger if not already animating to prevent rapid size changes
      if (this.sizeAnimationTimer === 0 && Math.abs(this.targetSize - this.baseSize) < 0.1) {
        this.targetSize = this.baseSize * 1.25; // Smaller, smoother pop
        this.sizeAnimationTimer = 8; // ~8 frames at 60fps = ~133ms for smoother return
      }
    }

    if (this.y < padding + this.size || this.y > this.canvasHeight - padding - this.size) {
      this.speedY *= -0.85;

      if (this.y < padding + this.size) this.y = padding + this.size;
      if (this.y > this.canvasHeight - padding - this.size) this.y = this.canvasHeight - padding - this.size;

      // Smooth size animation on collision - use frame-based timer instead of setTimeout
      // Only trigger if not already animating to prevent rapid size changes
      if (this.sizeAnimationTimer === 0 && Math.abs(this.targetSize - this.baseSize) < 0.1) {
        this.targetSize = this.baseSize * 1.25; // Smaller, smoother pop
        this.sizeAnimationTimer = 8; // ~8 frames at 60fps = ~133ms for smoother return
      }
    }
  }

  draw() {
    const isGlowParticle = this.color.includes('255, 255, 255');
    const glow = this.size * (isGlowParticle ? 3 : 2);

    // Always recreate gradient for smooth visual movement
    // Canvas gradients are tied to their creation coordinates, so we need to
    // recreate them frequently for smooth visual effects
    // Use small threshold to balance performance and smoothness
    const needsNewGradient = !this.cachedGradient ||
      Math.abs(this.x - this.lastGradientX) > 1.5 ||
      Math.abs(this.y - this.lastGradientY) > 1.5 ||
      Math.abs(glow - this.gradientRadius) > 0.5;

    if (needsNewGradient) {
      this.cachedGradient = this.ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, glow
      );

      const baseColor = this.color.replace(/[^,]+(?=\))/, '0.1');
      const innerColor = isGlowParticle ?
        this.color.replace(/[^,]+(?=\))/, '0.7') :
        this.color;

      this.cachedGradient.addColorStop(0, innerColor);
      this.cachedGradient.addColorStop(0.6, this.color);
      this.cachedGradient.addColorStop(1, baseColor);

      this.lastGradientX = this.x;
      this.lastGradientY = this.y;
      this.gradientRadius = glow;
    }

    this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = this.cachedGradient;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, glow, 0, Math.PI * 2);
    this.ctx.fill();

    if (!isGlowParticle) {
      this.ctx.globalAlpha = this.alpha;
      this.ctx.fillStyle = this.color;
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  fadeOut() {
    this.targetAlpha = 0;
  }

  fadeIn() {
    this.targetAlpha = 0.7;
  }

  activate() {
    this.isActive = true;

    setTimeout(() => {
      this.isActive = false;
    }, 3000);
  }

  applyForce(forceX, forceY) {
    this.speedX += forceX / this.mass;
    this.speedY += forceY / this.mass;

    this.activate();
  }

  explodeFrom(centerX, centerY, force) {
    const dx = this.x - centerX;
    const dy = this.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    const actualForce = force / (1 + distance * 0.1);

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

let resizeTimeout = null;
let ctx = null;
let canvasInitialized = false;
let particlesCreated = false;

onMounted(() => {
  // Defer heavy operations to avoid blocking initial render
  // Start with minimal setup, then progressively load
  requestAnimationFrame(() => {
    // Use requestIdleCallback if available, otherwise setTimeout
    const defer = (callback) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 100 });
      } else {
        setTimeout(callback, 50);
      }
    };

    // Initialize canvas first (lightweight)
    initCanvasBasic();

    // Start animation loop with empty particles (smooth background)
    if (particleCanvas.value) {
      const canvas = particleCanvas.value;
      animate(ctx, canvas.width, canvas.height);
    }

    // Defer particle creation until after initial render
    defer(() => {
      if (particleCanvas.value && ctx) {
        createParticles(ctx, particleCanvas.value.width, particleCanvas.value.height);
      }
    });
  });

  // Gradient orbs can start immediately (CSS animations are lightweight)
  animateGradientOrbs();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  window.removeEventListener('resize', handleResize);
});

function handleResize() {
  // Debounce resize to avoid performance issues
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }

  resizeTimeout = setTimeout(() => {
    if (particleCanvas.value && ctx) {
      const canvas = particleCanvas.value;
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Update canvas context reference if needed
      if (!ctx || ctx.canvas !== canvas) {
        ctx = canvas.getContext('2d', { alpha: true });
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }

      if (particles.length > 0) {
        particles.forEach(particle => {
          particle.x = (particle.x / oldWidth) * canvas.width;
          particle.y = (particle.y / oldHeight) * canvas.height;

          particle.canvasWidth = canvas.width;
          particle.canvasHeight = canvas.height;

          // Invalidate cached gradient on resize
          particle.cachedGradient = null;
        });
      }
    }
  }, 150);
}

function initCanvasBasic() {
  if (!particleCanvas.value || canvasInitialized) return;

  const canvas = particleCanvas.value;
  ctx = canvas.getContext('2d', { alpha: true });

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Performance: enable hardware acceleration hints
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  canvasInitialized = true;

  if (DEBUG_MODE) {
    canvas.style.border = '2px solid red';
  }
}

function createParticles(ctx, width, height) {
  if (!ctx || particlesCreated) return;

  particles = [];

  const colors = [
    'rgba(241, 87, 80, 0.7)',
    'rgba(241, 87, 80, 0.5)',
    'rgba(255, 253, 118, 0.7)',
    'rgba(255, 253, 118, 0.5)',
    'rgba(5, 117, 230, 0.7)',
    'rgba(5, 117, 230, 0.5)',
    'rgba(160, 68, 255, 0.7)',
    'rgba(160, 68, 255, 0.5)',
    'rgba(255, 255, 255, 0.4)',
  ];

  const padding = 50;

  // Use adaptive particle count based on device performance
  const particleCounts = getParticleCount();
  const particleSizes = [
    { min: 1, max: 2, count: particleCounts.tiny, name: 'tiny' },
    { min: 2, max: 3.5, count: particleCounts.small, name: 'small' },
    { min: 3.5, max: 5, count: particleCounts.medium, name: 'medium' },
    { min: 5, max: 7, count: particleCounts.large, name: 'large' }
  ];

  // Create particles progressively in batches to avoid blocking
  let sizeIndex = 0;
  let particleIndex = 0;
  const batchSize = 12; // Smaller batches for smoother loading

  const createBatch = () => {
    let created = 0;

    while (created < batchSize && sizeIndex < particleSizes.length) {
      const sizeCategory = particleSizes[sizeIndex];

      if (particleIndex < sizeCategory.count) {
        const x = padding + Math.random() * (width - padding * 2);
        const y = padding + Math.random() * (height - padding * 2);
        const size = sizeCategory.min + Math.random() * (sizeCategory.max - sizeCategory.min);
        const color = colors[Math.floor(Math.random() * colors.length)];

        const particle = new Particle(x, y, size, color, ctx, width, height);
        const speedFactor = 1.2 - (size / 7);
        particle.setRandomVelocity(0.05 * speedFactor, 0.25 * speedFactor);
        particle.friction = 0.995 + (Math.random() * 0.004);

        const baseAlpha = 0.5 + (Math.random() * 0.3);
        particle.alpha = baseAlpha;
        particle.targetAlpha = baseAlpha;

        particles.push(particle);
        particleIndex++;
        created++;
      } else {
        // Move to next size category
        sizeIndex++;
        particleIndex = 0;
      }
    }

    // Continue creating if there are more particles to create
    if (sizeIndex < particleSizes.length) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(createBatch, { timeout: 16 });
      } else {
        setTimeout(createBatch, 16);
      }
    } else {
      particlesCreated = true;
    }
  };

  // Start creating particles
  createBatch();
}

function animate(ctx, width, height) {
  if (!ctx) return;

  // Always render on every frame for smooth animation
  // requestAnimationFrame already syncs with display refresh rate
  ctx.clearRect(0, 0, width, height);

  // Only animate if particles exist (allows smooth background before particles load)
  if (particles.length > 0) {
    // Update all particles every frame for smooth motion
    particles.forEach(particle => {
      particle.update();
    });

    particles.forEach(particle => {
      particle.draw();
    });
  }

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

defineExpose({
  animateParticles,
  setShuffling: (value) => {
    isShuffling.value = value;
  }
});

function animateParticles() {
  if (!particleCanvas.value) return;

  isShuffling.value = true;

  const canvas = particleCanvas.value;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  particles.forEach(particle => {
    const dx = centerX - particle.x;
    const dy = centerY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const force = 5 + Math.random() * 5;
      particle.speedX = (dx / distance) * force;
      particle.speedY = (dy / distance) * force;
      particle.activate();
      particle.fadeIn();
    }
  });

  setTimeout(() => {
    particles.forEach(particle => {
      particle.explodeFrom(centerX, centerY, 20 + Math.random() * 20);
    });
  }, 800);

  setTimeout(() => {
    particles.forEach(particle => {
      particle.setRandomVelocity(1, 8);
    });
  }, 1600);

  setTimeout(() => {
    isShuffling.value = false;
  }, 3000);
}
</script>

<style scoped>
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
  /* Performance: hint to browser for GPU acceleration */
  will-change: contents;
  transform: translateZ(0);
}
</style>