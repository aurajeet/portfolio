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
  slug: "nwn" | "hebe";
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
    slug: "hebe",
    eyebrow: "HEBE · PRODUCT & OPERATIONS LEAD · JUL '25 TO PRESENT",
    title:
      "Rebuilding a ₹1.6 Cr B2B essential-oil business as a digitally instrumented supply chain",
    dek: {
      short:
        "Inherited a 5,000+ farmer supplier network and almost no digital infrastructure. Took revenue to ₹2.1 Cr in 12 months by building a B2B marketplace with farmer-level traceability.",
      long: "Inherited a B2B essential-oil business with a 5,000+ farmer supplier network, 100+ workers, and almost no digital infrastructure. Owned P&L. Took revenue to ₹2.1 Cr in 12 months by building a B2B marketplace with farmer-level traceability, integrating payments and operational workflows, and rebuilding pricing and supply-demand alignment from scratch.",
    },
    metrics: [
      { value: "₹1.6 Cr → ₹2.1 Cr", label: "Revenue in 12 months" },
      { value: "5,000+", label: "Farmer suppliers" },
      { value: "0 → 1", label: "Marketplace built" },
    ],
    tags: ["P&L", "Marketplace", "Supply Chain", "Pricing", "0-to-1", "GTM"],
    ribbon: [
      { value: "₹1.6 Cr → ₹2.1 Cr", label: "Revenue · 31% YoY" },
      { value: "5,000+", label: "Farmer suppliers" },
      { value: "0 → 1", label: "B2B marketplace built" },
    ],
    prose: [
      { kind: "h2", text: "Context" },
      {
        kind: "p",
        text: "HEBE is a B2B essential-oil manufacturing and trading business and a family enterprise. When I took over as Product and Operations Lead in July 2025, the business was running ₹1.6 Cr in annual revenue across a network of 5,000+ farmers supplying raw aromatic crops, 100+ workers across processing and operations, and a B2B customer base of fragrance and flavor wholesalers and a handful of specialty buyers.",
      },
      {
        kind: "p",
        text: "The diagnosis was straightforward and uncomfortable: the business had no instrumentation. Supplier relationships lived in WhatsApp threads. Pricing decisions were made on the phone, on the day. Customer mix had drifted toward a small number of repeat buyers. Margins were uneven across batches in ways no one could explain after the fact. Buyer trust was the quiet bottleneck. Without traceability from farmer to finished oil, larger buyers would not commit to volume. The core business was real, but the operating layer was held together by relationships and memory.",
      },
      { kind: "h2", text: "My role" },
      {
        kind: "p",
        text: "I owned the P&L. I owned product, operations, and digital infrastructure. I did not own manufacturing (one specialist plus a small processing crew handled that) or finance compliance (handled by a part-time CA). Every other lever (supplier onboarding, pricing, customer acquisition, sales operations, the marketplace itself) was mine.",
      },
      { kind: "h2", text: "Approach" },
      { kind: "h3", text: "Diagnosis" },
      {
        kind: "p",
        text: "Month one was a top-to-bottom audit. I rebuilt the previous twelve months of revenue from invoices and bank statements into a single sheet broken down by customer, product line, and batch. Three findings dropped out: (1) margin variance across batches was not random, but tracked the supplier district where raw material was sourced; (2) about 60% of revenue came from four customers, all of whom were on hand-shake pricing that hadn't been revisited in over a year; (3) onboarding a new supplier cost roughly two weeks of someone's time, mostly on paperwork that could be templated.",
      },
      {
        kind: "h3",
        text: "Building the B2B marketplace with farmer-level traceability",
      },
      {
        kind: "p",
        text: "The single biggest unlock was a B2B marketplace built from scratch, a digital surface that connected farmer-level supply data to buyer-facing inventory, with traceability all the way from district of origin through batch and dispatch. The platform integrated payments (so farmers got paid on a deterministic schedule, not a phone call) and operational workflows (procurement orders, batch tracking, dispatch planning). Once buyers could see provenance and quality data per batch, two things happened: trust gaps closed, and we could credibly address larger order volumes that had been off the table before.",
      },
      { kind: "h3", text: "Supplier-network and pricing rebuild" },
      {
        kind: "p",
        text: 'The supplier-onboarding flow was the highest-leverage rebuild. I templated a one-page agreement, built the supplier database with district-level metadata (so we could trace yield-vs-district patterns), and shifted payment terms from variable to a tier system. Onboarding time dropped from roughly two weeks to about three days. The variance between districts on yield and quality became visible inside the database, which is what we then used to renegotiate procurement priorities. On the customer side, I rebuilt pricing as a tier system mapped to product grade and order volume, with an explicit floor below which we would not negotiate. We lost two of the previously locked-in repeat buyers; we gained four new mid-volume buyers in adjacent product categories. Customer mix shifted from "four buyers / 60% of revenue" to "eight buyers / 50% of revenue", a healthier base.',
      },
      { kind: "h3", text: "Operations digitization" },
      {
        kind: "p",
        text: "Most of the operations layer was paper or memory. I moved supplier records, batch tracking, and invoicing into a single shared system (intentionally simple; there was no headcount for a real ERP). The new rule: nothing ships from the warehouse without a row in the batch-tracking sheet. Within four months we could tell, for the first time, what each batch had cost us and what it had earned.",
      },
      { kind: "h2", text: "Outcomes" },
      { kind: "p", text: "End of year 1 in this role:" },
      {
        kind: "ul",
        items: [
          "Revenue: ₹1.6 Cr → ₹2.1 Cr in 12 months. 31% YoY growth.",
          "B2B marketplace launched with farmer-level traceability, payments integration, and operational workflows.",
          "Customer mix: shifted from 60% concentrated in 4 buyers to ~50% across 8 buyers.",
          "Supplier onboarding time: ~2 weeks → ~3 days.",
          "Supply transparency: every dispatched batch traceable to its source district within 24 hours of dispatch (previously untracked).",
        ],
      },
      { kind: "h2", text: "Reflections" },
      {
        kind: "p",
        text: "The thing I underestimated was how much of this role was relationship management with farmers and old-line customers. The digital infrastructure rebuild was the easy part. The harder part was renegotiating pricing with buyers who had a personal relationship with the previous owner, and explaining the new traceability flow to farmers who had never been asked to report district-level yield data. Software does not solve those conversations; it just makes the trade-offs visible enough to have them seriously.",
      },
      {
        kind: "p",
        text: "What I would do differently: I would have introduced batch-level cost tracking in month one, not month four. Three months of unattributable margins is three months of business decisions made on instinct.",
      },
    ],
    methods: [
      "P&L decomposition",
      "Marketplace design",
      "Pricing strategy",
      "Supplier-network design",
      "Operations digitization",
      "Customer-mix rebalancing",
    ],
    tools: [
      "SQL",
      "Power BI",
      "Excel / Sheets",
      "Claude Code",
      "Perplexity",
      "WhatsApp Business",
    ],
    collaborators: [
      "1 manufacturing specialist",
      "~5-person processing crew",
      "Part-time CA (compliance)",
      "5,000+ farmer supplier network",
      "100+ workers across operations",
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
        text: "Two interventions stand out from the governance side of the work. The first: a Pink Booth campaign in rural Ratlam (Madhya Pradesh), aimed at increasing female voter turnout. We analyzed participation data to identify safety concerns at specific polling locations, then deployed a high-visibility community outreach effort promoting 1,296 designated Pink Booths. Female voter turnout in those areas rose 38% relative to the previous cycle.",
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
          "38% female voter turnout lift in rural Ratlam via the 1,296-Pink-Booth campaign.",
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
