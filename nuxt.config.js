module.exports = {
  build: {},
  head: {},
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
  ],
  plugins: [{ src: '~/plugins/localStorage.js', ssr: false }]
}
