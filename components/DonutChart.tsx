"use client";

import { useEffect, useState } from "react";
import type { DonutChart as DonutChartType } from "@/content/board-paper";
import { BRAND_RING_PATHS, BRAND_RING_SEGMENTS } from "@/lib/brand-chart";

export function DonutChartView({ chart }: { chart: DonutChartType }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = document.querySelector("[data-donut-root]");
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

  return (
    <figure
      data-donut-root
      className="chart-visual my-6 rounded-lg border border-border-default bg-surface-card p-5 sm:p-6"
    >
      <p className="mb-5 text-sm font-semibold text-text-primary">{chart.title}</p>
      <figcaption className="sr-only">{chart.title}</figcaption>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
        <svg
          viewBox="0 0 268 268"
          className={`h-[200px] w-[200px] shrink-0 sm:h-[220px] sm:w-[220px] ${
            visible || reduced ? "opacity-100" : "opacity-0"
          } transition-opacity duration-700`}
          role="img"
          aria-label={chart.title}
        >
          <title>{chart.title}</title>
          {BRAND_RING_PATHS.map((d, i) => {
            const segment = chart.segments[i];
            const brand = BRAND_RING_SEGMENTS[i];
            const active = hovered === null || hovered === i;
            return (
              <path
                key={brand.id}
                d={d}
                fill={brand.fill}
                opacity={active ? 1 : 0.35}
                className="cursor-pointer transition-opacity duration-200"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setHovered(hovered === i ? null : i)}
              >
                {segment && <title>{`${segment.label} ${segment.percentage}%`}</title>}
              </path>
            );
          })}
        </svg>

        <ul className="w-full min-w-0 flex-1 space-y-2.5" aria-label="Revenue segments">
          {chart.segments.map((seg, i) => {
            const brand = BRAND_RING_SEGMENTS[i];
            const isActive = hovered === i;
            return (
              <li key={seg.label}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors ${
                    isActive ? "bg-surface-metric" : "hover:bg-surface-metric/60"
                  }`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setHovered(hovered === i ? null : i)}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: brand.fill }}
                    aria-hidden
                  />
                  <span className="flex-1 text-sm text-text-primary">{seg.label}</span>
                  <span className="tabular-nums text-sm font-semibold text-text-primary">
                    {seg.percentage}%
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <table className="chart-print-table mt-4 hidden w-full text-cell-table">
        <caption>{chart.title}</caption>
        <thead>
          <tr>
            <th scope="col">Segment</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {chart.segments.map((s) => (
            <tr key={s.label}>
              <td>{s.label}</td>
              <td>{s.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
