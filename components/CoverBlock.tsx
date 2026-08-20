import Image from "next/image";
import type { CoverData } from "@/content/board-paper";
import { BrandLogo } from "./BrandLogo";
import { MetricCardView } from "./MetricCard";

export function CoverBlock({ cover }: { cover: CoverData }) {
  return (
    <header id="cover" className="mb-section-top">
      <BrandLogo priority className="mb-4 h-auto w-[130px] sm:w-[150px]" />

      <div className="relative min-h-[16rem] overflow-hidden rounded-xl sm:min-h-[20rem] lg:min-h-[22rem]">
        <Image
          src="/images/hero-field.png"
          alt="Agriarche field team in a rice paddy at harvest"
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 896px"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--color-surface-hero-overlay)" }}
          aria-hidden
        />
        <div className="relative flex h-full min-h-[16rem] flex-col justify-between p-6 sm:min-h-[20rem] sm:p-8 lg:min-h-[22rem] lg:p-10">
          <div>
            <p className="text-sm font-medium text-white/90">Agriarche Limited</p>
            <h1 className="mt-2 max-w-xl text-display-cover font-bold tracking-tight text-white drop-shadow-sm">
              {cover.title}
            </h1>
            <p className="mt-2 max-w-lg text-heading-cover-sub font-medium text-white/95 drop-shadow-sm">
              {cover.subtitle}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/25 pt-4 text-sm text-white/90">
            <time dateTime="2026-06-30">{cover.date}</time>
            <p>{cover.preparedFor}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border-default bg-surface-card p-5 shadow-card sm:p-6">
        <p className="text-sm text-text-secondary">
          Confidential — for board and invited investors only. Do not distribute.
        </p>
        <div className="metric-row mt-5 grid grid-cols-1 gap-metric-gap sm:grid-cols-2 lg:grid-cols-4">
          {cover.metrics.map((m) => (
            <MetricCardView key={m.label} card={m} />
          ))}
        </div>
      </div>
    </header>
  );
}
