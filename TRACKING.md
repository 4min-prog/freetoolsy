# Tracking File — FreetoolsY

This file tracks where the project stands. Whenever a working session ends, update the **Status** section at the top.

## Status
**Last session:** SEO güçlendirme + canlı kur + AdSense tamamlandı (Sep 25, 2026)

Çalışma şubesi **`main` = Vercel production** (hero-iyilestirme main'e merge edildi). Push hep `origin main`'e.

### Bu turda bitenler (hepsi yayında doğrulandı)
- **Favicon v2** (`6473b67`): `app/icon.svg`, `app/favicon.ico` (16/32/48 şeffaf), `public/apple-touch-icon.png` — ortalanmış çubuklar, şeffaf zemin. `app/apple-touch-icon.png` silindi (Next tarafından servis edilmiyordu).
- **Canlı kur API'si** (`be26e70`): `app/api/rates/route.ts` (open.er-api.com/v6/latest/USD, anahtarsız, 1 saat modül cache, 8s timeout, FALLBACK_RATES). `CurrencyConverter` artık TRY→EUR vb. gerçek anlık kuru gösteriyor (live:true, TRY/EUR ≈ 55.65). middleware `/api`'yi hariç tutuyor — güvenli.
- **Rehber kitaplığı 18** (`20275c3`): 8 yeni rehber eklendi. `npm run sitemap` → `public/sitemap.xml` **118 URL** (88 araç + 7 kategori + 18 rehber + ...). Tool/guide ekleyince sitemap YENİDEN ÜRETİLMELİ.
- **ToolContent 88/88** (`2b70744` + `9d47019`): 60 araç 5 blok, 28 araç 4 blok, 3 bloklu araç kalmadı. Hepsi en+tr.
- **jwt-generator bug fix** (`eadfbec`): ToolContent'te 71 yamalı blok vardı (stopwatch/salary kalıntıları karışmıştı) → 5 gerçek JWT bloğu. Yabancı içerik taraması yapıldı, başka kontaminasyon yok.
- **AdSense** (`7499754`): `app/[locale]/layout.tsx` `<head>`'inde sabit script `ca-pub-8880626756482815` (async + crossorigin). Projede `ca-pub-XXXXXXXXXX` placeholder YOK (grep sıfır sonuç). `AdSlot` üniteleri hâlâ env-gated: `NEXT_PUBLIC_ADS_ENABLED=true` + `NEXT_PUBLIC_ADS_SLOT_TOP`/`BOTTOM` Vercel'e girilmeden reklam render olmaz.
- hreflang + canonical her sayfada doğrulandı (canlı curl).

### Diğer terminal (tasarım) için kritik kurallar
- **Yazım/encode:** Türkçe içerik SADECE Write/Edit/node (UTF-8) ile. PowerShell ile `�?` bozulur — mojibake alarmı display sorunu, dosyalar temiz.
- **Build:** önce dev node'unu öldür (3000/4100), `.next`'i sil, `npm run build`, sonra `npx tsc --noEmit`. Kurulan build'de `/_document PageNotFoundError` dev-race'i olabilir — gerçek hata değil, tekrar build.
- **URL yapısı:** EN `/tools/[slug]`, TR `/tr/araclar/[slug]`; kategori EN `/categories/[id]`, TR `/tr/kategoriler/[id]`. `lib/paths.ts` tek kaynak — elle string kurma.
- **Kod yorumu yasak** (proje kuralı). `freetoolsy_logo_v3.svg` untracked, dokunma.
- **Dokunulacak dosyalar (commit çakışması):** `messages/en.json`, `messages/tr.json` (en/tr blok sayıları SENKRON olmalı), `data/tools.ts`, `data/guides.ts`, `app/api/rates/`, `scripts/generate-sitemap.mts`, `app/[locale]/layout.tsx`.
- **Body scripts:** GA `G-6J6JB9SHKZ` + GoatCounter `freetoolsy.goatcounter.com` zaten body'de lazyOnload.
- İç linkleme zaten güçlü (similar/popular/guideLinks/breadcrumb). Sayfa HTML 318KB → 134KB yapıldı (`e1c77f3`, client mesaj kesme).

### Bekleyen / isteğe bağlı
- Search Console: 118 URL sitemap + yeni rehberlerin indexlenmesi 1-3 gün beklenecek; gerekirse URL Denetimi → "İndekslenmesini İsten".
- AdSense slot env'leri kullanıcıda (AdSense onayı sonrası set edilecek).
- İsteğe bağlı büyüme: kategori sayfaları açıklama metni, yeni rehber/araç (örn. WHOIS, HTML→Markdown), döviz sayfasının deploy sonrası canlı kontrolü.

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
3. Register the tool: `app/[locale]/tools/[slug]/page.tsx` (EN) + `app/[locale]/araclar/[slug]/page.tsx` (TR) `toolComponents` map + `generateStaticParams` (URL'i elle yazma, `lib/paths.ts`'i kullan)
4. `messages/en.json` — add `ToolMeta.<slug>` (name/desc), `ToolPage` page title/desc/h1 copy and `ToolContent.<slug>` SEO blocks (en/tr block sayıları aynı olmalı — **5 blok dolu içerik hedefleyin**, 3 blokta bırakmayın)
5. Verify: `npm run sitemap && npm run build && npx tsc --noEmit` (sitemap ÜRETİLMEK zorunda)

## Install / commands
```bash
npm install
npm run dev          # http://localhost:3000  (build öncesi durdur, .next çekişmesini önlemek için)
npm run sitemap      # public/sitemap.xml: 118 URL
npm run build + npx tsc --noEmit
git push             # main = production
```

## Notes
- BMI result is not medical advice (disclaimer lives inside the component).
- Everything runs client-side; no server/DB.
- Domain `freetoolsy.com` intended; site currently lives on `freetoolsy.com` (all URLs updated).