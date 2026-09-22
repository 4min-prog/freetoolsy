# Tracking File — FreetoolsY

This file tracks where the project stands. Whenever a working session ends, update the **Status** section at the top.

## Status
**Last session:** 7 new tools (v1.3.0) (Sep 22, 2026)
- Site live at `https://freetoolsy.vercel.app` (domain `freetoolsy.com` not purchased yet).
- Real IDs in place: GA4 `G-6J6JB9SHKZ`, AdSense `ca-pub-8880626756482815` (no placeholders).
- AdSense snippet is a **raw `<script>` in `<head>`** of `app/layout.tsx` — required for verification, `next/script` does NOT emit a real `<script>` tag in App Router HTML. GA4 stays as `next/script` (`afterInteractive`).
- AdSense site verification passed; status: "being prepared", review requested (~1-2 weeks wait — do not re-submit). Real `<ins class="adsbygoogle">` units go into `components/AdSlot.tsx` after approval.
- GA4 setup complete; data collection within ~48h. CMP consent message live for EEA/UK/CH (3-option template recommended).
- Home page redesigned (SEO hero, live search `#arac-ara`, category sections, "Kullan" buttons, category dropdown, LinklyhHub footer link).
- **18 tools now** (was 11): added QR Kod Oluşturucu (`react-qr-code` dep), SHA Hash Üretici (Web Crypto), Tarih Farkı, Renk Dönüştürücü, UUID Üretici (`crypto.randomUUID` + fallback), Birim Dönüştürücü, Parola Güç Testi. Every new tool has a dedicated SEO page (own H1, meta, AdSlot top/bottom, ToolJsonLd, ~300-word copy + FAQ, linkly.hub link).
- JSON-LD: home (WebSite + SoftwareApplication + FAQPage), all 18 tool pages (SoftwareApplication, url `https://freetoolsy.vercel.app/araclar/{slug}`), `/hakkimizda` (Organization + AboutPage), `/iletisim` (ContactPage). Validated in Google Rich Results Test — one valid item (SoftwareApplication), no critical issues.
- All URLs (sitemap.xml now 22 URLs, robots.txt, `metadataBase`, canonical/OG, JSON-LD, privacy page text) point to `https://freetoolsy.vercel.app`.
- `npm run build` passes (26 static pages), lint clean.
- Next up: more tools, real ad units after AdSense approval, buy `freetoolsy.com` domain.
- No technical debt.

## Done
- [x] Next.js 14 App Router + TypeScript + Tailwind scaffold
- [x] Inter font (latin-ext, full Turkish support)
- [x] Class-based dark mode + ThemeToggle + FOUC prevention script
- [x] `data/tools.ts`: 18 tools, 4 categories, helper functions
- [x] Home page: SEO hero + live-search tool explorer grouped by category with icons and counts
- [x] `app/araclar/[slug]/page.tsx`: SSG, generateMetadata, 404, breadcrumb
- [x] 18 working tools (client components): char/word counter, case converter, JSON formatter, Base64, URL encoder, password generator, BMI, KDV, percentage, age, QR code, SHA hash, date diff, color converter, UUID, unit converter, password strength
- [x] Dedicated SEO pages for every tool (own H1, meta, ad slot, SEO copy, linkly.hub link)
- [x] JSON-LD structured data (WebSite, SoftwareApplication per tool, FAQ, Organization, ContactPage) — Rich Results validated
- [x] `app/not-found.tsx` (Turkish)
- [x] Deployed to Vercel, custom domain pending
- [x] `react-qr-code` dependency (QR tool)

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
- Domain `freetoolsy.com` intended; site currently lives on `freetoolsy.vercel.app` (all URLs updated).