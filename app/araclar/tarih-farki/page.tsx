import type { Metadata } from "next";
import Link from "next/link";
import ToolJsonLd from "@/components/ToolJsonLd";
import AdSlot from "@/components/AdSlot";
import TarihFarki from "@/components/tools/TarihFarki";

export const metadata: Metadata = {
  title: "Tarih Farkı Hesaplama — Ücretsiz Online Araç",
  description:
    "İki tarih arasındaki yıl, ay, gün, saat ve hafta farkını anında hesaplayın. Ücretsiz, reklamsız ve tamamen tarayıcınızda çalışır.",
  alternates: { canonical: "/araclar/tarih-farki" },
};

export default function TarihFarkiPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <ToolJsonLd slug="tarih-farki" />
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
        <span className="text-text">Tarih Farkı</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Tarih Farkı Hesaplama — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Hesaplama
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Başlangıç ve bitiş tarihini seçin; aradaki yıl, ay, gün farkını ve
        toplam gün, hafta, saat, dakika karşılıklarını anında görün.
      </p>

      <AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <TarihFarki />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          Tarih Farkı Nedir?
        </h2>
        <p className="mt-3">
          Tarih Farkı, iki tarih arasındaki süreyi yıl, ay ve gün olarak
          ayrıştıran; aynı zamanda toplam gün, hafta, saat ve dakika cinsinden
          karşılığını gösteren ücretsiz bir hesaplama aracıdır. Doğum gününe
          kalan süre, taahhüt bitişi, kıdem hesaplama, vade takibi ve proje
          zaman çizelgeleri gibi senaryolarda zamandan tasarruf sağlar.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Sonuç nasıl yorumlanır?
        </h3>
        <p className="mt-3">
          Yıl/ay/gün dönüşümü, takvim ortalamalarına (yılın 365,2425 günü)
          dayanır; bu değerler tatmin edici bir &ldquo;kaç yıl, kaç ay&rdquo; perspektifi
          verir. Toplam gün ve saat ise kesindir ve sözleşme süresi gibi
          kesinlik gerektiren hesaplarda esas alınmalıdır. Artık yıllar dahil
          tüm günler tarayıcınızın takvimine göre hesaplanır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Hesaplama tamamen tarayıcınızda yapılır; tarihleriniz hiçbir
          sunucuya gönderilmez veya kaydedilmez. Üye olmadan, uygulama kurmadan
          ve ücret ödemeden kullanılır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Sık sorulan sorular
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Hangi tarih önce olursa olsun hesap yapılır mı? Evet, farkın mutlak
            değeri gösterilir; sıralama önemli değildir.
          </li>
          <li>
            Bugünün tarihi başlangıç olabilir mi? Evet, alanlar ön tanımlı
            olarak bugünü gösterir.
          </li>
          <li>
            Toplam saat gerçekçi mi? Evet, kesin gün sayısının 24 saatle
            çarpımıdır.
          </li>
        </ul>
        <p className="mt-6">
          İster bir geri sayım bekleyin, ister sözleşme tarihini doğrulayın;
          ihtiyacınız olan tüm zaman ölçüleri yukarıdaki kutuda. İki tarih seçin,
          sonucu saniyeler içinde görün.
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