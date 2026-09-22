# Tracking File — FreetoolsY

This file tracks where the project stands. Whenever a working session ends, update the **Status** section at the top.

## Status
**Last session:** SEO & AdSense prep (Sep 22, 2026)
- Added GA4 (G-XXXX placeholder) + AdSense (ca-pub-XXXX placeholder) scripts via `next/script` in `app/layout.tsx`; OG + Twitter Card defaults.
- Added info pages: `/gizlilik-politikasi` (AdSense-required), `/hakkimizda`, `/iletisim` (mailto-based form).
- Added `public/sitemap.xml` (all 11 tools + info pages) and `public/robots.txt`.
- AdSlot now renders `ad-top` (above tool) and `ad-bottom` (below tool) placeholders on every tool page; AdSense code goes there later.
- `npm run build` passes, 19 static pages.
- Next up: real GA/AdSense IDs, deployment, more tools.
- No technical debt.

## Done
- [x] Next.js 14 App Router + TypeScript + Tailwind scaffold
- [x] Inter font (latin-ext, full Turkish support)
- [x] Class-based dark mode + ThemeToggle + FOUC prevention script
- [x] `data/tools.ts`: 11 tools, 4 categories, helper functions
- [x] Home page: tool cards grouped by category
- [x] `app/araclar/[slug]/page.tsx`: SSG, generateMetadata, 404, breadcrumb
- [x] 11 working tools (client components): char/word counter, case converter, JSON formatter, Base64, URL encoder, password generator, BMI, KDV, percentage, age
- [x] Dedicated SEO pages for every tool (own H1, meta, ad slot, SEO copy, linkly.hub link)
- [x] `app/not-found.tsx` (Turkish)
- [x] Build passes cleanly

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
4. (Required for every tool) add a dedicated `app/araclar/<slug>/page.tsx` with own H1, meta, `<AdSlot slot="top" />` above the tool and `<AdSlot slot="bottom" />` below it, ~300-word SEO copy and linkly.hub link. Static segments override the `[slug]` route.
5. Verify with `npm run build`

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