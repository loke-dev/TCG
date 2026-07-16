export default defineNuxtConfig({
  typescript: {
    shim: false,
  },

  modules: ["@vite-pwa/nuxt"],

  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      ],
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
      description: "Shuffle four iconic colors into two teams with a tactile 3D draw.",
      background_color: "#08090d",
      theme_color: "#08090d",
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
    preset: "static",
  },

  compatibilityDate: "2026-07-16",
});
