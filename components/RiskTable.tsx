"use client";

import { useState } from "react";
import type { RiskRow } from "@/content/board-paper";

export function RiskTable({ rows }: { rows: RiskRow[] }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[320px] border-collapse text-left">
          <caption className="sr-only">Major risks exposed in H1</caption>
          <thead>
            <tr className="border-b border-border-default bg-surface-metric">
              {["Unit", "Risk", "Business Impact", "Mitigation / Response"].map((h) => (
                <th key={h} scope="col" className="px-4 py-3 text-xs font-semibold text-text-secondary">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border-default last:border-0 hover:bg-table-row-hover">
                <td className="px-4 py-3 text-cell-table font-medium">{row.unit}</td>
                <td className="px-4 py-3 text-cell-table">{row.risk}</td>
                <td className="px-4 py-3 text-cell-table">{row.businessImpact}</td>
                <td className="px-4 py-3 text-cell-table">{row.mitigation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile expandable */}
      <div className="space-y-2 md:hidden">
        {rows.map((row, i) => (
          <MobileRiskRow key={i} row={row} />
        ))}
      </div>
    </>
  );
}

function MobileRiskRow({ row }: { row: RiskRow }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border-default bg-surface-card">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-2 px-4 py-3 text-left"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <p className="text-[11px] uppercase text-text-secondary">{row.unit}</p>
          <p className="text-cell-table font-semibold">{row.risk}</p>
          <p className="mt-1 text-cell-table text-text-secondary">{row.businessImpact}</p>
        </div>
        <span aria-hidden className="text-text-secondary">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-border-default px-3 py-2 text-cell-table">
          <p className="text-[11px] uppercase text-text-secondary">Mitigation</p>
          <p className="mt-1">{row.mitigation}</p>
        </div>
      )}
    </div>
  );
}
