import type { Metadata } from "next";
import Link from "next/link";
import ToolJsonLd from "@/components/ToolJsonLd";
import AdSlot from "@/components/AdSlot";
import ParolaGucTesti from "@/components/tools/ParolaGucTesti";

export const metadata: Metadata = {
  title: "Parola Güç Testi — Ücretsiz Online Araç",
  description:
    "Parolanızın ne kadar güçlü olduğunu entropi ile ölçün, eksiklerini görün. Verileriniz asla gönderilmez; tamamen tarayıcınızda çalışır.",
  alternates: { canonical: "/araclar/parola-guc-testi" },
};

export default function ParolaGucTestiPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <ToolJsonLd slug="parola-guc-testi" />
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-text">
          Ana sayfa
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <Link href="/#guvenlik" className="transition-colors hover:text-text">
          Güvenlik
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="text-text">Parola Güç Testi</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Parola Güç Testi — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Güvenlik
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Parolanızın gerçekte ne kadar güçlü olduğunu öğrenin. Entropi
        hesabıyla tahmini bit değerini görün, eksik karakter türlerini
        işaretleyin ve zayıf parolalardan uzak durun.
      </p>

      <AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <ParolaGucTesti />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          Parola Güç Testi Nedir?
        </h2>
        <p className="mt-3">
          Parola Güç Testi, girdiğiniz parolanın saldırılara karşı ne kadar
          dayanıklı olduğunu tahmini entropi ile değerlendiren ücretsiz bir
          araçtır. Uzunluk, karakter çeşitliliği ve yaygın parolalarla olan
          benzerlik kontrol edilir. Sonuç; çok zayıf, zayıf, orta, güçlü ve çok
          güçlü olarak gösterilir ve hangi eksiklerin giderilmesi gerektiği tek
          tek işaretlenir.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Entropi nedir ve neden önemlidir?
        </h3>
        <p className="mt-3">
          Entropi, parolanın tahmin edilebilirlik derecesini bit cinsinden ölçer.
          Her ekstra karakter ve farklı karakter türü, kaba kuvvet saldırısında
          denenecek kombinasyon sayısını üstel olarak artırır. Örneğin
          yalnızca küçük harflerden oluşan 8 karakterlik bir parolanın bit değeri
          düşüktür; aynı uzunlukta ama rakam ve sembol içeren bir parola çok daha
          yüksek entropi sunar. Aracımız, şifre üretici sayfamızdaki üretim
          mantığıyla aynı ölçüyü kullanır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Test tamamen tarayıcınızda yapılır; parolanız hiçbir sunucuya
          gönderilmez, kaydedilmez veya günlüğe yazılmaz. Gerçek parolanızı
          rahatça test edebilirsiniz.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Sık sorulan sorular
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Hangi uzunluk yeterli? Temel kural 12 karakter ve üzeridir; 16+
            karakter daha güvenlidir.
          </li>
          <li>
            Yaygın parola listesini çevrimiçi kontrol ediyor musunuz? Hayır,
            liste cihazınıza gömülüdür; çevrimiçi kontrol yapılmaz.
          </li>
          <li>
            En iyi parola nasıl olur? Benzersiz, uzun ve tahmin edilmesi zor bir
            parolayı parola yöneticisi ile saklamak en iyi pratiktir.
          </li>
        </ul>
        <p className="mt-6">
          Güvenliğiniz seçtiğiniz parolanın gücüne bağlıdır. Parolanızı test
          edin, eksiklerini tamamlayın, eğer gerekiyorsa güçlü bir parolayı
          şifre üreticiyle oluşturun.
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