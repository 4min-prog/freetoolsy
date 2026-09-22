"use client";

import { useMemo, useState } from "react";

const COMMON: string[] = [
  "123456",
  "12345678",
  "123456789",
  "12345",
  "sifre",
  "parola",
  "password",
  "qwerty",
  "qwerty123",
  "1q2w3e4r",
  "123123",
  "asd123",
  "deneme",
  "iloveyou",
];

type Rating = {
  label: string;
  className: string;
  bar: string;
};

function rate(value: string): Rating {
  if (!value) return { label: "Boş", className: "text-muted", bar: "bg-surface-2" };
  const pool =
    (/[a-z]/.test(value) ? 26 : 0) +
    (/[A-Z]/.test(value) ? 26 : 0) +
    (/\d/.test(value) ? 10 : 0) +
    (/[^A-Za-z0-9]/.test(value) ? 33 : 0);
  const bits = pool === 0 ? 0 : value.length * Math.log2(pool);
  if (bits < 28) return { label: "Çok zayıf", className: "text-danger", bar: "bg-[#FCA5A5]" };
  if (bits < 45) return { label: "Zayıf", className: "text-danger", bar: "bg-[#FCA5A5]" };
  if (bits < 70) return { label: "Orta", className: "text-warning", bar: "bg-[#FCD34D]" };
  if (bits < 100) return { label: "Güçlü", className: "text-success", bar: "bg-[#6EE7B7]" };
  return { label: "Çok güçlü", className: "text-success", bar: "bg-[#6EE7B7]" };
}

function entropyBits(value: string): number {
  const pool =
    (/[a-z]/.test(value) ? 26 : 0) +
    (/[A-Z]/.test(value) ? 26 : 0) +
    (/\d/.test(value) ? 10 : 0) +
    (/[^A-Za-z0-9]/.test(value) ? 33 : 0);
  return pool === 0 ? 0 : value.length * Math.log2(pool);
}

const CHECKS: { id: string; label: string; test: (v: string) => boolean }[] = [
  { id: "length", label: "En az 8 karakter", test: (v) => v.length >= 8 },
  { id: "lower", label: "Küçük harf içeriyor", test: (v) => /[a-z]/.test(v) },
  { id: "upper", label: "Büyük harf içeriyor", test: (v) => /[A-Z]/.test(v) },
  { id: "digit", label: "Rakam içeriyor", test: (v) => /\d/.test(v) },
  { id: "symbol", label: "Özel karakter içeriyor", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export default function ParolaGucTesti() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const result = useMemo(() => rate(password), [password]);
  const common = password.length > 0 && COMMON.indexOf(password.toLowerCase()) !== -1;
  const percentage = useMemo(() => {
    if (!password) return 0;
    const bits = entropyBits(password);
    return Math.min(100, Math.round((bits / 100) * 100));
  }, [password]);

  return (
    <div>
      <label htmlFor="parola-deger" className="block text-sm font-medium text-text">
        Parolanızı girin
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="parola-deger"
          type={visible ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Parola deneme için"
          autoComplete="off"
          className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          {visible ? "Gizle" : "Göster"}
        </button>
      </div>

      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className={`h-full rounded-full transition-all ${result.bar}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <span className={`font-medium ${result.className}`}>
            Güç: {result.label}
          </span>
          <span className="tabular-nums text-faint">
            ~{password ? Math.round(entropyBits(password)) : 0} bit entropi
          </span>
        </div>
      </div>

      {common && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
        >
          Bu, en yaygın parolalardan birine birebir uyuyor. Hemen değiştirin;
          kaba kuvvet saldırılarıyla saniyeler içinde kırılır.
        </p>
      )}

      <ul className="mt-4 space-y-2">
        {CHECKS.map((check) => {
          const ok = check.test(password);
          return (
            <li
              key={check.id}
              className="flex items-center gap-2.5 text-sm text-muted"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  ok ? "bg-[#6EE7B7] text-[#052E16]" : "bg-surface-2 text-faint"
                }`}
              >
                {ok ? "✓" : "•"}
              </span>
              {check.label}
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Parola yalnızca bu tarayıcıda test edilir; asla gönderilmez veya
        kaydedilmez. Tahmini entropi, karakter çeşitliliğine dayalı bir üst
        sınırdır; gerçek güç kullandığınız parolanın tahmin edilebilirliğine
        bağlıdır.
      </p>
    </div>
  );
}