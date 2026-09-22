import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import KarakterSayaci from "@/components/tools/KarakterSayaci";

export const metadata: Metadata = {
  title: "Karakter Sayacı — Ücretsiz Online Araç",
  description:
    "Metninizin karakter sayısını boşluklu ve boşluksuz olarak anında hesaplayın. Kelime, satır ve cümle sayısını ücretsiz görün; verileriniz asla gönderilmez.",
  alternates: { canonical: "/araclar/karakter-sayaci" },
};

export default function KarakterSayaciPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
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
        <span className="text-text">Karakter Sayacı</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Karakter Sayacı — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Metin
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Metninizin karakter sayısını boşluklu ve boşluksuz olarak hesaplayın.
        Kelime, satır, cümle ve paragraf sayıları anında güncellenir.
      </p>

<AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <KarakterSayaci />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          Karakter Sayacı Nedir?
        </h2>
        <p className="mt-3">
          Karakter Sayacı, yazdığınız veya yapıştırdığınız metnin karakter
          sayısını boşluklu ve boşluksuz olarak anında hesaplayan ücretsiz bir
          online araçtır. Kelime, satır ve cümle sayısını da tek ekranda
          gösterir; böylece metninizin uzunluğunu saniyeler içinde öğrenirsiniz.
          Twitter/X ya da Instagram gönderileri, SMS, meta açıklama ve form
          alanları gibi karakter sınırı olan her yerde işinizi hızlandırır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Karakter sınırı nerede önemli?
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Sosyal medya: Twitter/X paylaşımları 280 karakterdir; Instagram
            biyografi alanı 150 karakterle sınırlıdır.
          </li>
          <li>
            SEO meta açıklaması: Google arama sonuçlarında görünen meta
            description genellikle 150-160 karakter arasında kaldığında en iyi
            sonucu verir.
          </li>
          <li>
            SMS: Bir SMS 160 karakter alır; mesajınızın kaç SMS harcayacağını
            karakter sayısıyla hızlıca hesaplayabilirsiniz.
          </li>
          <li>
            Ödev ve makaleler: Kelime ya da satır sınırı olan öğrenci
            ödevlerinde içeriğinizi kontrol etmek için pratiktir.
          </li>
          <li>
            Form alanları: Ad, soyad, e-posta gibi kısıtlı giriş alanlarında
            geçerli uzunlukta yazıp yazmadığınızı anında görürsünüz.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Boşluklu ve boşluksuz karakter arasındaki fark
        </h3>
        <p className="mt-3">
          Boşluklu karakter sayısı; sekme ve boşluk dahil her karakteri sayar.
          Boşluksuz karakter sayısı ise yalnızca harf, rakam ve noktalama
          işaretlerini dikkate alır. İki değer arasındaki fark, metninizde kaç
          boşluk olduğunu gösterir ve görsel düzeni hassas içeriklerde özellikle
          yardımcı olur. Örneğin bir başlık veya sloganın son karakterine kadar
          cetvelle hizalamak istediğinizde boşluksuz sayım daha kullanışlıdır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Bu araç tamamen tarayıcınızda çalışır; metniniz hiçbir sunucuya
          gönderilmez, yüklenmez veya kaydedilmez. Bu yüzden kod parçaları,
          kişisel notlar ve gizli metinler dahil her şeyi güvenle kontrol
          edebilirsiniz. Üye olmadan, uygulama kurmadan ve hiçbir ücret
          ödemeden kullanılır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Sık sorulan sorular
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Boşluksuz karakter ne demek? Metindeki boşlukların sayılmadığı
            karakter sayısıdır.
          </li>
          <li>
            Araç mobilde çalışır mı? Evet, tüm cihazlarda tarayıcı üzerinden
            çalışır.
          </li>
          <li>
            Verilerim kaydediliyor mu? Hayır, tüm işlem cihazınızda yapılır.
          </li>
        </ul>
        <p className="mt-6">
          Öğrenci, editör, SEO uzmanı ya da sosyal medya yöneticisi olun; metin
          uzunluğunu doğrulamak için ihtiyacınız olan tüm ölçümler yukarıdaki
          kutuda. Metninizi yapıştırın, sayımı anında görün.
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