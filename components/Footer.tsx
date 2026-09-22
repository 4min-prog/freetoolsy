import Link from "next/link";
import { categories } from "@/data/tools";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-[45ch]">
          <p className="text-sm font-semibold text-text">FreetoolsY</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            freetoolsy.com — üyelik gerektirmeyen, tarayıcıda çalışan ücretsiz
            araçlar.
          </p>
        </div>
        <nav aria-label="Kategoriler" className="flex flex-wrap gap-x-5 gap-y-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/#${category.id}`}
              className="text-sm text-muted transition-colors hover:text-text"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto w-full max-w-5xl px-4 py-4 text-xs text-muted sm:px-6">
          © 2026 FreetoolsY
        </p>
      </div>
    </footer>
  );
}
