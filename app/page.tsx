import type { Metadata } from "next";
import ToolExplorer from "@/components/ToolExplorer";
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