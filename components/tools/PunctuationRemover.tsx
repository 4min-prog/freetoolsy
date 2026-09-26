"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const PUNCTUATION = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

export default function PunctuationRemover() {
  const [input, setInput] = useState("");
  const [keepApostrophe, setKeepApostrophe] = useState(false);
  const [keepHyphen, setKeepHyphen] = useState(false);
  const t = useTranslations("comp.punctuationRemover");

  const { output, removed } = useMemo(() => {
    let count = 0;
    let result = "";
    for (const char of input) {
      if (!PUNCTUATION.includes(char)) {
        result += char;
        continue;
      }
      if (keepApostrophe && char === "'") {
        result += char;
        continue;
      }
      if (keepHyphen && char === "-") {
        result += char;
        continue;
      }
      count++;
    }
    return { output: result, removed: count };
  }, [input, keepApostrophe, keepHyphen]);

  return (
    <div>
      <label htmlFor="pr-input" className="block text-xs font-medium text-muted">
        {t("inputLabel")}
      </label>
      <textarea
        id="pr-input"
        value={input}
        onChange={(event) => setInput(event.target.value.slice(0, 10000))}
        placeholder={t("inputPlaceholder")}
        className="mt-1 min-h-28 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-3 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={keepApostrophe}
            onChange={(event) => setKeepApostrophe(event.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          {t("keepApostrophe")}
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={keepHyphen}
            onChange={(event) => setKeepHyphen(event.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          {t("keepHyphen")}
        </label>
      </div>

      {input ? (
        <p className="mt-3 text-sm text-muted">
          {t("removedCount", { count: removed })}
        </p>
      ) : null}

      <label htmlFor="pr-output" className="mt-4 block text-xs font-medium text-muted">
        {t("outputLabel")}
      </label>
      <textarea
        id="pr-output"
        readOnly
        value={output}
        placeholder={t("outputPlaceholder")}
        className="mt-1 min-h-28 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}