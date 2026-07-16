# TCG — Team Color Generator

![EGbyZEi](https://user-images.githubusercontent.com/14079937/55016464-1cc59680-4fef-11e9-8777-e4a600c91be5.png)

TCG is a mobile-first 3D team draw. Four glass cards — yellow, purple, blue,
and red — shuffle into two teams using a WebGL scene powered by Three.js.

## Stack

- Nuxt 3 and Vue 3
- Three.js/WebGL for the interactive deck
- pnpm
- Cloudflare Pages

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Run the type checker with `pnpm typecheck`.

Deploy the static production build with:

```bash
pnpm deploy
```
