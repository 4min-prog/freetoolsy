import type { Metadata } from "next";
import Link from "next/link";
import ToolJsonLd from "@/components/ToolJsonLd";
import AdSlot from "@/components/AdSlot";
import BirimDonusturucu from "@/components/tools/BirimDonusturucu";

export const metadata: Metadata = {
  title: "Birim Dönüştürücü — Ücretsiz Online Araç",
  description:
    "Uzunluk, ağırlık, hacim, alan ve sıcaklık birimleri arasında anında dönüşüm yapın. Ücretsiz ve reklamsız; sonucu tek tıkla kopyalayın.",
  alternates: { canonical: "/araclar/birim-donusturucu" },
};

export default function BirimDonusturucuPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <ToolJsonLd slug="birim-donusturucu" />
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-text">
          Ana sayfa
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <Link href="/#hesaplama" className="transition-colors hover:text-text">
          Hesaplama
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="text-text">Birim Dönüştürücü</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Birim Dönüştürücü — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Hesaplama
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Uzunluk, ağırlık, hacim, alan ve sıcaklık kategorilerinde birimler
        arasında anında dönüşüm yapın. Kaynak ve hedef birimi tek tıkla
        değiştirin.
      </p>

      <AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <BirimDonusturucu />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          Birim Dönüştürücü Nedir?
        </h2>
        <p className="mt-3">
          Birim Dönüştürücü; uzunluk, ağırlık, hacim, alan ve sıcaklık
          ölçülerini bir birimden diğerine taşıyan ücretsiz bir hesaplama
          aracıdır. Santimetreden ince, kilogramdan pound&apos;a, Santigrattan
          Fahrenhayt&apos;a kadar yüzlerce günlük dönüşümü tek ekranda çözer.
          Tariflerden matematik ödevlerine, mühendislik hesaplarından alışverişe
          kadar her yerde işe yarar.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Hangi dönüşümler destekleniyor?
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Uzunluk: milimetre, santimetre, metre, kilometre, inç, fit, yarda ve
            mil.
          </li>
          <li>
            Ağırlık: miligram, gram, kilogram, ton, ons ve pound.
          </li>
          <li>
            Hacim: mililitre, santilitre, desilitre, litre, metreküp ve galon
            (ABD).
          </li>
          <li>
            Alan: milimetrekare, santimetrekare, metrekare, hektar, kilometrekare
            ve acre.
          </li>
          <li>
            Sıcaklık: Santigrat, Fahrenhayt ve Kelvin.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Tüm hesaplamalar tarayıcınızda yapılır; değerleriniz hiçbir
          sunucuya gönderilmez veya kaydedilmez. Ücretsizdir, üyelik gerektirmez.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Sık sorulan sorular
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Veri girişinde ayırıcı olarak ne kullanabilirim? Hem virgül hem nokta kabul
            edilir (örn. 1,5 veya 1.5).
          </li>
          <li>
            Sonuçta kayan nokta hataları olur mu? Sonuçlar altı basamağa
            yuvarlanır; pratikte ölçümler için yeterli hassasiyettedir.
          </li>
          <li>
            Yeni birim eklenebilir mi? Şu an en çok kullanılan beş kategori
            destekleniyor; talep üzerine kategoriler genişletilebilir.
          </li>
        </ul>
        <p className="mt-6">
          Okul, iş veya günlük yaşamda ölçüler bir ülkeden diğerine taşındığında
          hata yapmanın bedeli büyük olabilir. Doğru sonucu saniyeler içinde
          alın, değeri kopyalayın ve devam edin.
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