#!/usr/bin/env python3
"""Generate content/board-paper.ts from reconcile-output.json."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

with open(ROOT / "scripts/reconcile-output.json") as f:
    d = json.load(f)


def esc(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def fix(s: str) -> str:
    s = s.replace("Zonkwo", "Zonkwa")
    s = s.replace("Mite'ra", "Mitera")
    s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
    s = s.replace("target.of farmer", "target of farmer")
    return s


exec_paras = [fix(p) for p in d["exec"]]

yoy = [
    "H1 2026 closed with revenue of ₦1.124 billion, compared to ₦917.3 million in H1 2025, representing a 22.5% year-on-year increase.",
    "Export performance was stronger in H1 2025 compared to H1 2026. However, export activities in 2026 were impacted by the ongoing war, slower shipping and supply-chain disruptions, as well as cash-flow constraints.",
    "Despite these challenges, local trade performance improved significantly in H1 2026, contributing strongly to the overall revenue growth. Mitera contributed ₦131 million to H1 2026 revenue, while the Projects business delivered a particularly strong revenue performance, further supporting the growth recorded during the period.",
    "Overall, H1 2026 reflects stronger performance in the local business and Projects, which more than offset the weaker export performance.",
]

h2_cascador = [fix(x.rstrip("., ")) for x in d["h2"]["##"]["bullets"]]
h2_cascador[-1] = "Additional Warehouse activation: Zonkwa and Niger."

ghana = fix(d["h2"]["Ghana Expansion"]["paras"][0])
ghana = re.sub(
    r"\\- \[link\]\((https://[^)]+)\)|- \[link\]\((https://[^)]+)\)",
    lambda m: f"(Planning spreadsheet: {m.group(1) or m.group(2)})",
    ghana,
)

fintech = [fix(p) for p in d["h2"]["Fintech Model"]["paras"][:4]]
logistics = [fix(p) for p in d["h2"]["Fintech Model"]["paras"][4:7]]
sahel = [fix(p) for p in d["h2"]["Fintech Model"]["paras"][7:9]]
fundraise = [
    fix(d["h2"]["Fintech Model"]["paras"][9]),
    "Also our future fundraise strategy is attached (https://docs.google.com/document/d/1pCxoe400BOuoiH4GL0JsqpMUwTu8Oa0KQxHgLpcrDT0/edit?usp=sharing).",
]

kas_overview = fix(d["kasuwa"]["overview"][0])
kas_h2 = [fix(p) for p in d["kasuwa"]["h2focus_paras"]]
esp_para = fix(d["esp_para"][0])
esp_rows = [[fix(c) for c in row] for row in d["esp_rows"]]
hr_items = [fix(x) for x in d["hr_bullets"][1:]]
pmo_items = [fix(x) for x in d["pmo_bullets"]]
fund_para = fix(d["fund_para"][0])
uof = [[fix(r[0]), fix(r[1])] for r in d["uof_rows"]]

impact_cards = [
    ("Trade Lenda farmers financed", "700+", "targeting 2,000 in 2026"),
    ("Propcom+ farmers trained", "23,000+", "Garkuwan Manoma Project"),
    ("Oyu Green farmers / hectares", "2,800", "carbon credit onboarding target"),
    ("CBAs onboarded on Kasuwa", "197", "under AGRA"),
]

annex_intro = (
    "Across 38 locations in 8 states (Adamawa, Benue, Borno, Gombe, Jigawa, "
    "Kaduna, Niger, Rivers, and Yobe), Agriarche has established a network of "
    "agricultural service delivery points to strengthen farmer productivity, "
    "market access, and financial inclusion."
)
annex_outro = (
    "Overall, the intervention has strengthened agricultural value chains by "
    "expanding access to finance, improving farmer capacity, enhancing "
    "aggregation infrastructure, and creating more efficient routes to market "
    "across key agricultural communities in Northern Nigeria."
)
annex_list = [
    "Farmer Capacity Building: Delivered in 31 locations, equipping farmers with improved agronomic practices, post-harvest handling, and business management skills.",
    "Financial Services (Input Credit & Payments): Extended to 16 locations, improving farmers' access to input financing and digital payment solutions, thereby reducing financial barriers to production and trade.",
    "Fulfilment Centres: Established in 11 locations, providing aggregation, storage, and market linkage infrastructure that enhances commodity collection and distribution efficiency.",
    "Mitera Centre: 1 retail centre established in Port Harcourt to support market access for value-added agricultural products.",
]
strategy = [fix(p) for p in d["annex"]["AGL Strategy Snapshot"]["paras"]]

risk_lines = []
for row in d["risks"]:
    risk_lines.append(
        f"""          {{
            unit: {esc(fix(row[0]))},
            risk: {esc(fix(row[1]))},
            businessImpact: {esc(fix(row[2]))},
            mitigation: {esc(fix(row[3]))},
          }},"""
    )

esp_table_lines = []
for row in esp_rows:
    esp_table_lines.append(
        f"""              [
                {esc(row[0])},
                {esc(row[1])},
                {esc(row[2])},
              ],"""
    )

uof_lines = []
for cat, purpose in uof:
    uof_lines.append(
        f"""              [
                {esc(cat)},
                {esc(purpose)},
              ],"""
    )

impact_card_lines = []
for label, value, subtitle in impact_cards:
    impact_card_lines.append(
        f"""          {{
            label: {esc(label)},
            value: {esc(value)},
            subtitle: {esc(subtitle)},
          }},"""
    )

nl = ",\n          "
out = f"""/**
 * Content reconciled against Board_Paper.pdf / Board_Paper.md (Aug 2026).
 * PDF is authority for figures; Figma for structure. Typo fixes applied per brief.
 */

export const DOC_VERSION = "h1-2026-board-paper-pdf-v1";

export type VarianceDirection = "favourable" | "unfavourable" | "neutral";

export type VarianceCell = {{
  value: string;
  direction: VarianceDirection;
}};

export type MetricCard = {{
  label: string;
  value: string;
  subtitle?: string;
  /** Apply negative/loss styling when true */
  negative?: boolean;
}};

export type TableRow = (string | VarianceCell)[];

export type TableData = {{
  caption?: string;
  headers: string[];
  rows: TableRow[];
}};

export type BarChartItem = {{
  label: string;
  actual: string;
  budget: string;
}};

export type BarChart = {{
  title: string;
  items: BarChartItem[];
}};

export type DonutSegment = {{
  label: string;
  percentage: number;
}};

export type DonutChart = {{
  title: string;
  segments: DonutSegment[];
}};

export type RiskRow = {{
  unit: string;
  risk: string;
  businessImpact: string;
  mitigation: string;
}};

export type ListBlock = {{
  title?: string;
  items: string[];
}};

export type Subsection = {{
  id: string;
  title?: string;
  paragraphs?: string[];
  metricCards?: MetricCard[];
  tables?: TableData[];
  barCharts?: BarChart[];
  donut?: DonutChart;
  riskRows?: RiskRow[];
  lists?: ListBlock[];
}};

export type Section = {{
  id: string;
  title: string;
  subsections: Subsection[];
}};

export type TocEntry = {{
  number: string;
  title: string;
}};

export type CoverData = {{
  title: string;
  subtitle: string;
  date: string;
  preparedFor: string;
  tableOfContents: TocEntry[];
  metrics: MetricCard[];
}};

export const cover: CoverData = {{
  title: "Board Presentation",
  subtitle: "H1 2026 Performance Review",
  date: "June 30, 2026",
  preparedFor: "Prepared for the Board of Directors",
  tableOfContents: [
    {{ number: "1", title: "Executive Summary" }},
    {{ number: "2", title: "Financial Performance" }},
    {{ number: "3", title: "Major Risks Exposed in H1 (Across All Units)" }},
    {{ number: "4", title: "H2 Priorities" }},
    {{ number: "5", title: "H2 Budget" }},
    {{ number: "6", title: "State of Kasuwa" }},
    {{ number: "7", title: "ESP Progress" }},
    {{ number: "8", title: "Key Departmental Updates: HR, PMO, Finance" }},
    {{ number: "9", title: "Fundraising: Justification and Use of Funds" }},
    {{ number: "—", title: "Annex" }},
  ],
  metrics: [
    {{
      label: "Revenue",
      value: "₦1,123.6M",
      subtitle: "51.5% of budget",
    }},
    {{
      label: "Gross Margin",
      value: "18.1%",
      subtitle: "vs 18.7% budget",
    }},
    {{
      label: "Volume Traded",
      value: "840.4 MT",
      subtitle: "across 41 trades",
    }},
    {{
      label: "Net Loss After Tax",
      value: "(₦73.6M)",
      negative: true,
      subtitle: "after ₦38.6M finance costs",
    }},
  ],
}};

export const sections: Section[] = [
  {{
    id: "executive-summary",
    title: "1. Executive Summary",
    subsections: [
      {{
        id: "headline-metrics",
        metricCards: [
          {{
            label: "Revenue",
            value: "₦1,123.6M",
            subtitle: "51.5% of budget",
          }},
          {{
            label: "Gross Margin",
            value: "18.1%",
            subtitle: "vs 18.7% budget",
          }},
          {{
            label: "Volume Traded",
            value: "840.4 MT",
            subtitle: "across 41 trades",
          }},
          {{
            label: "Net Loss After Tax",
            value: "(₦73.6M)",
            negative: true,
            subtitle: "after ₦38.6M finance costs",
          }},
        ],
      }},
      {{
        id: "narrative",
        paragraphs: [
          {nl.join(esc(p) for p in exec_paras)},
        ],
      }},
    ],
  }},
  {{
    id: "financial-performance",
    title: "2. Financial Performance",
    subsections: [
      {{
        id: "h1-summary",
        title: "H1 2026 Summary",
        tables: [
          {{
            headers: ["Metric", "H1 2026 Actual", "H1 2026 Budget", "Variance"],
            rows: [
              ["Revenue", "₦1,123.6M", "₦2,180.9M", {{ value: "−48.5%", direction: "unfavourable" }}],
              ["COGS", "₦920.0M", "—", {{ value: "—", direction: "neutral" }}],
              ["Gross Profit", "₦203.6M", "—", {{ value: "—", direction: "neutral" }}],
              ["Gross Margin %", "18.1%", "18.7%", {{ value: "−0.6 pp", direction: "unfavourable" }}],
              ["Operating Profit", "−₦35.0M", "—", {{ value: "—", direction: "neutral" }}],
              ["Finance Costs", "₦38.6M", "—", {{ value: "—", direction: "neutral" }}],
              ["Net Loss After Tax", "(₦73.6M)", "—", {{ value: "—", direction: "neutral" }}],
              ["Volume (MT)", "840.4 MT", "1,800 MT", {{ value: "−53.3%", direction: "unfavourable" }}],
              ["Logistics Cost", "₦97M", "—", {{ value: "79% of margins", direction: "neutral" }}],
              ["Trades Completed", "41", "80+", {{ value: "−49%", direction: "unfavourable" }}],
              ["Highest Expense", "Salary & Allowance – ₦71.5M", "—", {{ value: "35% of margins", direction: "neutral" }}],
            ],
          }},
        ],
        barCharts: [
          {{
            title: "Actual vs. Budget — H1 2026",
            items: [
              {{ label: "Revenue", actual: "₦1,123.6M", budget: "₦2,180.9M" }},
              {{ label: "Volume (MT)", actual: "840.4 MT", budget: "1,800 MT" }},
              {{ label: "Trades Completed", actual: "41", budget: "80+" }},
            ],
          }},
        ],
      }},
      {{
        id: "revenue-stream-breakdown",
        title: "Revenue Stream Breakdown (H1 2026)",
        tables: [
          {{
            headers: ["Stream", "H1 Actual", "H1 Budget", "Variance"],
            rows: [
              ["Local Trade", "₦722.6M", "₦1,377.0M", {{ value: "−47.5%", direction: "unfavourable" }}],
              ["Projects", "₦363.9M", "₦244.0M", {{ value: "+49.1%", direction: "favourable" }}],
              ["Export", "₦37.1M", "₦559.9M", {{ value: "−93.4%", direction: "unfavourable" }}],
              ["Total", "₦1,123.6M", "₦2,180.9M", {{ value: "−48.5%", direction: "unfavourable" }}],
            ],
          }},
        ],
        barCharts: [
          {{
            title: "Revenue Stream — Actual vs. Budget",
            items: [
              {{ label: "Local Trade", actual: "₦722.6M", budget: "₦1,377.0M" }},
              {{ label: "Projects", actual: "₦363.9M", budget: "₦244.0M" }},
              {{ label: "Export", actual: "₦37.1M", budget: "₦559.9M" }},
            ],
          }},
        ],
      }},
      {{
        id: "yoy-performance",
        title: "H1 2025 vs H1 2026 Performance",
        donut: {{
          title: "H1 2025 vs H1 2026 Performance",
          // Placeholder segment weights — source deck uses chart image, not labelled percentages
          segments: [
            {{ label: "Local Commodity", percentage: 42 }},
            {{ label: "Waste 2 feed", percentage: 18 }},
            {{ label: "Mitera", percentage: 15 }},
            {{ label: "Project", percentage: 17 }},
            {{ label: "Export Trade", percentage: 8 }},
          ],
        }},
        barCharts: [
          {{
            title: "Revenue — Year on Year",
            items: [
              {{ label: "H1 2025", actual: "₦917.3M", budget: "" }},
              {{ label: "H1 2026", actual: "₦1,123.6M", budget: "" }},
            ],
          }},
        ],
        metricCards: [
          {{
            label: "Revenue — Year on Year",
            value: "+22.5%",
            subtitle: "H1 2025 vs H1 2026",
          }},
        ],
        paragraphs: [
          {nl.join(esc(p) for p in yoy)},
        ],
      }},
    ],
  }},
  {{
    id: "major-risks",
    title: "3. Major Risks Exposed in H1 (Across All Units)",
    subsections: [
      {{
        id: "risk-register",
        riskRows: [
{chr(10).join(risk_lines)}
        ],
      }},
    ],
  }},
  {{
    id: "h2-priorities",
    title: "4. H2 Priorities",
    subsections: [
      {{
        id: "cascador-export-local",
        title: "Cascador Deployment, Export & Local Trade Scaling (September–December)",
        lists: [
          {{
            items: [
              {nl.join(esc(x) for x in h2_cascador)},
            ],
          }},
        ],
      }},
      {{
        id: "ghana-expansion",
        title: "Ghana Expansion",
        paragraphs: [
          {esc(ghana)},
        ],
      }},
      {{
        id: "fintech-model",
        title: "Fintech Model",
        paragraphs: [
          {nl.join(esc(p) for p in fintech)},
        ],
      }},
      {{
        id: "logistics",
        title: "Logistics",
        paragraphs: [
          {nl.join(esc(p) for p in logistics)},
        ],
      }},
      {{
        id: "sahel-repayment",
        title: "Sahel Repayment",
        paragraphs: [
          {nl.join(esc(p) for p in sahel)},
        ],
      }},
      {{
        id: "fundraise-strategy",
        title: "Fundraise Strategy",
        paragraphs: [
          {nl.join(esc(p) for p in fundraise)},
        ],
      }},
    ],
  }},
  {{
    id: "h2-budget",
    title: "5. H2 Budget",
    subsections: [
      {{
        id: "h2-budget-table",
        tables: [
          {{
            headers: ["Metric", "Q3", "Q4"],
            rows: [
              ["Local Trade Sales", "₦834,311,869", "₦1,650,212,723"],
              ["Export Sales", "₦352,111,129", "₦428,079,595"],
              ["Retail Sales", "₦65,000,000", "₦227,755,607"],
              ["Projects Revenue", "₦137,647,343", "₦174,182,646"],
              ["Cascador Facility", "₦1.5B secured pre-deployment", "Full ₦2.5B in field"],
            ],
          }},
        ],
        barCharts: [
          {{
            title: "H2 Revenue Budget by Category — Q3 vs. Q4",
            items: [
              {{ label: "Local Trade Sales", actual: "₦834.3M", budget: "₦1,650.2M" }},
              {{ label: "Export Sales", actual: "₦352.1M", budget: "₦428.1M" }},
              {{ label: "Retail Sales", actual: "₦65.0M", budget: "₦227.8M" }},
              {{ label: "Projects Revenue", actual: "₦137.6M", budget: "₦174.2M" }},
            ],
          }},
        ],
        metricCards: [
          {{
            label: "Q3 Revenue Target",
            value: "₦1,389,070,341",
          }},
          {{
            label: "H2 Trade Target",
            value: "₦3.8B",
          }},
        ],
      }},
    ],
  }},
  {{
    id: "state-of-kasuwa",
    title: "6. State of Kasuwa",
    subsections: [
      {{
        id: "overview",
        paragraphs: [
          {esc(kas_overview)},
        ],
      }},
      {{
        id: "h2-focus",
        title: "H2 Focus",
        paragraphs: [
          {nl.join(esc(p) for p in kas_h2)},
        ],
      }},
    ],
  }},
  {{
    id: "esp-progress",
    title: "7. ESP Progress",
    subsections: [
      {{
        id: "esp-overview",
        paragraphs: [
          {esc(esp_para)},
        ],
      }},
      {{
        id: "esp-tracker",
        tables: [
          {{
            headers: ["Vertical", "TA Focus", "Status"],
            rows: [
{chr(10).join(esp_table_lines)}
            ],
          }},
        ],
      }},
    ],
  }},
  {{
    id: "departmental-updates",
    title: "8. Key Departmental Updates: HR, PMO, Finance",
    subsections: [
      {{
        id: "hr-workforce",
        title: "HR & Workforce",
        tables: [
          {{
            headers: ["Metric", "H1 2026"],
            rows: [
              ["Total Employees (End H1)", "43"],
              ["Promotions", "3 (career advancement)"],
              ["Exits", "2 (staff rationalization)"],
              ["New Hires", "1 (COO)"],
              ["Survey Participation", "70%"],
              ["Satisfaction Score", "82%"],
            ],
          }},
        ],
        lists: [
          {{
            title: "Employee engagement survey highlights",
            items: [
              {nl.join(esc(x) for x in hr_items)},
            ],
          }},
        ],
      }},
      {{
        id: "pmo-grant-management",
        title: "PMO & Grant Management",
        lists: [
          {{
            items: [
              {nl.join(esc(x) for x in pmo_items)},
            ],
          }},
        ],
      }},
    ],
  }},
  {{
    id: "fundraising",
    title: "9. Fundraising: Justification and Use of Funds",
    subsections: [
      {{
        id: "raise-overview",
        paragraphs: [
          {esc(fund_para)},
        ],
      }},
      {{
        id: "use-of-funds",
        title: "Use of Funds",
        tables: [
          {{
            headers: ["Category", "Purpose"],
            rows: [
{chr(10).join(uof_lines)}
            ],
          }},
        ],
      }},
      {{
        id: "impact",
        title: "Impact of Our Work",
        metricCards: [
{chr(10).join(impact_card_lines)}
        ],
      }},
    ],
  }},
  {{
    id: "annex",
    title: "Annex",
    subsections: [
      {{
        id: "impact-communities",
        title: "Impact Communities",
        paragraphs: [
          {esc(annex_intro)},
          {esc(annex_outro)},
        ],
        metricCards: [
          {{
            label: "Farmer Capacity Building locations",
            value: "31",
          }},
          {{
            label: "Financial Services locations",
            value: "16",
          }},
          {{
            label: "Fulfilment Centres",
            value: "11",
          }},
          {{
            label: "Mitera retail centre (Port Harcourt)",
            value: "1",
          }},
        ],
        lists: [
          {{
            title: "Key interventions include:",
            items: [
              {nl.join(esc(x) for x in annex_list)},
            ],
          }},
        ],
      }},
      {{
        id: "agl-strategy-snapshot",
        title: "AGL Strategy Snapshot",
        lists: [
          {{
            items: [
              {nl.join(esc(p) for p in strategy)},
            ],
          }},
        ],
      }},
      {{
        id: "buyer-score-board",
        title: "Buyer Score Board",
        paragraphs: [
          "Buyer score board referenced in board materials; detailed scoreboard available on request.",
        ],
      }},
      {{
        id: "financial-projections",
        title: "Link to 5-Year Financial Projections",
        paragraphs: [
          "Supporting financial model available on request.",
        ],
      }},
    ],
  }},
];

/** Convenience export — all document sections including cover metadata */
export const boardPaper = {{
  docVersion: DOC_VERSION,
  cover,
  sections,
}} as const;
"""

(ROOT / "content/board-paper.ts").write_text(out)
print(f"Wrote {ROOT / 'content/board-paper.ts'}")
