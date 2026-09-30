# FreetoolsY

Günlük işler için ücretsiz online araçlar. 160 araç, 24 rehber, 7 kategori — üyelik yok, kurulum yok, hepsi tarayıcıda çalışır.

Domain: [freetoolsy.com](https://www.freetoolsy.com) · 399 statik sayfa · sitemap'te 392 URL

## Teknolojiler

- Next.js 14 (App Router, SSG)
- React 18, TypeScript
- Tailwind CSS (class dark mode)
- next-intl (EN/TR, `[locale]` segment)
- Resend (iletişim formu)
- next/og (`ImageResponse`) ile OG görselleri

## Geliştirme

```bash
npm install
npm run dev
```

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | `check:tools` + `next build` |
| `npm start` | Production sunucusu |
| `npm run lint` | ESLint |
| `npm run check:tools` | Araç/rehber/i18n tutarlılık denetimi (build'de otomatik çalışır) |
| `npm run indexnow` | Sitemap'i IndexNow'a gönderir |
| `node scripts/backlink-check.mjs` | Backlink araması (arama motoru bot koruması nedeniyle çoğu zaman boş döner) |

## Mimari

```
app/
  [locale]/                Tüm sayfalar yerelleştirilmiş segment altında
    page.tsx               Ana sayfa
    tools/[slug]/          Araç sayfaları (SSG)
    categories/[id]/       Kategori sayfaları (EN)
    kategoriler/[id]/      Kategori sayfaları (TR)
    rehber/[slug]/         Rehber sayfaları
    about, contact,
    privacy-policy/
  api/
    contact/route.ts       İletişim formu → Resend
    rates/route.ts         Döviz kurları (open.er-api.com, 1 saat cache)
  og/[slug]/route.ts       OG görselleri (1200×630) + /og/logo (512×512)
  icon.svg, favicon.ico    Site ikonu
  sitemap.ts               Statik sitemap

components/
  tools/                   160 araç bileşeni (client)
  Header, Footer, Logo,
  SearchBox, ToolIcon, ...

data/
  tools.ts                 Araç kayıtları (slug, name, category, description)
  guides.ts                24 rehber kaydı
  toolComponents.ts        Client registry — her sayfada tek araç yüklenir
  toolCompNamespaces.ts    Araç → i18n namespace eşlemesi
  dynamicTools.ts          5 dinamik import gerektiren ağır araç
  popular.ts, samples.ts

lib/
  paths.ts                 Merkezî URL kuralları (siteUrl, toolUrl, guidePath)
  canvasLimit.ts           16 MP canvas guard (tüm görsel araçlar)
  clipboard.ts             Güvenli pano yazma (izin reddi yakalanıyor)
  analytics.ts, ads.ts, consent.ts

messages/en.json, tr.json  Tüm arayüz metinleri
```

### Araç yükleme stratejisi

Araç sayfaları statiktir ve **sadece kendi aracının** JS'ini yükler. `data/toolComponents.ts` bir client registry'dir; `components/tools/ToolLoader.tsx` içinden dinamik import yapılır. `data/dynamicTools.ts` içindeki 5 araç (görsel/işlem yoğun) ayrıca chunk'a ayrılır.

Sonuç: Tool First Load JS **326 kB → 107 kB**, route size **164 kB → 8.7 kB**.

## Yeni araç ekleme

1. `data/tools.ts` içine kayıt: `slug`, `name`, `category`, `description`
2. `components/tools/<Name>.tsx` bileşenini yaz (client component)
3. `data/toolComponents.ts` registry'ye ekle
4. `messages/en.json` → `ToolMeta.<slug>` (name, title, pageDesc) ve `comp.<namespace>`
5. `messages/tr.json` → aynı anahtarlar
6. `npm run check:tools` çalıştır — eksik anahtar varsa yazar

## Ortam değişkenleri

`.env.local` (gitignore'da) ve Vercel'de tanımlı olmalı:

| Değişken | Değer |
|---|---|
| `RESEND_API_KEY` | Resend API anahtarı (Secret olarak işaretlenmeli) |
| `CONTACT_FROM` | `FreetoolsY <support@freetoolsy.com>` |
| `CONTACT_TO` | `support@freetoolsy.com` |
| `NEXT_PUBLIC_ADS_ENABLED` | AdSense açık/kapalı |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense client ID |

## E-posta

`support@freetoolsy.com` → Cloudflare Email Routing → Gmail'e iletilir. Gelen mail Resend üzerinden formdan gönderilir; SPF/DKIM kayıtları Resend tarafından yönetilir.

## Production

```bash
npm run build
npm start
```

Deploy: Vercel. DNS ve e-posta kayıtları Cloudflare'de.
