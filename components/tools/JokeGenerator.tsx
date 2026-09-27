"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const JOKES: Record<string, string[]> = {
  en: [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "Why did the developer go broke? Because he used up all his cache.",
    "There are only 10 kinds of people: those who understand binary and those who don't.",
    "Why do Java developers wear glasses? Because they don't C#.",
    "A SQL query walks into a bar, goes up to two tables and asks: Can I join you?",
    "Why was the JavaScript developer sad? Because he didn't know how to null his feelings.",
    "I told my computer I needed a break. Now it won't stop sending me Kit Kat ads.",
    "Why don't skeletons fight each other? Because they don't have the guts.",
    "I would tell you a joke about UDP, but you might not get it.",
    "Why did the chicken cross the road? To get to the other dropdown.",
  ],
  tr: [
    "Programcılar neden karanlık modu sever? Çünkü ışık böcekleri (bug) çeker.",
    "Geliştirici neden iflas etti? Çünkü tüm cache'ini harcadı.",
    "Sadece 10 tür insan vardır: ikili sistemi anlayanlar ve anlamayanlar.",
    "Java geliştiricileri neden gözlük takar? Çünkü C# göremezler.",
    "Bir SQL sorgusu bara girer, iki masaya yaklaşır ve sorar: Aranıza katılabilir miyim?",
    "JavaScript geliştiricisi neden üzgündü? Çünkü duygularını null'lamayı bilmiyordu.",
    "Bilgisayarıma ara vermem gerektiğini söyledim. Şimdi bana Kit Kat reklamı göndermeyi bırakmıyor.",
    "İskeletler neden birbiriyle kavga etmez? Çünkü cesaretleri (guts) yok.",
    "Sana UDP hakkında bir fıkra anlatırdım ama anlamayabilirsin.",
    "Tavuk neden karşıya geçti? Diğer açılır menüye (dropdown) ulaşmak için.",
  ],
};

export default function JokeGenerator() {
  const locale = useLocale();
  const t = useTranslations("comp.jokeGenerator");
  const [joke, setJoke] = useState<string | null>(null);

  function next() {
    const list = JOKES[locale] ?? JOKES.en;
    const current = list.indexOf(joke ?? "");
    let index = Math.floor(Math.random() * list.length);
    if (list.length > 1 && index === current) {
      index = (index + 1) % list.length;
    }
    setJoke(list[index]);
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

      {joke ? (
        <div className="mt-6 max-w-xl rounded-lg border border-border bg-surface p-5">
          <p className="text-lg leading-relaxed text-text">{joke}</p>
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}