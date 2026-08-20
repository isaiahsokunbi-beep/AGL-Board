import type { PerformanceHighlight } from "@/content/board-paper";

export function PerformanceHighlights({ items }: { items: PerformanceHighlight[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const isWin = item.type === "win";
        return (
          <div
            key={`${item.type}-${item.label}`}
            className="relative overflow-hidden rounded-lg border border-border-default bg-surface-card px-4 py-3.5"
          >
            <p
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isWin ? "text-variance-favourable" : "text-variance-unfavourable"
              }`}
            >
              {isWin ? "↑ Win" : "↓ Gap"} · {item.label}
            </p>
            <p className="mt-1 text-sm leading-snug text-text-primary">{item.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
