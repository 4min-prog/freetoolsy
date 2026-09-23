export function createSampleImageFile(): File {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <rect width="640" height="360" fill="#0f172a"/>
  <rect x="40" y="40" width="560" height="280" rx="28" fill="#1a1d2e" stroke="#3b82f6" stroke-width="3"/>
  <rect x="120" y="90" width="180" height="26" rx="13" fill="#3b82f6"/>
  <rect x="120" y="130" width="130" height="26" rx="13" fill="#3b82f6" opacity="0.55"/>
  <rect x="120" y="170" width="150" height="26" rx="13" fill="#3b82f6" opacity="0.3"/>
  <rect x="120" y="210" width="90" height="26" rx="13" fill="#3b82f6" opacity="0.15"/>
  <text x="340" y="150" fill="#e9ebf0" font-size="40" font-weight="700" font-family="Segoe UI, sans-serif">freetools</text>
  <text x="530" y="150" fill="#3b82f6" font-size="40" font-weight="800" font-family="Segoe UI, sans-serif">Y</text>
  <text x="340" y="185" fill="#64748b" font-size="18" letter-spacing="4" font-family="Segoe UI, sans-serif">FREE ONLINE TOOLS</text>
</svg>`;
  return new File([svg], "freetoolsy-sample.svg", {
    type: "image/svg+xml",
  });
}