import type { Metadata } from "next";
import Link from "next/link";
import ToolJsonLd from "@/components/ToolJsonLd";
import AdSlot from "@/components/AdSlot";
import QrKodOlusturucu from "@/components/tools/QrKodOlusturucu";

export const metadata: Metadata = {
  title: "QR Kod Oluşturucu — Ücretsiz Online Araç",
  description:
    "Metni veya bağlantıyı anında QR koda dönüştürün. Ücretsiz ve reklamsız; PNG olarak indirin. Verileriniz tarayıcınızdan asla çıkmaz.",
  alternates: { canonical: "/araclar/qr-kod-olusturucu" },
};

export default function QrKodOlusturucuPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <ToolJsonLd slug="qr-kod-olusturucu" />
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
        <span className="text-text">QR Kod Oluşturucu</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          QR Kod Oluşturucu — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Geliştirici
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Yazdığınız metni veya bağlantıyı saniyeler içinde QR koda
        dönüştürün. Kodu PNG görsel olarak indirebilir, menülere,
        banner&apos;lara veya ürün etiketlerine yerleştirebilirsiniz.
      </p>

      <AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <QrKodOlusturucu />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          QR Kod Oluşturucu Nedir?
        </h2>
        <p className="mt-3">
          QR Kod Oluşturucu, bir metni ya da internet adresini kare şeklindeki
          taranabilir bir QR koda çeviren ücretsiz bir online araçtır. Telefonlardaki
          kamera uygulamaları bu kodu okuduğunda içindeki bilgiye anında ulaşılır;
          böylece uzun bağlantılar yazmadan paylaşılır. Restoran menüsü, kartvizit,
          Wi-Fi yönlendirme, etkinlik bileti ve ürün ambalajı gibi pek çok alanda
          kullanılır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Nelere dikkat etmelisiniz?
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Kodun içine koyduğunuz metin telefon ekranında 500 karakterle
            sınırlıdır; uzun bağlantılar için kısa URL hizmeti kullanın.
          </li>
          <li>
            Yazdıracağınız kodlar küçük boyutlarda bozulabilir; en az 2 cm
            genişliğinde ve yüksek kontrastlı basın.
          </li>
          <li>
            Tarama kalitesini artırmak için koyu modülleri açık zemin üzerinde
            koruyun; ters renkler bazı okuyucularda sorun çıkarır.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Kod tamamen tarayıcınızda üretilir; yazdığınız metin hiçbir
          sunucuya gönderilmez veya kaydedilmez. Kişisel bağlantılarınızı,
          notlarınızı ve iş bilgilerinizi gönül rahatlığıyla QR koda
          çevirebilirsiniz.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Sık sorulan sorular
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            QR kod nasıl okutulur? Telefonunuzun kamera uygulamasını koda tutmanız
            yeterlidir.
          </li>
          <li>
            Kodun süresi var mı? Hayır, üretilen kod kalıcıdır ve süresi
            dolmaz.
          </li>
          <li>
            İndirilen PNG&apos;yi yazdırabilir miyim? Evet, yüksek çözünürlüklü
            PNG her ortamda basılabilir.
          </li>
        </ul>
        <p className="mt-6">
          Menüye, afişe, kartvizite veya sunuma eklemek üzere profesyonel
          görünümlü bir QR kod şimdi bir yazışma uzaklığında. Metninizi girin,
          kodu indirin, işinize devam edin.
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