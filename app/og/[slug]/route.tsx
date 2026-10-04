import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { categories, getTool, tools } from "@/data/tools";
import { categoryTheme } from "@/components/categoryTheme";
import { LogoBars } from "../_logo";
import { siteUrl } from "@/lib/paths";
import ogMessages from "@/data/og-messages.json";

const CATEGORY_ICON_PATHS: Record<string, string[]> = {
  text: [
    "M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9z",
    "M14 3v6h6M8.5 13.5h7M8.5 17.5h4",
  ],
  security: [
    "M12 3l7 2.8V11c0 4.4-3.1 7.8-7 9-3.9-1.2-7-4.6-7-9V5.8z",
    "M9.2 11.2l2 2 3.6-3.9",
  ],
  developer: ["M8 9.5L4.5 12 8 14.5M16 9.5L19.5 12 16 14.5M13.5 7L10.5 17"],
  calculation: [
    "M8 3.5h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z",
    "M9 7.5h6M9 12.5h.01M12 12.5h.01M15 12.5h.01M9 15.5h.01M12 15.5h.01M15 15.5h.01M9 18.5h.01M12 18.5h.01M15 18.5h.01",
  ],
  image: [
    "M5.5 5h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
    "M8.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM20.5 15.5L16 11l-4.5 4.5-3-3-5 5",
  ],
  seo: [
    "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.2-3.2",
    "M11 7.5v3.5l2.5 1.5",
  ],
  fun: [
    "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z",
    "M12 8.5V12l2.5 1.5M9.5 5V3.5M14.5 5V3.5M12 20.5V15M8.5 9.5H7M16.5 9.5H15",
  ],
};

export const runtime = "edge";
export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  const toolSlugs = tools.map((tool) => ({ slug: tool.slug }));
  const categorySlugs = categories.map((category) => ({ slug: category.id }));
  return [{ slug: "home" }, { slug: "logo" }, ...toolSlugs, ...categorySlugs];
}

function hexA(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
      {(CATEGORY_ICON_PATHS[id] ?? CATEGORY_ICON_PATHS.text).map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const locale = new URL(request.url).searchParams.get("locale") === "tr" ? "tr" : "en";
  const isTurkish = locale === "tr";
  const msgs = ogMessages[locale] as {
    ToolMeta?: Record<string, { name?: string; pageDesc?: string }>;
    Categories?: Record<string, string>;
    CategoryPage?: {
      desc?: Record<string, string>;
      seoContent?: Record<string, { description?: string }>;
    };
  };

  let name = "";
  let label = "";
  let desc = "";
  let hex = categoryTheme("text").hex;
  let icon: ReactNode | null = null;
  let watermark: ReactNode | null = null;

  if (slug === "logo" || slug === "logo-v2" || slug === "logo-v3") {
    try {
      const logoBuf = await fetch(new URL("/og-logo-v2-new.png", siteUrl)).then((res) => res.arrayBuffer());
      const logoData = Buffer.from(logoBuf).toString("base64");
      return new ImageResponse(
        (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
            }}
          >
            <img
              src={`data:image/png;base64,${logoData}`}
              width={512}
              height={512}
              style={{ objectFit: "contain" }}
            />
          </div>
        ),
        { width: 512, height: 512 }
      );
    } catch {
      return new ImageResponse(
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff" }}>
          <LogoBars size={512} boxFill="none" boxRadius={0} />
        </div>,
        { width: 512, height: 512 }
      );
    }
  }

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
                {isTurkish ? "ÜCRETSİZ ÇEVRİMİÇİ ARAÇLAR" : "FREE ONLINE TOOLS"}
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
                  {isTurkish ? "Günlük işler," : "Everyday tools,"}
                </div>
                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 800,
                    lineHeight: 1.05,
                    color: "#0f172a",
                  }}
                >
                  {isTurkish ? "kolayca hallolsun." : "zero friction."}
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
                {isTurkish
                  ? "Metin, dönüştürme, hesaplama, geliştirici, görsel ve SEO araçları. Hızlı, gizli, tarayıcınızda — kayıt yok, sınır yok."
                  : "Text, converters, calculators, developer, image and SEO tools. Fast, private, in your browser — no signup, no limits."}
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
              {isTurkish ? "150+ araç · kayıt yok" : "150+ tools · no signup"}
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
    icon = categoryIconMark(tool.category, hex);
    watermark = categoryIconMark(tool.category, hex, 400);
  } else if (categories.some((category) => category.id === slug)) {
    hex = categoryTheme(slug).hex;
    name = msgs.Categories?.[slug] ?? slug;
    label = isTurkish ? "Kategori" : "Category";
    desc =
      msgs.CategoryPage?.seoContent?.[slug]?.description ??
      msgs.CategoryPage?.desc?.[slug] ??
      "";
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
                fontSize: name.length > 20 ? 56 : 72,
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
                  fontSize: 25,
                  lineHeight: 1.35,
                  color: "#475569",
                  marginTop: 22,
                }}
              >
                  {desc.length > 185 ? `${desc.slice(0, 182).trimEnd()}…` : desc}
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
          <div style={{ fontSize: 24, color: "#94a3b8" }}>
            {isTurkish ? "ücretsiz araçlar · kayıt yok" : "free tools · no signup"}
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