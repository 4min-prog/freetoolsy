"use client";

import { useState } from "react";

const REMOTE_SRC = "https://startupfa.me/badges/featured-badge-small.webp";
const FALLBACK_SRC = "/startupfa-featured-badge.webp";

export default function StartupFameBadge() {
  const [src, setSrc] = useState(REMOTE_SRC);

  return (
    <a
      href="https://startupfa.me/s/freetoolsy?utm_source=www.freetoolsy.com"
      target="_blank"
      rel="noopener noreferrer"
      title="Featured on Startup Fame"
      className="col-span-2"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="FreeToolsy - Featured on Startup Fame"
        width={224}
        height={36}
        loading="lazy"
        decoding="async"
        onError={() => setSrc(FALLBACK_SRC)}
        className="h-auto w-full rounded-md border border-border bg-bg transition-opacity hover:opacity-80"
      />
    </a>
  );
}
