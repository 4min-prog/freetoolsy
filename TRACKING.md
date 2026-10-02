# Tracking File — FreetoolsY

This file tracks where the project stands. Whenever a working session ends, update the **Status** section at the top.

## Status
**Güncelleme (Sep 27, 2026):** Tanıtım/bilinirlik planı başladı. Araç ekleme bitti (kullanıcı kararı) — bundan sonra hedef tanınma. İçerik leverninde otonom işler (rehber, iç link) asistan tarafı; hesap gerektirenler (GSC/Bing/sosyal/AdSense env) kullanıcıya ait checklist aşağıda.

Çalışma şubesi **`main` = Vercel production** (hero-iyilestirme main'e merge edildi). Push hep `origin main`'e.

### Mevcut durum (doğrulanmış)
- **160 araç** — veri `data/tools.ts`; kayıt `components/tools/*.tsx` + `toolComponents.ts` + `toolCompNamespaces.ts` + `ToolIcon.tsx`. `npm run check:tools` tutarlılık kontrolü (`npm run build` bunu otomatik çalıştırır).
- **24 rehber** — `data/guides.ts`. `relatedTools` ile araç ↔ rehber çift yönlü iç link otomatik; sitemap'e otomatik dahil.
- **URL yapısı:** EN `/tools/[slug]`, TR `/tr/tools/[slug]`; kategori EN `/categories/[id]`, TR `/tr/kategoriler/[id]`; rehber EN `/rehber/[slug]`, TR `/tr/rehber/[slug]`. `lib/paths.ts` tek kaynak — elle string kurma. Route'lar `app/[locale]/tools/[slug]` ve `app/[locale]/rehber/[slug]`. (`araclar` yok — eski TR path kaldırıldı.)
- **Sitemap:** build-time `app/sitemap.ts` (otomatik, `revalidate = 86400`). `public/sitemap.xml` YOK — oraya yazma. Güncel sayı `/sitemap.xml`'den okunur; rehber ekleyince site otomatik yeniden üretir.
- **SEO:** JSON-LD (WebSite, SoftwareApplication, FAQPage, BreadcrumbList), hreflang+canonical her sayfada, AdSense sabit script `ca-pub-8880626756482815` (slotlar env-gated), GA `G-6J6JB9SHKZ` + GoatCounter body lazyOnload, favicon v2, canlı kur API'si (`app/api/rates/route.ts`).
- **Sayı politikası:** `displayToolCount` her yerde **"150+"** döndürür (hero/OG "150+ tools · no signup"). Yalnızca ToolExplorer "All tools" sekmesi gerçek sayıyı gösterir (`tools.length` = 160).
- **Footer:** e-posta/abone okuru **eklenmedi** (kullanıcı kararı — kapalı konu).

### Kritik kurallar
- **Yazım/encode:** Türkçe içerik SADECE Write/Edit/node (UTF-8). PowerShell ile yazma — bozulur.
- **Build/verify:** önce node'ları öldür (3000/3100), stale `.next`'i sil (arızalı build kalıntısı "Cannot find module for page: /_document" hatası yapar), `npm run build`, sonra `npx tsc --noEmit`. Yayın öncesi: `npx next start -p 3100` + URL 200 + OG PNG (ham buffer magic `89504e47` ile, dize kontrolü false verir) + sitemap sayısı. Push sonrası `npm run indexnow` (sitemap listesi; son: 392 URL → 200).
- **ES5 target tuzakları:** `\u`/`\p{}` regex yok (TS1501), `matchAll(...)` spread yok, BigInt literal yok, `key.buffer as ArrayBuffer` cast gerekir. ICU güvenliği: message string'lerinde `<tag>` asla (UNCLOSED_TAG).
- **Kod yorumu yasak** (proje kuralı). `freetoolsy_logo_v3.svg` untracked, dokunma.
- **Dokunulacak dosyalar (commit çakışması):** `messages/en.json`, `messages/tr.json` (en/tr blok sayıları SENKRON olmalı), `data/tools.ts`, `data/guides.ts`, `app/api/rates/`, `app/sitemap.ts`, `app/[locale]/layout.tsx`.

### Tanıtım (Promosyon) checklist
**Asistan run book (her içerik turu sonrası):** tsc → temiz build → local 3100'de URL/OG/sitemap kontrolü → Türkçe commit → push → `npm run indexnow`.

**Kullanıcıya ait (hesap gerektirir, asistan yapamaz):**
1. Google Search Console: www.freetoolsy.com doğrula → sitemap `https://www.freetoolsy.com/sitemap.xml` gönder; indexleme 1-3 gün.
2. Bing Webmaster Tools: aynı sitemap (GSC'dan içe aktarma daha hızlı).
3. Yeni rehberler için gerekirse URL Denetimi → "İndekslenmesini İsten".
4. AdSense slot env'leri Vercel'e: `NEXT_PUBLIC_ADS_ENABLED=true` + `NEXT_PUBLIC_ADS_SLOT_TOP`/`BOTTOM` (onay sonrası).
5. Sosyal/forum/dizin paylaşımları (Product Hunt, Reddit, İngilizce/Türkçe topluluklar) — tanıtım içerikleri.
6. Backlink planı: araç listesi koleksiyonları, dizin siteleri, "tool collection" yazıları.

### Bu turda yayınlananlar
- `5d769d1`: 16 yeni araç (emoji-remover, reading-time-calculator, totp-generator, url-parser, js-minifier, mime-type-finder, percentage-change-calculator, fuel-economy-calculator, electricity-cost-calculator, calories-burned-calculator, image-combiner, image-flipper, sitemap-url-extractor, joke-generator, random-quote-generator, guess-the-number) → 160 araç; sitemap 380; IndexNow 380→200.
- `a98a18e`: displayToolCount "100+" + ToolExplorer gerçek sayı; ThemeToggle büyük toggle switch.

### Bekleyen / isteğe bağlı
- Rehber/araç eklemek yerine tanıtıma odaklan (kullanıcı kararı). Yeni içerik turları asistan planlar.
- Gerekirse kategori sayfalarına açıklama metni, döviz sayfası canlı kontrolü.

## Done
- [x] Next.js 14 App Router + TypeScript + Tailwind scaffold
- [x] Inter font (latin-ext, full Turkish support)
- [x] Class-based dark mode + ThemeToggle + FOUC prevention script
- [x] `data/tools.ts`: 18 tools, 4 categories, helper functions
- [x] Home page: SEO hero + live-search tool explorer grouped by category with icons and counts
- [x] `app/[locale]/tools/[slug]/page.tsx`: SSG, generateMetadata, 404, breadcrumb (eski `app/araclar` yolu kaldırıldı; legacy `araclar` → `tools` 301 yönlendirmesi middleware'de)
- [x] 44 working tools (client components) — see Status list
- [x] SEO pages for every tool via the consolidated `app/[locale]/tools/[slug]/page.tsx` (own H1, meta, ad slot, localized SEO copy)
- [x] JSON-LD structured data (WebSite, SoftwareApplication per tool, FAQ, Organization, ContactPage) — Rich Results validated
- [x] `app/[locale]/not-found.tsx` (klasör düzeyinde; `dynamicParams = false` yüzünden Next'in global 404'ü devreye girer)
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

## Adding a new tool (standard workflow — aktif değil, "araç ekleme bitti")
1. `data/tools.ts` — `tools` dizisine giriş (`slug` küçük harf, tireli)
2. `components/tools/Xxx.tsx` — `"use client"` bileşen (etiketler `useTranslations("comp.*")`)
3. Kayıt: `app/[locale]/tools/[slug]/page.tsx` `toolComponents` map + `toolCompNamespaces.ts` + `ToolIcon.tsx` import + `data/tools.ts` (URL'i elle yazma, `lib/paths.ts`'i kullan)
4. İçerik: `messages/en.json` + `messages/tr.json` — `ToolMeta.<slug>`, `ToolPage` ve `ToolContent.<slug>` (en/tr blok sayıları AYNI olmalı — 5 blok hedef)
5. Doğrula: `npm run build` (check:tools dahil) && `npx tsc --noEmit`; sitemap otomatik

## Install / commands
```bash
npm install
npm run dev          # http://localhost:3000  (build öncesi durdur, .next çekişmesini önlemek için)
npm run build        # check:tools içerir
npx tsc --noEmit
npx next start -p 3100   # yayın öncesi URL/OG/sitemap doğrulaması
npm run indexnow     # push sonrası URL bildirimi (sitemap listesi)
git push             # main = production
```

## Notes
- BMI result is not medical advice (disclaimer lives inside the component).
- Everything runs client-side; no server/DB.
- Domain `freetoolsy.com` intended; site lives on `www.freetoolsy.com` (Vercel 308 bare→www). Canonical host for SEO must stay `https://www.freetoolsy.com` (paths.ts `siteUrl`). If Vercel is flipped to serve bare, revert all `www.freetoolsy.com` references.