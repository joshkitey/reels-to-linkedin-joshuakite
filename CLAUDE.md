# Reels to LinkedIn - Joshua Kite

## Project Overview
A client-side React app that converts Instagram Reel content into LinkedIn-optimized posts for health, energy, and longevity coaching.

## Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **Deployment**: GitHub Pages via Actions workflow
- **Transcription**: Browser Web Speech API (Chrome recommended)
- **No backend** — everything runs client-side

## Architecture
- `src/lib/rewriteEngine.js` — Core content generation engine. Extracts topics from transcript keywords, generates LinkedIn text posts and carousel slide content using template-based system with health/longevity angles.
- `src/lib/transcriber.js` — Browser-based speech-to-text using Web Speech API.
- `src/components/VideoInput.jsx` — Upload video, paste URL, or paste transcript.
- `src/components/TextPostPreview.jsx` — LinkedIn-style preview for text posts with copy to clipboard.
- `src/components/CarouselPreview.jsx` — Scrollable carousel slide previews with navigation.

## Key Behaviors
- Generates **3 text post alternatives** and **3 carousel alternatives** per transcript
- Health coach template pre-fills energy/longevity angles
- Topics auto-detected from transcript keywords (nutrition, sleep, fitness, etc.)
- Each alternative uses different hooks, CTAs, transitions, and stat references
- Carousel slides use gradient color schemes with cover → content → proof → CTA flow

## Build & Deploy
```bash
npm install
npm run build     # outputs to dist/
npm run dev       # local dev server
```
Push to `main` triggers GitHub Actions deploy to Pages.

## Live URL
https://joshkitey.github.io/reels-to-linkedin-joshuakite/

## Owner
Joshua Kite (@joshkitey) — Health & Longevity Coach
