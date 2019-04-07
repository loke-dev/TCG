<template>
  <section class="container">
    <div class="header">
      <h1 @click="animate" class="title">TCG</h1>
      <p class="subtitle">Team Color Generator</p>
    </div>
    <div class="content">
      <transition-group name="cell" class="colors-wrapper" tag="div">
        <div class="team1 lt-1" :class="colors[0].id" :key="colors[0].id"/>
        <div class="team1 lt-2" :class="colors[1].id" :key="colors[1].id"/>
        <div class="vs lt-0" key="vs">vs</div>
        <div class="team2 lt-3" :class="colors[2].id" :key="colors[2].id"/>
        <div class="team2 lt-4" :class="colors[3].id" :key="colors[3].id"/>
      </transition-group>
    </div>
    <div class="links">
      <a href="https://lokecarlsson.se" target="_blank" class="button--grey" rel="noopener">Author</a>
      <a
        href="https://github.com/LokeCarlsson/TCG"
        target="_blank"
        class="button--grey"
        rel="noopener"
      >GitHub</a>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      colors: [
        {
          name: "Blue",
          id: "blue"
        },
        {
          name: "Red",
          id: "red"
        },
        {
          name: "Purple",
          id: "purple"
        },
        {
          name: "Yellow",
          id: "yellow"
        }
      ]
    };
  },
  async mounted() {
    this.animate()
  },
  methods: {
    sleep(milliseconds = 1000) {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    },
    async animate() {
      this.shuffle()
      await this.sleep(600)
      this.shuffle()
      await this.sleep(600)
      this.shuffle()
    },
    shuffle() {
      this.colors
        .map(a => [Math.random(), a])
        .sort((a, b) => a[0] - b[0])
        .forEach((e, i) => {
          this.$set(this.colors, i, { name: e[1].name, id: e[1].id })
        })
    }
  }
};
</script>

<style lang="sass">
.colors-wrapper
  display: grid
  grid-template-columns: 1fr 1fr 1fr
  grid-template-rows: 1fr 1fr
  grid-template-areas: "lt-1  lt-0  lt-3 " "lt-2  lt-0  lt-4 "

.lt-1
  grid-area: lt-1

.lt-2
  grid-area: lt-2

.lt-0
  grid-area: lt-0

.lt-3
  grid-area: lt-3

.lt-4
  grid-area: lt-4

.cell-move
  transition: transform 0.75s

body
  background-color: #232323
  color: white

.container
  display: grid
  min-height: 100vh

.header
  margin: auto
  display: flex
  flex-direction: column
  align-items: center

.content
  margin: auto
  display: grid

.colors-wrapper
  padding: 20px
  display: grid
  grid-auto-flow: column
  align-items: center
  justify-content: center
  grid-gap: 20px

.colors-wrapper p
  margin: 20px

.title
  font-size: 5rem
  color: #fefefe
  text-shadow 0px 1px 0px #c0c0c0, 0px 2px 0px #b0b0b0, 0px 3px 0px #a0a0a0, 0px 4px 0px #909090, 0px 5px 10px rgba(0, 0, 0, 0.6)

.subtitle
  font-size: 2em

.links
  align-self: end
  justify-self: end
  padding: 10px

.button--grey
  display: inline-block
  color: #dadada
  text-decoration: none
  padding: 5px 10px
  margin-left: 15px

.button--grey:hover
  color: rgb(133, 133, 133)

.button--randomize
  font-size: 20px
  text-decoration: none
  cursor: pointer
  margin: auto

.red, .blue, .yellow, .purple
  height: 12rem
  width: 10rem
  margin: 3rem
  border-radius: 0.5rem
  @media (max-width: 500px)
    height: 7rem
    width: 25vw
    margin: 20px 10px

.vs
  justify-self: center
  font-size: 3rem

.red
  background: #cb2d3e
  background: -webkit-linear-gradient(to top right, #ef473a, #cb2d3e)
  background: linear-gradient(to top right, #ef473a, #cb2d3e)

.blue
  background: #0575E6
  background: -webkit-linear-gradient(to top right, rgb(0, 35, 161), #0575E6)
  background: linear-gradient(to top right, rgb(0, 35, 161), #0575E6)

.yellow
  background: #fffc00
  background: -webkit-linear-gradient(to top right, #fffd76, #fffc00)
  background: linear-gradient(to top right, #fffd76, #fffc00)

.purple
  background: #6a3093
  background: -webkit-linear-gradient(to top right, #a044ff, #6a3093)
  background: linear-gradient(to top right, #a044ff, #6a3093)
</style>
