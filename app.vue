<template>
  <Head>
    <Title>Team Color Generator</Title>
    <Meta name="description" content="Generate team colors for playstation games."/>
  </Head>
  <section class="container">
    <div @click="animate" class="content">
      <transition-group v-if="colors.length > 0" name="cell" class="colors-wrapper" tag="div">
        <div class="team1 lt-1" :class="colors[0].id" :key="colors[0].id" />
        <div class="team1 lt-2" :class="colors[1].id" :key="colors[1].id" />
        <div class="vs lt-0" key="vs">vs</div>
        <div class="team2 lt-3" :class="colors[2].id" :key="colors[2].id" />
        <div class="team2 lt-4" :class="colors[3].id" :key="colors[3].id" />
      </transition-group>
    </div>
    <div class="header">
      <h1 class="title">TCG</h1>
      <p class="subtitle">Team Color Generator</p>
      <p class="notice">(Click anywhere to shuffle)</p>
    </div>

    <div class="links">
      <a href="https://loke.dev" target="_blank" class="button--grey" rel="noopener">Author</a>
      <a href="https://github.com/loke-dev/TCG" target="_blank" class="button--grey" rel="noopener">GitHub</a>
    </div>
  </section>
</template>

<script setup>
const defaultColors = [
  { id: 'red', name: 'Team 1' },
  { id: 'yellow', name: 'Team 2' },
  { id: 'blue', name: 'Team 3' },
  { id: 'purple', name: 'Team 4' },
]
const colors = ref([]);

useHead({
  htmlAttrs: {
    lang: 'en',
  }
})

function sleep(milliseconds = 1000) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

onMounted(() => {
  if (localStorage.colors) {
    colors.value = JSON.parse(localStorage.colors)
  } else {
    colors.value = defaultColors
  }
})

watch(colors, async (newColors) => {
  localStorage.colors = JSON.stringify(newColors);
})


async function animate() {
  await shuffle()
  await sleep(600)
  await shuffle()
  await sleep(600)
  await shuffle()
}

async function shuffle() {
  colors.value = colors.value
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1])
}
</script>

<style>
.colors-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: "lt-1  lt-0  lt-3 ""lt-2  lt-0  lt-4 ";
}

.lt-1 {
  grid-area: lt-1;
}

.lt-2 {
  grid-area: lt-2;
}

.lt-0 {
  grid-area: lt-0;
}

.lt-3 {
  grid-area: lt-3;
}

.lt-4 {
  grid-area: lt-4;
}

.cell-move {
  transition: transform 0.75s;
}

body {
  background-color: #232323;
  color: #fff;
}

.container {
  display: grid;
  min-height: 100vh;
}

.header {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  margin: auto;
  display: grid;
  min-height: 636px;
}

.colors-wrapper {
  padding: 20px;
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: center;

}
@media (min-width: 800px) {
  .colors-wrapper {
    column-gap: 15%;
  }
}

.colors-wrapper p {
  margin: 20px;
}

.title {
  font-size: 5rem;
  text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3), 0 3px 5px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.2), 0 20px 20px rgba(0, 0, 0, 0.15);
}

.subtitle {
  font-size: 2em;
}

.title,
.subtitle,
.notice {
  cursor: default;
  user-select: none;
  font-weight: bold;
  margin: 10px;
}

.links {
  align-self: end;
  justify-self: end;
  padding: 10px;
}

.button--grey {
  display: inline-block;
  color: #dadada;
  text-decoration: none;
  padding: 5px 10px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #858585;
}

.button--randomize {
  font-size: 20px;
  text-decoration: none;
  cursor: pointer;
  margin: auto;
}

.red,
.blue,
.yellow,
.purple {
  height: 12rem;
  width: 10rem;
  margin: 3rem;
  border-radius: 0.5rem;
}

@media (max-width: 500px) {
  .red,
  .blue,
  .yellow,
  .purple {
    height: 7rem;
    width: 25vw;
    margin: 20px 10px;
  }
}

.vs {
  justify-self: center;
  font-size: 3rem;
  cursor: default;
  user-select: none;
}

.red {
  background: #cb2d3e;
  background: linear-gradient(to top right, #f15750, #de0707);
}

.blue {
  background: #0575e6;
  background: linear-gradient(to top right, #0575e6, #0023a1);
}

.yellow {
  background: #fffc00;
  background: linear-gradient(to top right, #fffd76, #fffc00);
}

.purple {
  background: #6a3093;
  background: linear-gradient(to top right, #a044ff, #6a3093);
}
</style>