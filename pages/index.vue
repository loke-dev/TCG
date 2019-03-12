<template>
  <section class="container">
    <div class="header">
      <h1 class="title">
        TCG
      </h1>
      <h2 class="subtitle">
        Team Color Generator
      </h2>
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
      <a href="https://lokecarlsson.se" target="_blank" class="button--green" rel="noopener">Author</a>
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

.content {
  margin: auto;
  display: grid;
}

.colors-wrapper {
  padding: 20px;
  display: flex;
  align-items: center;
}

.colors-wrapper p {
  margin: 20px;
}

.versus {
  padding: 30px;
}

.team1, .team2 {
  display: grid;
}

.links {
  align-self: end;
  justify-self: end;
  padding: 10px;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.button--randomize {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #b718df;
  color: #b718df;
  text-decoration: none;
  padding: 10px 30px;
  cursor: pointer;
  margin: auto;
}
</style>
