export interface ToolContentBlock {
  h?: string;
  p?: string;
  list?: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export function isFaqBlock(block: ToolContentBlock): boolean {
  return /^faq$/i.test((block.h ?? "").trim());
}

function splitFaqEntry(entry: string): FaqItem | null {
  const match = entry.match(/^([^?]{5,200}\?)\s+(.+)$/);
  if (!match) return null;
  return { q: match[1].trim(), a: match[2].trim() };
}

export function specificFaqItems(blocks: ToolContentBlock[]): FaqItem[] {
  const block = blocks.find(isFaqBlock);
  if (!block?.list) return [];
  return block.list.map(splitFaqEntry).filter((item): item is FaqItem => item !== null);
}

export function toolFaqItems(
  blocks: ToolContentBlock[],
  fallback: FaqItem[]
): FaqItem[] {
  const specific = specificFaqItems(blocks);
  return specific.length ? specific : fallback;
}
