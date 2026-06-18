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
      "Building AmberLink, a 0→1 B2B essential-oil marketplace, to ₹7.5 L MRR in two months",
    dek: {
      short:
        "Co-founded and led product for a 0→1 multi-sided B2B essential-oil marketplace — from 60+ discovery interviews to ₹7.5 L MRR and 16K+ users in two months.",
      long: "Co-founded AmberLink and owned product end-to-end: a 0→1 multi-sided B2B marketplace connecting essential-oil buyers with traders and aggregators, with payments, logistics, and quality-assurance workflows across six stakeholder groups. Took it from 60+ discovery interviews to 16K+ users, 500+ transactions at ₹3 L AOV, and ₹7.5 L MRR within two months — and cut end-to-end procurement time in half.",
    },
    metrics: [
      { value: "₹7.5 L MRR", label: "Within 2 months" },
      { value: "16K+", label: "Users" },
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
      { value: "₹7.5 L MRR", label: "Within 2 months" },
      { value: "16K+", label: "Users" },
      { value: "500+", label: "Transactions · ₹3 L AOV" },
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
        text: "I defined the North Star and acquisition metrics, then ran A/B tests, cohort analysis, and funnel optimization to scale supply and demand together: 600+ active sellers, 150+ buyers, and a 15K+ farmer supply base, driving 500+ transactions at ₹3 L average order value and ₹7.5 L MRR within two months — while cutting procurement time in half, from 18 to 9 days.",
      },
      { kind: "h2", text: "Outcomes" },
      { kind: "p", text: "Within two months of launch:" },
      {
        kind: "ul",
        items: [
          "₹7.5 L MRR within 2 months of launch.",
          "16K+ users across buyers, traders/aggregators, and a 15K+ farmer supply base.",
          "500+ transactions at ₹3 L average order value.",
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
    eyebrow: "HEBE · PRODUCT LEAD · JUL '25 TO PRESENT",
    title:
      "Turning a ₹1.6 Cr family essential-oil business into a digitally instrumented operation",
    dek: {
      short:
        "Took over a ₹1.6 Cr family essential-oil business running on WhatsApp and memory. Instrumented operations with a real-time dashboard and built an AI-driven B2B sales engine — growing it to ₹2.1 Cr in 12 months.",
      long: "Took over a ₹1.6 Cr family essential-oil manufacturing and trading business running on WhatsApp and memory. In 12 months I grew it to ₹2.1 Cr by instrumenting operations with a real-time dashboard — cutting fulfilment time from 21 to 14 days and tripling the supplier base — and by building an AI-driven B2B sales engine that filtered a noisy inbound pipeline into 15+ enterprise clients.",
    },
    metrics: [
      { value: "₹1.6 Cr → ₹2.1 Cr", label: "Revenue in 12 months" },
      { value: "3×", label: "Supplier base" },
      { value: "15+", label: "Enterprise clients" },
    ],
    tags: ["P&L", "Operations", "AI Automation", "B2B Growth", "Supply Chain", "Analytics"],
    ribbon: [
      { value: "₹1.6 Cr → ₹2.1 Cr", label: "Revenue · 31% YoY" },
      { value: "3×", label: "Supplier base" },
      { value: "21 → 14 days", label: "Fulfilment · −33%" },
      { value: "15+", label: "Enterprise clients" },
    ],
    prose: [
      { kind: "h2", text: "Context" },
      {
        kind: "p",
        text: "HEBE is a family-run B2B essential-oil manufacturing and trading business doing ₹1.6 Cr in annual revenue when I took over as Product Lead in July 2025, selling to fragrance and flavor wholesalers. The business was real but uninstrumented: procurement and vendor relationships lived in WhatsApp threads, reporting was manual and after-the-fact, order fulfilment took roughly 21 days, and the inbound B2B pipeline was high-noise — plenty of enquiries, little signal on which were worth chasing.",
      },
      { kind: "h2", text: "My role" },
      {
        kind: "p",
        text: "I owned the P&L, operations, vendor management, and B2B growth. I did not own manufacturing (a specialist plus a small processing crew handled that) or finance compliance (a part-time CA). Every other lever — supplier and vendor management, operations instrumentation, customer acquisition, and sales — was mine.",
      },
      { kind: "h2", text: "Approach" },
      { kind: "h3", text: "A real-time operations dashboard" },
      {
        kind: "p",
        text: "The first build was instrumentation. I built a real-time operations dashboard with automated reporting and alerts across procurement, vendor management, and fulfilment. For the first time, vendor performance and order status were visible as they happened rather than reconstructed after the fact — which is what let us widen the supply base safely. The supplier base grew 3×, and order fulfilment time dropped 33%, from 21 to 14 days.",
      },
      { kind: "h3", text: "An AI-driven B2B sales engine" },
      {
        kind: "p",
        text: "The second build went after the noisy inbound pipeline. I built an AI-powered lead-qualification and outreach automation system that filtered high-volume, low-signal B2B enquiries down to the buyers actually worth pursuing, then ran personalized outreach against that shortlist. It landed 15+ enterprise clients and drove 31% year-over-year revenue growth, from ₹1.6 Cr to ₹2.1 Cr.",
      },
      { kind: "h2", text: "Outcomes" },
      { kind: "p", text: "End of year 1 in this role:" },
      {
        kind: "ul",
        items: [
          "Revenue: ₹1.6 Cr → ₹2.1 Cr in 12 months. 31% YoY growth.",
          "Supplier base: grew 3×.",
          "Fulfilment time: 21 → 14 days (−33%).",
          "15+ enterprise clients acquired via the AI-driven sales engine.",
          "Operations moved from WhatsApp and memory to a single real-time dashboard with automated reporting and alerts.",
        ],
      },
      { kind: "h2", text: "Reflections" },
      {
        kind: "p",
        text: "The dashboard was the easy part. The harder part was getting a relationship-run business to trust a system over a phone call — the instrumentation only mattered once people actually acted on what it showed. What I would do differently: introduce the reporting layer in week one, not month two. Every week the business ran on instinct was a week of decisions I could not later explain with data.",
      },
    ],
    methods: [
      "Operations instrumentation",
      "Vendor management",
      "AI lead qualification",
      "Outreach automation",
      "B2B sales",
      "Analytics & reporting",
    ],
    tools: [
      "SQL",
      "Power BI",
      "Excel / Sheets",
      "Claude Code",
      "WhatsApp Business",
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
