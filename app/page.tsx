import type { Metadata } from "next";
import ToolExplorer from "@/components/ToolExplorer";
import JsonLd from "@/components/JsonLd";
import { categories, tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "Ücretsiz Online Araçlar — Hızlı, Kolay, Türkçe",
  description: `${tools.length} ücretsiz online araç, ${categories.length} kategoride. Karakter sayacı, şifre üretici, JSON formatter, KDV ve daha fazlası. Üyelik yok, kurulum yok.`,
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FreetoolsY — Ücretsiz Online Araçlar",
            url: "https://freetoolsy.vercel.app/",
            description:
              "Metin, güvenlik, geliştirici ve hesaplama araçları. Üyelik yok, kurulum yok.",
            inLanguage: "tr",
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "FreetoolsY",
            url: "https://freetoolsy.vercel.app/",
            description:
              "Karakter sayacı, şifre üretici, JSON formatter, KDV hesap makinesi ve daha fazlası.",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            inLanguage: "tr",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "TRY",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "FreetoolsY ücretsiz mi?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Evet. Tüm araçlar ücretsizdir; üyelik, kurulum veya ücret gerektirmez.",
                },
              },
              {
                "@type": "Question",
                name: "Yazdığım veriler saklanıyor mu?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Hayır. Araçlar tarayıcınızda çalışır; metin veya sayılar sunucuya gönderilmez.",
                },
              },
              {
                "@type": "Question",
                name: "Araçlar hangi cihazlarda çalışıyor?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Tüm web tarayıcılı cihazlarda (bilgisayar, tablet, telefon) çalışır.",
                },
              },
            ],
          },
        ]}
      />
      <section className="pb-9 pt-14 sm:pb-10 sm:pt-20">
        <h1 className="max-w-[20ch] text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
          Ücretsiz Online Araçlar — Hızlı, Kolay, Türkçe
        </h1>
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted">
          {tools.length} ücretsiz araç, {categories.length} kategoride: Metin,
          Güvenlik, Geliştirici ve Hesaplama. Üyelik yok, kurulum yok; tüm
          hesaplamalar tarayıcınızda yapılır, verileriniz hiçbir yere
          gönderilmez.
        </p>
      </section>

      <ToolExplorer />
    </main>
  );
}