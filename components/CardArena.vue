<template>
  <div
    ref="host"
    class="card-arena"
    :class="{ 'is-fallback': webglFailed }"
    role="button"
    tabindex="0"
    aria-label="3D color deck. Activate to shuffle teams."
    @click="$emit('request-shuffle')"
    @keydown.enter="$emit('request-shuffle')"
    @keydown.space.prevent="$emit('request-shuffle')"
    @pointermove="handlePointerMove"
    @pointerleave="resetPointer"
  >
    <canvas ref="canvas" aria-hidden="true" />
    <div v-if="webglFailed" class="webgl-fallback" aria-hidden="true">
      <span
        v-for="card in orderedCards"
        :key="card.id"
        :style="{ '--fallback-color': card.hex }"
      >{{ card.symbol }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

type CardData = {
  id: string;
  label: string;
  symbol: string;
  hex: string;
};

type CardObject = {
  id: string;
  group: THREE.Group;
  target: THREE.Vector3;
  homeRotation: THREE.Euler;
  settledAt?: number;
  shuffle?: {
    curve: THREE.CatmullRomCurve3;
    startRotation: THREE.Euler;
    startedAt: number;
    delay: number;
    duration: number;
    turns: number;
  };
};

const props = defineProps<{
  cards: CardData[];
  initialOrder: string[];
  isShuffling: boolean;
}>();

const emit = defineEmits<{
  (event: "request-shuffle"): void;
  (event: "ready"): void;
}>();

const host = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const webglFailed = ref(false);
const activeOrder = ref([...props.initialOrder]);
const orderedCards = computed(() =>
  activeOrder.value
    .map((id) => props.cards.find((card) => card.id === id))
    .filter(Boolean) as CardData[],
);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let deck: THREE.Group;
let animationFrame = 0;
let resizeObserver: ResizeObserver;
let startTime = 0;
let resolveShuffle: (() => void) | null = null;
let pointerX = 0;
let pointerY = 0;
let targetPointerX = 0;
let targetPointerY = 0;
let reducedMotion = false;
let isVisible = true;
let baseCameraZ = 10.2;
let restingCardScale = 1;
let shuffleEnergy = 0;
let shuffleHalo: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
const objects = new Map<string, CardObject>();
const textures: THREE.Texture[] = [];
const materials: THREE.Material[] = [];
const geometries: THREE.BufferGeometry[] = [];
const cardWidth = 2.05;
const cardHeight = 3.05;
const maxRestingRotation = 0.07;

function makeFaceTexture(card: CardData) {
  const surface = document.createElement("canvas");
  surface.width = 512;
  surface.height = 768;
  const context = surface.getContext("2d") as CanvasRenderingContext2D;

  context.clearRect(0, 0, surface.width, surface.height);
  const sheen = context.createLinearGradient(0, 0, surface.width, surface.height);
  sheen.addColorStop(0, "rgba(255,255,255,.62)");
  sheen.addColorStop(0.28, "rgba(255,255,255,.08)");
  sheen.addColorStop(0.62, "rgba(255,255,255,.18)");
  sheen.addColorStop(1, "rgba(255,255,255,.42)");
  context.fillStyle = sheen;
  context.fillRect(0, 0, surface.width, surface.height);

  context.strokeStyle = "rgba(255,255,255,.56)";
  context.lineWidth = 4;
  context.strokeRect(34, 34, 444, 700);

  context.fillStyle = "rgba(255,255,255,.92)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "300 230px Arial, sans-serif";
  context.fillText(card.symbol, 256, 335);

  context.font = "600 28px Arial, sans-serif";
  context.letterSpacing = "8px";
  context.fillText(card.label.toUpperCase(), 256, 646);
  context.font = "500 18px Arial, sans-serif";
  context.fillStyle = "rgba(255,255,255,.68)";
  context.fillText("TCG / COLOR DECK", 256, 690);

  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  textures.push(texture);
  return texture;
}

function makeCard(card: CardData, index: number) {
  const group = new THREE.Group();
  group.name = card.id;
  group.userData.floatIndex = index;

  const bodyGeometry = new RoundedBoxGeometry(cardWidth, cardHeight, 0.2, 8, 0.16);
  geometries.push(bodyGeometry);
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(card.hex),
    roughness: 0.16,
    metalness: 0.02,
    transmission: 0.58,
    thickness: 0.9,
    ior: 1.38,
    transparent: true,
    opacity: 0.91,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
  });
  materials.push(bodyMaterial);
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const faceGeometry = new THREE.PlaneGeometry(1.82, 2.82);
  geometries.push(faceGeometry);
  const faceMaterial = new THREE.MeshBasicMaterial({
    map: makeFaceTexture(card),
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
  materials.push(faceMaterial);
  const face = new THREE.Mesh(faceGeometry, faceMaterial);
  face.position.z = 0.108;
  group.add(face);

  const edgeGeometry = new THREE.EdgesGeometry(bodyGeometry, 24);
  geometries.push(edgeGeometry);
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.32,
  });
  materials.push(edgeMaterial);
  group.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));

  const pointLight = new THREE.PointLight(card.hex, 1.35, 4.5, 2.2);
  pointLight.position.set(0, 0, -0.4);
  group.add(pointLight);

  group.rotation.set(0.03 * (index % 2 ? -1 : 1), 0, (index - 1.5) * 0.035);
  deck.add(group);

  const cardObject: CardObject = {
    id: card.id,
    group,
    target: new THREE.Vector3(),
    homeRotation: group.rotation.clone(),
  };
  objects.set(card.id, cardObject);
}

function makeParticles() {
  const count = window.innerWidth < 720 ? 58 : 110;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = props.cards.map((card) => new THREE.Color(card.hex));

  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 16;
    positions[index * 3 + 1] = (Math.random() - 0.5) * 9;
    positions[index * 3 + 2] = -1.5 - Math.random() * 5;
    const color = palette[index % palette.length];
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometries.push(particleGeometry);
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  materials.push(particleMaterial);
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particles.name = "particles";
  scene.add(particles);
}

function cardLayout(width: number, height: number) {
  const stacked = window.matchMedia("(max-width: 760px)").matches;
  baseCameraZ = stacked ? 10.8 : 10.2;

  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const worldHeight = 2 * Math.tan(verticalFov / 2) * baseCameraZ;
  const worldWidth = worldHeight * camera.aspect;
  const worldPerPixel = worldHeight / height;
  const projectedWidth = Math.abs(cardWidth * Math.cos(maxRestingRotation))
    + Math.abs(cardHeight * Math.sin(maxRestingRotation));
  const projectedHeight = Math.abs(cardHeight * Math.cos(maxRestingRotation))
    + Math.abs(cardWidth * Math.sin(maxRestingRotation));

  if (stacked) {
    const zoneWidth = width - 28;
    const zoneHeight = (height - 28 - 72) / 2;
    const x = (zoneWidth * 0.23 / width) * worldWidth;
    const firstCenterY = 14 + zoneHeight / 2;
    const y = (0.5 - firstCenterY / height) * worldHeight;
    const scaleForWidth = ((zoneWidth - 44) * worldPerPixel) / (projectedWidth * 2);
    const scaleForHeight = ((zoneHeight - 60) * worldPerPixel) / projectedHeight;

    return {
      scale: THREE.MathUtils.clamp(Math.min(scaleForWidth, scaleForHeight), 0.5, 0.72),
      slots: [
        new THREE.Vector3(-x, y, 0),
        new THREE.Vector3(x, y, -0.15),
        new THREE.Vector3(-x, -y, -0.15),
        new THREE.Vector3(x, -y, 0),
      ],
    };
  }

  const zoneWidth = (width - 44 - 74) / 2;
  const zoneHeight = height - 44;
  const leftEdge = 22;
  const screenPositions = [
    leftEdge + zoneWidth * 0.28,
    leftEdge + zoneWidth * 0.72,
    width - leftEdge - zoneWidth * 0.72,
    width - leftEdge - zoneWidth * 0.28,
  ];
  const scaleForWidth = ((zoneWidth - 76) * worldPerPixel) / (projectedWidth * 2);
  const scaleForHeight = ((zoneHeight - 92) * worldPerPixel) / projectedHeight;

  return {
    scale: THREE.MathUtils.clamp(Math.min(scaleForWidth, scaleForHeight), 0.5, 0.9),
    slots: screenPositions.map((screenX, index) => new THREE.Vector3(
      (screenX / width - 0.5) * worldWidth,
      index === 0 || index === 3 ? 0.12 : -0.08,
      index === 0 || index === 3 ? -0.1 : 0.12,
    )),
  };
}

function layoutCards(order = activeOrder.value) {
  if (!host.value || !camera) return;
  const { slots, scale } = cardLayout(
    Math.max(host.value.clientWidth, 1),
    Math.max(host.value.clientHeight, 1),
  );
  deck.scale.setScalar(1);
  restingCardScale = scale;
  camera.position.z = baseCameraZ;

  order.forEach((id, index) => {
    const card = objects.get(id);
    if (!card) return;
    card.target.copy(slots[index]);
    if (!card.shuffle) {
      card.group.position.copy(card.target);
      card.group.scale.setScalar(restingCardScale);
    }
  });
}

function resize() {
  if (!host.value || !renderer || !camera) return;
  const width = Math.max(host.value.clientWidth, 1);
  const height = Math.max(host.value.clientHeight, 1);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  layoutCards();
}

function easeInOutQuint(value: number) {
  return value < 0.5
    ? 16 * value * value * value * value * value
    : 1 - Math.pow(-2 * value + 2, 5) / 2;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function smoothstep(value: number) {
  const clamped = THREE.MathUtils.clamp(value, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function animate(now: number) {
  animationFrame = requestAnimationFrame(animate);
  if (!isVisible || !renderer) return;

  const elapsed = (now - startTime) / 1000;
  pointerX += (targetPointerX - pointerX) * 0.045;
  pointerY += (targetPointerY - pointerY) * 0.045;
  camera.position.x = pointerX * 0.38;
  camera.position.y = -pointerY * 0.24;
  camera.position.z = baseCameraZ - shuffleEnergy * 0.55;
  camera.lookAt(0, 0, 0);

  let activeAnimations = 0;
  let nextShuffleEnergy = 0;

  objects.forEach((card) => {
    const floatIndex = card.group.userData.floatIndex as number;
    const animation = card.shuffle;

    if (animation) {
      const rawProgress = (elapsed - animation.startedAt - animation.delay) / animation.duration;
      if (rawProgress < 0) {
        activeAnimations += 1;
      } else if (rawProgress < 1) {
        activeAnimations += 1;
        const linearProgress = Math.max(0, rawProgress);
        const progress = easeInOutQuint(linearProgress);
        const lift = Math.pow(Math.sin(linearProgress * Math.PI), 2);
        nextShuffleEnergy = Math.max(nextShuffleEnergy, lift);
        card.group.position.copy(animation.curve.getPoint(progress));
        card.group.position.z += lift * 2.7;
        card.group.rotation.x = THREE.MathUtils.lerp(animation.startRotation.x, card.homeRotation.x, progress)
          + Math.sin(linearProgress * Math.PI * 2) * lift * 0.42;
        card.group.rotation.y = THREE.MathUtils.lerp(animation.startRotation.y, 0, progress)
          + easeOutCubic(linearProgress) * Math.PI * 2 * animation.turns;
        card.group.rotation.z = THREE.MathUtils.lerp(animation.startRotation.z, card.homeRotation.z, progress)
          + Math.sin(linearProgress * Math.PI * 3) * lift * 0.3;
        card.group.scale.setScalar(restingCardScale * (1 + lift * 0.075));
      } else {
        card.group.position.copy(card.target);
        card.group.rotation.copy(card.homeRotation);
        card.group.scale.setScalar(restingCardScale);
        card.shuffle = undefined;
        card.settledAt = elapsed;
      }
    } else if (!reducedMotion) {
      const idleBlend = card.settledAt == null ? 1 : smoothstep((elapsed - card.settledAt) / 0.55);
      card.group.position.y = card.target.y
        + Math.sin(elapsed * 0.72 + floatIndex * 1.4) * 0.055 * idleBlend;
      card.group.rotation.x = card.homeRotation.x
        + Math.sin(elapsed * 0.48 + floatIndex) * 0.018 * idleBlend;
      card.group.rotation.z = card.homeRotation.z
        + Math.cos(elapsed * 0.4 + floatIndex) * 0.012 * idleBlend;
      if (idleBlend === 1) card.settledAt = undefined;
    }
  });

  shuffleEnergy += (nextShuffleEnergy - shuffleEnergy) * 0.14;
  deck.rotation.z = Math.sin(elapsed * 5.2) * shuffleEnergy * 0.024;
  if (shuffleHalo) {
    shuffleHalo.material.opacity = shuffleEnergy * 0.36;
    shuffleHalo.rotation.z = elapsed * 0.7;
    shuffleHalo.scale.setScalar(0.82 + shuffleEnergy * 1.15);
  }

  const particles = scene.getObjectByName("particles");
  if (particles && !reducedMotion) particles.rotation.z = elapsed * 0.006;

  if (activeAnimations === 0 && resolveShuffle) {
    const resolve = resolveShuffle;
    resolveShuffle = null;
    resolve();
  }

  renderer.render(scene, camera);
}

function handlePointerMove(event: PointerEvent) {
  if (!host.value || event.pointerType === "touch") return;
  const bounds = host.value.getBoundingClientRect();
  targetPointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
  targetPointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
}

function resetPointer() {
  targetPointerX = 0;
  targetPointerY = 0;
}

function playShuffle(nextOrder: string[]) {
  if (resolveShuffle || webglFailed.value) {
    activeOrder.value = [...nextOrder];
    return Promise.resolve();
  }

  if (reducedMotion) {
    activeOrder.value = [...nextOrder];
    layoutCards(nextOrder);
    return new Promise<void>((resolve) => window.setTimeout(resolve, 260));
  }

  const { slots, scale } = cardLayout(
    Math.max(host.value?.clientWidth || 900, 1),
    Math.max(host.value?.clientHeight || 600, 1),
  );
  restingCardScale = scale;
  const now = (performance.now() - startTime) / 1000;

  nextOrder.forEach((id, index) => {
    const card = objects.get(id);
    if (!card) return;
    card.target.copy(slots[index]);
    const start = card.group.position.clone();
    const direction = index % 2 === 0 ? 1 : -1;
    const lane = index < 2 ? 1 : -1;
    const gather = new THREE.Vector3(direction * 0.42, lane * 0.28, 1.1 + index * 0.08);
    const orbit = new THREE.Vector3(
      -direction * (2.45 + index * 0.12),
      lane * (1.65 + (index % 2) * 0.35),
      1.6,
    );
    const settle = card.target.clone().lerp(new THREE.Vector3(0, 0, 0.5), 0.16);
    const curve = new THREE.CatmullRomCurve3(
      [start, gather, orbit, settle, card.target.clone()],
      false,
      "centripetal",
    );
    card.shuffle = {
      curve,
      startRotation: card.group.rotation.clone(),
      startedAt: now,
      delay: index * 0.065,
      duration: 2.05,
      turns: 1 + (index % 2),
    };
  });

  activeOrder.value = [...nextOrder];
  return new Promise<void>((resolve) => {
    resolveShuffle = resolve;
  });
}

function handleVisibility() {
  isVisible = !document.hidden;
}

onMounted(() => {
  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 10.2);
    renderer = new THREE.WebGLRenderer({
      canvas: canvas.value as HTMLCanvasElement,
      antialias: window.devicePixelRatio < 2.25,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    deck = new THREE.Group();
    scene.add(deck);
    scene.add(new THREE.HemisphereLight(0xdce9ff, 0x110d1b, 2.4));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(1.5, 5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x7b61ff, 26, 14, 2);
    rimLight.position.set(-5, -1, 3);
    scene.add(rimLight);
    const coolLight = new THREE.PointLight(0x2d9cff, 20, 12, 2);
    coolLight.position.set(5, 2, 2);
    scene.add(coolLight);

    const haloGeometry = new THREE.RingGeometry(0.95, 1.02, 96);
    geometries.push(haloGeometry);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0xe8e4ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    materials.push(haloMaterial);
    shuffleHalo = new THREE.Mesh(haloGeometry, haloMaterial);
    shuffleHalo.position.z = -0.35;
    scene.add(shuffleHalo);

    props.cards.forEach(makeCard);
    makeParticles();
    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host.value as HTMLElement);
    document.addEventListener("visibilitychange", handleVisibility);
    startTime = performance.now();
    animationFrame = requestAnimationFrame((now) => {
      animate(now);
      requestAnimationFrame(() => emit("ready"));
    });
  } catch (error) {
    console.warn("WebGL scene unavailable", error);
    webglFailed.value = true;
    emit("ready");
  }
});

watch(
  () => props.initialOrder,
  (order) => {
    if (!props.isShuffling && order.join() !== activeOrder.value.join()) {
      activeOrder.value = [...order];
      layoutCards(order);
    }
  },
  { deep: true },
);

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  document.removeEventListener("visibilitychange", handleVisibility);
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
  renderer?.dispose();
});

defineExpose({ playShuffle });
</script>

<style scoped>
.card-arena {
  position: absolute;
  inset: 0;
  cursor: grab;
  outline: none;
  touch-action: manipulation;
  opacity: 0;
  transition: opacity 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.card-arena.scene-is-ready,
.card-arena.is-fallback {
  opacity: 1;
}

.card-arena:active {
  cursor: grabbing;
}

.card-arena:focus-visible {
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.78);
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.webgl-fallback {
  position: absolute;
  inset: 13% 7%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.webgl-fallback span {
  display: grid;
  place-items: center;
  border-radius: 1.25rem;
  color: white;
  font-size: 4rem;
  background: color-mix(in srgb, var(--fallback-color) 72%, transparent);
  border: 1px solid rgba(255, 255, 255, 0.42);
}

@media (max-width: 699px) {
  .webgl-fallback {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
