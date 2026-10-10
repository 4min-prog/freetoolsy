"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

const QUOTES: Record<string, string[]> = {
  en: [
    "The only way to do great work is to love what you do. — Steve Jobs",
    "Simplicity is the ultimate sophistication. — Leonardo da Vinci",
    "Talk is cheap. Show me the code. — Linus Torvalds",
    "It always seems impossible until it's done. — Nelson Mandela",
    "First, solve the problem. Then, write the code. — John Johnson",
    "Innovation distinguishes between a leader and a follower. — Steve Jobs",
    "Stay hungry, stay foolish. — Steve Jobs",
    "The best way to predict the future is to invent it. — Alan Kay",
    "Programming is the art of telling another human being what one wants the computer to do. — Donald Knuth",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. — Martin Fowler",
    "Opportunities are usually disguised as hard work, so most people don't recognize them. — Ann Landers",
  ],
  tr: [
    "Harika işler yapmanın tek yolu, yaptığın işi sevmektir. — Steve Jobs",
    "Sadeliğin kendisi en büyük zarafettir. — Leonardo da Vinci",
    "Laf kalabalık yapma. Bana kodu göster. — Linus Torvalds",
    "İmkânsız görünene kadar her şey mümkün görünür. — Nelson Mandela",
    "Önce problemi çöz, sonra kodu yaz. — John Johnson",
    "Lider ile takipçi arasındaki fark inovasyondur. — Steve Jobs",
    "Aç kal, akılsız kal. — Steve Jobs",
    "Geleceği tahmin etmenin en iyi yolu, onu icat etmektir. — Alan Kay",
    "Programlama, bir insanın bilgisayardan ne yapmasını istediğini başka bir insana anlatma sanatıdır. — Donald Knuth",
    "Başarı nihai değildir, başarısızlık ölümcül değildir; devam etme cesareti asıl olan budur. — Winston Churchill",
    "Bilgisayarın anlayacağı kodu herkes yazabilir. İyi programcılar insanların anlayacağı kodu yazar. — Martin Fowler",
    "Fırsatlar genellikle sıkı çalışmanın arkasına gizlenir, bu yüzden çoğu insan onları fark edemez. — Ann Landers",
  ],
};

export default function RandomQuoteGenerator() {
  const locale = useLocale();
  const t = useTranslations("comp.randomQuoteGenerator");
  const [quote, setQuote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function next() {
    const list = QUOTES[locale] ?? QUOTES.en;
    const current = list.indexOf(quote ?? "");
    let index = Math.floor(Math.random() * list.length);
    if (list.length > 1 && index === current) {
      index = (index + 1) % list.length;
    }
    setQuote(list[index]);
  }

  async function copy() {
    if (!quote) return;
    try {
      await navigator.clipboard.writeText(quote);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={next}
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("generate")}
      </button>

      {quote ? (
        <blockquote className="mt-6 max-w-xl rounded-lg border border-border bg-surface p-5">
          <p className="text-lg leading-relaxed text-text">{quote}</p>
        </blockquote>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      {quote ? (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={copy}
            disabled={!quote}
            className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}