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
          <span>{{colors[0].name}}</span>
          <span>{{colors[1].name}}</span>
        </div>
        <span class="versus">vs</span>
        <div class="team2">
          <span>{{colors[2].name}}</span>
          <span>{{colors[3].name}}</span>
        </div>
      </div>
      <button @click="randomize" class="button--randomize">Randomize</button>
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
      randomize() {
        this.colors = this.shuffle(this.colors)
      },
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

.versus {
  padding: 30px;
}

.team1, .team2 {
  font-size: 22px;
  font-weight: 500;
  width: 100px;
  padding: 30px;
}

.links {
  align-self: end;
  justify-self: end;
  padding: 10px;
}

.button--grey {
  display: inline-block;
  color: #35495e;
  text-decoration: none;
  padding: 5px 10px;
  margin-left: 15px;
}

.button--grey:hover {
  color: black;
}

.button--randomize {
  font-size: 20px;
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  background-color: white;
  text-decoration: none;
  padding: 10px 30px;
  cursor: pointer;
  margin: auto;
}

.button--randomize:hover {
  color: #fff;
  background-color: #3b8070;
}
</style>
