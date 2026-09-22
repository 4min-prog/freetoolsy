import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import BmiHesaplayici from "@/components/tools/BmiHesaplayici";

export const metadata: Metadata = {
  title: "BMI Hesaplayıcı — Ücretsiz Online Araç",
  description:
    "Boy ve kilonuza göre vücut kitle indeksinizi hesaplayın; renkli gösterge çubuğu ve BMI skalası tablosuyla kategorinizi anında öğrenin.",
  alternates: { canonical: "/araclar/bmi-hesaplayici" },
};

export default function BmiHesaplayiciPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
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
        <span className="text-text">BMI Hesaplayıcı</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          BMI Hesaplayıcı — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Hesaplama
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Boy ve kilonuzu girin; vücut kitle indeksinizi ve kategorinizi hesaplayın.
        Sonuç renkli bir gösterge çubuğuyla sunulur.
      </p>

<AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <BmiHesaplayici />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          BMI Hesaplayıcı Nedir?
        </h2>
        <p className="mt-3">
          BMI Hesaplayıcı, boy ve kilo bilgilerinize dayanarak vücut kitle
          indeksinizi (Body Mass Index) ücretsiz olarak hesaplayan online bir
          araçtır. Boyunuzu santimetre, kilonuzu kilogram olarak girin ve Hesapla
          düğmesine basın. Araç, kilonuzu boyunuzun metre cinsinden karesine
          bölerek BMI değerinizi çıkarır ve sonucu düşük kilo, normal kilo, fazla
          kilo veya obezite kategorilerinden biriyle birlikte gösterir.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          BMI nasıl hesaplanır?
        </h3>
        <p className="mt-3">
          BMI, kilonun (kg) boyun metre cinsinden karesine bölünmesiyle bulunur.
          Örneğin 70 kilogram ağırlığında ve 1,75 metre boyunda bir kişinin BMI
          değeri 70 ÷ (1,75 × 1,75) ≈ 22,9 olur ve normal kilo aralığına karşılık
          gelir. Dünya Sağlık Örgütü&apos;ne göre 18,5 altı düşük kilo, 18,5-25
          arası normal, 25-30 arası fazla kilo ve 30 üzeri obezite kabul edilir.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Renkli gösterge ve skala tablosu
        </h3>
        <p className="mt-3">
          Sonucunuz, bir uçtan diğerine düşük kilodan obeziteye uzanan renkli bir
          çubuk üzerinde işaretlenir; böylece kategorinizi tek bakışta görürsünüz.
          Aracın altındaki BMI skalası tablosu ise tüm aralıkları ve
          kategorileri ayrıntılı biçimde listeler, güncel kategoriniz otomatik
          vurgulanır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          BMI ne kadar güvenilirdir?
        </h3>
        <p className="mt-3">
          BMI, kitle sağlığını izlemek için pratik bir göstergedir ancak bir tıbbi
          tanı aracı değildir. Kas kütlesi fazla olan bireylerde, yaşlılarda,
          çocuklarda ve hamilelerde tek başına yanıltıcı olabilir. Bu yüzden
          sonuçları yalnızca bilgilendirme amaçlı kullanın; herhangi bir sağlık
          endişeniz için hekiminize danışın.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Tüm hesaplama tarayıcınızda yapılır; boy ve kilo bilgileriniz
          hiçbir sunucuya gönderilmez ya da saklanmaz. Üyelik yok, kurulum yok;
          araç tamamen ücretsizdir.
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