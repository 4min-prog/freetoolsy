"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

const WORDS_PER_MINUTE = 238;
const GRADE_SCALE_MAX = 18;
const EASE_SCALE_MAX = 100;

const BE_VERBS = new Set([
  "am",
  "are",
  "be",
  "been",
  "being",
  "get",
  "gets",
  "getting",
  "got",
  "gotten",
  "is",
  "was",
  "were",
]);

const IRREGULAR_PARTICIPLES = new Set([
  "built",
  "chosen",
  "done",
  "driven",
  "eaten",
  "fallen",
  "forgotten",
  "found",
  "given",
  "gone",
  "held",
  "hidden",
  "kept",
  "known",
  "left",
  "lost",
  "made",
  "paid",
  "read",
  "said",
  "seen",
  "sent",
  "shown",
  "sold",
  "spoken",
  "taken",
  "told",
  "worn",
  "written",
]);

const TURKISH_AGENT_MARKER = "tarafindan";

const TURKISH_STRONG_LETTERS = /[çÇğĞıİ]/g;

const TURKISH_WEAK_LETTERS = /[öÖşŞüÜ]/g;

const GERMAN_MARKERS = /[ßäÄ]/g;

const LETTERS = /[A-Za-zÇĞİÖŞÜçğıöşüâîûÂÎÛ]/g;

const TURKISH_PASSIVE_SUFFIX = /(ildi|ildı|ıldı|ilmiş|ilmış|ulmuş|uldu|üldü)$/;

const ENGLISH_PARTICIPLE_SUFFIX = /(ed|en|wn|ne|ht|ld|de|te|ue|un|ug|ot)$/;

type Band = "easy" | "medium" | "hard";

type Language = "tr" | "en";

type ScoreCard = {
  key: string;
  score: number;
  band: Band;
  percent: number;
  overflow: boolean;
  labelKey: string;
};

const BAND_LABEL: Record<Band, string> = {
  easy: "text-success",
  medium: "text-warning",
  hard: "text-danger",
};

const BAND_BAR: Record<Band, string> = {
  easy: "bg-success",
  medium: "bg-warning",
  hard: "bg-danger",
};

const BAND_DOT: Record<Band, string> = {
  easy: "bg-success",
  medium: "bg-warning",
  hard: "bg-danger",
};

const GRADE_CARD_KEYS = [
  "fleschKincaidLabel",
  "gunningFogLabel",
  "smogLabel",
  "colemanLiauLabel",
  "ariLabel",
];

function countSyllables(word: string): number {
  const groups = word.match(/[aeiouy]+/g);
  return groups && groups.length > 0 ? groups.length : 1;
}

function isPassiveAt(words: string[], index: number): boolean {
  const word = words[index];
  if (!word) return false;
  if (word === TURKISH_AGENT_MARKER) return true;
  if (TURKISH_PASSIVE_SUFFIX.test(word)) return true;
  const previous = index > 0 ? words[index - 1] : "";
  if (previous && BE_VERBS.has(previous)) {
    return IRREGULAR_PARTICIPLES.has(word) || ENGLISH_PARTICIPLE_SUFFIX.test(word);
  }
  return false;
}

function splitSentences(value: string): string[] {
  return value.split(/[.!?\u2026]+(?:\s|$)/).filter((part) => part.trim().length > 0);
}

function tokenize(value: string): string[] {
  return value
    .replace(/[ıİ]/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((part) => part.length > 0);
}

function detectLanguage(value: string): Language {
  const total = (value.match(LETTERS) ?? []).length;
  if (total === 0) return "en";
  if (value.match(GERMAN_MARKERS)) return "en";
  const strong = (value.match(TURKISH_STRONG_LETTERS) ?? []).length;
  if (strong / total >= 0.01) return "tr";
  const weak = (value.match(TURKISH_WEAK_LETTERS) ?? []).length;
  return weak / total >= 0.03 ? "tr" : "en";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function cap(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMinutes(minutes: number): string {
  if (minutes < 1) return "<1";
  if (minutes < 60) return String(Math.round(minutes));
  const hours = Math.floor(minutes / 60);
  const rest = Math.round(minutes % 60);
  return rest === 0 ? String(hours) : `${hours}h ${rest}m`;
}

function gradeKey(grade: number): string {
  if (grade <= 5) return "levelElementary";
  if (grade <= 8) return "levelMiddleSchool";
  if (grade <= 12) return "levelHighSchool";
  if (grade <= 16) return "levelCollege";
  return "levelGraduate";
}

function gradeBand(grade: number): Band {
  if (grade < 9) return "easy";
  if (grade < 13) return "medium";
  return "hard";
}

function easeBand(score: number): Band {
  if (score >= 50) return "easy";
  if (score >= 30) return "medium";
  return "hard";
}

function atesmanKey(score: number): string {
  if (score >= 90) return "trLevelVeryEasy";
  if (score >= 70) return "trLevelEasy";
  if (score >= 50) return "trLevelMedium";
  if (score >= 30) return "trLevelHard";
  return "trLevelVeryHard";
}

function cetinkayaKey(score: number): string {
  if (score >= 51) return "trEduIndependent";
  if (score >= 35) return "trEduInstructional";
  return "trEduFrustration";
}

function fleschKey(score: number): string {
  if (score >= 90) return "levelVeryEasy";
  if (score >= 70) return "levelEasy";
  if (score >= 50) return "levelFairlyDifficult";
  return "levelDifficult";
}

function fleschBand(score: number): Band {
  if (score >= 60) return "easy";
  if (score >= 40) return "medium";
  return "hard";
}

export default function ReadabilityScore() {
  const [text, setText] = useState("");
  const t = useTranslations("comp.readabilityScore");

  const result = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const language = detectLanguage(trimmed);
    const sentenceTexts = splitSentences(trimmed);
    if (sentenceTexts.length === 0) return null;

    let words = 0;
    let syllables = 0;
    let letters = 0;
    let longWords = 0;
    let passiveSentences = 0;

    for (const sentenceText of sentenceTexts) {
      const tokens = tokenize(sentenceText);
      if (tokens.length === 0) continue;

      let sentenceIsPassive = false;
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        syllables += countSyllables(token);
        letters += (token.match(/[a-z]/g) ?? []).length;
        if (countSyllables(token) >= 3) longWords += 1;
        if (isPassiveAt(tokens, i)) sentenceIsPassive = true;
      }

      words += tokens.length;
      if (sentenceIsPassive) passiveSentences += 1;
    }

    if (words === 0) return null;

    const sentences = sentenceTexts.length;
    const avgWords = words / sentences;
    const avgSyllables = syllables / words;
    const longWordRatio = longWords / words;
    const lettersPer100Words = (letters / words) * 100;
    const sentencesPer100Words = (sentences / words) * 100;

    const fleschRaw = 206.835 - 1.015 * avgWords - 84.6 * avgSyllables;
    const atesmanRaw = 198.825 - 40.175 * avgSyllables - 2.61 * avgWords;
    const cetinkayaRaw = 118.823 - 25.987 * avgSyllables - 0.971 * avgWords;

    const fk = 0.39 * avgWords + 11.8 * avgSyllables - 15.59;
    const gunning = 0.4 * (avgWords + 100 * longWordRatio);
    const smog = 1.043 * Math.sqrt(longWords * (30 / sentences)) + 3.1291;
    const colemanLiau = 0.0588 * lettersPer100Words - 0.296 * sentencesPer100Words - 15.8;
    const ari = 4.71 * (letters / words) + 0.5 * avgWords - 21.43;

    const gradeValues = [fk, gunning, smog, colemanLiau, ari];
    const gradeAverage = gradeValues.reduce((sum, value) => sum + Math.max(0, value), 0) / gradeValues.length;

    const gradeCards: ScoreCard[] = gradeValues.map((value, index) => {
      const score = round1(clamp(value, 0, GRADE_SCALE_MAX));
      return {
        key: GRADE_CARD_KEYS[index],
        score,
        band: gradeBand(value),
        percent: clamp((score / GRADE_SCALE_MAX) * 100, 0, 100),
        overflow: value > GRADE_SCALE_MAX,
        labelKey: gradeKey(value),
      };
    });

    if (language === "tr") {
      const atesmanScore = round1(clamp(atesmanRaw, 0, EASE_SCALE_MAX));
      const cetinkayaScore = round1(clamp(cetinkayaRaw, 0, EASE_SCALE_MAX));
      const primary: ScoreCard = {
        key: "trFormulaLabel",
        score: atesmanScore,
        band: easeBand(atesmanScore),
        percent: atesmanScore,
        overflow: atesmanRaw > EASE_SCALE_MAX,
        labelKey: atesmanKey(atesmanScore),
      };
      const secondary: ScoreCard = {
        key: "trEduFormulaLabel",
        score: cetinkayaScore,
        band: easeBand(cetinkayaScore),
        percent: cetinkayaScore,
        overflow: cetinkayaRaw > EASE_SCALE_MAX,
        labelKey: cetinkayaKey(cetinkayaScore),
      };
      return {
        language,
        words,
        sentences,
        syllables,
        letters,
        longWords,
        avgWords: round1(avgWords),
        avgSyllables: round1(avgSyllables),
        passivePercent: round1((passiveSentences / sentences) * 100),
        readingMinutes: words / WORDS_PER_MINUTE,
        primary,
        levelHeadingKey: "educationLabel",
        levelScore: secondary.score,
        levelOverflow: secondary.overflow,
        levelLabelKey: secondary.labelKey,
        cards: [primary, secondary, ...gradeCards],
        caveatKey: "englishFormulaCaveat" as string | null,
      };
    }

    const fleschScore = Math.round(clamp(fleschRaw, 0, EASE_SCALE_MAX));
    const primary: ScoreCard = {
      key: "fleschLabel",
      score: fleschScore,
      band: fleschBand(fleschScore),
      percent: fleschScore,
      overflow: false,
      labelKey: fleschKey(fleschScore),
    };
    return {
      language,
      words,
      sentences,
      syllables,
      letters,
      longWords,
      avgWords: round1(avgWords),
      avgSyllables: round1(avgSyllables),
      passivePercent: round1((passiveSentences / sentences) * 100),
      readingMinutes: words / WORDS_PER_MINUTE,
      primary,
      levelHeadingKey: "gradeLabel",
      levelScore: round1(clamp(gradeAverage, 0, GRADE_SCALE_MAX)),
      levelOverflow: gradeAverage > GRADE_SCALE_MAX,
      levelLabelKey: gradeKey(gradeAverage),
      cards: [primary, ...gradeCards],
      caveatKey: null as string | null,
    };
  }, [text]);

  const scoreBand: Band = result ? result.primary.band : "medium";

  return (
    <div>
      <label htmlFor="okunabilirlik-metin" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="okunabilirlik-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={10}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setText(t("sampleText"))} />
        <button
          type="button"
          onClick={() => setText(t("simpleSampleText"))}
          className="min-h-10 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {t("simpleSample")}
        </button>
        <button
          type="button"
          onClick={() => setText(t("complexSampleText"))}
          className="min-h-10 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {t("complexSample")}
        </button>
      </div>

      {result ? (
        <div className="mt-5">
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${BAND_DOT[result.primary.band]}`} />
                <span className="text-sm font-medium text-text">{t(result.primary.key)}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
                  {t("languageLabel")}: {t(result.language === "tr" ? "langTurkish" : "langEnglish")}
                </span>
                <span className={`text-4xl font-bold tabular-nums tracking-tight ${BAND_LABEL[scoreBand]}`}>
                  {result.primary.score}
                  {result.primary.overflow ? "+" : ""}
                </span>
              </div>
            </div>

            <div
              role="progressbar"
              aria-label={t(result.primary.key)}
              aria-valuenow={result.primary.score}
              aria-valuemin={0}
              aria-valuemax={EASE_SCALE_MAX}
              className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-2"
            >
              <div
                className={`h-full rounded-full ${BAND_BAR[result.primary.band]}`}
                style={{ width: `${result.primary.percent}%` }}
              />
            </div>

            <p className="mt-2 text-sm font-medium text-muted">{t(result.primary.labelKey)}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{t(`meaning${cap(scoreBand)}`)}</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-bg px-3 py-2.5">
                <p className="text-xs text-muted">{t(result.levelHeadingKey)}</p>
                <p className={`mt-0.5 text-xl font-bold tabular-nums tracking-tight ${BAND_LABEL[scoreBand]}`}>
                  {result.levelScore}
                  {result.levelOverflow ? "+" : ""}
                </p>
                <p className="mt-0.5 text-xs font-medium text-text">{t(result.levelLabelKey)}</p>
              </div>
              <div className="rounded-lg border border-border bg-bg px-3 py-2.5">
                <p className="text-xs text-muted">{t("readingTimeLabel")}</p>
                <p className="mt-0.5 text-xl font-bold tabular-nums tracking-tight text-text">
                  {formatMinutes(result.readingMinutes)}
                  {" "}
                  <span className="text-xs font-medium text-muted">{t("minutesLabel")}</span>
                </p>
              </div>
              <div className="rounded-lg border border-border bg-bg px-3 py-2.5">
                <p className="text-xs text-muted">{t("targetAudienceLabel")}</p>
                <p className="mt-1 text-xs font-medium leading-relaxed text-text">{t(`audience${cap(scoreBand)}`)}</p>
              </div>
            </div>
          </div>

          <h3 className="mt-6 text-sm font-semibold text-text">{t("formulasLabel")}</h3>
          <ul className="mt-2 grid gap-3 sm:grid-cols-2">
            {result.cards.map((card) => (
              <li key={card.key} className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className={`h-2 w-2 rounded-full ${BAND_DOT[card.band]}`} />
                  <span className="text-sm font-medium text-text">{t(card.key)}</span>
                </div>
                <p className={`mt-1 text-3xl font-bold tabular-nums tracking-tight ${BAND_LABEL[card.band]}`}>
                  {card.score}
                  {card.overflow ? "+" : ""}
                </p>
                <div
                  role="progressbar"
                  aria-label={t(card.key)}
                  aria-valuenow={card.score}
                  aria-valuemin={0}
                  aria-valuemax={card.key === "fleschLabel" || card.key.startsWith("tr") ? EASE_SCALE_MAX : GRADE_SCALE_MAX}
                  className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-2"
                >
                  <div className={`h-full rounded-full ${BAND_BAR[card.band]}`} style={{ width: `${card.percent}%` }} />
                </div>
                <p className="mt-1.5 text-xs font-medium text-muted">{t(card.labelKey)}</p>
              </li>
            ))}
          </ul>

          {result.caveatKey ? <p className="mt-2 text-xs leading-relaxed text-muted">{t(result.caveatKey)}</p> : null}

          <h3 className="mt-6 text-sm font-semibold text-text">{t("statisticsLabel")}</h3>
          <dl className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("statWords")}</dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">{result.words}</dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("statSentences")}</dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">{result.sentences}</dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("statSyllables")}</dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">{result.syllables}</dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("avgLabel")}</dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">{result.avgWords}</dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("statAvgSyllables")}</dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
                {result.avgSyllables}
              </dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("statLongWords")}</dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">{result.longWords}</dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("statPassiveVoice")}</dt>
              <dd
                className={`mt-0.5 text-xl font-semibold tabular-nums tracking-tight ${
                  result.passivePercent > 20 ? "text-warning" : "text-text"
                }`}
              >
                {result.passivePercent}%
              </dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("statLetters")}</dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">{result.letters}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs leading-relaxed text-muted">{t("passiveNote")}</p>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">{t("empty")}</p>
        </div>
      )}
    </div>
  );
}