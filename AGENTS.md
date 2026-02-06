# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tokyo FM Podcast Client — a full-stack Nuxt 4 app that scrapes Tokyo FM's podcast website using Puppeteer and serves a Vue 3 SPA for browsing programs and playing episodes.

## Commands

- **Install**: `bun install`
- **Dev server**: `bun run dev` (http://localhost:3000)
- **Build + preview**: `bun run start`
- **Lint**: `bun run lint` / `bun run lint:fix`
- **Test all**: `bun test`
- **Single test**: `bun test server/scraping/programs.test.ts`

Git hooks (lefthook): pre-commit runs `lint:fix`, pre-push runs `bun test`.

## Architecture

**Runtime**: Bun + Nuxt 4 (Vue 3 + Nitro server)

### Frontend (`app/`)
- File-based routing: `/` (program search) → `/:program/episodes` (episode list)
- UI: Nuxt UI v4 components + Lucide icons
- Data fetching via `useFetch()` composable

### Backend (`server/`)
- Nitro auto-routes under `server/api/`
- API: `GET /api/programs?name=<query>`, `GET /api/:program/episodes`
- Query/route param validation with Zod schemas
- Scraping logic in `server/scraping/` — Puppeteer extracts data from TFM website

### Shared types (`shared/model/`)
- `Program` (id, title, href, img) and `Episode` (id, title, description, length, publishedAt, audio, thumbnail)
- Used by both frontend and backend via Nuxt auto-imports

### Key pattern: Puppeteer singleton
`server/utils/browser.ts` manages a single browser instance. `withBrowser(callback)` creates a page, runs the callback, and closes the page.

## Code Style

- TypeScript, 2-space indent, single quotes, no semicolons
- ESLint with `@nuxt/eslint` stylistic rules, 1TBS brace style
- Tests use `bun:test` with long timeouts (20-30s) since they hit the real TFM website
