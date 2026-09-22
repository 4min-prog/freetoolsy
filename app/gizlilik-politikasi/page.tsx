import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "FreetoolsY gizlilik politikası: hangi verilerin toplandığı, çerezler, üçüncü taraf reklamlar ve kullanıcı hakları hakkında bilgi.",
  alternates: { canonical: "/gizlilik-politikasi" },
};

export default function GizlilikPolitikasiPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-text">
          Ana sayfa
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="text-text">Gizlilik Politikası</span>
      </nav>

      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
        Gizlilik Politikası
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Son güncelleme: 22 Eylül 2026
      </p>

      <section className="mt-8 space-y-8 text-sm leading-relaxed text-muted sm:text-base">
        <div>
          <h2 className="text-base font-semibold text-text">1. Genel Bilgiler</h2>
          <p className="mt-2">
            FreetoolsY (&quot;biz&quot;, &quot;site&quot;), {`https://freetoolsy.vercel.app`}{" "}
            adresinde ücretsiz çevrimiçi araçlar sunar. Bu gizlilik politikası,
            siteyi kullanırken hangi bilgilerin toplandığını ve nasıl
            kullanıldığını açıklar. Siteyi kullanarak bu politikayı kabul etmiş
            sayılırsınız.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-text">2. Toplanan Veriler</h2>
          <p className="mt-2">
            Araçlarımızın büyük bölümü tarayıcınızda çalışır; girdiğiniz
            metinler, sayılar veya veriler sunucularımıza gönderilmez ve
            saklanmaz. Site standart web analitiği ve reklam hizmetlerinin
            çalışması için belirli teknik verileri (IP adresi, tarayıcı türü,
            ziyaret edilen sayfalar, cihaz bilgileri) işleyebilir.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-text">3. Çerezler (Cookies)</h2>
          <p className="mt-2">
            Site, tercihlerinizi hatırlamak (örneğin tema seçimi) ve hizmet
            kalitesini ölçmek için çerezler kullanır. Çerezlere, tarayıcınızın
            ayarlarından dilediğiniz zaman izin verebilir veya engelleyebilirsiniz.
            Çerezleri engellemeniz, araçların çoğunu kullanmanıza engel olmaz.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-text">4. Üçüncü Taraf Reklamlar</h2>
          <p className="mt-2">
            Bu site, gelir elde etmek amacıyla Google AdSense gibi üçüncü taraf
            reklam sağlayıcılarından yararlanabilir. Google, reklam gösterimini
            kişiselleştirebilmek için çerezleri (DART çerezleri dahil)
            kullanabilir. Google&apos;ın veri kullanımına ilişkin detayları{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent transition-opacity hover:opacity-80"
            >
              Google&apos;ın reklam ortaklığı sayfasından
            </a>{" "}
            inceleyebilirsiniz. Kullanıcılar, kişiselleştirilmiş reklamları{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent transition-opacity hover:opacity-80"
            >
              Google Reklam Ayarları&apos;ndan
            </a>{" "}
            kapatabilir.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-text">5. Analitik</h2>
          <p className="mt-2">
            Site, ziyaretçi istatistiklerini anlamak için Google Analytics gibi
            analitik hizmetleri kullanabilir. Bu hizmetler, site kullanımını
            analiz etmek için çerezler kullanır; toplanan bilgiler anonim olarak
            işlenir.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-text">6. Veri Güvenliği</h2>
          <p className="mt-2">
            Site, kişisel verileri korumak için makul güvenlik önlemleri alır.
            Ancak internet üzerinden iletilen hiçbir veri yöntemi yüzde yüz
            güvenli değildir; bu yüzden mutlak güvenlik garantisi verilemez.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-text">7. Haklarınız</h2>
          <p className="mt-2">
            KVKK ve GDPR kapsamında, toplanan verilerinize erişme, düzeltilmesini
            isteme, silinmesini talep etme veya işlenmesine itiraz etme
            haklarınız bulunur. Talepleriniz için bize iletişim bölümünden
            ulaşabilirsiniz.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-text">8. Değişiklikler</h2>
          <p className="mt-2">
            Bu politika, yasal gereklilikler veya hizmet değişiklikleri
            doğrultusunda zaman zaman güncellenebilir. Güncellemeler bu sayfada
            yayımlanır; önemli değişikliklerde site üzerinden bildirimde bulunulur.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-text">9. İletişim</h2>
          <p className="mt-2">
            Bu politika hakkında sorularınız için{" "}
            <Link href="/iletisim" className="font-medium text-accent transition-opacity hover:opacity-80">
              İletişim sayfamızı
            </Link>{" "}
            kullanabilirsiniz.
          </p>
        </div>
      </section>
    </main>
  );
}