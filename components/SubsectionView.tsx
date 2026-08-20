import type { Subsection } from "@/content/board-paper";
import { BarChartView } from "./BarChart";
import { DataTable } from "./DataTable";
import { DonutChartView } from "./DonutChart";
import { GlossaryText } from "./GlossaryText";
import { MetricCardView } from "./MetricCard";
import { NarrativeHighlight } from "./NarrativeHighlight";
import { PerformanceHighlights } from "./PerformanceHighlights";
import { RiskTable } from "./RiskTable";

export function SubsectionView({ subsection }: { subsection: Subsection }) {
  const useNarrativeHighlight =
    subsection.id === "narrative" || subsection.id === "yoy-performance";

  return (
    <div className="mt-8 border-t border-border-default pt-8 first:mt-0 first:border-0 first:pt-0">
      {subsection.title && (
        <h3 className="flex items-center gap-3 text-lg font-semibold tracking-tight text-text-primary">
          <span className="h-px w-6 shrink-0 bg-brand-orange" aria-hidden />
          {subsection.title}
        </h3>
      )}
      {subsection.highlights && (
        <PerformanceHighlights items={subsection.highlights} />
      )}
      {subsection.metricCards && (
        <div className="metric-row mt-4 grid grid-cols-1 gap-metric-gap sm:grid-cols-2 lg:grid-cols-4">
          {subsection.metricCards.map((c) => (
            <MetricCardView key={c.label} card={c} />
          ))}
        </div>
      )}
      {subsection.paragraphs?.map((p, i) => (
        <p key={i} className="prose-measure mt-4 text-body leading-relaxed text-text-primary">
          {useNarrativeHighlight ? <NarrativeHighlight text={p} /> : <GlossaryText text={p} />}
        </p>
      ))}
      {subsection.tables?.map((t, i) => (
        <div key={i} className="mt-6 overflow-hidden rounded-lg border border-border-default">
          <DataTable table={t} />
        </div>
      ))}
      {subsection.barCharts?.map((c, i) => (
        <BarChartView key={i} chart={c} />
      ))}
      {subsection.donut && <DonutChartView chart={subsection.donut} />}
      {subsection.riskRows && (
        <div className="mt-6 overflow-hidden rounded-lg border border-border-default">
          <RiskTable rows={subsection.riskRows} />
        </div>
      )}
      {subsection.lists?.map((list, i) => (
        <div key={i} className="mt-5 rounded-lg bg-surface-metric p-4 sm:p-5">
          {list.title && (
            <p className="text-sm font-semibold text-text-primary">{list.title}</p>
          )}
          <ul className={`space-y-2.5 text-body ${list.title ? "mt-3" : ""}`}>
            {list.items.map((item, j) => (
              <li key={j} className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" aria-hidden />
                <span className="leading-relaxed">
                  <GlossaryText text={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
