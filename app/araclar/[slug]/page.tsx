import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getTool, tools } from "@/data/tools";
import KarakterSayaci from "@/components/tools/KarakterSayaci";
import KelimeSayaci from "@/components/tools/KelimeSayaci";
import SifreUretici from "@/components/tools/SifreUretici";
import JsonFormatter from "@/components/tools/JsonFormatter";
import BmiHesaplayici from "@/components/tools/BmiHesaplayici";

const toolComponents: Record<string, React.ComponentType> = {
  "karakter-sayaci": KarakterSayaci,
  "kelime-sayaci": KelimeSayaci,
  "sifre-uretici": SifreUretici,
  "json-formatter": JsonFormatter,
  "bmi-hesaplayici": BmiHesaplayici,
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const tool = getTool(params.slug);
  if (!tool) return { title: "Araç bulunamadı" };
  return {
    title: tool.name,
    description: tool.description,
    alternates: { canonical: `/araclar/${tool.slug}` },
  };
}

export default function AraclarPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  if (!tool) notFound();

  const ToolComponent = toolComponents[tool.slug];
  if (!ToolComponent) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-text">
          Ana sayfa
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <Link
          href={`/#${categories.find((c) => c.name === tool.category)?.id ?? String(tool.category).toLowerCase()}`}
          className="transition-colors hover:text-text"
        >
          {tool.category}
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="text-text">{tool.name}</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          {tool.name}
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          {tool.category}
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        {tool.description}
      </p>

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <ToolComponent />
      </div>
    </main>
  );
}
