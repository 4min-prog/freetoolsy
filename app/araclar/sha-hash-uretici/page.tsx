import type { Metadata } from "next";
import Link from "next/link";
import ToolJsonLd from "@/components/ToolJsonLd";
import AdSlot from "@/components/AdSlot";
import ShaHashUretici from "@/components/tools/ShaHashUretici";

export const metadata: Metadata = {
  title: "SHA Hash Üretici — Ücretsiz Online Araç",
  description:
    "Metnin SHA-1, SHA-256 ve SHA-512 özetini tarayıcınızda hesaplayın. Verileriniz gönderilmez; sonucu tek tıkla kopyalayın.",
  alternates: { canonical: "/araclar/sha-hash-uretici" },
};

export default function ShaHashUreticiPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <ToolJsonLd slug="sha-hash-uretici" />
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-text">
          Ana sayfa
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <Link href="/#guvenlik" className="transition-colors hover:text-text">
          Güvenlik
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="text-text">SHA Hash Üretici</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          SHA Hash Üretici — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Güvenlik
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Bir metnin parmak izi sayılan SHA özetini hesaplayın. SHA-256
        bütünlük kontrolü, şifre doğrulama ve veri imzalama projelerinin
        vazgeçilmez adımıdır.
      </p>

      <AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <ShaHashUretici />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          SHA Hash Nedir?
        </h2>
        <p className="mt-3">
          SHA (Secure Hash Algorithm), herhangi bir uzunluktaki veriden sabit
          uzunlukta bir özet üreten tek yönlü bir kriptografik fonksiyondur. Bir
          kelime değiştiğinde özet tamamen değişir; aynı veri her zaman aynı
          özette sonuçlanır. Bu yüzden dosyanın doğru indirilip indirilmediğini
          kontrol etmek, şifrelerin veritabanında güvenli saklanması ve imza
          doğrulama gibi işlerde temel araçtır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          SHA-1, SHA-256 ve SHA-512 arasındaki fark
        </h3>
        <p className="mt-3">
          SHA-1 160 bit özet üretir ve 2005&apos;ten beri çarpışma saldırılarına
          karşı güvenli sayılmaz; yalnızca eski sistemlerle uyum için kullanılır.
          SHA-256 32 baytlık (64 karakterlik), SHA-512 ise 64 baytlık (128
          karakterlik) onaltılık özet verir. Yeni projeler ve imza şemaları için
          SHA-256 standart kabul edilir; yüksek güvenlik gereksinimlerinde
          SHA-512 tercih edilir.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Hesaplama, tarayıcınızın kripto kütüphanesiyle tamamen cihazınızda
          yapılır; metniniz hiçbir sunucuya gönderilmez. Özel anahtarlar, parolalar
          ve hassas veriler bu araçta güvenle özetlenir.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Sık sorulan sorular
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Hash&apos;ten özgün metne dönebilir miyim? Hayır, SHA tek yönlüdür;
            özeti okuyup metni geri üretemezsiniz.
          </li>
          <li>
            Aynı metin farklı zamanlarda farklı özet verir mi? Hayır, SHA
            belirleyicidir; aynı giriş hep aynı çıkışı verir.
          </li>
          <li>
            Hangi algoritmayı seçmeliyim? Çoğu durumda SHA-256 yeterli ve
            güvenlidir.
          </li>
        </ul>
        <p className="mt-6">
          Bir dosya indirme, sürüm kontrolü ya da kimlik doğrulama akışı üzerinde
          çalışıyorsanız özete ihtiyacınız vardır. Metninizi yapıştırın,
          algoritmayı seçin, özet anında elinizde.
        </p>
      </section>

      <p className="mt-10 text-center text-sm text-muted">
        Oluşturduğun içeriği paylaşmak için{" "}
        <a
          href="https://linkly.hub"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent transition-opacity hover:opacity-80"
        >
          linkly.hub
        </a>{" "}
        adresini dene
      </p>
    </main>
  );
}