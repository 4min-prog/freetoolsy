import type { Metadata } from "next";
import Link from "next/link";
import ToolJsonLd from "@/components/ToolJsonLd";
import AdSlot from "@/components/AdSlot";
import KelimeSayaci from "@/components/tools/KelimeSayaci";

export const metadata: Metadata = {
  title: "Kelime Sayacı — Ücretsiz Online Araç",
  description:
    "Metninizin kelime, karakter, cümle ve paragraf sayısını ücretsiz hesaplayın. Tahmini okuma süresi ve en çok kullanılan kelimeleri anında görün.",
  alternates: { canonical: "/araclar/kelime-sayaci" },
};

export default function KelimeSayaciPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <ToolJsonLd slug="kelime-sayaci" />
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
        <span className="text-text">Kelime Sayacı</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Kelime Sayacı — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Metin
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Metninizin kelime, karakter, cümle ve paragraf sayısını hesaplayın.
        Tahmini okuma süresini ve en sık kullanılan kelimeleri görün.
      </p>

<AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <KelimeSayaci />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          Kelime Sayacı Nedir?
        </h2>
        <p className="mt-3">
          Kelime Sayacı, yazdığınız veya yapıştırdığınız metnin kelime,
          karakter, cümle ve paragraf sayısını anında hesaplayan ücretsiz bir
          online araçtır. Aynı zamanda metninizi kaç dakikada okunacağını
          tahmin eder ve en çok kullandığınız kelimeleri sıralar. Böylece bir
          makale, ödev, blog yazısı veya özgeçmiş hazırlarken içeriğinizin
          hacmini ve tekrar eden kelimelerinizi tek ekranda görebilirsiniz.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Okuma süresi nasıl hesaplanır?
        </h3>
        <p className="mt-3">
          Araç, ortalama bir yetişkinin dakikada 200 kelime okuduğu varsayımını
          kullanır. Toplam kelime sayısını 200&apos;e bölerek tahmini okuma süresini
          dakika cinsinden yuvarlar. Blog yazarları ve editörler bu değeri,
          içeriklerinin kitleye hitap süresini öngörmek için kullanır; örneğin
          bir blog yazısının kaç dakikalık okuma gerektirdiğini makaleye
          ekleyebilirsiniz.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          En çok kullanılan kelimeler neden faydalı?
        </h3>
        <p className="mt-3">
          Sık tekrarlanan kelimeler listesi, metninizde hangi ifadelerin öne
          çıktığını gösterir. SEO açısından bir anahtar kelimeyi gereğinden
          fazla tekrarlamak istemiyorsanız bu liste size katkı sağlar. Ayrıca
          akademik denemelerde kelime zenginliğini kontrol etmek ve sürekli
          kullanılan kalıpları fark etmek için de pratiktir.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Kimler kullanabilir?
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Öğrenciler: Kelime sınırı olan ödev ve tezlerde hızlı kontrol.
          </li>
          <li>
            Blog yazarları: Yazı uzunluğunu ve okuma süresini ölçmek.
          </li>
          <li>
            SEO uzmanları: İçerik yoğunluğunu ve anahtar kelime tekrarını
            izlemek.
          </li>
          <li>
            Çevirmenler: Tercüme edilen metnin özgün metne oranını görmek.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Hesaplamaların tamamı tarayıcınızda yapılır; metniniz hiçbir
          sunucuya gönderilmez ya da saklanmaz. Üyelik gerektirmez ve
          tamamen ücretsizdir.
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