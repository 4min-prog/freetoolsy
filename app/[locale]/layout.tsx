import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { pickClientMessages } from "@/lib/clientMessages";
import { ADS_CLIENT, ADS_ENABLED } from "@/lib/ads";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeGuard from "@/components/ThemeGuard";
import ToastHost from "@/components/ToastHost";
import PageViewTracker from "@/components/PageViewTracker";
import CookieBanner from "@/components/CookieBanner";
import JsonLd from "@/components/JsonLd";
import { siteUrl } from "@/lib/paths";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!routing.locales.includes(params.locale as Locale)) {
    notFound();
  }
  const t = await getTranslations("Layout");
  const asLocale = params.locale as Locale;
  const canonicalPath = asLocale === "en" ? "/" : `/${asLocale}`;
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("defaultTitle"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    applicationName: "FreetoolsY",
    icons: {
      icon: [
        { url: "/favicon-v2.ico", sizes: "any", type: "image/x-icon" },
        { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        { url: "/icon-v2.svg", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/apple-touch-icon-v2.png", sizes: "180x180", type: "image/png" },
      ],
    },
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: `${siteUrl}/`,
        tr: `${siteUrl}/tr`,
      },
    },
    openGraph: {
      siteName: "FreetoolsY",
      type: "website",
      locale: asLocale === "tr" ? "tr_TR" : "en_US",
      url: `${siteUrl}${canonicalPath}`,
      title: t("ogTitle"),
      description: t("description"),
      images: [
        {
          url: `${siteUrl}/og/home`,
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("description"),
      images: [`${siteUrl}/og/home`],
    },
  };
}

const themeScript = `try{var t=localStorage.theme;if(t==="dark"){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}}catch(e){}`;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  if (!routing.locales.includes(params.locale as Locale)) {
    notFound();
  }
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const messages = pickClientMessages(await getMessages());

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} flex min-h-screen flex-col antialiased`}>
        <ThemeGuard />
        <NextIntlClientProvider messages={messages}>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "FreetoolsY",
              url: siteUrl,
              logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/og/logo-v2`,
                width: 512,
                height: 512,
                caption: "FreetoolsY",
              },
              image: `${siteUrl}/og/logo-v2`,
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                url: `${siteUrl}/contact`,
              },
            }}
          />
          <PageViewTracker />
          <Header />
          {children}
          <Footer />
          <ToastHost />
          <CookieBanner adsClient={ADS_CLIENT} adsEnabled={ADS_ENABLED} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}