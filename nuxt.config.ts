export default defineNuxtConfig({
  typescript: {
    shim: false,
  },

  modules: ["@vite-pwa/nuxt"],

  app: {
    head: {
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
      ],
    },
  },

  pwa: {
    manifest: {
      name: "Team Color Generator",
      short_name: "TCG",
      description: "Generate team colors for playstation games.",
      background_color: "#232323",
      theme_color: "#131313",
      lang: "en",
      display: "standalone",
      start_url: "/",
    },
  },

  vite: {
    build: {
      rollupOptions: {
        context: "globalThis",
      },
    },
  },

  nitro: {
    preset: "vercel",
  },

  compatibilityDate: "2025-03-11",
});