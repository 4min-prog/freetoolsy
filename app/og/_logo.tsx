export function LogoBars({
  size,
  color = "#2563eb",
}: {
  size: number;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      <rect x="12" y="10" width="40" height="6" rx="3" fill={color} />
      <rect x="18" y="22" width="28" height="6" rx="3" fill={color} opacity="0.5" />
      <rect x="15" y="34" width="34" height="6" rx="3" fill={color} opacity="0.3" />
      <rect x="22" y="46" width="20" height="6" rx="3" fill={color} opacity="0.15" />
    </svg>
  );
}