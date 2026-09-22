# Tracking File — FreetoolsY

This file tracks where the project stands. Whenever a working session ends, update the **Status** section at the top.

## Status
**Last session:** Real TR translation done + 23 new tools added (Sep 22, 2026)
- **Turkish translation COMPLETE:** `messages/tr.json` is now real Turkish (no longer a placeholder copy of en.json), translated in 6 parallel agents + merged/validated (identical key structure across en/tr, mojibake-free, placeholders preserved). Commits `64d200d`.
- **44 tools now** (was 21): added in one batch — MD5 Hash (md5-hash), JWT Decoder (jwt-cozucu), JSON↔CSV (json-csv-donusturucu), Unix Timestamp (unix-timestamp-cevirici), Duplicate Line Remover (tekrar-satir-temizleyici), AI Token (ai-token-hesaplayici), Lorem Ipsum (lorem-ipsum-uretici), Tip (bahsis-hesaplayici), Discount (indirim-hesaplayici), Average (ortalama-hesaplayici), Dog Age (kopek-yasi-hesaplayici), Subnet (subnet-hesaplayici), PX↔REM (px-rem-donusturucu), XML Formatter (xml-formatter), CSS Minifier (css-minifier), HTML Minifier (html-minifier), WCAG Contrast (wcag-kontrast), Color Palette (renk-paleti-uretici), Box Shadow (box-shadow-uretici), Text Sorter (metin-siralayici), List Randomizer (liste-karistirici), YAML↔JSON (yaml-json-donusturucu), MD5 File Checksum (md5-dosya-checksum). Each has ToolMeta/ToolContent/comp messages in both languages, FA icon, registry entry. Home meta count updated to 44. Build now 100 static pages.
- **AdSlot → env-gated real AdSense:** `AdSlot` renders the real `<ins class="adsbygoogle">` + `push({})` only when `NEXT_PUBLIC_ADS_ENABLED=true` and `NEXT_PUBLIC_ADS_CLIENT` + `NEXT_PUBLIC_ADS_SLOT_(TOP|BOTTOM)` are set; otherwise it keeps the placeholder box. Set those Vercel env vars once AdSense approves.
- Header nav: category buttons each open their own drop-down menu of that category's tools (mobile: compact "Categories" menu, hidden md:flex). "All Tools" button removed.
- Tool cards show Font Awesome watermark icons (right, rotate-6, white 15→hover 25).
- Dark-mode bug on locale switch fixed (commit 4667e44) + ThemeGuard (77eb473) re-applies theme on locale-change navigation.
- ES5-aware constraints still apply: no `\p{L}`/`u` regex, no `for..of`, no spread on strings, no `flatMap`, no `0n` BigInt literal (use `BigInt(0)`).
- Next up: real ad units (set env vars after AdSense approval), buy `freetoolsy.com`.

## Done
- [x] Next.js 14 App Router + TypeScript + Tailwind scaffold
- [x] Inter font (latin-ext, full Turkish support)
- [x] Class-based dark mode + ThemeToggle + FOUC prevention script
- [x] `data/tools.ts`: 18 tools, 4 categories, helper functions
- [x] Home page: SEO hero + live-search tool explorer grouped by category with icons and counts
- [x] `app/araclar/[slug]/page.tsx`: SSG, generateMetadata, 404, breadcrumb
- [x] 44 working tools (client components) — see Status list
- [x] SEO pages for every tool via the consolidated `app/[locale]/araclar/[slug]/page.tsx` (own H1, meta, ad slot, localized SEO copy, linklyhub.com link)
- [x] JSON-LD structured data (WebSite, SoftwareApplication per tool, FAQ, Organization, ContactPage) — Rich Results validated
- [x] `app/not-found.tsx` (localized)
- [x] Bilingual sitemap (`xhtml:link` hreflang en/tr)
- [x] i18n: next-intl v3, `i18n/routing.ts` + `i18n/navigation.ts`, `/` = en, `/tr` = tr (tr.json placeholder pending real translation)
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
2. `components/tools/Xxx.tsx` — write a `"use client"` component (labels via `useTranslations("comp.*")`)
3. `app/[locale]/araclar/[slug]/page.tsx` — import it and add to the `toolComponents` map + register in `generateStaticParams`
4. `messages/en.json` — add `ToolMeta.<slug>` (name/desc), `ToolPage` page title/desc/h1 copy and `ToolContent.<slug>` SEO blocks (keep `messages/tr.json` in sync with identical placeholder keys)
5. Verify with `npm run build && npm run lint`

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