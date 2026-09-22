import type { Metadata } from "next";
import Link from "next/link";
import ToolJsonLd from "@/components/ToolJsonLd";
import AdSlot from "@/components/AdSlot";
import YasHesaplayici from "@/components/tools/YasHesaplayici";

export const metadata: Metadata = {
  title: "Yaş Hesaplayıcı — Ücretsiz Online Araç",
  description:
    "Doğum tarihinizi girin; yaşınızı yıl, ay, gün, saat, dakika ve saniye cinsinden canlı olarak öğrenin. Sonraki doğum gününüze kaç gün kaldığını görün.",
  alternates: { canonical: "/araclar/yas-hesaplayici" },
};

export default function YasHesaplayiciPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <ToolJsonLd slug="yas-hesaplayici" />
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
        <span className="text-text">Yaş Hesaplayıcı</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Yaş Hesaplayıcı — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Hesaplama
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Doğum tarihinizi seçin; tam yaşınız yıl, ay, gün, saat, dakika ve saniye
        cinsinden canlı olarak gösterilsin.
      </p>

<AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <YasHesaplayici />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          Yaş Hesaplayıcı Nedir?
        </h2>
        <p className="mt-3">
          Yaş Hesaplayıcı, doğum tarihinize bakarak yaşınızı saniye hassasiyetiyle
          hesaplayan ücretsiz bir online araçtır. Doğum tarihinizi seçtiğinizde
          yaşınızın kaç yıl, kaç ay, kaç gün, kaç saat, kaç dakika ve kaç saniye
          olduğunu gösteren canlı bir sayaç başlar. Her saniye güncellenen bu
          sayaç, yaşınızı en ayrıntılı biçimde takip etmenizi sağlar.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Yaş neden saniye cinsinden hesaplanır?
        </h3>
        <p className="mt-3">
          İnsanlar genellikle yaşlarını yıl olarak ifade eder, ancak iki kişi aynı
          senede doğmuş olsa bile günlük farkları önemlidir. Bu araç yıl, ay ve
          günün yanı sıra saati, dakikayı ve saniyeyi de göstererek doğum
          anından şu ana kadar geçen tam süreyi ortaya koyar. Sayaç her saniye
          bir artarak yaşınızı gerçek zamanlı olarak canlı tutar.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Sonraki doğum günü bilgisi
        </h3>
        <p className="mt-3">
          Araç doğduğunuz günü esas alarak bir sonraki doğum gününüze kaç gün
          kaldığını da hesaplar. Böylece planlamalarınızı yapmak, kutlama
          hazırlıklarınızı organize etmek ve özel günleri kaçırmamak için
          ihtiyacınız olan bilgiyi tek ekranda bulursunuz.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Kimlere faydalıdır?
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Resmi işlemlerde yaşını tam yıl, ay ve gün olarak belgelemek isteyenler.
          </li>
          <li>
            Sigorta, emeklilik ve yaş sınırı hesaplamalarında kesin doğum günü
            kontrolü yapanlar.
          </li>
          <li>
            Yaşını saniye saniye görmeyi seven ve doğum günü takibi yapan
            herkes.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Hesaplama tamamen tarayıcınızda yapılır; doğum tarihiniz hiçbir
          sunucuya gönderilmez ya da kaydedilmez. Üyelik yok, kurulum yok; araç
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