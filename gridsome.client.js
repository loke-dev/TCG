import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

export default function (Vue, options, {
  appOptions
}) {
  Vue.use(Vuex)

  appOptions.store = new Vuex.Store({
    state: {
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
    },
    mutations: {
      shuffle (state) {
        state.colors = state.colors
          .map(a => [Math.random(), a])
          .sort((a, b) => a[0] - b[0])
          .map(a => a[1])
      }
    },
    getters: {
      getColors: state => {
        return state.colors
      }
    },
    actions: {
      shuffle ({ commit }) {
        commit('shuffle')
      }
    },
    plugins: [
      createPersistedState({
        storage: {
          getItem: key => Cookies.get(key),
          setItem: (key, value) =>
            Cookies.set(key, value, { expires: 3, secure: true }),
          removeItem: key => Cookies.remove(key),
        },
      }),
    ],
  })
}