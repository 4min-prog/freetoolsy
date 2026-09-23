let activeTool: string | null = null;

export function setActiveTool(slug: string | null): void {
  activeTool = slug;
}

export function getActiveTool(): string | null {
  return activeTool;
}