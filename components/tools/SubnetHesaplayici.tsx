"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

function parseIPv4(value: string): number | null {
  const parts = value.trim().split(".");
  if (parts.length !== 4) return null;
  let result = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const octet = Number(part);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null;
    result = ((result << 8) | octet) >>> 0;
  }
  return result >>> 0;
}

function ipToString(value: number): string {
  return [
    (value >>> 24) & 255,
    (value >>> 16) & 255,
    (value >>> 8) & 255,
    value & 255,
  ].join(".");
}

function netmaskFromPrefix(prefix: number): number {
  if (prefix === 0) return 0;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

function Stat(props: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-bg px-3 py-3 text-center">
      <div
        className={`text-lg font-semibold tabular-nums tracking-tight text-text ${
          props.mono ? "font-mono" : ""
        }`}
      >
        {props.value}
      </div>
      <div className="mt-1 text-xs text-muted">{props.label}</div>
    </div>
  );
}

export default function SubnetHesaplayici() {
  const [ip, setIp] = useState("");
  const [prefix, setPrefix] = useState("");
  const [result, setResult] = useState<{
    network: string;
    broadcast: string;
    mask: string;
    totalHosts: number;
    usableHosts: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("comp.subnet");
  const locale = useLocale();

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale),
    [locale]
  );

  function calculate() {
    const ipValue = parseIPv4(ip);
    const prefixValue = Number(prefix.trim());
    if (ipValue === null || !Number.isInteger(prefixValue) || prefixValue < 0 || prefixValue > 32) {
      setResult(null);
      setError(t("invalid"));
      return;
    }
    const mask = netmaskFromPrefix(prefixValue);
    const network = ipValue & mask;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const hostBits = 32 - prefixValue;
    const totalHosts = 2 ** hostBits;
    const usableHosts = prefixValue <= 30 ? totalHosts - 2 : prefixValue === 31 ? 2 : 1;
    setError(null);
    setResult({
      network: ipToString(network),
      broadcast: ipToString(broadcast),
      mask: ipToString(mask),
      totalHosts,
      usableHosts,
    });
  }

  const tiles = result
    ? [
        { key: "network", label: t("network"), value: result.network, mono: true as const },
        { key: "broadcast", label: t("broadcast"), value: result.broadcast, mono: true as const },
        { key: "mask", label: t("mask"), value: result.mask, mono: true as const },
        { key: "hosts", label: t("hosts"), value: formatter.format(result.totalHosts), mono: false as const },
        { key: "usable", label: t("usable"), value: formatter.format(result.usableHosts), mono: false as const },
      ]
    : [];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="subnet-ip" className="block text-sm font-medium text-text">
            {t("ipLabel")}
          </label>
          <input
            id="subnet-ip"
            type="text"
            value={ip}
            onChange={(event) => setIp(event.target.value)}
            placeholder="e.g. 192.168.1.0"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="subnet-prefix" className="block text-sm font-medium text-text">
            {t("prefixLabel")}
          </label>
          <input
            id="subnet-prefix"
            type="text"
            inputMode="numeric"
            value={prefix}
            onChange={(event) => setPrefix(event.target.value)}
            placeholder="e.g. 24"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <SampleButton onApply={() => { setIp("192.168.1.0"); setPrefix("24"); }} />
      </div>

      <button
        type="button"
        onClick={calculate}
        className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("calculate")}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
        >
          {error}
        </p>
      )}

      {result ? (
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {tiles.map((tile) => (
            <Stat
              key={tile.key}
              label={tile.label}
              value={tile.value}
              mono={tile.mono}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">-</p>
        </div>
      )}
    </div>
  );
}