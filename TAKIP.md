# Takip Dosyası — FreetoolsY

Bu dosya projenin nerede kaldığını gösterir. Her çalışma oturumunda en üstteki **Durum** bölümünü güncelle.

## Durum
**Son oturum:** Başlangıç (22 Eylül 2026)
- Site tamamlandı, `npm run build` geçti, GitHub'a push edildi (main → 4min-prog/freetoolsy).
- Sırada kalan iş: yeni araç ekleme, SEO/sitemap, deployment.
- Teknik borç yok.

## Yapılanlar
- [x] Next.js 14 App Router + TypeScript + Tailwind scaffold
- [x] Inter fontu (latin-ext, ciddi Türkçe desteği)
- [x] Class tabanlı dark mode + ThemeToggle + FOUC önleme scripti
- [x] `data/tools.ts`: 5 araç, 4 kategori, helper fonksiyonlar
- [x] Ana sayfa: kategorilere göre araç kartları
- [x] `app/araclar/[slug]/page.tsx`: SSG, generateMetadata, 404, breadcrumb
- [x] Çalışan 5 araç (client components): karakter/kelime sayacı, şifre üretici, JSON formatter, BMI
- [x] `app/not-found.tsx` (TR)
- [x] Build hatasız, 10 statik sayfa üretildi

## Tasarım kararları (kural — bozma)
- Arka plan: açık `#F5F6F8`, koyu `#15161A` (asla tam siyah/beyaz, asla `#0B0B0B`)
- Primary accent: açık `#2563EB`, koyu `#60A5FA` (WCAG AA kontrol edildi)
- Font: sadece Inter. Radius/gölgeler kasıtlı çeşitlendirildi (`rounded-xl` kart, `rounded-lg` input).
- Yasaklar: ALL CAPS başlık etiketi, "→" her yere, krem/terracotta, her karta aynı gölge.
- Renk tokenları `app/globals.css` içindeki CSS değişkenlerinde tanımlı; Tailwind map'i `tailwind.config.ts`.

## Yeni araç ekleme (standart iş akışı)
1. `data/tools.ts` — `tools` dizisine kayıt ekle (`slug` küçük harf, tireyle)
2. `components/tools/Xxx.tsx` — `"use client"` bileşen yaz
3. `app/araclar/[slug]/page.tsx` — import + `toolComponents` map'ine ekle
4. `npm run build` ile doğrula

## Kurulum / komutlar
```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run lint
git push             # main
```

## Notlar
- BMI sonucu sağlık beyanı değildir (bilgilendirme metni bileşenin içinde).
- Değerler yalnızca istemcide işleniyor; servis/DB yok.
- Domain `freetoolsy.com` metadata'da `metadataBase` ve canonical/OG olarak tanımlı (ilk deployment sonrası gözden geçir).