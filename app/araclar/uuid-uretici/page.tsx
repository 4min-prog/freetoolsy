import type { Metadata } from "next";
import Link from "next/link";
import ToolJsonLd from "@/components/ToolJsonLd";
import AdSlot from "@/components/AdSlot";
import UuidUretici from "@/components/tools/UuidUretici";

export const metadata: Metadata = {
  title: "UUID Üretici (GUID) — Ücretsiz Online Araç",
  description:
    "Tek tıkla rastgele UUID v4 kimlikleri üretin; birden çok kimliği toplu kopyalayın. Kriptografik rastgelelik, verileriniz gönderilmez.",
  alternates: { canonical: "/araclar/uuid-uretici" },
};

export default function UuidUreticiPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <ToolJsonLd slug="uuid-uretici" />
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
        <span className="text-text">UUID Üretici</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          UUID Üretici — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Geliştirici
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Test verisi, veritabanı anahtarı veya kayıt kimliği için rastgele
        UUID v4 değerleri üretin. Birden çok değeri tek işlemde kopyalayın;
        paylaşın. Verileriniz tarayıcınızdan çıkmaz.
      </p>

      <AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <UuidUretici />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          UUID Nedir?
        </h2>
        <p className="mt-3">
          UUID (Evrensel Olarak Benzersiz Kimlik), 128 bitlik standart bir
          tanımlayıcıdır ve 36 karakterle (örn. 123e4567-e89b-12d3-a456-426614174000)
          yazılır. v4 sürümü,
          kimliği rastgele üretir; aynı değerin iki kez oluşma olasılığı
          pratikte imkânsızdır. Bu yüzden dağıtık sistemlerde, veritabanlarında
          ve API&apos;lerde sıralı anahtarlara göre çok daha güvenilirdir:
          kayıtlar birbirine çakışmadan üretilir.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Ne zaman kullanmalısınız?
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Veritabanı birincil anahtarları ve kayıt kimlikleri (ID).
          </li>
          <li>
            API istek izleme, oturum ve işlem numaraları (trace ID).
          </li>
          <li>
            Test verileri, form alanları ve geçici dosya isimleri.
          </li>
          <li>
            Birden fazla sunucunun aynı anda kayıt ürettiği uygulamalar.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Değerler, tarayıcınızın kriptografik rastgelelik kaynağıyla
          cihazınızda üretilir; hiçbir sunucuya gönderilmez. Üretilen kimlikler
          tamamen size aittir.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Sık sorulan sorular
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            UUID ve GUID aynı şey mi? Evet; GUID, Microsoft ekosisteminde
            UUID&apos;nin adlandırılmış biçimidir.
          </li>
          <li>
            Kimlikler değiştirilebilir mi? Her üretimde yeni rastgele değerler
            oluşur; ürettiğiniz liste kopyalayınca kalıcıdır.
          </li>
          <li>
            Kaç farklı değer üretebilirim? Üretici her tıklamada istediğiniz
            adet kadar yeni değer verir; sınır pratikte yoktur.
          </li>
        </ul>
        <p className="mt-6">
          Dağıtık bir sistem mi kuruyorsunuz, yoksa bir form testi mi? Göz
          kırpmadan benzersiz kimlikler üretin ve tek tıkla panoya alın. Zaman
          kaybetmeden geliştirmeye devam edin.
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