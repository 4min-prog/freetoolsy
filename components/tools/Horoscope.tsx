"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type Sign = {
  key: string;
  en: string;
  tr: string;
  elementEn: string;
  elementTr: string;
  range: string;
  attrsEn: string;
  attrsTr: string;
};

const SIGNS: Sign[] = [
  { key: "aries", en: "Aries", tr: "Koç", elementEn: "Fire", elementTr: "Ateş", range: "Mar 21 – Apr 19", attrsEn: "Bold, energetic and direct.", attrsTr: "Cesur, enerjik ve doğrudan." },
  { key: "taurus", en: "Taurus", tr: "Boğa", elementEn: "Earth", elementTr: "Toprak", range: "Apr 20 – May 20", attrsEn: "Practical, loyal and determined.", attrsTr: "Pratik, sadık ve kararlı." },
  { key: "gemini", en: "Gemini", tr: "İkizler", elementEn: "Air", elementTr: "Hava", range: "May 21 – Jun 20", attrsEn: "Curious, adaptable and quick-witted.", attrsTr: "Meraklı, uyumlu ve zeki." },
  { key: "cancer", en: "Cancer", tr: "Yengeç", elementEn: "Water", elementTr: "Su", range: "Jun 21 – Jul 22", attrsEn: "Intuitive, caring and protective.", attrsTr: "Sezgisel, şefkatli ve koruyucu." },
  { key: "leo", en: "Leo", tr: "Aslan", elementEn: "Fire", elementTr: "Ateş", range: "Jul 23 – Aug 22", attrsEn: "Confident, generous and warm.", attrsTr: "Özgüvenli, cömert ve sıcakkanlı." },
  { key: "virgo", en: "Virgo", tr: "Başak", elementEn: "Earth", elementTr: "Toprak", range: "Aug 23 – Sep 22", attrsEn: "Analytical, reliable and methodical.", attrsTr: "Analitik, güvenilir ve düzenli." },
  { key: "libra", en: "Libra", tr: "Terazi", elementEn: "Air", elementTr: "Hava", range: "Sep 23 – Oct 22", attrsEn: "Diplomatic, fair and social.", attrsTr: "Diplomatik, adil ve sosyal." },
  { key: "scorpio", en: "Scorpio", tr: "Akrep", elementEn: "Water", elementTr: "Su", range: "Oct 23 – Nov 21", attrsEn: "Passionate, brave and sharp.", attrsTr: "Tutkulu, cesur ve keskin." },
  { key: "sagittarius", en: "Sagittarius", tr: "Yay", elementEn: "Fire", elementTr: "Ateş", range: "Nov 22 – Dec 21", attrsEn: "Optimistic, adventurous and honest.", attrsTr: "İyimser, maceracı ve dürüst." },
  { key: "capricorn", en: "Capricorn", tr: "Oğlak", elementEn: "Earth", elementTr: "Toprak", range: "Dec 22 – Jan 19", attrsEn: "Ambitious, disciplined and patient.", attrsTr: "Hırslı, disiplinli ve sabırlı." },
  { key: "aquarius", en: "Aquarius", tr: "Kova", elementEn: "Air", elementTr: "Hava", range: "Jan 20 – Feb 18", attrsEn: "Innovative, independent and friendly.", attrsTr: "Yenilikçi, bağımsız ve arkadaş canlısı." },
  { key: "pisces", en: "Pisces", tr: "Balık", elementEn: "Water", elementTr: "Su", range: "Feb 19 – Mar 20", attrsEn: "Artistic, empathetic and dreamy.", attrsTr: "Sanatçı ruhlu, empatik ve hayalperest." },
];

const RANGES: { start: [number, number]; index: number }[] = [
  { start: [3, 21], index: 0 },
  { start: [4, 20], index: 1 },
  { start: [5, 21], index: 2 },
  { start: [6, 21], index: 3 },
  { start: [7, 23], index: 4 },
  { start: [8, 23], index: 5 },
  { start: [9, 23], index: 6 },
  { start: [10, 24], index: 7 },
  { start: [11, 23], index: 8 },
  { start: [12, 22], index: 9 },
  { start: [1, 20], index: 10 },
  { start: [2, 19], index: 11 },
];

function signFor(date: Date): Sign {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  for (const entry of RANGES) {
    if (month === entry.start[0] && day >= entry.start[1]) return SIGNS[entry.index];
  }
  return SIGNS[0];
}

export default function Horoscope() {
  const [date, setDate] = useState("");
  const t = useTranslations("comp.horoscope");
  const locale = useLocale();
  const isTr = locale === "tr";

  const result = useMemo(() => {
    if (!date) return null;
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return null;
    return signFor(parsed);
  }, [date]);

  function clear() {
    setDate("");
  }

  return (
    <div>
      <label htmlFor="zodiac-date" className="block text-sm font-medium text-text">
        {t("dateLabel")}
      </label>
      <input
        id="zodiac-date"
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="mt-2 w-full max-w-sm rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {result ? (
        <div className="mt-6 max-w-md rounded-xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-muted">
            {t("sign")}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-text">
            {isTr ? `${result.tr} (${result.en})` : result.en}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted">{t("element")}</p>
              <p className="mt-0.5 font-medium text-text">
                {isTr ? result.elementTr : result.elementEn}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">{t("range")}</p>
              <p className="mt-0.5 font-medium tabular-nums text-text">
                {result.range}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {isTr ? result.attrsTr : result.attrsEn}
          </p>
        </div>
      ) : (
        <p className="mt-6 max-w-md rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={clear}
          disabled={!date}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}