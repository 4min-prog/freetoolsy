import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { categories, getTool, tools } from "@/data/tools";
import { categoryTheme } from "@/components/categoryTheme";
import { TOOL_ICONS } from "@/components/ToolIcon";
import { CATEGORY_ICON_PATHS } from "@/components/CategoryIcon";
import { LogoBars } from "../_logo";
import en from "@/messages/en.json";

export const runtime = "edge";
export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  const toolSlugs = tools.map((tool) => ({ slug: tool.slug }));
  const categorySlugs = categories.map((category) => ({ slug: category.id }));
  return [{ slug: "home" }, ...toolSlugs, ...categorySlugs];
}

function hexA(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function toolIconMark(slug: string, hex: string, size = 80): ReactNode {
  const def = TOOL_ICONS[slug];
  if (!def) return null;
  const paths = Array.isArray(def.icon[4]) ? def.icon[4] : [def.icon[4]];
  return (
    <svg
      viewBox={`0 0 ${def.icon[0]} ${def.icon[1]}`}
      width={size}
      height={size}
      fill={hex}
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

function categoryIconMark(id: string, hex: string, size = 80): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={hex}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {CATEGORY_ICON_PATHS[id] ?? CATEGORY_ICON_PATHS.text}
    </svg>
  );
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const msgs = en as {
    ToolMeta?: Record<string, { name?: string; pageDesc?: string }>;
    Categories?: Record<string, string>;
    CategoryPage?: { desc?: Record<string, string> };
  };

  let name = "";
  let label = "";
  let desc = "";
  let hex = categoryTheme("text").hex;
  let icon: ReactNode | null = null;
  let watermark: ReactNode | null = null;

  if (slug === "home") {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            backgroundColor: "#ffffff",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -160,
              right: -140,
              width: 520,
              height: 520,
              borderRadius: 260,
              backgroundColor: hexA("#2563eb", 0.08),
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -120,
              bottom: -180,
              width: 380,
              height: 380,
              borderRadius: 190,
              backgroundColor: hexA("#2563eb", 0.06),
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 36,
              bottom: 16,
              width: 380,
              height: 380,
              display: "flex",
              opacity: 0.06,
            }}
          >
            <LogoBars size={380} />
          </div>

          <div
            style={{
              position: "absolute",
              top: 56,
              left: 72,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <LogoBars size={36} />
            <div style={{ fontSize: 34, fontWeight: 800, color: "#0f172a" }}>
              FreetoolsY
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              paddingLeft: 72,
              paddingRight: 72,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: 760,
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#2563eb",
                  letterSpacing: 1.5,
                }}
              >
                FREE ONLINE TOOLS
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 800,
                    lineHeight: 1.05,
                    color: "#0f172a",
                  }}
                >
                  Everyday tools,
                </div>
                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 800,
                    lineHeight: 1.05,
                    color: "#0f172a",
                  }}
                >
                  zero friction.
                </div>
              </div>
              <div
                style={{
                  fontSize: 27,
                  lineHeight: 1.4,
                  color: "#475569",
                  marginTop: 20,
                }}
              >
                Text, converters, calculators, developer, image and SEO tools.
                Fast, private, in your browser — no signup, no limits.
              </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 72,
              bottom: 44,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 24, color: "#94a3b8" }}>freetoolsy.com</div>
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: 3,
                backgroundColor: "#cbd5e1",
                display: "flex",
              }}
            />
            <div style={{ fontSize: 24, color: "#94a3b8" }}>
              100+ tools · no signup
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  const tool = getTool(slug);
  if (tool) {
    hex = categoryTheme(tool.category).hex;
    name = msgs.ToolMeta?.[slug]?.name ?? tool.name;
    label = msgs.Categories?.[tool.category] ?? tool.category;
    desc = msgs.ToolMeta?.[slug]?.pageDesc ?? "";
    icon = toolIconMark(slug, hex);
    watermark = toolIconMark(slug, hex, 400);
  } else if (categories.some((category) => category.id === slug)) {
    hex = categoryTheme(slug).hex;
    name = msgs.Categories?.[slug] ?? slug;
    label = "Category";
    desc = msgs.CategoryPage?.desc?.[slug] ?? "";
    icon = categoryIconMark(slug, hex);
    watermark = categoryIconMark(slug, hex, 400);
  } else {
    notFound();
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          backgroundColor: "#ffffff",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -140,
            width: 520,
            height: 520,
            borderRadius: 260,
            backgroundColor: hexA(hex, 0.08),
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -120,
            bottom: -180,
            width: 380,
            height: 380,
            borderRadius: 190,
            backgroundColor: hexA(hex, 0.06),
            display: "flex",
          }}
        />
        {watermark && (
          <div
            style={{
              position: "absolute",
              right: 40,
              bottom: 24,
              width: 420,
              height: 420,
              display: "flex",
            }}
          >
            {watermark}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: 56,
            left: 72,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              display: "flex",
            }}
          >
            <LogoBars size={36} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#0f172a" }}>
            FreetoolsY
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 72,
            paddingRight: 72,
            paddingTop: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 680,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: hex,
                letterSpacing: 1,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                lineHeight: 1.05,
                color: "#0f172a",
                marginTop: 12,
              }}
            >
              {name}
            </div>
            {desc && (
              <div
                style={{
                  fontSize: 29,
                  lineHeight: 1.35,
                  color: "#475569",
                  marginTop: 22,
                }}
              >
                {desc}
              </div>
            )}
          </div>
          {icon && (
            <div
              style={{
                width: 148,
                height: 148,
                borderRadius: 40,
                backgroundColor: hexA(hex, 0.12),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            left: 72,
            bottom: 44,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 24, color: "#94a3b8" }}>freetoolsy.com</div>
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: 3,
              backgroundColor: "#cbd5e1",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 24, color: "#94a3b8" }}>free tools · no signup</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}