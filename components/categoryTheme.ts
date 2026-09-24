export interface CategoryTheme {
  iconText: string;
  iconBg: string;
  strip: string;
  active: string;
  hoverBorder: string;
  hex: string;
}

const THEMES: Record<string, CategoryTheme> = {
  text: {
    iconText: "text-sky-600 dark:text-sky-400",
    iconBg: "bg-sky-500/10",
    strip: "bg-sky-500 dark:bg-sky-400",
    active: "bg-sky-600 text-white dark:bg-sky-400 dark:text-sky-950",
    hoverBorder: "hover:border-sky-400/60 dark:hover:border-sky-400/60",
    hex: "#0ea5e9",
  },
  security: {
    iconText: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10",
    strip: "bg-emerald-500 dark:bg-emerald-400",
    active:
      "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-emerald-950",
    hoverBorder:
      "hover:border-emerald-400/60 dark:hover:border-emerald-400/60",
    hex: "#10b981",
  },
  developer: {
    iconText: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-500/10",
    strip: "bg-violet-500 dark:bg-violet-400",
    active: "bg-violet-600 text-white dark:bg-violet-400 dark:text-violet-950",
    hoverBorder: "hover:border-violet-400/60 dark:hover:border-violet-400/60",
    hex: "#8b5cf6",
  },
  calculation: {
    iconText: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-500/10",
    strip: "bg-amber-500 dark:bg-amber-400",
    active: "bg-amber-500 text-white dark:bg-amber-400 dark:text-amber-950",
    hoverBorder: "hover:border-amber-400/60 dark:hover:border-amber-400/60",
    hex: "#f59e0b",
  },
  image: {
    iconText: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-500/10",
    strip: "bg-rose-500 dark:bg-rose-400",
    active: "bg-rose-600 text-white dark:bg-rose-400 dark:text-rose-950",
    hoverBorder: "hover:border-rose-400/60 dark:hover:border-rose-400/60",
    hex: "#f43f5e",
  },
  seo: {
    iconText: "text-cyan-600 dark:text-cyan-400",
    iconBg: "bg-cyan-500/10",
    strip: "bg-cyan-500 dark:bg-cyan-400",
    active: "bg-cyan-600 text-white dark:bg-cyan-400 dark:text-cyan-950",
    hoverBorder: "hover:border-cyan-400/60 dark:hover:border-cyan-400/60",
    hex: "#06b6d4",
  },
};

export function categoryTheme(id: string): CategoryTheme {
  return THEMES[id] ?? THEMES.text;
}