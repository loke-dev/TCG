<template>
  <section class="container">
    <div class="header">
      <h1 class="title">
        TCG
      </h1>
      <p class="subtitle">
        Team Color Generator
      </p>
    </div>
    <div class="content">
      <div class="colors-wrapper">
        <div class="team1">
          <div :class="colors[0].id" :key="colors[0].id" />
          <div :class="colors[1].id" :key="colors[1].id" />
        </div>
        <span class="versus">vs</span>
        <div class="team2">
          <div :class="colors[2].id" :key="colors[2].id" />
          <div :class="colors[3].id" :key="colors[3].id" />
        </div>
      </div>
    </div>
    <div class="links">
      <a href="https://lokecarlsson.se" target="_blank" class="button--grey" rel="noopener">Author</a>
      <a href="https://github.com/LokeCarlsson/TCG" target="_blank" class="button--grey" rel="noopener">GitHub</a>
    </div>
  </section>
</template>

<script>
export default {
    data () {
      return {
        colors: this.shuffle()
      }
    },
    mounted () {
    },
    methods: {
      shuffle() {
        const startColors = [
          {
            name: 'Blue',
            id: 'blue'
          },
          {
            name: 'Red',
            id: 'red'
          },
          {
            name: 'Purple',
            id: 'purple'
          },
          {
            name: 'Yellow',
            id: 'yellow'
          }
        ]
        return startColors
          .map(a => [Math.random(), a])
          .sort((a, b) => a[0] - b[0])
          .map(a => a[1]);
      }
    },
  }
</script>

<style>
body {
  background-color: #232323;
  color: white;
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
}

.colors-wrapper {
  padding: 20px;
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: center;
  grid-gap: 20px;
}

.colors-wrapper p {
  margin: 20px;
}

.title {
  font-size: 5em;
  color:#fefefe;
  text-shadow:
  0px 1px 0px #c0c0c0,
  0px 2px 0px #b0b0b0,
  0px 3px 0px #a0a0a0,
  0px 4px 0px #909090,
  0px 5px 10px rgba(0, 0, 0, 0.6);
}

.subtitle {
  font-size: 2em;
}

.versus {
  padding: 30px;
  font-size: 2.5rem;
}

.team1, .team2 {
  font-size: 22px;
  font-weight: 500;
  padding: 30px;
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
  color: rgb(133, 133, 133);
}

.button--randomize {
  font-size: 20px;
  text-decoration: none;
  cursor: pointer;
  margin: auto;
}

.red, .blue, .yellow, .purple {
  height: 150px;
  width: 150px;
  margin: 50px 0;
  border-radius: 0.5rem;
}

.red {
  background: #cb2d3e;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to top right, #ef473a, #cb2d3e);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top right, #ef473a, #cb2d3e); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.blue {
  background: #0575E6;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to top right, rgb(0, 35, 161), #0575E6);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top right, rgb(0, 35, 161), #0575E6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.yellow {
  background: #fffc00;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to top right, #fffd76, #fffc00);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top right, #fffd76, #fffc00); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.purple {
  background: #6a3093;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to top right, #a044ff, #6a3093);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top right, #a044ff, #6a3093); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
