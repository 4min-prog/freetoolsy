"use client";

import dynamic from "next/dynamic";

const ResimSikistirici = dynamic(() => import("./ResimSikistirici"), {
  ssr: false,
  loading: () => <ToolLoading />,
});
const ResimBoyutlandirici = dynamic(() => import("./ResimBoyutlandirici"), {
  ssr: false,
  loading: () => <ToolLoading />,
});
const ResimDonusturucu = dynamic(() => import("./ResimDonusturucu"), {
  ssr: false,
  loading: () => <ToolLoading />,
});
const ResimdenBase64 = dynamic(() => import("./ResimdenBase64"), {
  ssr: false,
  loading: () => <ToolLoading />,
});
const ResimdenRenkSecici = dynamic(() => import("./ResimdenRenkSecici"), {
  ssr: false,
  loading: () => <ToolLoading />,
});

const MAP: Record<string, React.ComponentType> = {
  "resim-sikistirici": ResimSikistirici,
  "resim-boyutlandirici": ResimBoyutlandirici,
  "resim-donusturucu": ResimDonusturucu,
  "resimden-base64": ResimdenBase64,
  "resimden-renk-secici": ResimdenRenkSecici,
};

function ToolLoading() {
  return <div className="h-72 w-full animate-pulse rounded-lg bg-surface-2" />;
}

export default function ToolDynamic({ slug }: { slug: string }) {
  const Component = MAP[slug];
  if (!Component) return null;
  return <Component />;
}