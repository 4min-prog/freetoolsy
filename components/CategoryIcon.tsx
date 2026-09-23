import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  metin: (
    <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9zM14 3v6h6M8.5 13.5h7M8.5 17.5h4" />
  ),
  guvenlik: (
    <>
      <path d="M12 3l7 2.8V11c0 4.4-3.1 7.8-7 9-3.9-1.2-7-4.6-7-9V5.8z" />
      <path d="M9.2 11.2l2 2 3.6-3.9" />
    </>
  ),
  gelistirici: (
    <>
      <path d="M8 9.5L4.5 12 8 14.5M16 9.5L19.5 12 16 14.5M13.5 7L10.5 17" />
    </>
  ),
  hesaplama: (
    <>
      <rect x="6" y="3.5" width="12" height="17" rx="2" />
      <path d="M9 7.5h6M9 12.5h.01M12 12.5h.01M15 12.5h.01M9 15.5h.01M12 15.5h.01M15 15.5h.01M9 18.5h.01M12 18.5h.01M15 18.5h.01" />
    </>
  ),
  gorsel: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="M20.5 15.5L16 11l-4.5 4.5L8.5 12.5 3.5 17.5" />
    </>
  ),
  seo: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2M11 7.5v3.5l2.5 1.5" />
    </>
  ),
};

export default function CategoryIcon({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICONS[id] ?? ICONS.metin}
    </svg>
  );
}