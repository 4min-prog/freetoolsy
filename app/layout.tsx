import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://freetoolsy.com"),
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
      </body>
    </html>
  );
}
