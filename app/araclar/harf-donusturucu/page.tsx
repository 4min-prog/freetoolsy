import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import HarfDonusturucu from "@/components/tools/HarfDonusturucu";

export const metadata: Metadata = {
  title: "Harf Dönüştürücü — Ücretsiz Online Araç",
  description:
    "Metni büyük harfe, küçük harfe veya başlık biçimine tek tıkla çevirin. Harfleri ters düz edin ve sonucu anında kopyalayın.",
  alternates: { canonical: "/araclar/harf-donusturucu" },
};

export default function HarfDonusturucuPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-text">
          Ana sayfa
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <Link href="/#metin" className="transition-colors hover:text-text">
          Metin
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="text-text">Harf Dönüştürücü</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Harf Dönüştürücü — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Metin
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Metninizi büyük harfe, küçük harfe veya başlık biçimine çevirin; ister
        ters düz edin. Sonucu tek tıkla kopyalayın.
      </p>

<AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <HarfDonusturucu />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          Harf Dönüştürücü Nedir?
        </h2>
        <p className="mt-3">
          Harf Dönüştürücü, yapıştırdığınız metnin büyük/küçük harflerini
          istediğiniz biçime saniyeler içinde çeviren ücretsiz bir online
          araçtır. Metninizi üst kutuya yapıştırın, size uygun dönüştürme
          biçimini seçin ve sonucu tek tıkla kopyalayın. Birden fazla
          dönüştürme türü sayesinde başlıklar, özgeçmiş maddeleri ve sosyal
          medya gönderileri hızla biçimlendirilir.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Hangi dönüştürme türleri var?
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Büyük harf: Metnin tüm harflerini büyütür. Vurgu yapmak veya başlık
            etiketi gibi kullanmak için uygundur.
          </li>
          <li>
            Küçük harf: Metnin tüm harflerini küçültür; normal biçime döndürür.
          </li>
          <li>
            İlk Harf Büyük: Her kelimenin ilk harfini büyütür, geri kalanını
            küçültür. Makale ve blog başlıkları için idealdir.
          </li>
          <li>
            Ters Düz: Harflerin büyük/küçük durumunu tersine çevirir; örneğin
            kazayla CAPS LOCK açıkken yazılmış metni düzeltir.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Türkçe karakter desteği var mı?
        </h3>
        <p className="mt-3">
          Evet. Araç Türkçe karakterleri özel olarak işler; ç, ğ, ı, i, ö, ş, ü
          harfleri büyütüldüğünde Ç, Ğ, I, İ, Ö, Ş, Ü biçimine doğru şekilde
          dönüşür. Bu sayede özellikle Türkçe içerik üreten kullanıcılar için
          sonuçlar her zaman tutarlıdır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Ne zaman kullanılır?
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            CAPS LOCK açıkken kazayla yazılmış metinleri düzeltmek için.
          </li>
          <li>
            Başlık, altyazı ve özgeçmiş başlıklarını hızlıca biçimlendirmek
            için.
          </li>
          <li>
            Alıntıları veya sloganları büyük harfle vurgulamak için.
          </li>
          <li>
            Form alanları ve dosya adları gibi büyük/küçük harf duyarlı
            kısımları standartlaştırmak için.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Tüm dönüştürme işlemi tarayıcınızda yapılır; metniniz hiçbir
          sunucuya gönderilmez veya saklanmaz. Üyelik yok, kurulum yok,
          ücretsizdir.
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