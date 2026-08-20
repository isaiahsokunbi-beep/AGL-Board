"use client";

const periods = [
  {
    id: "h1-2026",
    label: "H1 2026",
    status: "current" as const,
  },
  {
    id: "h2-2026",
    label: "H2 2026",
    status: "in-progress" as const,
  },
];

export function PeriodSwitcher() {
  return (
    <div
      className="no-print fixed bottom-5 left-5 z-40 flex flex-col gap-2 sm:flex-row"
      role="group"
      aria-label="Reporting period"
    >
      {periods.map((period) => {
        const isInProgress = period.status === "in-progress";

        if (isInProgress) {
          return (
            <button
              key={period.id}
              type="button"
              disabled
              aria-disabled="true"
              title="H2 2026 board paper is in progress"
              className="flex cursor-not-allowed items-center gap-2 rounded-full border border-border-default bg-surface-card/90 px-5 py-3 text-sm font-semibold text-text-secondary opacity-80 shadow-card backdrop-blur-sm"
            >
              <span>{period.label}</span>
              <span className="rounded-full bg-brand-orange/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-orange">
                In progress
              </span>
            </button>
          );
        }

        return (
          <button
            key={period.id}
            type="button"
            aria-current="page"
            className="flex items-center gap-2 rounded-full border border-brand-green/30 bg-surface-card px-5 py-3 text-sm font-semibold text-brand-green shadow-card"
          >
            <span
              className="h-2 w-2 rounded-full bg-brand-green"
              aria-hidden
            />
            {period.label}
          </button>
        );
      })}
    </div>
  );
}
