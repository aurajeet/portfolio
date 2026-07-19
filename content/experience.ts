// Single source of truth for the Work section (landing) and per-case-study
// deep dives at /experience/[slug]. Content lifted verbatim from the user's
// vetted source files at Cases/nwn.html and Cases/hebe.html. Picks for the
// landing-card metrics + first 4 tags are the locked Phase 3 defaults.
//
// Array order = landing display order = cross-case-nav neighbor order.
// Reverse-chronological / resume convention: most recent role first.

export type ProseBlock =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

export type CaseStudy = {
  slug: "amberlink" | "nwn" | "hebe";
  eyebrow: string;
  title: string;
  dek: { short: string; long: string };
  metrics: { value: string; label: string }[];
  tags: string[];
  ribbon: { value: string; label: string }[];
  prose: ProseBlock[];
  methods: string[];
  tools: string[];
  collaborators: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "amberlink",
    eyebrow: "AMBERLINK · PRODUCT LEAD & CO-FOUNDER · MAR '26 TO PRESENT",
    title:
      "Building AmberLink, a 0→1 B2B essential-oil marketplace, to ₹85K MRR in two months",
    dek: {
      short:
        "Co-founded and led product for a 0→1 multi-sided B2B essential-oil marketplace — from 60+ discovery interviews to ₹85K MRR and ₹1.8 Cr+ GMV in two months.",
      long: "Co-founded AmberLink and owned product end-to-end: a 0→1 multi-sided B2B marketplace connecting essential-oil buyers with traders and aggregators, with payments, logistics, and quality-assurance workflows across six stakeholder groups. Took it from 60+ discovery interviews to 85+ onboarded users, ₹1.8 Cr+ GMV across 150+ transactions, and ₹85K MRR within two months — and cut end-to-end procurement time in half.",
    },
    metrics: [
      { value: "₹85K MRR", label: "Within 2 months" },
      { value: "₹1.8 Cr+", label: "GMV" },
      { value: "0 → 1", label: "Marketplace built" },
    ],
    tags: [
      "0-to-1",
      "Multi-sided Marketplace",
      "Growth Experimentation",
      "Payments & Escrow",
      "Supply Chain",
      "GTM",
    ],
    ribbon: [
      { value: "₹85K MRR", label: "Within 2 months" },
      { value: "85+", label: "Users · 60+ suppliers, 25+ buyers" },
      { value: "₹1.8 Cr+", label: "GMV · 150+ transactions" },
      { value: "18 → 9 days", label: "Procurement · −50%" },
    ],
    prose: [
      { kind: "h2", text: "Context" },
      {
        kind: "p",
        text: "Essential-oil B2B trade in India is fragmented, opaque, and trust-poor. Discovery happens offline through relationships, buyers can't verify quality or provenance before committing, and procurement drags on for weeks. AmberLink's bet: a multi-sided marketplace that makes supply discoverable and trades trustworthy.",
      },
      { kind: "h2", text: "My role" },
      {
        kind: "p",
        text: "Co-founder and Product Lead. I owned product strategy, roadmap, and agile delivery across six stakeholder groups — buyers, sellers (traders and aggregators), trade specialists, admin, lab partners, and warehouse operations — and built the product AI-assisted (Claude) on a modern stack (Next.js / NestJS, PostgreSQL, Razorpay, Meilisearch).",
      },
      { kind: "h2", text: "Approach" },
      { kind: "h3", text: "Discovery" },
      {
        kind: "p",
        text: "I ran 60+ user interviews across every user group and synthesized them into the roadmap. The dominant signal was that trust — not selection or price — was the bottleneck, and that end-to-end procurement took roughly 18 days. That pointed the early roadmap at trust and supply-chain features over breadth.",
      },
      { kind: "h3", text: "The marketplace build" },
      {
        kind: "p",
        text: "We shipped the multi-sided core: listings and RFQs with quotes, real-time chat, escrow payments, warehouse logistics, lab-testing quality assurance with digital certificates, and a reviews and trust-score layer — an end-to-end flow from discovery to a quality-verified, escrow-backed delivered order.",
      },
      { kind: "h3", text: "The trust pivot" },
      {
        kind: "p",
        text: "The first version was a P2P connection layer where buyers and sellers dealt directly. Discovery and early usage showed that direct dealing reintroduced the exact trust gaps we set out to fix, so we pivoted to a managed-brokerage model: counterparties are masked to each other, and a platform-assigned Trade Specialist brokers every deal end-to-end. Trust stopped being something we tried to disintermediate and became the product itself.",
      },
      { kind: "h3", text: "Growth" },
      {
        kind: "p",
        text: "I defined the North Star and acquisition metrics, then ran funnel and cohort analysis to scale supply and demand together: 60+ suppliers and 25+ buyers onboarded, reaching back through the supplier network to a farmer base of 15,000+. That drove ₹1.8 Cr+ in GMV across 150+ transactions and ₹85K MRR within two months — while cutting procurement time in half, from 18 to 9 days.",
      },
      { kind: "h2", text: "Outcomes" },
      { kind: "p", text: "Within two months of launch:" },
      {
        kind: "ul",
        items: [
          "₹85K MRR within 2 months of launch.",
          "85+ users onboarded — 60+ suppliers and 25+ buyers — reaching a farmer supply base of 15,000+ behind them.",
          "₹1.8 Cr+ GMV across 150+ transactions.",
          "Procurement time halved: 18 → 9 days.",
          "Pivoted from a P2P connection layer to a managed brokerage based on user research.",
        ],
      },
      { kind: "h2", text: "Reflections" },
      {
        kind: "p",
        text: "The pivot was the lesson. We built the obvious thing — let buyers and sellers find each other — and the data told us the obvious thing recreated the problem. The marketplace only worked once we stopped trying to disintermediate trust and started selling it as the product.",
      },
    ],
    methods: [
      "Product discovery",
      "User research",
      "Marketplace design",
      "A/B & cohort analysis",
      "Funnel optimization",
      "Roadmapping",
    ],
    tools: [
      "Claude Code",
      "Next.js / NestJS",
      "PostgreSQL + Prisma",
      "Razorpay (escrow)",
      "Meilisearch",
      "SQL / Analytics",
    ],
    collaborators: [
      "Co-founding team",
      "Trade specialists (brokerage ops)",
      "Empaneled lab partners",
      "Warehouse operations",
    ],
  },
  {
    slug: "hebe",
    eyebrow: "HEBE · PRODUCT & OPERATIONS LEAD · JUL '25 TO FEB '26",
    title:
      "Filtering a noisy B2B pipeline and rebuilding quality assurance at an essential-oil business",
    dek: {
      short:
        "Built an LLM-assisted lead qualification system that turned 300–500 monthly inbound leads into 15+ recurring accounts, and redesigned the sample-to-bulk QA process to cut fulfilment cycles by a third.",
      long: "Led product and operations at HEBE, a B2B essential-oil manufacturing and trading business. Built an LLM-assisted lead qualification system that screened 300–500 monthly inbound leads against MCA defaulter and NCLT records to surface 10–20 credible buyers a month, converting ~15% into 15+ recurring accounts. Redesigned the sample-to-bulk QA process around in-house lot validation, cutting fulfilment cycles 33% across 40+ orders with zero quality rejections.",
    },
    metrics: [
      { value: "15+", label: "Recurring accounts" },
      { value: "21 → 14 days", label: "Fulfilment · −33%" },
      { value: "300–500", label: "Leads screened monthly" },
    ],
    tags: [
      "Operations",
      "AI Automation",
      "B2B Growth",
      "Quality Assurance",
      "Supply Chain",
      "Process Design",
    ],
    ribbon: [
      { value: "300–500", label: "Monthly leads screened" },
      { value: "15+", label: "Recurring accounts · ~15% conversion" },
      { value: "21 → 14 days", label: "Fulfilment · −33%" },
      { value: "40+", label: "Orders · zero quality rejections" },
    ],
    prose: [
      { kind: "h2", text: "Context" },
      {
        kind: "p",
        text: "HEBE is a B2B essential-oil manufacturing and trading business selling to fragrance and flavor wholesalers. Two problems dominated when I came in. The inbound pipeline was high-noise: 300–500 enquiries a month, most of them tyre-kickers, some of them credit risks nobody had checked. And quality assurance was duplicated — we tested a sample, the buyer re-tested the bulk lot on arrival, and every order absorbed the delay of that second round trip.",
      },
      { kind: "h2", text: "My role" },
      {
        kind: "p",
        text: "I led product and operations: vendor management, the fulfilment process, and B2B growth. I did not own manufacturing (a specialist plus a small processing crew handled that) or finance compliance (a part-time CA). The two builds below were mine end to end — problem framing, system design, and rollout with the people who had to live with them.",
      },
      { kind: "h2", text: "Approach" },
      { kind: "h3", text: "An LLM-assisted lead qualification system" },
      {
        kind: "p",
        text: "The sales team was spending its week on the wrong buyers. I built an LLM-assisted qualification system that screened every inbound lead — 300 to 500 a month — against MCA defaulter filings and NCLT insolvency records, then scored what survived on fit and intent. It surfaced 10 to 20 genuinely credible buyers a month instead of a queue of several hundred unranked ones. Roughly 15% of that shortlist converted, building to 15+ recurring accounts over seven months.",
      },
      { kind: "h3", text: "Rebuilding sample-to-bulk QA" },
      {
        kind: "p",
        text: "The second build was process, not software. Buyers re-tested bulk lots because they had no reason to trust our sample results — so the fix was to make our own validation credible enough to stand in for theirs. I redesigned the sample-to-bulk flow around in-house lot validation, with documented results travelling alongside the consignment. That eliminated the redundant buyer-side test and cut fulfilment cycles 33%, from 21 days to 14, across 40+ orders with zero quality rejections.",
      },
      { kind: "h2", text: "Outcomes" },
      { kind: "p", text: "Over seven months in the role:" },
      {
        kind: "ul",
        items: [
          "300–500 monthly inbound leads screened automatically against MCA defaulter and NCLT records.",
          "10–20 credible buyers prioritized per month; ~15% converted.",
          "15+ recurring accounts built within 7 months.",
          "Fulfilment cycles: 21 → 14 days (−33%) across 40+ orders.",
          "Zero quality rejections after the QA redesign.",
        ],
      },
      { kind: "h2", text: "Reflections" },
      {
        kind: "p",
        text: "The QA redesign taught me more than the AI system did. The instinct was to test more; the actual fix was to make one test trustworthy enough that the second one became unnecessary. Redundant work usually signals missing trust rather than missing rigour. The supply-chain gaps I kept hitting here — opaque counterparties, unverifiable quality, procurement measured in weeks — are what AmberLink was built to solve.",
      },
    ],
    methods: [
      "Process redesign",
      "AI lead qualification",
      "Vendor management",
      "Quality assurance design",
      "B2B sales",
      "Analytics & reporting",
    ],
    tools: [
      "Claude / LLM workflows",
      "SQL",
      "Power BI",
      "Excel / Sheets",
      "MCA & NCLT records",
    ],
    collaborators: [
      "1 manufacturing specialist",
      "~5-person processing crew",
      "Part-time CA (compliance)",
      "Supplier & vendor network",
    ],
  },
  {
    slug: "nwn",
    eyebrow: "NATION WITH NAMO · ASSOCIATE CONSULTANT · JUL '23 TO JUL '25",
    title:
      "Growth, experimentation, and analytics for five state-level electoral campaigns",
    dek: {
      short:
        "Two years across Madhya Pradesh, Arunachal Pradesh, Odisha, and West Bengal. Five campaigns, all won.",
      long: "Two years at Nation With NaMo across Madhya Pradesh, Arunachal Pradesh, Odisha, and West Bengal, spanning five campaigns, all won. Owned the experimentation backlog, the segmentation logic, and the analytics dashboards that shaped weekly decisions for senior campaign leadership.",
    },
    metrics: [
      { value: "5/5", label: "Campaigns won" },
      { value: "1.2M+", label: "Signups" },
      { value: "1.5M+", label: "Voter profiles modeled" },
    ],
    tags: [
      "Growth Experimentation",
      "Segmentation & Targeting",
      "Analytics Infrastructure",
      "Cross-functional Execution",
      "Geospatial Modeling",
    ],
    ribbon: [
      { value: "1.2M+", label: "Signups via experimentation" },
      { value: "35%", label: "Engagement lift via A/B testing" },
      { value: "1.5M+", label: "Voter profiles modeled" },
      { value: "5 / 5", label: "Campaigns won · 4 states" },
    ],
    prose: [
      { kind: "h2", text: "Context" },
      {
        kind: "p",
        text: "Each project was a state-level electoral cycle that ran months but ended on an immovable date: election day. Inside that window, the job was to land recommendations with senior political leadership on candidate selection, campaign narrative, and where to deploy time and money, synthesized from village-level field intelligence, survey rounds, and historical booth data that was always incomplete and shifting as the campaign moved. There was no next sprint to fix a wrong call. Every recommendation had to hold up against both the data and the ground.",
      },
      { kind: "h2", text: "My role" },
      {
        kind: "p",
        text: "I was an Associate Consultant: analyst, consultant, and product. As analyst I built the electoral intelligence, segmentation, and geospatial models that fed leadership decisions. As consultant I synthesized those into recommendations to senior political leadership on candidate selection, campaign narrative, and manifesto direction. As product I owned the experimentation backlog, the content-growth funnels, and the cross-functional execution that shipped on cycle. These three modes ran across three workstreams: political war room, campaign war room, and governance advisory. I did not own data engineering or field operations; the role sat between them, translating field signal into experiments and experiments into leadership decisions.",
      },
      { kind: "h2", text: "Approach" },
      { kind: "h3", text: "Campaign war room: execution & operations" },
      {
        kind: "p",
        text: "Across three of the five campaigns, I led growth and content strategy while managing a 12-person cross-functional team spanning research, design, and content production. The growth playbook was funnel-shaped: acquisition surfaces tested across messaging, channel, and conversion-journey variants. We instrumented every funnel stage and ran A/B tests across more than 6 million user data points, refining audience segments and content performance cycle over cycle. The work produced 1.2M+ signups across the three campaigns and lifted engagement by 35% through micro-targeted content tests.",
      },
      {
        kind: "p",
        text: "In parallel, I directed an omnichannel content distribution strategy for senior national leaders (including Dharmendra Pradhan, Pema Khandu, and Kiren Rijiju), using SMAR (Social Media Analytics & Reporting) data to refine the calendar week over week and keep content aligned with the central campaign narrative.",
      },
      {
        kind: "h3",
        text: "Political war room: stakeholder & ecosystem management",
      },
      {
        kind: "p",
        text: "I built an electoral analytics dashboard that integrated three data layers: historical voting results, real-time sentiment tracking, and multi-round survey responses. The dashboard categorized 65,000+ polling booths into priority cohorts that the campaign team used for resource allocation, a 25% improvement in deployment efficiency over the previous spreadsheet-driven approach.",
      },
      {
        kind: "p",
        text: "On top of the dashboard, I built a predictive geospatial clustering model across 1.5M+ voter profiles to identify high-impact cohorts for targeted interventions. The model translated raw demographic and behavioral data into executive-ready cohort recommendations, cutting leadership decision-making time by approximately 40% during the active phase of each campaign.",
      },
      { kind: "h3", text: "Governance advisory: policy & research" },
      {
        kind: "p",
        text: "Two interventions stand out from the governance side of the work. The first: a Pink Booth campaign in rural Raisen (Madhya Pradesh), aimed at increasing female voter turnout. We analyzed participation data to identify safety concerns at specific polling locations, then deployed a high-visibility community outreach effort promoting 1,296 designated Pink Booths. Female voter turnout in those areas rose 38% relative to the previous cycle.",
      },
      {
        kind: "p",
        text: "The second: a Forest Rights Act digitization initiative. I helped digitize village-level GIS audits, streamline inter-departmental workflows, and run a local-language awareness campaign, securing formal land titles for 2,800+ tribal families within nine months. Both interventions had policy-and-product elements; the work was as much about plumbing the operational pipeline as it was about field execution.",
      },
      { kind: "h2", text: "Outcomes" },
      { kind: "p", text: "By the end of two years and five campaigns:" },
      {
        kind: "ul",
        items: [
          "Five campaigns shipped, all five won, across four states (MP, Arunachal Pradesh, Odisha, West Bengal).",
          "1.2M+ signups acquired across the three campaigns I led directly.",
          "35% engagement lift via experimentation across 6M+ user data points.",
          "65,000+ polling booths classified into priority cohorts; 25% improvement in resource allocation.",
          "1.5M+ voter profiles modeled via geospatial clustering; ~40% reduction in leadership decision-making time.",
          "38% female voter turnout lift in rural Raisen via the 1,296-Pink-Booth campaign.",
          "2,800+ tribal families granted formal land titles via the Forest Rights Act digitization initiative within nine months.",
        ],
      },
      { kind: "h2", text: "Reflections" },
      {
        kind: "p",
        text: "The bottleneck was never collection. There was always more we could gather. It was synthesis: forcing fragmented evidence into a recommendation a Chief Minister could act on in ten minutes. Knowing when to stop reading and start writing was the highest-leverage discipline.",
      },
    ],
    methods: [
      "User research",
      "Behavioral segmentation",
      "A/B and multivariate testing",
      "Funnel analysis",
      "Geospatial clustering",
      "Cross-functional roadmapping",
    ],
    tools: [
      "SQL",
      "Power BI",
      "Excel / Sheets",
      "Custom analytics dashboards",
      "SMAR (Social Media Analytics & Reporting)",
    ],
    collaborators: [
      "12-person cross-functional team (research / design / content)",
      "Campaign war-room leadership",
      "Political war-room data engineering team",
      "Governance advisory (policy + GIS partners)",
    ],
  },
];

export function getCase(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getNeighbors(slug: string): {
  prev?: CaseStudy;
  next?: CaseStudy;
} {
  const idx = caseStudies.findIndex((c) => c.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? caseStudies[idx - 1] : undefined,
    next: idx < caseStudies.length - 1 ? caseStudies[idx + 1] : undefined,
  };
}
