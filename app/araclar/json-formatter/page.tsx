import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import JsonFormatter from "@/components/tools/JsonFormatter";

export const metadata: Metadata = {
  title: "JSON Formatter — Ücretsiz Online Araç",
  description:
    "JSON kodunuzu ücretsiz düzenleyin, sıkıştırın ve doğrulayın. Satır numaralı, renkli çıktı; geçersiz JSON'da kırmızı hata mesajı.",
  alternates: { canonical: "/araclar/json-formatter" },
};

export default function JsonFormatterPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
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
        <span className="text-text">JSON Formatter</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          JSON Formatter — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Geliştirici
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Ham JSON yapıştırın; okunaklı ve renklendirilmiş bir çıktı elde edin.
        Sıkıştırın, kopyalayın ya da temizleyin.
      </p>

<AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <JsonFormatter />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          JSON Formatter Nedir?
        </h2>
        <p className="mt-3">
          JSON Formatter, yapıştırdığınız ham JSON verisini biçimlendirilmiş,
          okunabilir bir yapıya dönüştüren ücretsiz bir online geliştirici
          aracıdır. Sol taraftaki alana JSON kodunuzu yapıştırın, Formatla
          düğmesine tıklayın; sağ tarafta girintiye göre düzenlenmiş, renk
          kodlu ve satır numaralı bir çıktı elde edersiniz. Sıkıştır seçeneği
          ise JSON&apos;u tek satıra indirerek boyutunu küçültür.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Neden JSON biçimlendirme önemli?
        </h3>
        <p className="mt-3">
          API&apos;lerden gelen JSON&apos;lar genellikle tek satır hâlinde ve okunması
          zor biçimde gelir. Nesne içinde nesne, dizi içinde dizi olduğunda
          hangi alanın hangi yapıya ait olduğunu anlamak zorlaşır. Formatla
          işlemi, her seviyeyi girintiyle ayırır, anahtarları değerlerden
          görsel olarak ayırır ve böylece hatayı ya da eksik alanı hızla fark
          edersiniz.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Hata ayıklama nasıl çalışır?
        </h3>
        <p className="mt-3">
          Geçersiz bir JSON yapıştırırsanız araç kırmızı bir hata mesajı
          gösterir. Tarayıcının JSON ayrıştırıcısı, hatanın yaklaşık konumunu
          ve nedenini (örneğin eksik virgül, yanlış tırnak veya fazla süslü
          parantez) bildirir. Böylece büyük bir veri içinde sorunun nerede
          olduğunu saniyeler içinde bulursunuz.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Hangi durumlarda kullanılır?
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            API yanıtlarını incelerken ve test ederken okunabilir hâle
            getirmek.
          </li>
          <li>
            Yapılandırma dosyalarını (<code className="rounded bg-surface-2 px-1 py-0.5">package.json</code>,{" "}
            <code className="rounded bg-surface-2 px-1 py-0.5">.json</code>) düzenlerken sözdizimini doğrulamak.
          </li>
          <li>
            Taşıma ve önbellekleme boyutunu azaltmak için JSON&apos;u sıkıştırmak.
          </li>
          <li>
            Kendi scriptlerinizi yazarken örnek veri üretmek ve kontrol etmek.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Tüm ayrıştırma ve biçimlendirme tamamen tarayıcınızda çalışır;
          JSON&apos;unuz herhangi bir sunucuya gönderilmez ya da kaydedilmez. API
          anahtarı veya kişisel veri içeren JSON&apos;ları bile güvenle
          biçimlendirebilirsiniz. Üyelik yok, kurulum yok; araç ücretsizdir.
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