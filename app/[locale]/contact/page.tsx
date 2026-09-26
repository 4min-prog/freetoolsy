import type { Metadata } from "next";
import {
  getLocale,
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { pickCompMessages } from "@/lib/clientMessages";
import { Link } from "@/i18n/navigation";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  setRequestLocale(params.locale);
  const tContact = await getTranslations("Info.contact");
  return {
    title: tContact("title"),
    description: tContact("desc"),
      alternates: {
        canonical: params.locale === "en" ? "/contact" : `/${params.locale}/contact`,
        languages: {
          en: "https://www.freetoolsy.com/contact",
          tr: "https://www.freetoolsy.com/tr/contact",
        },
      },
      openGraph: {
        url: params.locale === "en" ? "/contact" : `/${params.locale}/contact`,
      },
    };
  }

export default async function IletisimPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const locale = await getLocale();
  const formMessages = pickCompMessages(await getMessages(), "contactForm");
  const isTr = locale === "tr";
  const tInfo = await getTranslations("Info");
  const tTool = await getTranslations("ToolPage");
  const tContact = await getTranslations("Info.contact");
  const url = `https://www.freetoolsy.com${isTr ? "/tr" : ""}/contact`;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: tContact("navLabel"),
          url,
          inLanguage: isTr ? "tr" : "en",
        }}
      />
      <nav
        aria-label={tTool("breadcrumbAria")}
        className="flex flex-wrap items-center gap-1.5 text-sm text-muted"
      >
        <Link href="/" className="transition-colors hover:text-text">
          {tInfo("breadcrumbHome")}
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="text-text">{tContact("navLabel")}</span>
      </nav>

      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
        {tContact("h1")}
      </h1>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        {tContact("p1")}
      </p>

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <NextIntlClientProvider messages={formMessages}>
        <ContactForm />
      </NextIntlClientProvider>
      </div>
    </main>
  );
}