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
  loading: { color: '#232323' },
  manifest: {
    theme_color: '#232323',
    background_color: '#232323',
    name: 'Team Color Generator',
    short_name: 'TCG',
    description: 'Generate team colors for PS4'
  },
  modules: [
    '@nuxtjs/pwa',
    ['@nuxtjs/google-analytics', {
      id: 'UA-72659574-7'
    }]
  ]
}
