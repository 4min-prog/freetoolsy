import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { routing, type Locale } from "@/i18n/routing";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeGuard from "@/components/ThemeGuard";
import ToastHost from "@/components/ToastHost";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://freetoolsy.com";

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
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
          url: `${siteUrl}/og-image.png`,
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
      images: [`${siteUrl}/og-image.png`],
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
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {process.env.NEXT_PUBLIC_ADS_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADS_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${inter.variable} flex min-h-screen flex-col antialiased`}>
        <ThemeGuard />
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
          <ToastHost />
        </NextIntlClientProvider>
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-6J6JB9SHKZ"
        />
        <Script id="google-analytics-config" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-6J6JB9SHKZ");`}
        </Script>
      </body>
    </html>
  );
}