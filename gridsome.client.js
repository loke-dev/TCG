import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import { register } from 'register-service-worker'

export default function (Vue, options, {
  appOptions,
  isClient,
  head
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

  if (isClient && process.env.NODE_ENV === 'production') {
    register(options.serviceWorkerPath, {
      ready () {
        console.log('Service worker is active.')
      },
      registered (registration) {
        console.log('Service worker has been registered.')
      },
      cached (registration) {
        console.log('Content has been cached for offline use.')
      },
      updatefound (registration) {
        console.log('New content is downloading.')
      },
      updated (registration) {
        console.log('New content is available; please refresh.')
      },
      offline () {
        console.log('No internet connection found. App is running in offline mode.')
      },
      error (error) {
        console.error('Error during service worker registration:', error)
      }
    })
  }

  head.link.push({
    rel: 'manifest',
    href: '/manifest.json'
  })
}