import type { TableData } from "@/content/board-paper";
import { VarianceDisplay, isVarianceCell } from "./VarianceDisplay";

function rowLabel(row: TableData["rows"][number]): string | null {
  const first = row[0];
  return typeof first === "string" ? first : null;
}

function isHighlightedRow(table: TableData, row: TableData["rows"][number]): boolean {
  const label = rowLabel(row);
  return Boolean(label && table.highlightLabels?.includes(label));
}

export function DataTable({ table }: { table: TableData }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] border-collapse text-left">
        {table.caption && (
          <caption className="sr-only">{table.caption}</caption>
        )}
        <thead>
          <tr className="border-b border-border-default bg-surface-metric">
            {table.headers.map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-3 text-xs font-semibold text-text-secondary"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => {
            const highlighted = isHighlightedRow(table, row);
            return (
              <tr
                key={i}
                className={`border-b border-border-default transition-colors last:border-0 hover:bg-table-row-hover ${
                  highlighted ? "bg-brand-orange/10 hover:bg-brand-orange/15" : ""
                }`}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-4 py-3 text-cell-table ${j === 0 ? "font-medium text-text-primary" : "tabular-nums"} ${
                      highlighted && j === 0 ? "font-semibold text-brand-brown" : ""
                    } ${isVarianceCell(cell) ? "variance-cell" : ""}`}
                  >
                    {isVarianceCell(cell) ? (
                      highlighted ? (
                        <span className="inline-flex items-center rounded-full bg-brand-orange/20 px-2.5 py-1 text-sm font-bold tabular-nums text-brand-rust ring-1 ring-inset ring-brand-orange/45">
                          {cell.value}
                        </span>
                      ) : (
                        <VarianceDisplay cell={cell} />
                      )
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
