import type { Metadata } from "next";
import Link from "next/link";
import ToolJsonLd from "@/components/ToolJsonLd";
import AdSlot from "@/components/AdSlot";
import UrlEncoder from "@/components/tools/UrlEncoder";

export const metadata: Metadata = {
  title: "URL Encoder/Decoder — Ücretsiz Online Araç",
  description:
    "Metni URL güvenli biçime kodlayın veya kodlanmış URL parametrelerini çözün. Türkçe karakter desteğiyle ücretsiz çevrimiçi araç.",
  alternates: { canonical: "/araclar/url-encoder" },
};

export default function UrlEncoderPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <ToolJsonLd slug="url-encoder" />
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
        <span className="text-text">URL Encoder/Decoder</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          URL Encoder/Decoder — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Geliştirici
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Metni URL güvenli biçime kodlayın ya da kodlanmış URL parametrelerini
        okunaklı hâle çevirin.
      </p>

<AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <UrlEncoder />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          URL Encoder/Decoder Nedir?
        </h2>
        <p className="mt-3">
          URL Encoder/Decoder, URL&apos;lerde kullanılamayan ya da anlamı
          değişen karakterleri güvenli biçime çeviren ve bu çeviriyi geri alan
          ücretsiz bir online geliştirici aracıdır. Kodlama (Encode), boşluk,
          Türkçe karakter, tırnak ve özel işaretler gibi karakterleri yüzde
          gösterimiyle (%20, %C3%A7 gibi) değiştirir; çözme (Decode) işlemi bu
          gösterimi tekrar özgün içeriğe dönüştürür.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          URL kodlama ne zaman gereklidir?
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Arama parametreleri: Boşluklu veya Türkçe karakterli arama
            ifadelerini bir sorguya (query string) eklerken.
          </li>
          <li>
            Form verisi gönderimi: Kullanıcıdan gelen metinleri GET isteklerine
            güvenle yerleştirirken.
          </li>
          <li>
            Link paylaşımı: &amp; ve + gibi karakterlerin URL içinde yanlış
            yorumlanmasını önlerken.
          </li>
          <li>
            Kod parçaları: JSON, HTML veya script içeriğini URL parametresi
            olarak taşırken.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Türkçe karakterler nasıl işlenir?
        </h3>
        <p className="mt-3">
          Araç, metni UTF-8 olarak kodlar. Böylece ç, ğ, ı, ö, ş, ü ve emoji
          gibi karakterler bozulmadan %C3%BC biçiminde yüzde gösterimine
          çevrilir; Decode işlemi de bu kodları eksiksiz Türkçe harflere geri
          getirir. Kodlamadan önce ya da sonra boşlukların + işaretine
          dönüştürülmesi gibi farklılıklar da otomatik olarak ele alınır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          encodeURIComponent ile neler değişir?
        </h3>
        <p className="mt-3">
          Bu araç, en sık ihtiyaç duyulan biçim olan ve parametre değerleri için
          önerilen kapsamlı kodlamayı (encodeURIComponent) kullanır. A-Z, a-z,
          0-9 ve birkaç işareti dışındaki her karakter yüzde gösterimine
          çevrilir; bu da sorgu parametrelerinizin tarayıcı ve sunucu
          tarafından her zaman aynı şekilde okunmasını sağlar.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Kodlama ve çözme tamamen tarayıcınızda gerçekleşir; girdiler
          herhangi bir sunucuya gönderilmez ya da kaydedilmez. Üyelik yok,
          kurulum yok; araç ücretsizdir.
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