"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type VoiceOption = { uri: string; name: string; lang: string };

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [voiceUri, setVoiceUri] = useState("");
  const [rate, setRate] = useState("1");
  const [pitch, setPitch] = useState("1");
  const [speaking, setSpeaking] = useState(false);
  const [ready, setReady] = useState(false);
  const t = useTranslations("comp.textToSpeech");

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    function load() {
      const list = synth
        .getVoices()
        .map((voice) => ({
          uri: voice.voiceURI,
          name: voice.name,
          lang: voice.lang,
        }))
        .sort((a, b) => a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name));
      setVoices(list);
      setVoiceUri((current) => current || (list[0]?.uri ?? ""));
    }
    load();
    synth.addEventListener("voiceschanged", load);
    return () => synth.removeEventListener("voiceschanged", load);
  }, [ready]);

  function stop() {
    if (!ready) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function speak() {
    if (!ready || !text.trim()) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const selected = voices.find((item) => item.uri === voiceUri);
    if (selected) {
      const voice =
        synth.getVoices().find((item) => item.voiceURI === voiceUri) ?? null;
      utterance.voice = voice;
      utterance.lang = selected.lang;
    }
    utterance.rate = clamp(Number(rate), 0.5, 2);
    utterance.pitch = clamp(Number(pitch), 0, 2);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utterance);
  }

  return (
    <div>
      <div>
        <label htmlFor="tts-text" className="block text-sm font-medium text-text">
          {t("textLabel")}
        </label>
        <textarea
          id="tts-text"
          rows={5}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t("textPlaceholder")}
          className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tts-voice" className="block text-sm font-medium text-text">
            {t("voiceLabel")}
          </label>
          <select
            id="tts-voice"
            value={voiceUri}
            onChange={(event) => setVoiceUri(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            {voices.map((voice) => (
              <option key={voice.uri} value={voice.uri}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tts-rate" className="block text-sm font-medium text-text">
            {t("rateLabel")} {rate}
          </label>
          <input
            id="tts-rate"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            className="mt-3 w-full accent-accent"
          />
        </div>
        <div>
          <label htmlFor="tts-pitch" className="block text-sm font-medium text-text">
            {t("pitchLabel")} {pitch}
          </label>
          <input
            id="tts-pitch"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(event) => setPitch(event.target.value)}
            className="mt-3 w-full accent-accent"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={speak}
          disabled={!text.trim()}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {speaking ? t("restart") : t("speak")}
        </button>
        <button
          type="button"
          onClick={stop}
          disabled={!speaking}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("stop")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}