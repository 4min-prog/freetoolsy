# FreetoolsY

Günlük işler için sade online araçlar. Metin, güvenlik, geliştirici ve hesaplama araçları — üyelik yok, kurulum yok, hepsi tarayıcıda çalışır.

Domain: [freetoolsy.com](https://www.freetoolsy.com)

## Teknolojiler

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS (class dark mode)
- Google Fonts — Inter

## Geliştirme

```bash
npm install
npm run dev
```

## Yapı

```
app/
  page.tsx                Ana sayfa (kategorilere göre araç listesi)
  araclar/[slug]/page.tsx Araç sayfaları (statik, SSG)
components/
  Header.tsx, Footer.tsx, ToolCard.tsx, ThemeToggle.tsx
  tools/                  Araç uygulamaları (client components)
data/tools.ts             Araç verileri
```

Yeni araç eklemek için `data/tools.ts` içine bir kayıt, `components/tools/` altına da bileşeni ekleyip `app/araclar/[slug]/page.tsx` içindeki eşleştirmeye eklemeniz yeterlidir.

## Production

```bash
npm run build
npm start
```