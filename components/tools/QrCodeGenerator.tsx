"use client";

import { showToast } from "@/lib/toast";

import { Component, useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";
import QRCode from "react-qr-code";

type QrType = "url" | "text" | "wifi" | "vcard" | "email" | "phone" | "sms" | "location";
type Level = "L" | "M" | "Q" | "H";
type Encryption = "WPA" | "WEP" | "nopass";

const TYPES: QrType[] = ["url", "text", "wifi", "vcard", "email", "phone", "sms", "location"];
const LEVELS: Level[] = ["L", "M", "Q", "H"];
const SIZES = [512, 1024, 2048];

// QR sürüm 40'in bayt modunda azami kapasitesi, hata düzeltme seviyesine göre.
// Asilida bu esigi asarsak qrcode-generator make() icinde hata firlatir ve
// sayfa komple cokup gidiyor; o yuzden render oncesinde kontrol ediyoruz.
const CAPACITY: Record<Level, number> = { L: 2953, M: 2331, Q: 1663, H: 1273 };

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

function escapeQr(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/:/g, "\\:")
    .replace(/"/g, '\\"');
}

function escapeVcard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function normalizeUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
  return `https://${value}`;
}

function buildVcard(form: FormState): string {
  const name = form.vName.trim();
  if (!name) return "";
  const parts = name.split(/\s+/);
  const first = parts[0];
  const last = parts.slice(1).join(" ");
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${escapeVcard(last)};${escapeVcard(first)};;;`, `FN:${escapeVcard(name)}`];
  if (form.vOrg.trim()) lines.push(`ORG:${escapeVcard(form.vOrg.trim())}`);
  if (form.vPhone.trim()) lines.push(`TEL;TYPE=CELL:${escapeVcard(form.vPhone.trim())}`);
  if (form.vEmail.trim()) lines.push(`EMAIL:${escapeVcard(form.vEmail.trim())}`);
  if (form.vUrl.trim()) lines.push(`URL:${escapeVcard(normalizeUrl(form.vUrl))}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

function buildPayload(type: QrType, form: FormState): string {
  switch (type) {
    case "url": {
      const url = normalizeUrl(form.url);
      return url;
    }
    case "text":
      return form.text;
    case "wifi": {
      const ssid = form.wifiSsid.trim();
      if (!ssid) return "";
      const parts = [`T:${form.wifiEncryption}`, `S:${escapeQr(ssid)}`];
      if (form.wifiEncryption !== "nopass" && form.wifiPassword) {
        parts.push(`P:${escapeQr(form.wifiPassword)}`);
      }
      if (form.wifiHidden) parts.push("H:true");
      return `WIFI:${parts.join(";")};;`;
    }
    case "vcard":
      return buildVcard(form);
    case "email": {
      const to = form.emailTo.trim();
      if (!to) return "";
      const query = new URLSearchParams();
      if (form.emailSubject.trim()) query.set("subject", form.emailSubject.trim());
      if (form.emailBody.trim()) query.set("body", form.emailBody.trim());
      const suffix = query.toString();
      return `mailto:${to}${suffix ? `?${suffix}` : ""}`;
    }
    case "phone": {
      const phone = form.phone.replace(/[^\d+]/g, "");
      return phone ? `tel:${phone}` : "";
    }
    case "sms": {
      const number = form.smsNumber.replace(/[^\d+]/g, "");
      if (!number) return "";
      return `SMSTO:${number}:${form.smsBody}`;
    }
    case "location": {
      const lat = form.lat.trim();
      const lng = form.lng.trim();
      if (!lat || !lng) return "";
      if (Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) return "";
      return `geo:${lat},${lng}`;
    }
    default:
      return "";
  }
}

type FormState = {
  url: string;
  text: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: Encryption;
  wifiHidden: boolean;
  vName: string;
  vPhone: string;
  vEmail: string;
  vOrg: string;
  vUrl: string;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  phone: string;
  smsNumber: string;
  smsBody: string;
  lat: string;
  lng: string;
};

const EMPTY_FORM: FormState = {
  url: "",
  text: "",
  wifiSsid: "",
  wifiPassword: "",
  wifiEncryption: "WPA",
  wifiHidden: false,
  vName: "",
  vPhone: "",
  vEmail: "",
  vOrg: "",
  vUrl: "",
  emailTo: "",
  emailSubject: "",
  emailBody: "",
  phone: "",
  smsNumber: "",
  smsBody: "",
  lat: "",
  lng: "",
};

/**
 * qrcode-generator kapasiteyi asan veri hatasi firlatir ve bu durumda
 * kullanici sadece bos bir sayfa gorur. Onlem olarak ozellestirilmis QR
 * onizlemesini izole ediyoruz.
 */
class PreviewBoundary extends Component<{ children: ReactNode; fallback: ReactNode }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Field(props: { htmlFor: string; label: string; children: React.ReactNode }) {  return (
    <div>
      <label htmlFor={props.htmlFor} className="block text-sm font-medium text-text">
        {props.label}
      </label>
      <div className="mt-1.5">{props.children}</div>
    </div>
  );
}

export default function QrCodeGenerator() {
  const [type, setType] = useState<QrType>("url");
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
  const [level, setLevel] = useState<Level>("M");
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [margin, setMargin] = useState(4);
  const [size, setSize] = useState(1024);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.qrCodeGenerator");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const payload = useMemo(() => buildPayload(type, form), [type, form]);
  const byteLength = useMemo(
    () => (payload ? new TextEncoder().encode(payload).length : 0),
    [payload]
  );
  const tooLong = byteLength > CAPACITY[level];

  /**
   * react-qr-code her zaman 0 mod icinde uretir; sessiz bolge (quiet zone)
   * disinda bir cerceve ve arka plan dikdortgeni ekleyerek disa aktarim
   * dosyasini birebir uretiyoruz. Yollarin koordinatlariyla degisiklik
   * yapmadigimiz icin bozulma olmuyor.
   */
  function buildSvg(): string | null {
    const node = document.querySelector("#qr-svg-wrap svg");
    if (!node) return null;
    const viewBox = node.getAttribute("viewBox");
    if (!viewBox) return null;
    const cells = Number(viewBox.trim().split(/\s+/)[3]);
    if (!cells) return null;
    const raw = new XMLSerializer().serializeToString(node);
    const inner = raw.slice(raw.indexOf(">") + 1, raw.lastIndexOf("</svg>"));
    const total = cells + margin * 2;
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${total}" height="${total}" shape-rendering="crispEdges">`,
      `<rect width="${total}" height="${total}" fill="${background}"/>`,
      `<g transform="translate(${margin},${margin})">${inner}</g>`,
      `</svg>`,
    ].join("");
  }

  function downloadPng() {
    const svg = buildSvg();
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const link = document.createElement("a");
        link.download = "freetoolsy-qr.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        showToast("download");
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function downloadSvg() {
    const svg = buildSvg();
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "freetoolsy-qr.svg";
    link.href = href;
    link.click();
    URL.revokeObjectURL(href);
    showToast("download");
  }

  async function copyPayload() {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const canGenerate = payload.length > 0 && !tooLong;

  return (
    <div>
      <div>
        <span className="block text-sm font-medium text-text">{t("typeLabel")}</span>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TYPES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setType(item)}
              aria-pressed={type === item}
              className={
                type === item
                  ? "rounded-lg border border-accent bg-accent/10 px-3 py-2 text-sm font-medium text-accent"
                  : "rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
              }
            >
              {t(`types.${item}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {type === "url" && (
          <Field htmlFor="qr-url" label={t("field.url")}>
            <input
              id="qr-url"
              type="text"
              value={form.url}
              onChange={(event) => update("url", event.target.value)}
              placeholder={t("ph.url")}
              spellCheck={false}
              autoComplete="url"
              className={inputClass}
            />
          </Field>
        )}

        {type === "text" && (
          <Field htmlFor="qr-text" label={t("field.text")}>
            <textarea
              id="qr-text"
              value={form.text}
              onChange={(event) => update("text", event.target.value)}
              rows={4}
              placeholder={t("ph.text")}
              className={`${inputClass} resize-y`}
            />
          </Field>
        )}

        {type === "wifi" && (
          <div className="grid gap-4">
            <Field htmlFor="qr-ssid" label={t("field.ssid")}>
              <input
                id="qr-ssid"
                type="text"
                value={form.wifiSsid}
                onChange={(event) => update("wifiSsid", event.target.value)}
                placeholder={t("ph.ssid")}
                spellCheck={false}
                className={inputClass}
              />
            </Field>
            <Field htmlFor="qr-wifi-pass" label={t("field.wifiPassword")}>
              <input
                id="qr-wifi-pass"
                type="text"
                value={form.wifiPassword}
                onChange={(event) => update("wifiPassword", event.target.value)}
                disabled={form.wifiEncryption === "nopass"}
                placeholder={t("ph.wifiPassword")}
                className={`${inputClass} disabled:opacity-50`}
              />
            </Field>
            <Field htmlFor="qr-wifi-enc" label={t("field.wifiEncryption")}>
              <select
                id="qr-wifi-enc"
                value={form.wifiEncryption}
                onChange={(event) => update("wifiEncryption", event.target.value as Encryption)}
                className={inputClass}
              >
                <option value="WPA">{t("enc.wpa")}</option>
                <option value="WEP">{t("enc.wep")}</option>
                <option value="nopass">{t("enc.none")}</option>
              </select>
            </Field>
            <label className="flex items-center gap-2.5 text-sm text-text">
              <input
                type="checkbox"
                checked={form.wifiHidden}
                onChange={(event) => update("wifiHidden", event.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-border accent-accent"
              />
              {t("field.wifiHidden")}
            </label>
          </div>
        )}

        {type === "vcard" && (
          <div className="grid gap-4">
            <Field htmlFor="qr-vname" label={t("field.vName")}>
              <input
                id="qr-vname"
                type="text"
                value={form.vName}
                onChange={(event) => update("vName", event.target.value)}
                placeholder={t("ph.vName")}
                autoComplete="name"
                className={inputClass}
              />
            </Field>
            <Field htmlFor="qr-vphone" label={t("field.vPhone")}>
              <input
                id="qr-vphone"
                type="tel"
                value={form.vPhone}
                onChange={(event) => update("vPhone", event.target.value)}
                placeholder={t("ph.vPhone")}
                autoComplete="tel"
                className={inputClass}
              />
            </Field>
            <Field htmlFor="qr-vemail" label={t("field.vEmail")}>
              <input
                id="qr-vemail"
                type="email"
                value={form.vEmail}
                onChange={(event) => update("vEmail", event.target.value)}
                placeholder={t("ph.vEmail")}
                autoComplete="email"
                className={inputClass}
              />
            </Field>
            <Field htmlFor="qr-vorg" label={t("field.vOrg")}>
              <input
                id="qr-vorg"
                type="text"
                value={form.vOrg}
                onChange={(event) => update("vOrg", event.target.value)}
                placeholder={t("ph.vOrg")}
                autoComplete="organization"
                className={inputClass}
              />
            </Field>
            <Field htmlFor="qr-vurl" label={t("field.vUrl")}>
              <input
                id="qr-vurl"
                type="text"
                value={form.vUrl}
                onChange={(event) => update("vUrl", event.target.value)}
                placeholder={t("ph.vUrl")}
                spellCheck={false}
                className={inputClass}
              />
            </Field>
          </div>
        )}

        {type === "email" && (
          <div className="grid gap-4">
            <Field htmlFor="qr-mailto" label={t("field.emailTo")}>
              <input
                id="qr-mailto"
                type="email"
                value={form.emailTo}
                onChange={(event) => update("emailTo", event.target.value)}
                placeholder={t("ph.emailTo")}
                autoComplete="email"
                className={inputClass}
              />
            </Field>
            <Field htmlFor="qr-mailsubject" label={t("field.emailSubject")}>
              <input
                id="qr-mailsubject"
                type="text"
                value={form.emailSubject}
                onChange={(event) => update("emailSubject", event.target.value)}
                placeholder={t("ph.emailSubject")}
                className={inputClass}
              />
            </Field>
            <Field htmlFor="qr-mailbody" label={t("field.emailBody")}>
              <textarea
                id="qr-mailbody"
                value={form.emailBody}
                onChange={(event) => update("emailBody", event.target.value)}
                rows={3}
                placeholder={t("ph.emailBody")}
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>
        )}

        {type === "phone" && (
          <Field htmlFor="qr-phone" label={t("field.phone")}>
            <input
              id="qr-phone"
              type="tel"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              placeholder={t("ph.phone")}
              autoComplete="tel"
              className={inputClass}
            />
          </Field>
        )}

        {type === "sms" && (
          <div className="grid gap-4">
            <Field htmlFor="qr-smsnum" label={t("field.smsNumber")}>
              <input
                id="qr-smsnum"
                type="tel"
                value={form.smsNumber}
                onChange={(event) => update("smsNumber", event.target.value)}
                placeholder={t("ph.smsNumber")}
                autoComplete="tel"
                className={inputClass}
              />
            </Field>
            <Field htmlFor="qr-smsbody" label={t("field.smsBody")}>
              <textarea
                id="qr-smsbody"
                value={form.smsBody}
                onChange={(event) => update("smsBody", event.target.value)}
                rows={3}
                placeholder={t("ph.smsBody")}
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>
        )}

        {type === "location" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field htmlFor="qr-lat" label={t("field.lat")}>
              <input
                id="qr-lat"
                type="text"
                inputMode="decimal"
                value={form.lat}
                onChange={(event) => update("lat", event.target.value)}
                placeholder={t("ph.lat")}
                spellCheck={false}
                className={`${inputClass} font-mono`}
              />
            </Field>
            <Field htmlFor="qr-lng" label={t("field.lng")}>
              <input
                id="qr-lng"
                type="text"
                inputMode="decimal"
                value={form.lng}
                onChange={(event) => update("lng", event.target.value)}
                placeholder={t("ph.lng")}
                spellCheck={false}
                className={`${inputClass} font-mono`}
              />
            </Field>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton
          onApply={() => {
            setType("url");
            setForm({ ...EMPTY_FORM, url: SAMPLES["qr-code-generator"] });
            setLevel("M");
            setForeground("#000000");
            setBackground("#ffffff");
            setMargin(4);
          }}
        />
        {payload && (
          <button
            type="button"
            onClick={() => setForm({ ...EMPTY_FORM })}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {t("clear")}
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div
          id="qr-svg-wrap"
          className="flex items-center justify-center rounded-lg border border-border"
          style={{ backgroundColor: background, padding: margin * 6 }}
        >
          {canGenerate ? (
            <PreviewBoundary
              fallback={
                <p className="py-16 text-center text-sm text-muted">{t("tooLong")}</p>
              }
            >
              <QRCode
                value={payload}
                size={220}
                level={level}
                bgColor={background}
                fgColor={foreground}
                style={{ maxWidth: 220, width: "100%", height: "auto" }}
              />
            </PreviewBoundary>
          ) : (
            <p className="py-16 text-center text-sm text-muted">{tooLong ? t("tooLong") : t("emptyMsg")}</p>
          )}
        </div>

        <div className="grid content-start gap-5">
          <div>
            <span className="block text-sm font-medium text-text">{t("levelTitle")}</span>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {LEVELS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLevel(item)}
                  aria-pressed={level === item}
                  title={t(`level.${item}`)}
                  className={
                    level === item
                      ? "rounded-lg border border-accent bg-accent/10 px-2 py-2 text-sm font-medium text-accent"
                      : "rounded-lg border border-border bg-surface px-2 py-2 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
                  }
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-faint">{t(`level.${level}`)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="qr-fg" className="block text-sm font-medium text-text">
                {t("fgColor")}
              </label>
              <div className="mt-1.5 flex items-center gap-2.5">
                <input
                  id="qr-fg"
                  type="color"
                  value={foreground}
                  onChange={(event) => setForeground(event.target.value)}
                  className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-border bg-bg p-1"
                />
                <span className="font-mono text-sm text-text">{foreground.toUpperCase()}</span>
              </div>
            </div>
            <div>
              <label htmlFor="qr-bg" className="block text-sm font-medium text-text">
                {t("bgColor")}
              </label>
              <div className="mt-1.5 flex items-center gap-2.5">
                <input
                  id="qr-bg"
                  type="color"
                  value={background}
                  onChange={(event) => setBackground(event.target.value)}
                  className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-border bg-bg p-1"
                />
                <span className="font-mono text-sm text-text">{background.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="qr-margin" className="text-sm font-medium text-text">
                {t("margin")}
              </label>
              <span className="text-sm tabular-nums text-muted">{margin}</span>
            </div>
            <input
              id="qr-margin"
              type="range"
              min={0}
              max={16}
              step={1}
              value={margin}
              onChange={(event) => setMargin(Number(event.target.value))}
              className="mt-2 w-full cursor-pointer accent-accent"
            />
          </div>

          <div>
            <label htmlFor="qr-size" className="block text-sm font-medium text-text">
              {t("sizeTitle")}
            </label>
            <select
              id="qr-size"
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              className={`${inputClass} mt-1.5`}
            >
              {SIZES.map((item) => (
                <option key={item} value={item}>
                  {item} x {item} px
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {payload && (
        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-xs tabular-nums text-faint">{t("charCount", { count: byteLength })}</p>
          <button
            type="button"
            onClick={copyPayload}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {copied ? t("copied") : t("copyPayload")}
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={downloadPng}
          disabled={!canGenerate}
          className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {t("downloadPng")}
        </button>
        <button
          type="button"
          onClick={downloadSvg}
          disabled={!canGenerate}
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("downloadSvg")}
        </button>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}
