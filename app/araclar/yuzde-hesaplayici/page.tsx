import type { Metadata } from "next";
import Link from "next/link";
import ToolJsonLd from "@/components/ToolJsonLd";
import AdSlot from "@/components/AdSlot";
import YuzdeHesaplayici from "@/components/tools/YuzdeHesaplayici";

export const metadata: Metadata = {
  title: "Yüzde Hesaplayıcı — Ücretsiz Online Araç",
  description:
    "Sayının yüzdesini, iki sayı arasındaki yüzde değişimini ve bütünün yüzdesini tek araçta hesaplayın. 3 mod, tab ile kolay geçiş.",
  alternates: { canonical: "/araclar/yuzde-hesaplayici" },
};

export default function YuzdeHesaplayiciPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <ToolJsonLd slug="yuzde-hesaplayici" />
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
        <span className="text-text">Yüzde Hesaplayıcı</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Yüzde Hesaplayıcı — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Hesaplama
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Sayının yüzdesini, yüzde değişimini ve bütünün yüzdesini hesaplayın.
        Sekmeler arasında geçiş yaparak üç modu da kesintisiz kullanın.
      </p>

<AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <YuzdeHesaplayici />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          Yüzde Hesaplayıcı Nedir?
        </h2>
        <p className="mt-3">
          Yüzde Hesaplayıcı, en sık ihtiyaç duyulan üç yüzde işlemini tek
          ekranda çözen ücretsiz bir online araçtır. Sekmeler arasında geçiş
          yaparak bir sayının yüzdesini hesaplar, iki değer arasındaki yüzde
          değişimini bulur ve bir değerin bütün içindeki payını oran olarak
          gösterir. Tüm sonuçlar değerleri yazdıkça anında güncellenir.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Hangi işlemler var?
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Sayının yüzdesi: Bir sayı ve oran girerek sonucu bulursunuz; örneğin
            100&apos;ün %20&apos;si 20&apos;dir.
          </li>
          <li>
            Yüzde değişimi: Başlangıç ve son değeri girerek farkın yüzde kaç
            olduğunu öğrenirsiniz; örneğin 80&apos;den 100&apos;e artış %25 olur.
          </li>
          <li>
            Bütünün yüzdesi: Bir parçanın bütün içinde yüzde kaç olduğunu
            görürsünüz; örneğin 20, 100&apos;ün %20&apos;sidir.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Nerede kullanılır?
        </h3>
        <p className="mt-3">
          İndirim ve zam oranlarını hesaplarken alışverişlerde, sınav başarı
          oranı ve anket sonuçlarını yorumlarken eğitimde, satış ve kâr
          değişimlerini takip ederken iş dünyasında ve bütçe dağılımlarını
          planlarken günlük hayatta sıkça kullanılır. Araç, virgüllü sayıları da
          destekler; değerlerin etiket ve birimini elle ekleyebilirsiniz.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Program hakkında bilgi
        </h3>
        <p className="mt-3">
          Hesaplamalar tamamen tarayıcınızda yapılır; girdileriniz hiçbir
          sunucuya gönderilmez ya da saklanmaz, üyelik ve kurulum gerektirmez.
          Ayrıca Değişim modunda artış ve azalışlar renk kodlu olarak
          işaretlenir, böylece sonucu anında doğru yorumlarsınız.
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