import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        404
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-text">
        Sayfa bulunamadı
      </h1>
      <p className="mt-3 max-w-[50ch] text-sm leading-relaxed text-muted">
        Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Araçların tamamına
        ana sayfadan ulaşabilirsiniz.
        <span className="mt-2 block text-muted/80">
          This page could not be found. You can reach every tool from the home
          page.
        </span>
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        FreetoolsY
      </Link>
    </main>
  );
}
