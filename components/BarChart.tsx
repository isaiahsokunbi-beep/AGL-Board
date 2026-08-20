"use client";

import { useEffect, useRef, useState } from "react";
import type { BarChart as BarChartType } from "@/content/board-paper";

function parseAmount(s: string): number {
  const m = s.match(/[\d,.]+/);
  if (!m) return 0;
  return parseFloat(m[0].replace(/,/g, ""));
}

function budgetDelta(actual: string, budget: string): { pct: number; beat: boolean } | null {
  if (!budget.trim()) return null;
  const a = parseAmount(actual);
  const b = parseAmount(budget);
  if (b <= 0) return null;
  const pct = ((a - b) / b) * 100;
  return { pct, beat: a >= b };
}

export function BarChartView({ chart }: { chart: BarChartType }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const maxValue = Math.max(
    1,
    ...chart.items.flatMap((i) => [parseAmount(i.actual), parseAmount(i.budget)]),
  );

  return (
    <figure
      ref={ref}
      className="chart-visual mt-6 overflow-hidden rounded-lg border border-border-default bg-surface-metric p-4 sm:p-5 md:p-6"
    >
      <figcaption className="text-sm font-semibold text-text-primary">
        {chart.title}
      </figcaption>
      <div className="mt-4 space-y-5">
        {chart.items.map((item, idx) => {
          const actualPct = Math.min(100, (parseAmount(item.actual) / maxValue) * 100);
          const budgetPct = Math.min(100, (parseAmount(item.budget) / maxValue) * 100);
          const delay = reduced ? 0 : idx * 60;
          const delta = budgetDelta(item.actual, item.budget);
          const hasBudget = Boolean(item.budget.trim());

          return (
            <div key={item.label} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-[13px] font-semibold text-text-primary">{item.label}</p>
                {delta && (
                  <span
                    className={`text-[11px] font-bold tabular-nums ${
                      delta.beat ? "text-variance-favourable" : "text-variance-unfavourable"
                    }`}
                  >
                    {delta.beat ? "↑" : "↓"}{" "}
                    {delta.pct >= 0 ? "+" : ""}
                    {delta.pct.toFixed(1)}% vs budget
                  </span>
                )}
              </div>

              <div className="mt-2 space-y-2">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-text-secondary">Actual</span>
                    <span className="tabular-nums font-semibold text-text-primary">
                      {item.actual}
                    </span>
                  </div>
                  <div className="relative h-chart-bar w-full min-w-0 overflow-hidden rounded-full bg-chart-track">
                    <div
                      className="absolute inset-y-0 left-0 max-w-full rounded-full bg-chart-local-trade transition-[width] duration-700 ease-out"
                      style={{
                        width: visible ? `${actualPct}%` : "0%",
                        transitionDelay: `${delay + 60}ms`,
                      }}
                    />
                  </div>
                </div>

                {hasBudget && (
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-text-secondary">Budget</span>
                      <span className="tabular-nums text-text-secondary">{item.budget}</span>
                    </div>
                    <div className="relative h-chart-bar w-full min-w-0 overflow-hidden rounded-full bg-chart-track">
                      <div
                        className="absolute inset-y-0 left-0 max-w-full rounded-full bg-chart-budget transition-[width] duration-700 ease-out"
                        style={{
                          width: visible ? `${budgetPct}%` : "0%",
                          transitionDelay: `${delay}ms`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <table className="chart-print-table mt-4 hidden w-full text-cell-table">
        <thead>
          <tr>
            <th scope="col">Stream</th>
            <th scope="col">Actual</th>
            <th scope="col">Budget</th>
          </tr>
        </thead>
        <tbody>
          {chart.items.map((item) => (
            <tr key={item.label}>
              <td>{item.label}</td>
              <td className="tabular-nums">{item.actual}</td>
              <td className="tabular-nums">{item.budget}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
