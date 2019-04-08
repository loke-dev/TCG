// import createPersistedState from 'vuex-persistedstate'
// import * as Cookies from 'js-cookie'

// export default ({store, isHMR, isClient, isServer}) => {
//   console.log('plugin')
//   if (isHMR) return
//   console.log('after HMR')
//   if (isClient) {
//     console.log('is client')
//     window.onNuxtReady((nuxt) => {
//       createPersistedState({
//         storage: {
//           getItem: key => Cookies.get(key),
//           setItem: (key, value) => Cookies.set(key, value, { expires: 3, secure: true }),
//           removeItem: key => Cookies.remove(key)
//         }
//       })(store)
//     })
//   }
// }

import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import cookie from 'cookie'

export default ({store, req, isDev, isClient}) => {
  createPersistedState({
    vuex: 'vuex',
    paths: ['colors'],
    storage: {
      getItem: (key) => isClient ? Cookies.getJSON(key) : cookie.parse(req.headers.cookie || '')[key],
      setItem: (key, value) => Cookies.set(key, value, { expires: 365, secure: !isDev }),
      removeItem: (key) => Cookies.remove(key)
    }
  })(store)
}
