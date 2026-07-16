<template>
  <div class="site-shell">
    <Head>
      <Title>TCG — Team Color Generator</Title>
      <Meta
        name="description"
        content="Shuffle four iconic colors into two teams with a tactile 3D draw."
      />
      <Meta name="theme-color" content="#090a0f" />
    </Head>

    <div class="ambient ambient-one" aria-hidden="true" />
    <div class="ambient ambient-two" aria-hidden="true" />

    <header class="topbar">
      <a class="brand" href="/" aria-label="TCG home">
        <span class="brand-mark" aria-hidden="true">
          <i /><i /><i /><i />
        </span>
        <span>
          <strong>TCG</strong>
          <small>Team Color Generator</small>
        </span>
      </a>

      <div class="mode-pill">
        <span class="status-dot" :class="{ busy: isShuffling }" />
        {{ isShuffling ? "Drawing teams" : "Color draw · 01" }}
      </div>
    </header>

    <main>
      <section class="draw-panel draw-panel-first" aria-labelledby="draw-heading">
        <div class="panel-meta">
          <div>
            <p class="panel-kicker">Live draw</p>
            <h2 id="draw-heading">Color deck</h2>
          </div>
          <p class="interaction-hint">
            <span aria-hidden="true">↗</span> Move to look · Tap to shuffle
          </p>
        </div>

        <div class="arena-shell">
          <div class="team-zones" aria-hidden="true">
            <div class="team-zone team-zone-one">
              <span class="zone-number">01</span>
              <strong>Team one</strong>
            </div>
            <div class="team-zone team-zone-two">
              <span class="zone-number">02</span>
              <strong>Team two</strong>
            </div>
          </div>

          <ClientOnly>
            <CardArena
              ref="arena"
              :cards="cards"
              :initial-order="order"
              :is-shuffling="isShuffling"
              @request-shuffle="shuffleTeams"
              @ready="handleArenaReady"
            />
            <template #fallback>
              <div class="canvas-fallback" aria-hidden="true">
                <span v-for="card in cards" :key="card.id" :style="{ '--card': card.hex }" />
              </div>
            </template>
          </ClientOnly>

          <div class="versus-divider" aria-hidden="true">
            <span>VS</span>
          </div>
          <p class="scene-caption">WebGL glass deck</p>
        </div>

        <div class="draw-actions">
          <button
            class="shuffle-button"
            type="button"
            :disabled="isShuffling"
            @click="shuffleTeams"
          >
            <span class="button-icon" aria-hidden="true">↝</span>
            <span>{{ isShuffling ? "Shuffling…" : "Shuffle teams" }}</span>
            <kbd>Space</kbd>
          </button>

          <div class="draw-count">
            <strong>{{ drawCount.toString().padStart(2, "0") }}</strong>
            <span>draws this session</span>
          </div>
        </div>
      </section>

      <section class="hero-copy" aria-labelledby="page-title">
        <p class="eyebrow">Fast teams. Zero debate.</p>
        <h1 id="page-title">Shuffle the <em>room.</em></h1>
        <p class="intro">
          Four colors enter. Two teams emerge. Tap the deck and let the table
          decide your next match.
        </p>
      </section>

      <section class="result-section" aria-labelledby="result-heading">
        <div class="section-heading">
          <div>
            <p class="panel-kicker">The match-up</p>
            <h2 id="result-heading">Teams are set</h2>
          </div>
          <p>Best of luck. No rerolls. Probably.</p>
        </div>

        <div class="teams" aria-live="polite" aria-atomic="true">
          <article class="team-card">
            <span class="team-number">01</span>
            <div>
              <p>Team one</p>
              <ul>
                <li v-for="card in teamOne" :key="card.id">
                  <i :style="{ background: card.hex }" />{{ card.label }}
                </li>
              </ul>
            </div>
          </article>

          <article class="team-card">
            <span class="team-number">02</span>
            <div>
              <p>Team two</p>
              <ul>
                <li v-for="card in teamTwo" :key="card.id">
                  <i :style="{ background: card.hex }" />{{ card.label }}
                </li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section class="coming-next" aria-label="Future game modes">
        <div class="dice-mark" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </div>
        <div>
          <p class="panel-kicker">Coming next</p>
          <h2>Roll the dice</h2>
          <p>More draw modes, same satisfying physics.</p>
        </div>
        <span class="soon-pill">In the lab</span>
      </section>
    </main>

    <footer>
      <p>Made for the next match.</p>
      <nav aria-label="Footer navigation">
        <a href="https://github.com/loke-dev/TCG" rel="noopener" target="_blank">Source</a>
        <a href="https://loke.dev" rel="noopener" target="_blank">Loke.dev</a>
      </nav>
    </footer>

    <p class="sr-only" aria-live="assertive">{{ announcement }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from "vue";

const CardArena = defineAsyncComponent(() => import("~/components/CardArena.vue"));

type ColorCard = {
  id: string;
  label: string;
  symbol: string;
  hex: string;
};

const cards: ColorCard[] = [
  { id: "yellow", label: "Yellow", symbol: "△", hex: "#f7d84a" },
  { id: "purple", label: "Purple", symbol: "□", hex: "#9b63f7" },
  { id: "blue", label: "Blue", symbol: "×", hex: "#3b82f6" },
  { id: "red", label: "Red", symbol: "○", hex: "#f05b56" },
];

const arena = ref<{ playShuffle: (order: string[]) => Promise<void> } | null>(null);
const order = ref(cards.map((card) => card.id));
const isShuffling = ref(false);
const drawCount = ref(0);
const announcement = ref("Ready to shuffle teams.");
const hasAutoShuffled = ref(false);

const cardById = new Map(cards.map((card) => [card.id, card]));
const orderedCards = computed(() =>
  order.value.map((id) => cardById.get(id)).filter(Boolean) as ColorCard[],
);
const teamOne = computed(() => orderedCards.value.slice(0, 2));
const teamTwo = computed(() => orderedCards.value.slice(2, 4));

function nextOrder() {
  const shuffled = [...order.value];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  if (shuffled.every((id, index) => id === order.value[index])) {
    shuffled.push(shuffled.shift() as string);
  }

  return shuffled;
}

async function shuffleTeams() {
  if (isShuffling.value || !arena.value) return;

  isShuffling.value = true;
  announcement.value = "Shuffling the color deck.";
  const shuffled = nextOrder();

  await arena.value.playShuffle(shuffled);

  order.value = shuffled;
  drawCount.value += 1;
  localStorage.setItem("tcg-color-order", JSON.stringify(shuffled));
  announcement.value = `Team one: ${teamOne.value.map((card) => card.label).join(" and ")}. Team two: ${teamTwo.value.map((card) => card.label).join(" and ")}.`;
  isShuffling.value = false;
}

function handleArenaReady() {
  if (hasAutoShuffled.value) return;
  hasAutoShuffled.value = true;
  window.setTimeout(() => shuffleTeams(), 320);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.code === "Space" && event.target === document.body) {
    event.preventDefault();
    shuffleTeams();
  }
}

onMounted(() => {
  const storedOrder = localStorage.getItem("tcg-color-order");

  if (storedOrder) {
    try {
      const parsed = JSON.parse(storedOrder);
      if (
        Array.isArray(parsed) &&
        parsed.length === cards.length &&
        parsed.every((id) => cardById.has(id))
      ) {
        order.value = parsed;
      }
    } catch {
      localStorage.removeItem("tcg-color-order");
    }
  }

  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => window.removeEventListener("keydown", handleKeydown));
</script>

<style>
@import "~/assets/css/global.css";
</style>
