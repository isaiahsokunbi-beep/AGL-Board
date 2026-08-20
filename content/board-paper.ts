/**
 * Content reconciled against Board_Paper.pdf / Board_Paper.md (Aug 2026).
 * PDF is authority for figures; Figma for structure. Typo fixes applied per brief.
 */

export const DOC_VERSION = "h1-2026-board-paper-pdf-v1";

export type VarianceDirection = "favourable" | "unfavourable" | "neutral";

export type VarianceCell = {
  value: string;
  direction: VarianceDirection;
};

export type MetricCard = {
  label: string;
  value: string;
  subtitle?: string;
  /** Apply negative/loss styling when true */
  negative?: boolean;
  /** Win/loss emphasis for headline metrics */
  tone?: "win" | "loss";
};

export type PerformanceHighlight = {
  type: "win" | "loss";
  label: string;
  detail: string;
};

export type TableRow = (string | VarianceCell)[];

export type TableData = {
  caption?: string;
  headers: string[];
  rows: TableRow[];
  /** Row labels (first column) to emphasize — e.g. Logistics Cost */
  highlightLabels?: string[];
};

export type BarChartItem = {
  label: string;
  actual: string;
  budget: string;
};

export type BarChart = {
  title: string;
  items: BarChartItem[];
};

export type DonutSegment = {
  label: string;
  percentage: number;
};

export type DonutChart = {
  title: string;
  segments: DonutSegment[];
};

export type RiskRow = {
  unit: string;
  risk: string;
  businessImpact: string;
  mitigation: string;
};

export type ListBlock = {
  title?: string;
  items: string[];
};

export type Subsection = {
  id: string;
  title?: string;
  paragraphs?: string[];
  metricCards?: MetricCard[];
  highlights?: PerformanceHighlight[];
  tables?: TableData[];
  barCharts?: BarChart[];
  donut?: DonutChart;
  riskRows?: RiskRow[];
  lists?: ListBlock[];
};

export type Section = {
  id: string;
  title: string;
  subsections: Subsection[];
};

export type TocEntry = {
  number: string;
  title: string;
};

export type CoverData = {
  title: string;
  subtitle: string;
  date: string;
  preparedFor: string;
  tableOfContents: TocEntry[];
  metrics: MetricCard[];
};

export const cover: CoverData = {
  title: "Board Presentation",
  subtitle: "H1 2026 Performance Review",
  date: "June 30, 2026",
  preparedFor: "Prepared for the Board of Directors",
  tableOfContents: [
    { number: "1", title: "Executive Summary" },
    { number: "2", title: "Financial Performance" },
    { number: "3", title: "Major Risks Exposed in H1 (Across All Units)" },
    { number: "4", title: "H2 Priorities" },
    { number: "5", title: "H2 Budget" },
    { number: "6", title: "State of Kasuwa" },
    { number: "7", title: "ESP Progress" },
    { number: "8", title: "Key Departmental Updates: HR, PMO, Finance" },
    { number: "9", title: "Fundraising: Justification and Use of Funds" },
    { number: "—", title: "Annex" },
  ],
  metrics: [
    {
      label: "Revenue",
      value: "₦1,123.6M",
      subtitle: "51.5% of budget",
      tone: "loss",
    },
    {
      label: "Gross Margin",
      value: "18.1%",
      subtitle: "vs 18.7% budget",
      tone: "loss",
    },
    {
      label: "Volume Traded",
      value: "840.4 MT",
      subtitle: "across 41 trades",
      tone: "loss",
    },
    {
      label: "Net Loss After Tax",
      value: "(₦73.6M)",
      negative: true,
      tone: "loss",
      subtitle: "after ₦38.6M finance costs",
    },
  ],
};

export const sections: Section[] = [
  {
    id: "executive-summary",
    title: "1. Executive Summary",
    subsections: [
      {
        id: "headline-metrics",
        metricCards: [
          {
            label: "Revenue",
            value: "₦1,123.6M",
            subtitle: "51.5% of budget",
            tone: "loss",
          },
          {
            label: "Gross Margin",
            value: "18.1%",
            subtitle: "vs 18.7% budget",
            tone: "loss",
          },
          {
            label: "Volume Traded",
            value: "840.4 MT",
            subtitle: "across 41 trades",
            tone: "loss",
          },
          {
            label: "Net Loss After Tax",
            value: "(₦73.6M)",
            negative: true,
            tone: "loss",
            subtitle: "after ₦38.6M finance costs",
          },
        ],
      },
      {
        id: "narrative",
        highlights: [
          {
            type: "win",
            label: "Bright spot",
            detail: "Projects closed H1 at +49.1% ahead of budget",
          },
          {
            type: "win",
            label: "YoY growth",
            detail: "Revenue up +22.5% vs H1 2025 (₦917.3M → ₦1,123.6M)",
          },
          {
            type: "loss",
            label: "Largest gap",
            detail: "Export sales −93.4% vs budget pending NEXIM disbursement",
          },
          {
            type: "loss",
            label: "Bottom line",
            detail: "Net loss of ₦73.6M after ₦38.6M finance costs",
          },
        ],
        paragraphs: [
          "H1 2026 delivered revenue broadly in line with a challenging budget, but full-year profitability was materially below plan once the complete cost base is reflected. Revenue reached ₦1,123.6M, 51.5% of the confirmed ₦2,180.9M H1 budget, on volume of 840.4 MT across 41 trades, with gross margin of 18.1%. After ₦38.6M in finance costs, the net loss was ₦73.6M.",
          "The ₦1,057.3M shortfall against the original revenue budget remains the primary driver of H1 underperformance. Management accounts show gross margin essentially on budget (18.1% actual vs 18.7% budget); the swing to a ₦73.6M net loss reflects logistics, administrative, and finance costs that did not scale down with lower trade volumes, on top of the revenue shortfall itself. The shortfall traces to three root causes, all addressable in H2: a supply sourcing gap driven by spot-market procurement and farmer price misalignment; operational gaps including 5% weight loss and quality and coordination issues; and pricing volatility.",
          "Export sales were the largest single driver of the shortfall, at 93.4% below budget pending NEXIM facility disbursement, this emerged due to trade disruptions due to war. Local Trades also under-shot at 47.5% below budget. Projects was the one bright spot, closing H1 at 49.1% ahead of budget.",
        ],
      },
    ],
  },
  {
    id: "financial-performance",
    title: "2. Financial Performance",
    subsections: [
      {
        id: "h1-summary",
        title: "H1 2026 Summary",
        tables: [
          {
            headers: ["Metric", "H1 2026 Actual", "H1 2026 Budget", "Variance"],
            highlightLabels: ["Logistics Cost"],
            rows: [
              ["Revenue", "₦1,123.6M", "₦2,180.9M", { value: "−48.5%", direction: "unfavourable" }],
              ["COGS", "₦920.0M", "—", { value: "—", direction: "neutral" }],
              ["Gross Profit", "₦203.6M", "—", { value: "—", direction: "neutral" }],
              ["Gross Margin %", "18.1%", "18.7%", { value: "−0.6 pp", direction: "unfavourable" }],
              ["Operating Profit", "−₦35.0M", "—", { value: "—", direction: "neutral" }],
              ["Finance Costs", "₦38.6M", "—", { value: "—", direction: "neutral" }],
              ["Net Loss After Tax", "(₦73.6M)", "—", { value: "—", direction: "neutral" }],
              ["Volume (MT)", "840.4 MT", "1,800 MT", { value: "−53.3%", direction: "unfavourable" }],
              ["Logistics Cost", "₦97M", "—", { value: "79% of margins", direction: "neutral" }],
              ["Trades Completed", "41", "80+", { value: "−49%", direction: "unfavourable" }],
              ["Highest Expense", "Salary & Allowance – ₦71.5M", "—", { value: "35% of margins", direction: "neutral" }],
            ],
          },
        ],
        barCharts: [
          {
            title: "Actual vs. Budget — H1 2026",
            items: [
              { label: "Revenue", actual: "₦1,123.6M", budget: "₦2,180.9M" },
              { label: "Volume (MT)", actual: "840.4 MT", budget: "1,800 MT" },
              { label: "Trades Completed", actual: "41", budget: "80+" },
            ],
          },
        ],
      },
      {
        id: "revenue-stream-breakdown",
        title: "Revenue Stream Breakdown (H1 2026)",
        tables: [
          {
            headers: ["Stream", "H1 Actual", "H1 Budget", "Variance"],
            rows: [
              ["Local Trade", "₦722.6M", "₦1,377.0M", { value: "−47.5%", direction: "unfavourable" }],
              ["Projects", "₦363.9M", "₦244.0M", { value: "+49.1%", direction: "favourable" }],
              ["Export", "₦37.1M", "₦559.9M", { value: "−93.4%", direction: "unfavourable" }],
              ["Total", "₦1,123.6M", "₦2,180.9M", { value: "−48.5%", direction: "unfavourable" }],
            ],
          },
        ],
        barCharts: [
          {
            title: "Revenue Stream — Actual vs. Budget",
            items: [
              { label: "Local Trade", actual: "₦722.6M", budget: "₦1,377.0M" },
              { label: "Projects", actual: "₦363.9M", budget: "₦244.0M" },
              { label: "Export", actual: "₦37.1M", budget: "₦559.9M" },
            ],
          },
        ],
      },
      {
        id: "yoy-performance",
        title: "H1 2025 vs H1 2026 Performance",
        donut: {
          title: "H1 2025 vs H1 2026 Performance",
          // Placeholder segment weights — mapped to brand revenue ring SVG (orange, green, rust, gold, brown)
          segments: [
            { label: "Local Commodity", percentage: 42 },
            { label: "Waste 2 feed", percentage: 18 },
            { label: "Export Trade", percentage: 8 },
            { label: "Mitera", percentage: 15 },
            { label: "Project", percentage: 17 },
          ],
        },
        barCharts: [
          {
            title: "Revenue — Year on Year",
            items: [
              { label: "H1 2025", actual: "₦917.3M", budget: "" },
              { label: "H1 2026", actual: "₦1,123.6M", budget: "" },
            ],
          },
        ],
        metricCards: [
          {
            label: "Revenue — Year on Year",
            value: "+22.5%",
            subtitle: "H1 2025 vs H1 2026",
            tone: "win",
          },
        ],
        paragraphs: [
          "H1 2026 closed with revenue of ₦1.124 billion, compared to ₦917.3 million in H1 2025, representing a 22.5% year-on-year increase.",
          "Export performance was stronger in H1 2025 compared to H1 2026. However, export activities in 2026 were impacted by the ongoing war, slower shipping and supply-chain disruptions, as well as cash-flow constraints.",
          "Despite these challenges, local trade performance improved significantly in H1 2026, contributing strongly to the overall revenue growth. Mitera contributed ₦131 million to H1 2026 revenue, while the Projects business delivered a particularly strong revenue performance, further supporting the growth recorded during the period.",
          "Overall, H1 2026 reflects stronger performance in the local business and Projects, which more than offset the weaker export performance.",
        ],
      },
    ],
  },
  {
    id: "major-risks",
    title: "3. Major Risks Exposed in H1 (Across All Units)",
    subsections: [
      {
        id: "risk-register",
        riskRows: [
          {
            unit: "Operations",
            risk: "Weight loss averaging 5% in H1",
            businessImpact: "Rooted in staff gaps and operational overlaps, weighing scale anomalies",
            mitigation: "Partnership with weigh bridges close to centres to firm weight position before leaving and logistics companies to verify weight consistency",
          },
          {
            unit: "Operations",
            risk: "Quality and coordination gaps",
            businessImpact: "Below-spec deliveries, delivery delays",
            mitigation: "Expert training consistently to establish competence. Hiring level of staff",
          },
          {
            unit: "Operations",
            risk: "Supply shocks during planting season",
            businessImpact: "Revenue uncertainty",
            mitigation: "Diversify commodities mix, expand and focus staff on specific regions, unlock supply- led model.",
          },
          {
            unit: "Operations",
            risk: "Margin-pressures",
            businessImpact: "Over 80% of our margins spent on logistics reducing Operating profit.",
            mitigation: "In house logistics infrastructure, Prioritize LPO issuing companies..",
          },
          {
            unit: "Operations",
            risk: "Global geopolitics - Strait closure and pressures.",
            businessImpact: "Longer TAT for exports, Impacts Buyer trust",
            mitigation: "Expand scope of shippers and ports of dispatch e.g Ghana",
          },
          {
            unit: "Operations",
            risk: "Team communication breakdowns",
            businessImpact: "Execution slippage across trade cycles",
            mitigation: "Internal Reporting Dashboard live since May 2026 for end-to-end trade visibility",
          },
          {
            unit: "PMO",
            risk: "Farmer KYC gaps",
            businessImpact: "Majority of farmers lack BVN/NIN documentation",
            mitigation: "Field agent support for BVN/NIN acquisition (ongoing), Prioritizing only verified farmers.",
          },
          {
            unit: "PMO",
            risk: "Delayed disbursements/Reconciliation",
            businessImpact: "Delayed payments from partners, Delay on projections",
            mitigation: "Train and equip finance coordination, Restructure step down training for all staff on project expectations.",
          },
          {
            unit: "Finance",
            risk: "CFO concentration/gaps",
            businessImpact: "Delay in deliverables and firm grip on financials, Harmonize cash flow with budget",
            mitigation: "Hire a CFO in H2",
          },
          {
            unit: "Finance",
            risk: "Cash flow and seasonality",
            businessImpact: "Missed Sales",
            mitigation: "Align cash flow to seasonality.",
          },
        ],
      },
    ],
  },
  {
    id: "h2-priorities",
    title: "4. H2 Priorities",
    subsections: [
      {
        id: "cascador-export-local",
        title: "Cascador Deployment, Export & Local Trade Scaling (September–December)",
        lists: [
          {
            items: [
              "Cascador first tranche ₦1.5B of a ₦2.5B facility (₦1B NEXIM export facility + ₦1.5B Sterling Bank facility), expected late Q3: deploy for 38+ trades per month",
          "Legal Cps pending",
          "Export pipeline conversion: $670k signed export pipeline delivered through H2, supported by the NEXIM export facility",
          "Local trade: continued focus alongside export",
          "Additional Warehouse activation: Zonkwa and Niger.",
            ],
          },
        ],
      },
      {
        id: "ghana-expansion",
        title: "Ghana Expansion",
        paragraphs: [
          "A shea butter pilot linking Ghana to the EU market is already operational through a live joint venture. H2 2026 work focuses on establishing in Ghana: scoping the opportunity and identifying potential internal or external partners, alongside standing up a field and sales team and hiring a Ghana Operations Manager. (Planning spreadsheet: https://docs.google.com/spreadsheets/d/1VR08Pjl6Y0GL1MkCIEYJeh9PyAqibsTWmIT_JX89l60/edit?usp=sharing)",
        ],
      },
      {
        id: "fintech-model",
        title: "Fintech Model",
        paragraphs: [
          "Agriarche's fintech model extends beyond input financing to deliver a broader suite of financial and trade services tailored to rural agricultural communities. While input financing is a key component, the platform is designed to facilitate deposits, payments, trade transactions, and other financial products that support the agricultural value chain.",
          "In 2026 so far, approximately 3.5% of deposits originate from non-trade users, demonstrating strong adoption beyond commodity trading and highlighting the opportunity to serve both trade and non-trade customers in underserved rural markets.",
          "Input financing has already been launched, with over 700 farmers financed in 2026 across the dry and wet seasons through the Trade Lenda programme. The business is targeting 2,000 farmers, with further scale expected as the model becomes more structured and operates under the appropriate licensing framework.",
          "The pace and scale of expansion will significantly enable the business to increase outreach, deepen financial inclusion, and deliver greater impact across rural communities. - Link",
        ],
      },
      {
        id: "logistics",
        title: "Logistics",
        paragraphs: [
          "Logistics costs have doubled over a 2 year period from an average of 650k to 1.3m per truck and this has placed pressure on our gross margins. Immediate ways to cope are to increase vols, diversify more to exports and reduce other costs. There are also not as many available trucks during harvest seasons to maximize our potential especially in areas with high volumes of commodities.",
          "Hence, we propose owning our own fleet, outsourcing the mgt of these trucks . This will increase our volumes, reduce costs and improve our delivery time as well as our cash conversion cycle. The goal is to use electric 40ft trucks as opposed to CNG as CNG infrastructure is government dependent and development in core rural regions is not bankable.",
          "This model will need a specialist to define the opportunities, impact on business and mgt processes. It is currently added to our ESP pillars.",
        ],
      },
      {
        id: "sahel-repayment",
        title: "Sahel Repayment",
        paragraphs: [
          "To be closed in Q4, all scheduled tranched payment so far this year has been met. Payout places a burden on cash flow but with our cash flow mgt tool, we have prioritized business expectations to prevent any shortfall.",
          "Learnings - is to actively have sufficient cash flow and reduce business risk to maintain a stable cash flow",
        ],
      },
      {
        id: "fundraise-strategy",
        title: "Fundraise Strategy",
        paragraphs: [
          "We will commence an equity raise to support our debt need, hire, market, expand to Ghana, expand exports to the EU markets and begin initial logistics infrastructure build out.",
          "Also our future fundraise strategy is attached (https://docs.google.com/document/d/1pCxoe400BOuoiH4GL0JsqpMUwTu8Oa0KQxHgLpcrDT0/edit?usp=sharing).",
        ],
      },
    ],
  },
  {
    id: "h2-budget",
    title: "5. H2 Budget",
    subsections: [
      {
        id: "h2-budget-table",
        tables: [
          {
            headers: ["Metric", "Q3", "Q4"],
            rows: [
              ["Local Trade Sales", "₦834,311,869", "₦1,650,212,723"],
              ["Export Sales", "₦352,111,129", "₦428,079,595"],
              ["Retail Sales", "₦65,000,000", "₦227,755,607"],
              ["Projects Revenue", "₦137,647,343", "₦174,182,646"],
              ["Cascador Facility", "₦1.5B secured pre-deployment", "Full ₦2.5B in field"],
            ],
          },
        ],
        barCharts: [
          {
            title: "H2 Revenue Budget by Category — Q3 vs. Q4",
            items: [
              { label: "Local Trade Sales", actual: "₦834.3M", budget: "₦1,650.2M" },
              { label: "Export Sales", actual: "₦352.1M", budget: "₦428.1M" },
              { label: "Retail Sales", actual: "₦65.0M", budget: "₦227.8M" },
              { label: "Projects Revenue", actual: "₦137.6M", budget: "₦174.2M" },
            ],
          },
        ],
        metricCards: [
          {
            label: "Q3 Revenue Target",
            value: "₦1,389,070,341",
          },
          {
            label: "H2 Trade Target",
            value: "₦3.8B",
          },
        ],
      },
    ],
  },
  {
    id: "state-of-kasuwa",
    title: "6. State of Kasuwa",
    subsections: [
      {
        id: "overview",
        paragraphs: [
          "Kasuwa in its current Phase is a demand-led model, where food processors place orders and Kasuwa reaches out through its Fulfillment Centres to fulfil demand, alongside the introduction of aggregator-led fulfilment across operating regions. Users also have wallets to receive and send money with other benefits like check prices, and available orders.",
        ],
      },
      {
        id: "h2-focus",
        title: "H2 Focus",
        paragraphs: [
          "H2 will focus on zoning community centres into key states for focus and deeper penetration under Zonal Coordinators, consolidating all key Agriarche activities in those areas under a structured leadership.",
          "H2 features include listings, logistics module, and agent app. The logistics module is to automate all hauling activities on the platform, from logistics partner onboarding to fleet management, dispatching, tracking, and payments. Currently, payment and sourcing of logistics are done manually, this module is to enable end-to-end order tracking from seller dispatch to buyer receipt. The listing side will allow sellers (farmers & Aggregators) to list commodities for sale or purchase without waiting for a direct order from buyer, thereby creating increased visibility and market accessibility. This will drive buyer conversion and increase platform activities. The Agent App will allow Field agents to carry out onboarding for farmers, aggregators or buyers, monitor farms, coordinate deliveries especially at the IP side, serving as bridge between the platform and the rural communities. This will drive numbers and usage level, expand the reach of kasuwa, while creating impact.",
          "The input credit was built to enable farmers to access essential agricultural inputs through financing, helping to improve productivity, profitability, and adoption of modern farming practices. This will be deployed for the coming dry season farming.",
          "Furthermore, the fintech part of the platform is currently building out and would commence in H2 so we structure for the bank aspect of our trajectory.",
        ],
      },
    ],
  },
  {
    id: "esp-progress",
    title: "7. ESP Progress",
    subsections: [
      {
        id: "esp-overview",
        paragraphs: [
          "ESP (Mastercard Foundation) is providing technical assistance across three verticals. Given this work is already embedded in day-to-day operational efficiency, it is tracked here as a standing progress grid rather than as a separate Control Tower session.",
        ],
      },
      {
        id: "esp-tracker",
        tables: [
          {
            headers: ["Vertical", "TA Focus", "Status"],
            rows: [
              [
                "1. Pricing Market Intelligence",
                "Pricing market and intelligence build-out and expansion consultancy",
                "Beginning Q3 2026. Preliminary conversations complete and all stakeholders aligned; awaiting ESP disbursement to consultants before mobilisation",
              ],
              [
                "2. Input Credit Structuring",
                "Structuring support for input credit facility design and a Credit scoring system for farmers.",
                "Needed – TA request",
              ],
              [
                "3. Quality Control training for all Supply Chain staff",
                "Training all field staff on handling, sourcing and guidelines to reduce losses or theft.",
                "Needed – TA request",
              ],
              [
                "3. Fundraising Support",
                "Support for infrastructural play: fulfilment centre and logistics",
                "Ongoing Proposal Structuring",
              ],
              [
                "4. Kasuwa/Tech Audit",
                "",
                "In Progress",
              ],
            ],
          },
        ],
      },
    ],
  },
  {
    id: "departmental-updates",
    title: "8. Key Departmental Updates: HR, PMO, Finance",
    subsections: [
      {
        id: "hr-workforce",
        title: "HR & Workforce",
        tables: [
          {
            headers: ["Metric", "H1 2026"],
            rows: [
              ["Total Employees (End H1)", "43"],
              ["Promotions", "3 (career advancement)"],
              ["Exits", "2 (staff rationalization)"],
              ["New Hires", "1 (COO)"],
              ["Survey Participation", "70%"],
              ["Satisfaction Score", "82%"],
            ],
          },
        ],
        lists: [
          {
            title: "Employee engagement survey highlights",
            items: [
              "Top strengths identified: role clarity, team collaboration, supervisor support",
          "Improvement areas: career growth, recognition, internal communication",
          "Recruitment SOP formalized, with Granary implementation underway",
          "Job descriptions updated across all roles, reinforcing role clarity",
          "Balanced scorecard introduced organization-wide for performance visibility",
          "Performance review process deployed, with manager communication completed",
          "Learning programs: ESG learning launched; Distinction AI approved",
            ],
          },
        ],
      },
      {
        id: "pmo-grant-management",
        title: "PMO & Grant Management",
        lists: [
          {
            items: [
              "Propcom+ project successfully closed out. Impact: 23,000+ farmers trained across Northern communities",
          "Trade Lenda 2025 Dry Season (AICS): 700+ female farmers valued at (N400m) financed across 6 states with zero defaults so far. Targeting 2,000 farmers in 2027 prioritizing already financed farmers.",
          "New project partnership with AGRA was unlocked. The Women in Rice Value Chain Project valued at $82,000 is a 12 months consortium project aimed at Advancing Inclusive and Resilient Agri-Food Systems through Smart Farming and Digital Solutions for 20,130 Women and Youth in Kaduna and Niger State, Nigeria.",
          "Oyu Green Initiative (carbon credit): 2,800+ farmers with 2,800ha of farmlands were mapped for carbon credit benefits. Farmers onboarding is still ongoing to reach the 5,000 hectares target of farmer onboarding, supported by weekly field agent visits and monthly AGL team visits",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "fundraising",
    title: "9. Fundraising: Justification and Use of Funds",
    subsections: [
      {
        id: "raise-overview",
        paragraphs: [
          "Agriarche is raising a $1.5M equity bridge round to expand into Ghana and fund the initial setup of its fintech infrastructure, strategic hires, marketing and support debt raise efforts (as leverage for more debt).",
        ],
      },
      {
        id: "use-of-funds",
        title: "Use of Funds",
        tables: [
          {
            headers: ["Category", "Purpose"],
            rows: [
              [
                "Ghana Expansion",
                "Legal and Business registration, identify partners, set up a field and sales team, and hire a Ghana Operations Manager",
              ],
              [
                "Logistics",
                "Fund warehouse activation at Zonkwa and Niger and supporting fulfilment infrastructure",
              ],
              [
                "Staff",
                "Key hires including QA Officer, Fintech Product mgr, Growth marketer, CFO and dedicated Zonal coordinators to scale trade execution",
              ],
              [
                "Fintech Activation",
                "Scale Input financing toward the 2,000-farmer target and fund the initial setup and licensing of financial services.",
              ],
              [
                "Marketing",
                "Execute Go to market and consolidation of activities within our states of operations.",
              ],
              [
                "Debt fundraise support",
                "Leverage on equity to use as BGs or cash collateral to unlock capital for working capital and other needs.",
              ],
            ],
          },
        ],
      },
      {
        id: "impact",
        title: "Impact of Our Work",
        metricCards: [
          {
            label: "Trade Lenda farmers financed",
            value: "700+",
            subtitle: "targeting 2,000 in 2026",
          },
          {
            label: "Propcom+ farmers trained",
            value: "23,000+",
            subtitle: "Garkuwan Manoma Project",
          },
          {
            label: "Oyu Green farmers / hectares",
            value: "2,800",
            subtitle: "carbon credit onboarding target",
          },
          {
            label: "CBAs onboarded on Kasuwa",
            value: "197",
            subtitle: "under AGRA",
          },
        ],
      },
    ],
  },
  {
    id: "annex",
    title: "Annex",
    subsections: [
      {
        id: "impact-communities",
        title: "Impact Communities",
        paragraphs: [
          "Across 38 locations in 8 states (Adamawa, Benue, Borno, Gombe, Jigawa, Kaduna, Niger, Rivers, and Yobe), Agriarche has established a network of agricultural service delivery points to strengthen farmer productivity, market access, and financial inclusion.",
          "Overall, the intervention has strengthened agricultural value chains by expanding access to finance, improving farmer capacity, enhancing aggregation infrastructure, and creating more efficient routes to market across key agricultural communities in Northern Nigeria.",
        ],
        metricCards: [
          {
            label: "Farmer Capacity Building locations",
            value: "31",
          },
          {
            label: "Financial Services locations",
            value: "16",
          },
          {
            label: "Fulfilment Centres",
            value: "11",
          },
          {
            label: "Mitera retail centre (Port Harcourt)",
            value: "1",
          },
        ],
        lists: [
          {
            title: "Key interventions include:",
            items: [
              "Farmer Capacity Building: Delivered in 31 locations, equipping farmers with improved agronomic practices, post-harvest handling, and business management skills.",
          "Financial Services (Input Credit & Payments): Extended to 16 locations, improving farmers' access to input financing and digital payment solutions, thereby reducing financial barriers to production and trade.",
          "Fulfilment Centres: Established in 11 locations, providing aggregation, storage, and market linkage infrastructure that enhances commodity collection and distribution efficiency.",
          "Mitera Centre: 1 retail centre established in Port Harcourt to support market access for value-added agricultural products.",
            ],
          },
        ],
      },
      {
        id: "agl-strategy-snapshot",
        title: "AGL Strategy Snapshot",
        lists: [
          {
            items: [
              "Execution stage - Trading for local and international markets set up and running. Scale needed for expansion of centres, increase in buyers, working capital injection and tech upgrade to shift to a supply led model to accommodate other value chains. Process currently tightened and stress tested.",
          "Manual execution of input credit scheme with automation underway in H2 defining all credit rules for farmers and agents.",
          "Institutional investors locked in with an outlook of involving HNIs and individuals through structured finance programs - dependent on MFB and platform readiness for investor clarity",
          "To deal with more structured Input processors as opposed to agrodealers yet to determine benefit to avoid creating a competition scenario on the field.",
          "Restructure Retail segment for scale and impact by employing its focus leader",
            ],
          },
        ],
      },
      {
        id: "buyer-score-board",
        title: "Buyer Score Board",
        paragraphs: [
          "Buyer score board referenced in board materials; detailed scoreboard available on request.",
        ],
      },
      {
        id: "financial-projections",
        title: "Link to 5-Year Financial Projections",
        paragraphs: [
          "Supporting financial model available on request.",
        ],
      },
    ],
  },
];

/** Convenience export — all document sections including cover metadata */
export const boardPaper = {
  docVersion: DOC_VERSION,
  cover,
  sections,
} as const;
