# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- Install deps (Yarn):
  ```bash path=null start=null
  yarn
  ```
- Run dev server (Next.js 15 with Turbopack):
  ```bash path=null start=null
  yarn dev
  ```
- Build (Turbopack):
  ```bash path=null start=null
  yarn build
  ```
- Start production server:
  ```bash path=null start=null
  yarn start
  ```
- Lint (ESLint flat config) and autofix:
  ```bash path=null start=null
  yarn lint
  yarn lint --fix
  ```
- Type-check (no script defined; runs TypeScript in no-emit mode):
  ```bash path=null start=null
  npx tsc --noEmit
  ```
- Tests: not configured in this repo (no Jest/Vitest setup).

## Architecture and structure

- Framework/runtime
  - Next.js 15 App Router with TypeScript. Dev/build use Turbopack.
  - Entry layout: `src/app/layout.tsx` defines `<html lang="ko">`, loads Google Geist fonts via `next/font`, sets `metadata`.
  - Root route: `src/app/page.tsx`. Route group `(main)` contains domain pages like `login/page.tsx`, `signup/page.tsx`.

- UI and styling
  - Global styles in `src/app/globals.css` use Tailwind CSS v4 (`@import 'tailwindcss'`) with CSS variables and `@theme inline` tokens.
  - Custom webfonts (Pretendard) are served from `public/fonts/*` and declared via `@font-face`; additional fonts (Geist) are injected via `next/font`.
  - Static assets live under `public/assets/`.

- Components and domain organization
  - Atomic design directories under `src/app/_components/`: `atoms/`, `molecules/`, `organisms/`, `templates/`.
  - `src/app/_lib/` reserved for business logic (API clients, query hooks). Place subfolders like `api/`, `queries/` under here.
  - Cross-cutting modules: `src/constants/`, `src/hooks/`, `src/styles/`, `src/types/`, `src/utils/`.

- Module resolution and aliases
  - TypeScript path alias `@/*` → `src/*` is configured in `tsconfig.json` (`baseUrl: ./`). Prefer absolute imports from `@/...` over deep relatives.

- Configuration
  - `next.config.ts`: minimal Next config (extend here as needed).
  - `tsconfig.json`: strict, `noEmit`, `moduleResolution: bundler`, JSX preserve, includes Next plugin. Paths configured for `@/*`.
  - ESLint flat config in `eslint.config.mjs` extending `next/core-web-vitals` and `next/typescript`; ignores `node_modules`, `.next`, `out`, `build`, `next-env.d.ts`.
  - Package manager: Yarn (repo includes `yarn.lock`).

- Repository workflows
  - GitHub templates exist under `.github/` for Issues (feature/bug/custom) and Pull Requests. Use them when opening work to keep context consistent.
