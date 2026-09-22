import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://freetoolsy.vercel.app"),
  title: {
    default: "FreetoolsY — Ücretsiz Online Araçlar",
    template: "%s · FreetoolsY",
  },
  description:
    "Metin, güvenlik, geliştirici ve hesaplama araçları. Üyelik yok, kurulum yok — hepsi tarayıcınızda çalışır.",
  applicationName: "FreetoolsY",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "FreetoolsY",
    type: "website",
    locale: "tr_TR",
    url: "/",
    title: "FreetoolsY — Ücretsiz Online Araçlar",
    description:
      "Metin, güvenlik, geliştirici ve hesaplama araçları. Üyelik yok, kurulum yok — hepsi tarayıcınızda çalışır.",
  },
  twitter: {
    card: "summary",
    title: "FreetoolsY — Ücretsiz Online Araçlar",
    description:
      "Metin, güvenlik, geliştirici ve hesaplama araçları. Üyelik yok, kurulum yok — hepsi tarayıcınızda çalışır.",
  },
};

const themeScript = `try{var t=localStorage.theme;if(t==="dark"||(!("theme" in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} flex min-h-screen flex-col antialiased`}>
        <Header />
        {children}
        <Footer />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-6J6JB9SHKZ"
        />
        <Script id="google-analytics-config" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-6J6JB9SHKZ");`}
        </Script>
        <Script
          id="adsense-init"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
