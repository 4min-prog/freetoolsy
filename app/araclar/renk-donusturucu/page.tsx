import type { Metadata } from "next";
import Link from "next/link";
import ToolJsonLd from "@/components/ToolJsonLd";
import AdSlot from "@/components/AdSlot";
import RenkDonusturucu from "@/components/tools/RenkDonusturucu";

export const metadata: Metadata = {
  title: "Renk Dönüştürücü (HEX, RGB, HSL) — Ücretsiz Araç",
  description:
    "HEX, RGB ve HSL renk değerleri arasında anında dönüşüm yapın. Önizleme ile kontrol edin, tek tıkla kopyalayın. Ücretsiz ve verileriniz gönderilmez.",
  alternates: { canonical: "/araclar/renk-donusturucu" },
};

export default function RenkDonusturucuPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <ToolJsonLd slug="renk-donusturucu" />
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-text">
          Ana sayfa
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <Link href="/#gelistirici" className="transition-colors hover:text-text">
          Geliştirici
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="text-text">Renk Dönüştürücü</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Renk Dönüştürücü — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Geliştirici
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        HEX, RGB ve HSL gösterimleri arasında anında geçin; rengi
        önizlemede görün ve istediğiniz formatı tek tıkla kopyalayın.
      </p>

      <AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <RenkDonusturucu />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          Renk Dönüştürücü Nedir?
        </h2>
        <p className="mt-3">
          Renk Dönüştürücü; HEX, RGB ve HSL biçimlerindeki renk kodları
          arasında anında dönüşüm yapan ücretsiz bir web aracıdır. Web
          geliştiricileri tasarımlarını, mobil arayüzlerdeki renkleri ve
          grafik programlarındaki değerleri hizalamak için sürekli bu
          dönüşümlere ihtiyaç duyar. Bu araç rengi aynı anda önizlemenize ve
          istenen formatta kopyalamanıza olanak tanır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Renk formatları ne zaman kullanılır?
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            HEX: Web tasarımında standarttır, #RRGGBB biçiminde 6 haneli
            onaltılık gösterimdir.
          </li>
          <li>
            RGB: Ekranlar ve grafik yazılımları için 0-255 aralığındaki üç
            sayıdır; ayrıca kontrast hesabının temelidir.
          </li>
          <li>
            HSL: Renk tonu, doygunluk ve parlaklıkla ifade edildiği için
            &ldquo;daha açık&rdquo;, &ldquo;daha koyu&rdquo; gibi ayarlar doğal olarak yapılır.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Tüm dönüşümler tarayıcınızda gerçekleşir; renginiz hiçbir
          sunucuya gönderilmez. Ücret yok, üyelik yok, reklam filtreleme
          gerektirmeyen hızlı bir erişim.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Sık sorulan sorular
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            HEX koduna # işareti eklemeli miyim? İkisi de olur; araç # ile veya
            # olmadan 6 haneli değeri kabul eder.
          </li>
          <li>
            Hangi alanın değeri düzenlenirse geçerli olur? Son geçerli giriş
            uygulanır; geçersiz girişler mevcut rengi bozmaz.
          </li>
          <li>
            HSL yüzdeleri zorunlu mu? Evet; doygunluk ve parlaklık % sembolüyle
            yazılır.
          </li>
        </ul>
        <p className="mt-6">
          HTML&apos;den CSS&apos;e, Figma&apos;dan Photoshop&apos;a hangi ortamda
          olursanız olun doğru renk kodunu bulmanız saniyeler sürer. Rekabetçi
          projelerde renkleri bir formattan diğerine taşırken vakit kaybetmeyin.
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