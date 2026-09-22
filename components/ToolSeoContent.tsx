import { getMessages } from "next-intl/server";

interface ToolContentBlock {
  h?: string;
  p?: string;
  list?: string[];
}

export default async function ToolSeoContent({ slug }: { slug: string }) {
  const messages = await getMessages();
  const toolContents = messages.ToolContent as unknown as
    | Record<string, ToolContentBlock[]>
    | undefined;
  const blocks = toolContents ? toolContents[slug] : [];

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
    </section>
  );
}