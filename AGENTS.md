# AGENTS.md

## Overview

React 19 + Vite 8 single-page app in JavaScript/JSX (no TypeScript, no backend in this repo). The UI is still largely the Vite starter template; don't assume cafeteria-specific features or an API layer exist.

## Commands

- Install: `npm install` (uses `package-lock.json`)
- Dev server: `npm run dev` (Vite, default http://localhost:5173)
- Build: `npm run build`
- Preview build: `npm run preview`
- Lint: `npm run lint` (runs `eslint .`)

There is no test runner and no typecheck script. Do not invent one; verify changes with `npm run lint` and `npm run build`.

## Structure

- `src/main.jsx` mounts `<App />` into `#root` and imports `src/index.css` (Tailwind entry).
- `src/App.jsx` is the entire UI and imports `src/App.css`.
- `src/assets/` images are imported as ES modules (e.g. `import heroImg from './assets/hero.png'`).
- `public/` is served from `/` (e.g. `/icons.svg`, `/favicon.svg`).
- `index.html` is the Vite entry point.

## Toolchain quirks

- Tailwind v4 only: loaded via the `@tailwindcss/vite` plugin in `vite.config.js` and `@import "tailwindcss";` in `src/index.css`. There is no `tailwind.config.js`; do not add one or use v3 directives (`@tailwind base/components/utilities`).
- Import from the `tailwindcss` package. The `css` and `tailwind` packages in `dependencies` are unused/stray — don't import from them.
- `src/App.css` uses native CSS nesting and theme CSS variables (`--accent`, `--border`, etc.), not Tailwind utilities. Put component styles there; keep global Tailwind imports in `index.css`.
- ESLint uses flat config (`eslint.config.js`); there is no `.eslintrc`. It lints `**/*.{js,jsx}` and ignores `dist`.
- Dependencies are intentionally current (React 19, Vite 8, ESLint 10); check current docs instead of relying on older API assumptions.

## Gotchas

- Some Tailwind class names in `src/App.jsx` are typos that silently do nothing (e.g. `text-3x1`, `text orange-600`). Fix them if you touch those lines.
