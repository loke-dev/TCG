const state = () => {
  return {
    colors: [
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
  }
}

const actions = {
  shuffle ({ commit }) {
    commit('shuffle')
  }
}

const mutations = {
  shuffle (state) {
    state.colors = state.colors
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1])
  }
}

export default {
  state,
  getters: {},
  actions,
  mutations
}