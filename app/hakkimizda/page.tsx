import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "FreetoolsY hakkında: günlük hayatta işinizi kolaylaştıran ücretsiz, reklam destekli ve veri göndermeyen çevrimiçi araçlar üretiyoruz.",
  alternates: { canonical: "/hakkimizda" },
};

export default function HakkimizdaPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-text">
          Ana sayfa
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="text-text">Hakkımızda</span>
      </nav>

      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
        Hakkımızda
      </h1>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        FreetoolsY, günlük işleri hızlandıran basit, hızlı ve ücretsiz
        çevrimiçi araçlardan oluşan bir koleksiyondur. Bir araç için ağır
        programlar kurmak ya da verilerinizi bilinmeyen sunuculara göndermek
        zorunda değilsiniz.
      </p>

      <section className="mt-8 space-y-8 text-sm leading-relaxed text-muted sm:text-base">
        <div>
          <h2 className="text-base font-semibold text-text">Neden FreetoolsY?</h2>
          <p className="mt-2">
            Bugün internette yüzlerce benzer araç vardır; ancak çoğu üyelik
            ister, veri toplar veya arayüzünü reklamlarla karmaşıklaştırır.
            Bizim önceliğimiz ne öğrenilmesi zaman alan ne de ekstra kurulum
            isteyen sade araçlardır. Her araç tek bir işi iyi yapmak için
            tasarlanır: metni say, şifre üret, JSON&apos;u düzenle.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-text">Verileriniz sizin kalır</h2>
          <p className="mt-2">
            Araçlarımızın tamamı tarayıcınızda çalışır. Kutuya yazdığınız
            metin, şifre veya sayılar hiçbir sunucuya gönderilmez, kaydedilmez
            ya da bir üçüncü kişiyle paylaşılmaz. Site yalnızca analitik ve
            reklam hizmetlerinin çalışması için gerekli olan standart teknik
            verileri işler. Detaylar için{" "}
            <Link href="/gizlilik-politikasi" className="font-medium text-accent transition-opacity hover:opacity-80">
              Gizlilik Politikamızı
            </Link>{" "}
            inceleyebilirsiniz.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-text">Nasıl ayakta duruyoruz?</h2>
          <p className="mt-2">
            Site, araçları ücretsiz tutabilmek için reklamlarla finanse edilir.
            Reklamlar, araçların altında ayrılan alanlarda gösterilir ve aracı
            kullanmayı kesintiye uğratmayacak şekilde yerleştirilir.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-text">Yol haritamız</h2>
          <p className="mt-2">
            Sürekli yeni araçlar ekliyor, mevcutları iyileştiriyoruz. Önerileriniz
            ve geri bildirimleriniz bize yol gösterir; bir fikriniz varsa{" "}
            <Link href="/iletisim" className="font-medium text-accent transition-opacity hover:opacity-80">
              iletişim sayfamızdan
            </Link>{" "}
            bize yazabilirsiniz.
          </p>
        </div>
      </section>
    </main>
  );
}