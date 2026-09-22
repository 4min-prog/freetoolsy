# Tracking File — FreetoolsY

This file tracks where the project stands. Whenever a working session ends, update the **Status** section at the top.

## Status
**Last session:** Initial build (Sep 22, 2026)
- Site complete, `npm run build` passes, pushed to GitHub (main → 4min-prog/freetoolsy).
- Next up: adding more tools, SEO/sitemap, deployment.
- No technical debt.

## Done
- [x] Next.js 14 App Router + TypeScript + Tailwind scaffold
- [x] Inter font (latin-ext, full Turkish support)
- [x] Class-based dark mode + ThemeToggle + FOUC prevention script
- [x] `data/tools.ts`: 5 tools, 4 categories, helper functions
- [x] Home page: tool cards grouped by category
- [x] `app/araclar/[slug]/page.tsx`: SSG, generateMetadata, 404, breadcrumb
- [x] 5 working tools (client components): char/word counter, password generator, JSON formatter, BMI
- [x] `app/not-found.tsx` (Turkish)
- [x] Build passes cleanly, 10 static pages generated

## Design decisions (rules — do not break)
- Background: light `#F5F6F8`, dark `#15161A` (never pure black/white, never `#0B0B0B`)
- Primary accent: light `#2563EB`, dark `#60A5FA` (WCAG AA checked)
- Font: Inter only. Radii/shadows intentionally varied (`rounded-xl` cards, `rounded-lg` inputs).
- Banned: ALL CAPS heading labels, "→" everywhere, cream/terracotta, identical shadows on every card.
- Color tokens are CSS variables in `app/globals.css`; mapped in `tailwind.config.ts`.

## Adding a new tool (standard workflow)
1. `data/tools.ts` — add an entry to `tools` (`slug` lowercase, hyphenated)
2. `components/tools/Xxx.tsx` — write a `"use client"` component
3. `app/araclar/[slug]/page.tsx` — import it and add to the `toolComponents` map
4. Verify with `npm run build`

## Install / commands
```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run lint
git push             # main
```

## Notes
- BMI result is not medical advice (disclaimer lives inside the component).
- Everything runs client-side; no server/DB.
- Domain `freetoolsy.com` is set in metadata (`metadataBase`, canonical/OG) — review after first deployment.