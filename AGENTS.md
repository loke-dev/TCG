# TCG repository instructions

TCG is a mobile-first Nuxt 3 and Vue 3 static application whose core interaction
is a persistent Three.js card scene.

- Use the pnpm version declared in `package.json`; do not introduce another
  package manager.
- Keep the app statically generatable for Cloudflare Pages.
- Preserve touch input, reduced-motion behavior, responsive layouts, and WebGL
  cleanup when changing the card scene.
- Treat `public/` as source assets. Do not edit generated `.nuxt/`, `.output/`,
  or Wrangler state.
- Run `pnpm typecheck` and `pnpm generate` for code or configuration changes.
- Use `pnpm deploy` only when the task explicitly requires a manual deployment.
- Never commit credentials, local environment files, or Cloudflare state.
