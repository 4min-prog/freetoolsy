import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import SifreUretici from "@/components/tools/SifreUretici";

export const metadata: Metadata = {
  title: "Şifre Üretici — Ücretsiz Online Araç",
  description:
    "Uzunluk ve karakter türlerini seçerek güçlü, rastgele parolalar üretin. Güç göstergesi ve 5'li şifre üretme seçeneğiyle tamamen ücretsiz.",
  alternates: { canonical: "/araclar/sifre-uretici" },
};

export default function SifreUreticiPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
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
        <span className="text-text">Şifre Üretici</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Şifre Üretici — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Güvenlik
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Uzunluk ve karakter türlerini seçin; tarayıcınızda güçlü, rastgele
        parolalar üretin. Tek seferde 5 şifre de oluşturabilirsiniz.
      </p>

<AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <SifreUretici />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          Şifre Üretici Nedir?
        </h2>
        <p className="mt-3">
          Şifre Üretici, uzunluk ve karakter türü tercihlerinize göre güçlü ve
          tahmin edilmesi zor parolalar üreten ücretsiz bir online güvenlik
          aracıdır. Uzunluk çubuğunu 8 ile 64 karakter arasında
          ayarlayabilirsiniz; büyük harf, küçük harf, rakam ve sembol
          seçeneklerinden dilediklerinizi işaretleyebilirsiniz. Üretilen her
          şifrenin gücü, Zayıf/Orta/Güçlü/Çok Güçlü olarak anında gösterilir.
          İsterseniz tek seferde 5 farklı şifre üreterek aralarından seçim
          yapabilirsiniz.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Şifre gücü nasıl hesaplanır?
        </h3>
        <p className="mt-3">
          Güç göstergesi, karakter sayısı ile kullanılan karakter havuzunun
          büyüklüğünü birlikte değerlendiren entropi hesabına dayanır.
          Kural basittir: şifre ne kadar uzun ve ne kadar farklı karakter türü
          içeriyorsa o kadar fazla ihtimal barındırır ve kaba kuvvet
          saldırılarına karşı o kadar dayanıklı olur. En az 12-16 karakter ve
          dört karakter türünün tamamını kullanmak önerilen başlangıç
          noktasıdır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Neden bu araç güvenlidir?
        </h3>
        <p className="mt-3">
          Şifreler tamamen tarayıcınızda üretilir; yazılıp internete asla
          gönderilmez. Araç; zor kullanılabilir ve güvenlik açısından zayıf
          olan Math.random yerine tarayıcının kriptografik olarak güvenli
          rastgele sayı üreticisini (crypto.getRandomValues) kullanır.
          Ürettiğiniz şifreler sunucularımızda saklanmaz, kaydedilmez veya hiçbir
          yere iletilmez.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Güçlü şifre ipuçları
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Her hesap için farklı bir şifre kullanın; aynı şifreyi tekrar
            etmeyin.
          </li>
          <li>
            Doğum tarihi, isim veya klavye düzenindeki sıralı tuşlardan
            kaçının.
          </li>
          <li>
            Şifreyi bir parola yöneticisinde saklayın veya güvenli bir şekilde
            kaydedin.
          </li>
          <li>
            İki faktörlü doğrulamayı (2FA) destekleyen hizmetlerde mutlaka
            etkinleştirin.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Ücretsiz ve mobil uyumludur
        </h3>
        <p className="mt-3">
          Üyelik ve indirme gerektirmez; telefon, tablet ve bilgisayarda
          tarayıcı üzerinden çalışır. İhtiyaç duyduğunuz anda güçlü bir şifre
          üretmek için tek tıklama yeterlidir.
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