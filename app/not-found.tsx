import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-text">
        Sayfa bulunamadı
      </h1>
      <p className="mt-3 max-w-[50ch] text-sm leading-relaxed text-muted">
        Aradığınız araç mevcut değil veya adres yanlış yazılmış olabilir.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        Ana sayfaya dön
      </Link>
    </main>
  );
}
