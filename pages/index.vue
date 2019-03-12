<template>
  <section class="container">
    <div>
      <h1 class="title">
        TCG
      </h1>
      <h2 class="subtitle">
        Team Color Generator
      </h2>
    </div>
    <div class="links">
      <a href="https://lokecarlsson.se" target="_blank" class="button--green" rel="noopener">Author</a>
      <a href="https://github.com/LokeCarlsson/TCG" target="_blank" class="button--grey" rel="noopener">GitHub</a>
    </div>
  </section>
</template>

<script>

  export default {
    components: {
      
    },
    data () {
      return {
      }
    },
    mounted () {
    },
    methods: {
    },
    destroyed () {
    }
  }
</script>

<style>
.container {
  display: grid;
  min-height: 100vh;
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
</style>
