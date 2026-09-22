import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "FreetoolsY ile iletişime geçin: sorularınız, önerileriniz ve geri bildirimleriniz için bize yazın.",
  alternates: { canonical: "/iletisim" },
};

export default function IletisimPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-text">
          Ana sayfa
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="text-text">İletişim</span>
      </nav>

      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
        İletişim
      </h1>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Sorularınız, önerileriniz veya geri bildirimleriniz için aşağıdaki
        formu kullanabilirsiniz. Form, mesajınızı e-posta uygulaması üzerinden
        destek@freetoolsy.com adresine iletir.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <ContactForm />
      </div>
    </main>
  );
}