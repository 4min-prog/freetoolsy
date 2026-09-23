"use client";

import { useEffect } from "react";
import { setActiveTool } from "@/lib/toolContext";
import { toolView } from "@/lib/analytics";

export default function ToolViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    setActiveTool(slug);
    toolView(slug);
    return () => setActiveTool(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return null;
}