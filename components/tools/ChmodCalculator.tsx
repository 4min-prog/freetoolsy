"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Perm = { read: boolean; write: boolean; execute: boolean };
type Preset = [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];

const PRESETS: [string, Preset][] = [
  ["777", [true, true, true, true, true, true, true, true, true]],
  ["755", [true, true, true, true, true, true, true, false, true]],
  ["644", [true, true, false, true, false, false, true, false, false]],
  ["600", [true, true, false, false, false, false, false, false, false]],
];

const SYMBOLS = ["r", "w", "x"];

function bits(group: Perm): number {
  return (group.read ? 4 : 0) + (group.write ? 2 : 0) + (group.execute ? 1 : 0);
}

function symbolic(groups: Perm[]): string {
  return groups
    .map((group) =>
      group.read && group.write && group.execute
        ? "rwx"
        : `${group.read ? "r" : "-"}${group.write ? "w" : "-"}${group.execute ? "x" : "-"}`
    )
    .join("");
}

export default function ChmodCalculator() {
  const [groups, setGroups] = useState<Perm[]>([
    { read: true, write: true, execute: true },
    { read: true, write: false, execute: true },
    { read: true, write: false, execute: false },
  ]);
  const t = useTranslations("comp.chmodCalculator");

  function toggle(groupIndex: number, perm: keyof Perm) {
    setGroups((current) =>
      current.map((group, index) =>
        index === groupIndex ? { ...group, [perm]: !group[perm] } : group
      )
    );
  }

  function applyPreset(preset: Preset) {
    setGroups([
      { read: preset[0], write: preset[1], execute: preset[2] },
      { read: preset[3], write: preset[4], execute: preset[5] },
      { read: preset[6], write: preset[7], execute: preset[8] },
    ]);
  }

  const numericValue = bits(groups[0]) * 100 + bits(groups[1]) * 10 + bits(groups[2]);
  const textValue = symbolic(groups);

  function handleCopy() {
    navigator.clipboard.writeText(String(numericValue)).catch(() => undefined);
  }

  const groupLabels = [t("owner"), t("group"), t("others")];
  const permLabels = [t("read"), t("write"), t("execute")];

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2 text-xs text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">{t("target")}</th>
              {SYMBOLS.map((symbol) => (
                <th key={symbol} className="px-3 py-2 text-center font-medium">
                  {symbol}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group, groupIndex) => (
              <tr key={groupLabels[groupIndex]} className="border-t border-border bg-surface">
                <td className="px-3 py-2 font-medium text-text">{groupLabels[groupIndex]}</td>
                {["read", "write", "execute"].map((perm, permIndex) => (
                  <td key={perm} className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      aria-label={permLabels[permIndex]}
                      checked={group[perm as keyof Perm]}
                      onChange={() => toggle(groupIndex, perm as keyof Perm)}
                      className="h-4 w-4 accent-accent"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg bg-accent px-5 py-2 text-lg font-bold tabular-nums text-on-accent transition-opacity hover:opacity-90"
        >
          {numericValue}
        </button>
        <span className="text-lg font-medium tabular-nums text-text">{textValue}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map(([label, preset]) => (
          <button
            key={label}
            type="button"
            onClick={() => applyPreset(preset)}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-text"
          >
            chmod {label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}