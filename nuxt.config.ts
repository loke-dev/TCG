import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  typescript: {
    shim: false
  },
  modules: [
    '@kevinmarrec/nuxt-pwa'
  ],
  pwa: {
    manifest: {
      name: 'Team Color Generator',
      short_name: 'TCG',
      description: 'Generate team colors for playstation games.',
      background_color: '#232323',
      theme_color: '#cb2d3e',
      lang: 'en',
      orientation: 'portrait',
      display: 'standalone',
      start_url: '/',
    }
  }
})
