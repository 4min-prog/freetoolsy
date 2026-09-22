import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
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
        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-md px-2 py-1.5 text-sm text-muted transition-colors hover:text-text"
          >
            Araçlar
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
