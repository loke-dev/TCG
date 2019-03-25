module.exports = {
  build: {},
  head: {
    titleTemplate: 'TCG - Team Color Generator',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  server: {
    port: 8080
  },
  loading: { color: '#3B8070' },
  manifest: {
    theme_color: '#3B8070'
  },
  modules: [
    '@nuxtjs/pwa',
    ['@nuxtjs/google-analytics', {
      id: 'UA-72659574-7'
    }]
  ]
}
