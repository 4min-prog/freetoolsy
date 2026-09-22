import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid h-7 w-7 place-items-center rounded-md bg-accent text-sm font-semibold text-on-accent"
            >
              F
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-text">
              FreetoolsY
            </span>
          </Link>
          <p className="max-w-[42ch] text-sm leading-relaxed text-muted">
            Ücretsiz online araçlar: Metin, güvenlik, geliştirici ve hesaplama.
            Üyelik gerekmez; verileriniz tarayıcınızdan çıkmaz.
          </p>
        </div>

        <nav
          aria-label="Alt bilgi linkleri"
          className="flex flex-wrap gap-x-10 gap-y-6 md:gap-x-16"
        >
          <div>
            <p className="text-sm font-semibold text-text">Kurumsal</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/hakkimizda"
                  className="text-sm text-muted transition-colors hover:text-text"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  href="/gizlilik-politikasi"
                  className="text-sm text-muted transition-colors hover:text-text"
                >
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link
                  href="/iletisim"
                  className="text-sm text-muted transition-colors hover:text-text"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">Partner</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="https://linkly.hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-text"
                >
                  Link kısaltma için → LinklyhHub
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto w-full max-w-5xl px-4 py-4 text-xs text-muted sm:px-6">
          © 2026 FreetoolsY. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}