export const MAX_CANVAS_PIXELS = 16_000_000;

export function exceedsCanvasLimit(width: number, height: number) {
  if (!(width > 0) || !(height > 0)) return true;
  return width * height > MAX_CANVAS_PIXELS;
}
