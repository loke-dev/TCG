import { defineNuxtConfig } from 'nuxt'
import { VitePWA } from 'vite-plugin-pwa'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  typescript: {
    shim: false
  },
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        }
      })
    ]
  }
})
