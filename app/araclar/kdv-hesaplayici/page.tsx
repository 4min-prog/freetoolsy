import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import KdvHesaplayici from "@/components/tools/KdvHesaplayici";

export const metadata: Metadata = {
  title: "KDV Hesaplayıcı — Ücretsiz Online Araç",
  description:
    "Tutar ve KDV oranı seçin (%1, %8, %10, %18, %20); KDV tutarını ve toplam tutarı anında hesaplayın. KDV dahil veya hariç seçeneğiyle ücretsiz.",
  alternates: { canonical: "/araclar/kdv-hesaplayici" },
};

export default function KdvHesaplayiciPage() {
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
        <span className="text-text">KDV Hesaplayıcı</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          KDV Hesaplayıcı — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Hesaplama
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Tutarı ve KDV oranını seçin; KDV tutarı ile toplam tutar anında
        hesaplansın. KDV dahil veya hariç fiyatlar için çalışır.
      </p>

<AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <KdvHesaplayici />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          KDV Hesaplayıcı Nedir?
        </h2>
        <p className="mt-3">
          KDV Hesaplayıcı, bir tutar üzerinden katma değer vergisini (KDV) ve
          vergi dahil toplam fiyatı anında hesaplayan ücretsiz bir online araçtır.
          Ürün veya hizmet bedelini girin, uygulanan KDV oranını seçin ve sonucu
          görün. Araç %, %1, %8, %10, %18 ve %20 oranlarını destekler; isterseniz
          tutarın KDV dahil mi yoksa KDV hariç mi olduğunu da belirleyebilirsiniz.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          KDV dahil ve hariç arasındaki fark
        </h3>
        <p className="mt-3">
          KDV hariç seçeneğinde girilen tutar vergisiz bedeldir; araç vergiyi
          ekleyerek toplamı bulur. KDV dahil seçeneğinde ise girilen tutar zaten
          vergiyle birlikte fiyattır; araç içindeki vergiyi ayırıp net (matrah)
          tutarı ve KDV miktarını gösterir. Bu, fatura ve teklif hazırlarken doğru
          rakamları hızlıca yakalamanıza yardımcı olur.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Hangi oranlar kullanılır?
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            %1: Temel gıda, ekmek gibi indirimli kademeye tabi ürünler.
          </li>
          <li>
            %8 ve %10: Birçok hizmet, kitap ve gıda ürününde uygulanan ara
            kademeler.
          </li>
          <li>
            %18 ve %20: Genel mal ve hizmet satışlarında geçerli standart oranlar.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Kimlere faydalıdır?
        </h3>
        <p className="mt-3">
          Fiyat listesi hazırlayan küçük işletmeler, fatura keserken tutarı hızlı
          doğrulamak isteyen muhasebeciler, etiketteki fiyatın KDV&apos;sini merak
          eden tüketiciler ve ticaretle uğraşan öğrenciler için pratiktir. Hesaplama
          tamamen tarayıcınızda yapıldığından tutarlarınız hiçbir yere gönderilmez,
          üyelik ve kurulum gerektirmez; araç ücretsizdir.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Sonuç doğru mu?
        </h3>
        <p className="mt-3">
          Evet. Sonuçlar, vergi mevzuatındaki standart formüllerle kuruş
          hassasiyetinde hesaplanır ve Türkçe ondalık biçimde gösterilir. Farklı
          oran ve tip kombinasyonları için sonuçlar her zaman güncellenir ve siz
          yazdıkça anlık olarak yeniden hesaplanır.
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