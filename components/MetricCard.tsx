"use client";

import { useEffect, useRef, useState } from "react";
import type { MetricCard as MetricCardType } from "@/content/board-paper";

function parseNumeric(value: string): number | null {
  const cleaned = value.replace(/[^0-9.-]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** Rebuild display from the original template so ₦1,389,070,341 and ₦3.8B stay correct. */
function formatAnimatedValue(template: string, current: number): string {
  const match = template.match(/^(.*?)([+-]?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return template;

  const [, prefix, sign, numberPart, suffix] = match;
  const decimalDigits = numberPart.includes(".")
    ? (numberPart.split(".")[1]?.length ?? 0)
    : 0;
  const useGrouping = numberPart.includes(",");

  let body: string;
  if (decimalDigits > 0) {
    const fixed = current.toFixed(decimalDigits);
    body = useGrouping
      ? Number(fixed).toLocaleString("en-US", {
          minimumFractionDigits: decimalDigits,
          maximumFractionDigits: decimalDigits,
        })
      : fixed;
  } else if (useGrouping) {
    body = Math.round(current).toLocaleString("en-US");
  } else {
    body = String(Math.round(current));
  }

  return `${prefix}${sign}${body}${suffix}`;
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
          setDisplay(formatAnimatedValue(card.value, current));
          if (t < 1) requestAnimationFrame(tick);
          else setDisplay(card.value);
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
      className="group flex min-w-0 flex-col rounded-lg border border-border-default bg-surface-metric p-4 transition-shadow hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 text-xs font-medium text-text-secondary">
          {card.label}
        </span>
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
      <span
        className={`tabular-nums mt-1 break-words text-[clamp(1.05rem,2.8vw,1.5rem)] font-bold leading-tight ${valueClass}`}
      >
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
