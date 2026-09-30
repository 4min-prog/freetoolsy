export function LogoBars({
  size,
  color = "#3b82f6",
  boxFill = "#1a1d2e",
  boxRadius = 14,
}: {
  size: number;
  color?: string;
  boxFill?: string;
  boxRadius?: number;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx={boxRadius} fill={boxFill} />
      <rect x="14" y="18" width="40" height="5" rx="2.5" fill={color} />
      <rect x="14" y="29" width="28" height="5" rx="2.5" fill={color} opacity="0.6" />
      <rect x="14" y="40" width="34" height="5" rx="2.5" fill={color} opacity="0.35" />
      <rect x="14" y="51" width="20" height="5" rx="2.5" fill={color} opacity="0.2" />
    </svg>
  );
}