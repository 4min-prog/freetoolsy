import ToolCard from "@/components/ToolCard";
import { categories, getToolsByCategory } from "@/data/tools";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
      <section className="pb-12 pt-14 sm:pb-16 sm:pt-20">
        <h1 className="max-w-[20ch] text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
          Günlük işler için sade online araçlar
        </h1>
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted">
          Metin, güvenlik, geliştirme ve hesaplama araçları. Üyelik yok, kurulum
          yok; hesaplamaların tamamı tarayıcınızda yapılır.
        </p>
      </section>

      <div className="space-y-14 pb-20">
        {categories.map((category) => {
          const categoryTools = getToolsByCategory(category.name);
          if (categoryTools.length === 0) return null;

          return (
            <section key={category.id} id={category.id} className="scroll-mt-20">
              <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                <h2 className="text-lg font-semibold tracking-tight text-text">
                  {category.name}
                </h2>
                <span className="text-sm text-muted">
                  {categoryTools.length} araç
                </span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
