import type { VarianceCell as VarianceCellType, VarianceDirection } from "@/content/board-paper";

function arrow(direction: VarianceDirection) {
  if (direction === "favourable") return "↑";
  if (direction === "unfavourable") return "↓";
  return "";
}

function label(direction: VarianceDirection) {
  if (direction === "favourable") return "Ahead";
  if (direction === "unfavourable") return "Gap";
  return "";
}

export function VarianceDisplay({ cell }: { cell: VarianceCellType }) {
  if (cell.direction === "neutral") {
    return <span className="tabular-nums text-text-primary">{cell.value}</span>;
  }

  const isWin = cell.direction === "favourable";
  const colorClass = isWin ? "text-variance-favourable" : "text-variance-unfavourable";
  const ringClass = isWin ? "ring-variance-favourable/35" : "ring-variance-unfavourable/35";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 tabular-nums ring-1 ring-inset ${ringClass} ${colorClass}`}
      aria-label={`${label(cell.direction)}: ${cell.value}`}
    >
      <span className="text-[11px] font-bold leading-none" aria-hidden>
        {arrow(cell.direction)}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-80" aria-hidden>
        {label(cell.direction)}
      </span>
      <span className="text-sm font-bold">{cell.value}</span>
    </span>
  );
}

export function isVarianceCell(v: string | VarianceCellType): v is VarianceCellType {
  return typeof v === "object" && v !== null && "direction" in v;
}

export function rowVarianceDirection(row: (string | VarianceCellType)[]): VarianceDirection {
  const cell = row.find(isVarianceCell);
  return cell?.direction ?? "neutral";
}
