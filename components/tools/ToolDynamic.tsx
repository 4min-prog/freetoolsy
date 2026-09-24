"use client";

import dynamic from "next/dynamic";

const ImageCompressor = dynamic(() => import("./ImageCompressor"), {
  ssr: false,
  loading: () => <ToolLoading />,
});
const ImageResizer = dynamic(() => import("./ImageResizer"), {
  ssr: false,
  loading: () => <ToolLoading />,
});
const ImageConverter = dynamic(() => import("./ImageConverter"), {
  ssr: false,
  loading: () => <ToolLoading />,
});
const ImageToBase64 = dynamic(() => import("./ImageToBase64"), {
  ssr: false,
  loading: () => <ToolLoading />,
});
const ImageColorPicker = dynamic(() => import("./ImageColorPicker"), {
  ssr: false,
  loading: () => <ToolLoading />,
});

const MAP: Record<string, React.ComponentType> = {
  "image-compressor": ImageCompressor,
  "image-resizer": ImageResizer,
  "image-converter": ImageConverter,
  "image-to-base64": ImageToBase64,
  "image-color-picker": ImageColorPicker,
};

function ToolLoading() {
  return <div className="h-72 w-full animate-pulse rounded-lg bg-surface-2" />;
}

export default function ToolDynamic({ slug }: { slug: string }) {
  const Component = MAP[slug];
  if (!Component) return null;
  return <Component />;
}