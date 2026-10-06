export const MAX_DESCRIPTION_LENGTH = 160;

const MIN_DESCRIPTION_LENGTH = 80;
const SENTENCE_ENDINGS = [". ", "! ", "? ", "; ", "… "];
const TRAILING_PUNCTUATION = /[\s,;:–—-]+$/;

export function clampDescription(
  text: string,
  max: number = MAX_DESCRIPTION_LENGTH,
): string {
  const value = text.trim();
  if (value.length <= max) return value;

  const window = value.slice(0, max);

  for (const ending of SENTENCE_ENDINGS) {
    const index = window.lastIndexOf(ending);
    if (index >= MIN_DESCRIPTION_LENGTH) {
      return window.slice(0, index + 1).trim();
    }
  }

  const wordBoundary = window.lastIndexOf(" ");
  if (wordBoundary >= MIN_DESCRIPTION_LENGTH) {
    return window
      .slice(0, wordBoundary)
      .replace(TRAILING_PUNCTUATION, "")
      .trim();
  }

  return window.trimEnd();
}
