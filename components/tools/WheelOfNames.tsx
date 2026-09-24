"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export default function WheelOfNames() {
  const [names, setNames] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const t = useTranslations("comp.wheelOfNames");

  const list = useMemo(
    () =>
      names
        .split("\n")
        .map((name) => name.trim())
        .filter(Boolean),
    [names]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || list.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = canvas.width / 2;
    const count = list.length;
    const slice = (Math.PI * 2) / count;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(size, size);
    ctx.rotate(rotation);
    for (let i = 0; i < count; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size, i * slice, (i + 1) * slice);
      ctx.closePath();
      ctx.fillStyle = `hsl(${((360 / count) * i + 20) % 360} 70% 55%)`;
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.save();
      ctx.rotate(i * slice + slice / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 13px system-ui, sans-serif";
      const label = list[i];
      const short = label.length > 12 ? `${label.slice(0, 11)}...` : label;
      ctx.fillText(short, size - 12, 4);
      ctx.restore();
    }
    ctx.restore();
    ctx.beginPath();
    ctx.arc(size, size, size * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
    ctx.stroke();
  }, [list, rotation]);

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  function spin() {
    if (spinning || list.length === 0) return;
    setSpinning(true);
    setWinner("");
    const targetRotation = rotation + (Math.random() * 240 + 1440) * (Math.PI / 180);
    const duration = 4000;
    const start = performance.now();
    const startRotation = rotation;

    function frame(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startRotation + (targetRotation - startRotation) * eased;
      setRotation(current);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(frame);
      } else {
        setSpinning(false);
        const normalized = ((current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const slice = (Math.PI * 2) / list.length;
        // Pointer is at 12 o'clock (angle -PI/2 in canvas space).
        const pointerAngle = (Math.PI * 2 - normalized + Math.PI / 2 + Math.PI) % (Math.PI * 2);
        const index = Math.floor(pointerAngle / slice) % list.length;
        const picked = list[(list.length - index) % list.length] ?? list[0];
        setWinner(picked || "");
      }
    }
    animationRef.current = requestAnimationFrame(frame);
  }

  function resetWheel() {
    if (spinning) return;
    setRotation(0);
    setWinner("");
  }

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="pointer-events-none absolute left-1/2 top-[-6px] z-10 h-0 w-0 -translate-x-1/2 border-x-8 border-t-[14px] border-x-transparent border-t-accent" />
            <canvas
              ref={canvasRef}
              width={360}
              height={360}
              className="max-w-full rounded-full shadow"
            />
          </div>
          {list.length === 0 ? (
            <p className="mt-3 text-sm text-muted">{t("emptyWheel")}</p>
          ) : null}
          {winner ? (
            <p className="mt-4 rounded-lg bg-accent/10 px-4 py-2 text-center text-sm font-medium text-accent">
              {t("winner", { name: winner })}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="wn-names" className="block text-sm font-medium text-text">
            {t("namesLabel")}
          </label>
          <textarea
            id="wn-names"
            value={names}
            onChange={(event) => {
              setNames(event.target.value);
              setWinner("");
            }}
            rows={8}
            spellCheck={false}
            placeholder={t("namesPlaceholder")}
            className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="mt-2 text-xs text-muted">
            {t("count", { count: list.length })}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setNames("Ada\nLeo\nMira\nEfe\nZara\nKaan")}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {t("sample")}
            </button>
            <button
              type="button"
              onClick={spin}
              disabled={spinning || list.length === 0}
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {spinning ? t("spinning") : t("spin")}
            </button>
            <button
              type="button"
              onClick={resetWheel}
              disabled={spinning}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
            >
              {t("reset")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}