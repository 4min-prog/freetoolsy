"use client";

import type { ComponentType } from "react";
import { toolComponents } from "@/data/toolComponents";

export default function ToolLoader({ slug }: { slug: string }) {
  const Component = toolComponents[slug] as ComponentType | undefined;
  if (!Component) return null;
  return <Component />;
}
