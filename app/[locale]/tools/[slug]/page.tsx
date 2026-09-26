import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { tools } from "@/data/tools";
import { toolPath } from "@/lib/paths";
import AraclarPage, {
  generateMetadata as buildToolMetadata,
} from "../../araclar/[slug]/page";

export const dynamicParams = false;

export const revalidate = 86400;

export function generateStaticParams() {
  return tools.map((tool) => ({ locale: "en", slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  return buildToolMetadata({ params: { ...params, locale: "en" } });
}

export default async function ToolsPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (params.locale === "tr") {
    permanentRedirect(toolPath("tr", params.slug));
  }
  return AraclarPage({ params: { ...params, locale: "en" } });
}
