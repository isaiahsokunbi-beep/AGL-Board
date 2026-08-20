"use client";

import { useEffect, useRef, useState } from "react";
import type { MetricCard as MetricCardType } from "@/content/board-paper";

function parseNumeric(value: string): number | null {
  const cleaned = value.replace(/[^0-9.-]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function toneFromCard(card: MetricCardType): "win" | "loss" | null {
  if (card.tone) return card.tone;
  if (card.negative) return "loss";
  if (card.value.startsWith("+")) return "win";
  return null;
}

export function MetricCardView({ card }: { card: MetricCardType }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState<string | null>(null);
  const numeric = parseNumeric(card.value);
  const tone = toneFromCard(card);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced || numeric === null) return;

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const duration = 700;
        const target = numeric;

        function tick(now: number) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) ** 3;
          const current = target * eased;
          const formatted = card.value.includes("₦")
            ? `₦${current.toFixed(1)}M`
            : card.value.includes("%")
              ? `${current.toFixed(1)}%`
              : card.value.includes("MT")
                ? `${current.toFixed(1)} MT`
                : String(Math.round(current));
          setDisplay(formatted);
          if (t < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [card.value, numeric, reduced]);

  const valueClass =
    tone === "win"
      ? "text-variance-favourable"
      : tone === "loss"
        ? "text-variance-unfavourable"
        : "text-text-primary";

  return (
    <div
      ref={ref}
      className="group flex flex-col rounded-lg border border-border-default bg-surface-metric p-4 transition-shadow hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-text-secondary">{card.label}</span>
        {tone && (
          <span
            className={`shrink-0 text-[10px] font-bold uppercase tracking-wide ${
              tone === "win" ? "text-variance-favourable" : "text-variance-unfavourable"
            }`}
          >
            {tone === "win" ? "↑ Win" : "↓ Gap"}
          </span>
        )}
      </div>
      <span className={`tabular-nums mt-1 text-value-metric font-bold ${valueClass}`}>
        {display ?? card.value}
      </span>
      {card.subtitle && (
        <span
          className={`mt-1.5 text-xs font-medium ${
            tone === "win"
              ? "text-variance-favourable"
              : tone === "loss"
                ? "text-variance-unfavourable"
                : "text-brand-orange"
          }`}
        >
          {card.subtitle}
        </span>
      )}
    </div>
  );
}
