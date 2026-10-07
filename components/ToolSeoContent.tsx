import { getMessages, getTranslations } from "next-intl/server";
import { getTool } from "@/data/tools";
import { isFaqBlock, type ToolContentBlock } from "@/lib/faq";

function normalizeHeading(heading: string) {
  return heading
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0131]/g, "i");
}

export default async function ToolSeoContent({ slug }: { slug: string }) {
  const messages = await getMessages();
  const toolContents = messages.ToolContent as unknown as
    | Record<string, ToolContentBlock[]>
    | undefined;
  const blocks = (toolContents?.[slug] ?? []).filter((block) => !isFaqBlock(block));
  const tool = getTool(slug);
  const shouldAddSeoSections =
    tool?.category === "text" || tool?.category === "developer";

  if (!blocks.length && !shouldAddSeoSections) return null;

  const headings = blocks.map((block) => block.h ?? "");
  const hasHowTo = headings.some((heading) =>
    /(how to use|nasil kullan)/.test(normalizeHeading(heading))
  );
  const hasWhyUse = headings.some((heading) =>
    /(why use|neden.*kullan)/.test(normalizeHeading(heading))
  );

  const tTool = shouldAddSeoSections
    ? await getTranslations(`ToolMeta.${slug}`)
    : null;
  const tSeo = shouldAddSeoSections
    ? await getTranslations("ToolSeoSections")
    : null;

  return (
    <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
      {blocks.map((block, index) => (
        <div key={index}>
          {block.h ? (
            index === 0 ? (
              <h2 className="text-lg font-semibold tracking-tight text-text">
                {block.h}
              </h2>
            ) : (
              <h3 className="mt-6 text-base font-semibold text-text">
                {block.h}
              </h3>
            )
          ) : null}
          {block.p ? <p className="mt-3">{block.p}</p> : null}
          {block.list ? (
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              {block.list.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
      {shouldAddSeoSections && !hasHowTo && tTool && tSeo && (
        <div>
          <h3 className="mt-6 text-base font-semibold text-text">
            {tSeo("howToTitle", { name: tTool("name") })}
          </h3>
          <p className="mt-3">{tTool("intro")}</p>
          <p className="mt-3">{tSeo("howToStep")}</p>
        </div>
      )}
      {shouldAddSeoSections && !hasWhyUse && tTool && tSeo && (
        <div>
          <h3 className="mt-6 text-base font-semibold text-text">
            {tSeo("whyUseTitle", { name: tTool("name") })}
          </h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>{tTool("desc")}</li>
            <li>{tSeo("whyUseWorkflow", { name: tTool("name") })}</li>
            <li>{tSeo("whyUseNoSignup")}</li>
          </ul>
        </div>
      )}
    </section>
  );
}