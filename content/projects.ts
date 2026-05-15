// Single source of truth for the Projects section (landing) and per-project
// deep dives at /projects/[slug]. Two-tier model:
//
//   1. Top tier — full case studies (Netflix India + Amazon Prime Video).
//      Content lifted verbatim from `Cases/netflix.html` + `Cases/amazon-prime.html`.
//      Each has a banner image (desktop + mobile variants for responsive swap),
//      a 2-metric outcome line for the landing card, a stat ribbon for the deep
//      dive, rich prose, and a downloadable original-deck PDF.
//
//   2. Bottom tier — product teardowns (9, from the SIGMA PM & Tech Club series).
//      Each has a square thumbnail, lighter metadata, prose lifted from the
//      original deck, and a downloadable PDF. Year displayed as `2026` for
//      visual cohesion across the section (overrides the actual 2022–2023 PDF
//      dates per Phase 4 user decision); `authoredAt` preserves the real date.
//
// Array order = landing display order. Case studies render in the top-tier
// 50/50 split (Netflix LEFT, Amazon Prime RIGHT). Teardowns render in the
// bottom-tier marquee row (most-recent-feel first).
//
// Image filenames currently point to SVG placeholders in /public/projects/.
// Real magazine-style banners + thumbnails ship in the Phase 4 image
// production pass; swap is a one-line `image.*` change per asset, no code
// refactor needed. Original decks ship as static PDFs at /public/cases/{slug}.pdf.

export type ProseBlock =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: (string | { lead: string; rest: string })[] };

// ---------- Top tier: case study projects ----------

export type ProjectCaseStudySlug = "netflix" | "amazon-prime";

export interface ProjectCaseStudy {
  kind: "case-study";
  slug: ProjectCaseStudySlug;
  /** Brand name shown in cross-project nav and short references. */
  brand: string;
  /** Card-metadata eyebrow (e.g., `SPEC EXERCISE · SELF-DIRECTED · 2026`). */
  eyebrow: string;
  /** Long card-metadata + deep-dive title. */
  title: string;
  /** Tighter title used in cross-project nav and OG. */
  shortTitle: string;
  /** Banner image — desktop (3:2) and mobile (9:19.5) variants, swapped via
   *  responsive `<picture>` in the card. */
  banner: {
    desktop: string;
    mobile: string;
    alt: string;
  };
  dek: { short: string; long: string };
  /** Two metrics surfaced on the landing card; same shape as `Work` entries. */
  metrics: [string, string];
  tags: string[];
  /** Stat ribbon for the deep dive (1–4 items). */
  ribbon: { value: string; label: string }[];
  /** Disclaimer rendered as italic prefatory text at the top of the deep-dive
   *  prose body. Both Netflix and Prime case studies are self-directed, so
   *  this is required for ethical clarity. */
  disclaimer: string;
  prose: ProseBlock[];
  /** Path to the downloadable original deck PDF in /public/cases/. Renders as
   *  a hairline-bordered link block above the cross-case pagination, with the
   *  cover image as the primary visual hook. */
  deckHref: string;
  /** Path to the deck cover image in /public/cases/ (16:9). Currently a
   *  placeholder SVG; swaps to a real JPG/PNG export of the deck's first page
   *  via a one-line edit when the deck is finalized. */
  deckCover: string;
  /** Slide count for the deck. Renders in the deck-link metadata line as
   *  `{n} slides` — primary signal of how much there is in the deck. */
  deckPages: number;
}

// ---------- Bottom tier: product teardowns ----------

export type ProjectTeardownSlug =
  | "cred"
  | "blinkit"
  | "groww"
  | "spotify"
  | "cult-fit"
  | "zerodha"
  | "instagram"
  | "zoom";

export interface ProjectTeardown {
  kind: "teardown";
  slug: ProjectTeardownSlug;
  product: string;
  /** Argument-led headline (e.g., `Why CRED's reward loop forgets quiet
   *  months. Three fixes.`). Renders as the card's primary line and as the
   *  deep-dive `<h1>`. Optional: when absent, `brief` fills the card slot
   *  and `${product} teardown` (the legacy `title`) fills the H1 — covers
   *  the period before each hook is finalized in the source slides. */
  hook?: string;
  /** Legacy display title (e.g., `CRED teardown`). Currently unused on
   *  cards (the hook + product byline replaced it) and falls back to the
   *  deep-dive `<h1>` only when `hook` is absent. Kept on the type for
   *  Next.js `generateMetadata` and any external consumer that needs an
   *  artifact-style label. Safe to remove once `hook` is populated for
   *  every entry. */
  title: string;
  /** Year displayed in card metadata. Locked to 2026 across the section.
   *  No longer rendered (the year added no signal once every card showed
   *  the same value); kept for any legacy consumer. */
  year: number;
  /** Square thumbnail (1:1). */
  thumb: { src: string; alt: string };
  /** One-line summary used in the deep-dive italic subtitle, the index
   *  metadata description, and as the card's Line 1 fallback when `hook`
   *  is absent. */
  brief: string;
  /** Originally-authored deck date (for credit / honesty in the deep dive),
   *  separate from the displayed `year` which is harmonized to 2026. */
  authoredAt: string;
  /** Optional prose body lifted from the source deck. When present, the
   *  TeardownDetail template renders the full deep dive (Introduction →
   *  Audience → Feature observations → Recommendations → Metrics).
   *  When absent, the template falls back to the "Deep dive — coming soon"
   *  placeholder card. */
  prose?: ProseBlock[];
  /** Path to the downloadable original deck PDF in /public/cases/. Renders as
   *  a hairline-bordered link block below the prose body, with the cover
   *  image as the primary visual hook. */
  deckHref?: string;
  /** Path to the deck cover image in /public/cases/ (16:9). Currently a
   *  placeholder SVG; swaps to a real JPG/PNG when the deck is finalized.
   *  Required when `deckHref` is present. */
  deckCover?: string;
  /** Slide count for the deck. Renders as `{n} slides` in the deck-link
   *  metadata line. Required when `deckHref` is present. */
  deckPages?: number;
}

export type Project = ProjectCaseStudy | ProjectTeardown;

// ---------- Case studies ----------

export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    kind: "case-study",
    slug: "netflix",
    brand: "Netflix",
    eyebrow: "SPEC EXERCISE · SELF-DIRECTED · 2026",
    title: "Netflix India's content is winning. Its product isn't.",
    shortTitle: "Netflix India",
    banner: {
      desktop: "/projects/netflix-banner.webp",
      mobile: "/projects/netflix-banner.webp",
      alt: "Netflix India case study banner",
    },
    dek: {
      short:
        "Netflix India runs third at 17% market share with the positioning right. What's missing is a product layer that lets viewing feel social.",
      long: "Netflix India runs third at 17% market share with the positioning right. What's missing is a product layer that lets viewing feel social. Two product bets, Watch Party with Creator and Netflix Creative Studio, close the gap.",
    },
    metrics: ["17% market share · 3rd in India", "2 product bets proposed"],
    tags: ["Spec Exercise", "Market Strategy", "User Research", "First Principles"],
    ribbon: [
      { value: "17%", label: "Market share · 3rd in India" },
      { value: "25+", label: "Users interviewed" },
      { value: "3", label: "Behavioral patterns surfaced" },
      { value: "2", label: "Product bets proposed" },
    ],
    disclaimer:
      "This is a self-directed product exercise based on publicly available data about Netflix India and its competitors. I have not worked at Netflix, do not have access to internal data, and am not affiliated with the company. The exercise simulates how I would approach the problem if asked.",
    prose: [
      { kind: "h2", text: "The problem" },
      {
        kind: "p",
        text: "Netflix is a global success. Netflix India is not. In Q1 FY26, Netflix India runs at ~17% market share, a distant third behind Disney Hotstar (26%, 300M+ subscribers) and Amazon Prime Video (24%, 67M subscribers). Netflix India's own subscriber base is ~17M and revenue ₹38 Cr; both are growing, neither is closing the gap. The exercise: figure out why, then propose product moves that would actually move it.",
      },
      { kind: "h2", text: "Approach" },
      {
        kind: "p",
        text: "I broke subscriber growth and revenue down into the metrics that move them. Subscriber growth is a function of content strategy, pricing, marketing, product/tech experience, and partnerships. Revenue is average plan price × (retention × prior-month paid subs + new subs gained this month). That gave five levers to investigate and a formula to keep the work honest.",
      },
      {
        kind: "p",
        text: "Then two parallel exercises: a competitive analysis across the five major Indian OTTs (Disney Hotstar, Amazon Prime Video, JioCinema, ZEE5, SonyLiv) on content strategy and pricing, and casual interviews with 25+ existing Netflix and other-OTT users on four themes: platform preference, first-time Netflix sign-up path, last-watched-show discovery path, and streaming frequency.",
      },
      { kind: "h2", text: "Insights" },
      { kind: "h3", text: "Netflix's positioning is \u201cthe Apple of OTTs\u201d" },
      {
        kind: "p",
        text: "The user interviews reframed the picture. Three patterns: nobody opens Netflix for a Bollywood movie or a SOAP (that traffic goes to Hotstar, JioCinema, or SonyLiv); for casual daily viewing, users default to the same; and every interviewee could name multiple Netflix Originals while none could name a Hotstar Original. Netflix isn't fighting for \u201cwhat's playing tonight\u201d. It's the intentional, binge-mode platform. Less volume, higher quality, premium audience. The races on sports, regional, and live events belong to someone else.",
      },
      { kind: "h3", text: "The real competitor isn't Hotstar. It's social media" },
      {
        kind: "p",
        text: "If the positioning is right, why doesn't the revenue follow? Re-running first principles answered it. The standard streaming framing (\u201cpeople want convenient, personalized, uninterrupted access to high-quality entertainment\u201d) explains why Netflix wins on quality but not why subscribers don't multiply. Streaming isn't the only entertainment.",
      },
      {
        kind: "p",
        text: "For a given user, the value of entertainment is a function of freedom; freedom is a function of time, money, and age. Other OTTs target the low-freedom segment: at \u20b929 to \u20b9199 per month, Hotstar and JioCinema deliver more entertainment value than going out for a user with limited money or time. Netflix targets the high-freedom segment, where the user is choosing between Netflix, social media, parties, travel, and hobbies.",
      },
      {
        kind: "p",
        text: "Run that through Maslow: Netflix's content taps esteem needs (storytelling, quality); social media taps belongingness (the social need). Watching Netflix is structurally isolated. Scrolling Reels with friends in a group chat is not. Netflix is winning the content war and losing the belongingness war.",
      },
      { kind: "h2", text: "Recommendations" },
      {
        kind: "p",
        text: "Two solutions, both built to bring belongingness into Netflix viewing by formalizing the creator-economy loop that already drives Netflix acquisition for free.",
      },
      {
        kind: "ol",
        items: [
          {
            lead: "Watch Party with Creator.",
            rest: "A live, shared viewing layer where users watch Netflix content alongside thousands of fans and a featured creator who reacts, comments, and engages in real time. The creator earns through a revenue-share model. Turns a Netflix release from an isolated experience into a communal one, closing the gap that social media currently fills.",
          },
          {
            lead: "Netflix Creative Studio.",
            rest: "A video-editing environment built into the platform that lets creators produce derivative content around Netflix shows: reactions, commentary, remixes, new storytelling formats. Today that content lives on Instagram, YouTube, and TikTok and drives Netflix acquisition organically. Bringing the creation surface inside Netflix turns the discovery loop into an owned channel and gives Netflix a content engine that doesn't require a multi-million-dollar original.",
          },
        ],
      },
      {
        kind: "p",
        text: "Both target the same root cause and both lean on the same fact about how Netflix wins users today: discovery happens because someone else talked about a Netflix show on a platform Netflix doesn't own. The two products formalize that loop inside the platform.",
      },
    ],
    deckHref: "/cases/netflix.pdf",
    deckCover: "/cases/netflix-cover.png",
    deckPages: 38,
  },
  {
    kind: "case-study",
    slug: "amazon-prime",
    brand: "Amazon Prime Video",
    eyebrow: "SPEC EXERCISE · SELF-DIRECTED · 2026",
    title: "Solving decision fatigue on Amazon Prime Video",
    shortTitle: "Amazon Prime Video",
    banner: {
      desktop: "/projects/amazon-prime-banner.webp",
      mobile: "/projects/amazon-prime-banner.webp",
      alt: "Amazon Prime Video case study banner",
    },
    dek: {
      short:
        "A self-directed product critique grounded in original survey research. Prime Video's biggest competitor isn't Netflix. It's the back button.",
      long: "A self-directed product critique grounded in original survey research. Prime Video's biggest competitor isn't Netflix. It's the back button. Four RICE-scored interventions, one recommendation.",
    },
    metrics: ["60+ surveyed", "4 RICE-scored interventions"],
    tags: ["Spec Exercise", "User Research", "RICE"],
    ribbon: [
      { value: "60+", label: "Survey responses" },
      { value: "3", label: "Decision-fatigue patterns" },
      { value: "4", label: "RICE-scored solutions" },
      { value: "1", label: "Recommendation" },
    ],
    disclaimer:
      "This is a self-directed product exercise based on publicly available information about Amazon Prime Video and original survey research conducted by me as a self-directed exercise. I have not worked at Amazon, do not have access to internal data, and am not affiliated with the company. The exercise simulates how I would approach the problem if asked.",
    prose: [
      { kind: "h2", text: "The prompt" },
      {
        kind: "p",
        text: "Prime Video has a content library competitive with the leaders, a built-in distribution channel through Prime membership, and yet self-reported viewer satisfaction trails the category. The exercise: identify what's breaking the conversion from open-app to start-playing and propose a ranked set of interventions.",
      },
      { kind: "h2", text: "Research method" },
      {
        kind: "p",
        text: "I ran a short, structured survey of 60+ respondents: friends, family, and peers across metro India who are active OTT users. The survey covered recent viewing sessions, time spent in the browse stage, what eventually got selected, and a recall of how the decision felt. Three patterns emerged.",
      },
      { kind: "h2", text: "Findings" },
      { kind: "h3", text: "Pattern 1: The library is wider than it is deep" },
      {
        kind: "p",
        text: "Respondents reported feeling that Prime Video has \u201ceverything,\u201d but that the rows surfaced in browse felt arbitrary. The breadth signal works against the depth signal: a wide library without strong curation reads as \u201cI could watch anything, so I'll watch nothing.\u201d",
      },
      { kind: "h3", text: "Pattern 2: The free-vs-paid line is invisible until you click" },
      {
        kind: "p",
        text: "Many respondents reported clicking into a title only to discover it required an additional rental or a Channel subscription. Each of these moments is a small churn risk: the viewer either pays grudgingly or backs out and picks something less ideal. The fragmented commerce model is silently degrading the browse experience.",
      },
      { kind: "h3", text: "Pattern 3: There is no \u201ctonight\u201d surface" },
      {
        kind: "p",
        text: "Browse leans heavily on genre, recency, and personalization, but does not acknowledge the time-bound nature of most viewing decisions. Most respondents had ten to thirty minutes between sitting down and committing. The browse experience does not optimize for that window.",
      },
      { kind: "h2", text: "Recommendations" },
      {
        kind: "ol",
        items: [
          {
            lead: "Visible commerce-state on every title card.",
            rest: "A persistent indicator (Prime / Rent / Channel) on the card itself, not on click. R: 9, I: 8, C: 6, E: 4 → RICE 108.",
          },
          {
            lead: "Curated \u201ctonight\u201d row.",
            rest: "A first-position row of 6 to 10 titles selected for \u201cready to watch tonight,\u201d updated daily. R: 8, I: 7, C: 5, E: 5 → RICE 56.",
          },
          {
            lead: "Time-budget filter.",
            rest: "A simple 30-min / 1-hr / 2-hr+ picker that reshuffles the carousels. R: 6, I: 6, C: 5, E: 5 → RICE 36.",
          },
          {
            lead: "Decision-history nudge.",
            rest: "A \u201cyou watched X last week, want to continue or try Y\u201d surface that short-circuits the browse stage entirely for returning viewers. R: 7, I: 7, C: 4, E: 6 → RICE 33.",
          },
        ],
      },
      {
        kind: "p",
        text: "Single recommendation: ship #1 (visible commerce-state). It eliminates a pattern of friction the team can fix without rebuilding the recommender, and it produces the cleanest test (browse-to-play conversion, segmented by content type).",
      },
      { kind: "h2", text: "Reflections" },
      {
        kind: "p",
        text: "The most useful thing I learned from running my own survey was how quickly small-sample qualitative research surfaces the \u201cobvious\u201d pattern that none of the strategy decks capture. The fragmentation of Prime Video's commerce model is well-known internally, almost certainly. The exercise's contribution is not the discovery; it is the prioritization of friction that the data team could already find.",
      },
    ],
    deckHref: "/cases/amazon-prime.pdf",
    deckCover: "/cases/amazon-prime-cover.png",
    deckPages: 8,
  },
];

// ---------- Teardowns ----------
//
// Source: SIGMA · PM & Tech Club teardown series, lifted from the PDFs in
// `Cases/`. `year` is locked to 2026 across the section per the Phase 4
// user decision (visual cohesion with the case studies). `authoredAt`
// preserves the original deck date for honesty in the deep dive.

export const projectTeardowns: ProjectTeardown[] = [
  {
    kind: "teardown",
    slug: "cred",
    product: "CRED",
    title: "CRED teardown",
    year: 2026,
    thumb: { src: "/projects/teardowns/cred.webp", alt: "CRED teardown thumbnail" },
    hook: "CRED's reward loop forgets quiet months. Three fixes.",
    brief:
      "CRED built a $6.4B fintech on a bizarre premise: rewarding India's top 1.5% for paying bills they'd pay anyway. The real product isn't the reward loop; it's the identity it sells.",
    authoredAt: "August 2023",
    deckHref: "/cases/cred.pdf",
    deckCover: "/cases/cred-cover.png",
    deckPages: 27,
    prose: [
      { kind: "h2", text: "The Setup" },
      {
        kind: "p",
        text: "Less than 4% of Indians hold a credit card. CRED's 750+ CIBIL requirement filters to roughly the top 1.5% of India's adult population: 13M+ members, ₹40–50K average monthly bill (3× the national average), and a peak valuation of $6.4B at Series F. FY23 revenue hit ₹1,400 Cr, but so did the net loss. A premium brand, a profitable user cohort, a structural moat no competitor has copied. Still loss-making.",
      },
      { kind: "h2", text: "The Paradox" },
      {
        kind: "p",
        text: "The founding premise is genuinely strange. You pay your credit card bill (which you were going to do anyway) and CRED gives you coins. The real answer isn't that CRED is rewarding the payment. It's rewarding the identity of being someone who pays on time. Most companies solve a problem. CRED solved an identity. Feelings are sticky in a way that utility is not.",
      },
      { kind: "h2", text: "Why It Worked" },
      {
        kind: "ul",
        items: [
          "Exclusivity: The 750+ CIBIL gate makes membership feel earned, not invited. You join to confirm something you already believe about yourself.",
          "Self-aware audience: India's credit card holders are urban, high-income, and underserved by apps designed for mass-market credit risk. They respond to a product that treats them accordingly.",
          "Aspiration over utility: The best apps make you feel like a better version of yourself. CRED sold the identity of the person who pays bills on time, not a feature set.",
        ],
      },
      { kind: "h2", text: "The Machine: Three Loops" },
      { kind: "h3", text: "Trust Loop" },
      {
        kind: "p",
        text: "Every on-time payment is a data point CRED converts into trust capital. That trust is what makes CRED Cash and Mint viable; users are comfortable borrowing from a platform that's seen their discipline. Bills paid → trust established → financial products unlocked.",
      },
      { kind: "h3", text: "Spend Loop" },
      {
        kind: "p",
        text: "Coins turn a monthly trigger (bill day) into a potential weekly behavior (checking deals). Premium brands pay to reach CRED's audience. That revenue funds the rewards program. Coins earned → CRED Store visited → brand revenue generated.",
      },
      { kind: "h3", text: "Data Loop" },
      {
        kind: "p",
        text: "No single bank sees spending across all of a user's credit cards. CRED does. This cross-card view is a genuinely unique data asset: transactions captured, credit profile refined, underwriting sharpened. Trust generates data, data enables better products, better products generate more trust.",
      },
      { kind: "h2", text: "The Product: Six Features" },
      { kind: "h3", text: "Bill Payment (Core, 2018)" },
      {
        kind: "p",
        text: "One-tap payment for 100+ bank credit cards. Automatic bill fetch, custom reminders, hidden charge alerts, zero-fee rails. Every payment is a data point that unlocks every other product. Known issues: zero-balance notifications fire even at ₹0 outstanding, eroding trust; no in-app dispute mechanism breaks the single-destination promise.",
      },
      { kind: "h3", text: "CRED Rewards + Store (Retention, 2018)" },
      {
        kind: "p",
        text: "Coins redeemable in the CRED Store for brand vouchers and experiences. Designed to turn monthly bill payment into weekly Store browsing. Where it broke: coin devaluation over time, a generic grid catalog with low redemption rates (~12% of coin earners), and lottery-style mechanics that users describe as dark-pattern-adjacent.",
      },
      { kind: "h3", text: "CRED Cash, Mint, and RentPay (Revenue, 2020–2021)" },
      {
        kind: "p",
        text: "CRED Cash offers instant credit lines (₹25K–5L) underwritten using CRED behavioral data. CRED Mint is an RBI-registered P2P NBFC offering 9%+ returns; the gate acts as a credit quality signal on both sides. CRED RentPay (1–1.5% fee on rent payments via credit card) captures the largest monthly expense for urban Indians that couldn't previously be paid by card; avg transaction ₹15–25K, recurring, first-mover advantage.",
      },
      { kind: "h3", text: "CRED Garage and Travel (New Triggers, 2022–2023)" },
      {
        kind: "p",
        text: "Garage (FASTag, insurance, challans, fuel) creates monthly and annual touchpoints beyond bill day, using existing vehicle-ownership behavior rather than asking for a new habit. Travel (flights, hotels, curated escapes) targets CRED's frequent-traveler demographic but faces deep inventory trust held by MakeMyTrip and Ixigo.",
      },
      { kind: "h2", text: "The Cracks" },
      { kind: "h3", text: "Engagement Ceiling" },
      {
        kind: "p",
        text: "Estimated DAU/MAU is ~10–15%, inferred from monthly-trigger behavior. WhatsApp is 80%+; Paytm is 30–40%. The primary use case is inherently monthly. Every feature launched since 2021 attempts to change this number. The existential risk: RBI autopay mandate expansion could eliminate the monthly trigger entirely, removing CRED's entry point.",
      },
      { kind: "h3", text: "Monetization Paradox" },
      {
        kind: "p",
        text: "The credit quality gate creates a structural tension: CRED's best users are its worst customers. A 750+ CIBIL member doesn't need emergency loans, pays in full monthly (no revolving interest), is financially disciplined (low impulse-buy conversion), and is cynical about ads. Every virtue that makes a user valuable also makes them hard to monetize through traditional fintech revenue streams.",
      },
      { kind: "h2", text: "The PM Take: Three Moves" },
      {
        kind: "ol",
        items: [
          {
            lead: "Smart Financial Pulse (60 days).",
            rest: "Replace bill-day notifications with a weekly financial health check: credit utilization trend, payment streak counter, score direction, and one actionable insight. Uses data CRED already has. A/B test three variants: streak-first, score-first, action-first. Target: notification CTR ≥15%, 7-day non-bill-day re-engagement uplift.",
          },
          {
            lead: "Rewards Intelligence Engine (3–6 months).",
            rest: "Map spend categories to rewards catalog tags, then use collaborative filtering to surface personalized rewards based on actual transaction behavior. Current coin redemption rate is ~12%; target is 25%+. Target: CRED Store revenue per MAU +30%.",
          },
          {
            lead: "CRED Pro at ₹499/year (12–18 months).",
            rest: "A paid membership tier that converts engagement into revenue for users too financially disciplined to take loans. Features: personalized credit score coaching, priority human support with 4-hour SLA, pro rewards catalog with guaranteed coin value, and financial goal tracking. Target: 8% conversion = ₹55 Cr direct annual revenue; 1M+ subscribers by Month 18.",
          },
        ],
      },
      { kind: "h2", text: "North Star Metric" },
      {
        kind: "p",
        text: "Monthly Active Sessions per Member. Current estimated: ~1.2. Target: >4. This is the single number that tells you whether CRED has cracked the engagement problem. Leading indicators: app opens per member per month (non-bill-day) ≥3, coin redemption rate ≥25%, Financial Pulse notification CTR ≥15%. Lagging: revenue per member (annual) ₹1,200+, 12-month member retention ≥75%.",
      },
    ],
  },
  {
    kind: "teardown",
    slug: "blinkit",
    product: "Blinkit",
    title: "Blinkit teardown",
    year: 2026,
    thumb: { src: "/projects/teardowns/blinkit.webp", alt: "Blinkit teardown thumbnail" },
    hook: "Blinkit won the speed war. The real battle is making dark stores print money.",
    brief:
      "Blinkit solved the 10-minute delivery problem by shrinking the store, not the distance. Now it has to turn 526 dark stores into a money-printing machine through ads, hot food, and pharmacy, before Zepto catches up.",
    authoredAt: "February 2023",
    deckHref: "/cases/blinkit.pdf",
    deckCover: "/cases/blinkit-cover.png",
    deckPages: 28,
    prose: [
      { kind: "h2", text: "The Paradox" },
      {
        kind: "p",
        text: "India's fastest-growing q-commerce platform has never turned an annual profit, and that's the point. Blinkit's losses are not a failure of execution; they are the entry fee for controlling India's urban grocery infrastructure. From losing ₹40–60 per order in FY2023, it reached contribution margin positive by Q2 FY2025. Zomato stockholders who voted against the $568M acquisition in 2022 watched Blinkit become the company's fastest-growing segment within 24 months.",
      },
      { kind: "h2", text: "The 10-Minute Promise" },
      {
        kind: "p",
        text: "Delivering in 10 minutes is a physics problem. Blinkit solved it by shrinking the store, not the distance. The constraint is not speed; it is inventory coverage within a 1.5 km radius. Every dark store decision is a bet on which 5,000–13,000 SKUs will satisfy 80% of demand in that micro-catchment. The 10-min promise holds in ideal conditions; peak hours, rain, and festivals push averages to 18–22 minutes. That perception gap is the biggest retention risk.",
      },
      { kind: "h2", text: "By the Numbers" },
      {
        kind: "ul",
        items: [
          "GMV FY2025: ₹27,000 Cr (~$3.3B annualized)",
          "Orders per month: 65–70M (Q3 FY2025)",
          "Dark stores: 526+ as of Sep 2024; target 1,000+ by FY2026",
          "Average order value: ₹640 (up from ₹480 in FY2023)",
          "Market share: 46–48% of India's q-commerce GMV",
        ],
      },
      { kind: "h2", text: "Business Model" },
      {
        kind: "p",
        text: "Four revenue streams, but only one is truly defensible at scale. The platform take rate has moved from 11% to 19% in two years; advertising is where the next 10 points come from.",
      },
      {
        kind: "ul",
        items: [
          "Commission + Delivery Fees: 12–14% take rate on GMV; delivery fee ₹15–49 per order, waived for Zomato Gold subscribers.",
          "Advertising / Brand Shelf Fees: +2–3% of GMV; growing 120% YoY; estimated ₹400–600 Cr FY2025; highest-margin line item.",
          "Zomato Gold Subscription: ₹299/month bundle covering food + grocery; Gold users churn 40–50% less; near-zero CAC cross-sell.",
          "Blinkit for Business (B2B): GST invoicing, net-30 credit, bulk pricing; 5–8% of GMV; AOV ₹3,000–8,000 vs consumer ₹640.",
        ],
      },
      { kind: "h2", text: "The Zomato Flywheel" },
      {
        kind: "p",
        text: "Zepto, Instamart, and BB Now all spend ₹200–400 to acquire a customer. Blinkit gets its best customers from the Zomato app tab, for free. Zomato's 100M+ user base is the unfair advantage no competitor can buy, and that gap compounds with every passing quarter.",
      },
      { kind: "h2", text: "Dark Store Unit Economics" },
      {
        kind: "p",
        text: "500 orders per day is the number that separates a profitable store from a cash incinerator. New stores lose ₹40–60 per order for 12–18 months. Mature stores earn ₹10–15. At breakeven, the per-order P&L looks like: Revenue ₹120–140, minus COGS ₹55–65, minus rent/utilities ₹15–20, minus delivery partner cost ₹30–40, minus packaging/tech ₹8–13, equals +₹10–15 contribution margin. Next-gen large-format stores (2,000–4,000 sq ft) hold 13,000+ SKUs and improve contribution margin per order by 30–40%.",
      },
      { kind: "h2", text: "Feature Deep-Dive" },
      { kind: "h3", text: "Item Search and Listing" },
      {
        kind: "p",
        text: "Blinkit's product pages out-detail every shelf in every kirana store in India: storage tips, shelf life, country of origin, FSSAI license, and real-time availability at your nearest dark store. Users who read product details convert at 2x rate. AI substitution auto-suggests the nearest equivalent when an item is out of stock, reducing cart abandonment by ~15%. The gap: auto-substitution picks the wrong brand, size, or price; users want an opt-out-and-refund option that doesn't yet exist.",
      },
      { kind: "h3", text: "Brand Discovery and Brand Stores" },
      {
        kind: "p",
        text: "Brand Stores turned Blinkit into a D2C launchpad overnight, at zero build cost for brands. A D2C brand's alternative to Blinkit is building its own logistics for ₹30–50 Cr and 18 months. Blinkit's brand storefronts offer the same shelf in 2 weeks. Brands pay ₹5–20L/month for premium placement, sampling, and banners. Real-time basket co-add data shared back to brands is something traditional retail can never provide.",
      },
      { kind: "h3", text: "Reorder and Recurring Delivery" },
      {
        kind: "p",
        text: "One-tap reorder converts urgency into habit for planned shoppers. Repeat orders take 30 seconds vs. 3–4 minutes for a fresh cart build. Users who reorder 3x in a month show 78% 90-day retention. Scheduled 30-min and 2-hour delivery slots launched in 2024. The missing feature: no true subscription or auto-replenishment; Amazon Subscribe & Save and BigBasket Smart Basket have this, and Blinkit has the data but not the product.",
      },
      { kind: "h3", text: "Blinkit Bistro" },
      {
        kind: "p",
        text: "Bistro delivers hot food in 12 minutes from a kitchen inside the dark store. Swiggy and Zomato deliver restaurant food in 30–45 minutes from third-party kitchens, taking 20–30% from restaurants. Bistro owns the kitchen, the menu, and the margin; food gross margins can reach 60–65% vs. grocery's 20%. Launched in Delhi-NCR (Q3 FY2025); 15% of Bistro users were new-to-platform. If Bistro reaches 100 stores, Blinkit exits pure q-commerce and becomes a vertically integrated food + grocery + pharmacy platform.",
      },
      { kind: "h2", text: "The Cracks" },
      { kind: "h3", text: "Retention" },
      {
        kind: "p",
        text: "4.2 orders/month average masks a dangerous bimodal reality: power users order 8–12x/month; casual users order 1–2x. A single 40-minute delivery during rain is remembered 10x more than ten 8-minute deliveries; delivery reliability is the #1 churn driver. Coupon-driven users acquired via deep discount codes show 60% lower 90-day retention.",
      },
      { kind: "h3", text: "Monetization Gap" },
      {
        kind: "p",
        text: "Ad revenue is Blinkit's biggest untapped lever and Amazon proved the playbook. Amazon earns 15–20% of GMV from advertising; Blinkit earns approximately 2%. The gap is not a product limitation; it is a sales motion and ad-tech capability problem. No second-price auction, no DSP, no off-platform retargeting. The brands are ready; the platform is not. A mature ad platform could absorb ₹2,000–3,000 Cr/year at 80%+ gross margins.",
      },
      { kind: "h3", text: "Competition" },
      {
        kind: "p",
        text: "Zepto is younger, leaner, and reaching contribution breakeven 6–9 months ahead of Blinkit. Blinkit holds 46–48% GMV market share, Instamart 28–30%, Zepto 20–22% (growing fastest). Zepto raised $665M in 2024 at $3.6B valuation and launched Zepto Cafe before Bistro. Dunzo's collapse (Google-backed, ₹3,000 Cr raised, shut down by 2024) is the cautionary tale: parent capital is not a strategy; unit economics is.",
      },
      { kind: "h2", text: "The PM Take: Three Moves" },
      {
        kind: "ol",
        items: [
          {
            lead: "60 days: Launch recurring basket subscriptions.",
            rest: "Blinkit's order history already knows every user's weekly basket. A scheduling layer on top of existing cart and payment infrastructure; no greenfield build required. Milkbasket's model showed 85% weekly retention for subscribed users vs. 40% for on-demand. At contribution margin positive, locking in 3–4 orders/week per subscriber is pure upside.",
          },
          {
            lead: "3–6 months: Build a Sponsored Products auction platform.",
            rest: "Phase 1: second-price keyword auction for search results. Phase 2: category banners with purchase-to-purchase attribution at SKU, location, and time-of-day granularity. Phase 3: premium brand storefronts at ₹5–20L/month with sampling integration. Target: close the gap from 2% to 8%+ ad attach rate, unlocking ₹2,000–3,000 Cr at 80%+ gross margins.",
          },
          {
            lead: "12–18 months: Scale Bistro to 100 dark stores.",
            rest: "Focus on next-gen large-format stores (2,000+ sq ft) in Delhi-NCR (40), Mumbai (25), Bengaluru (20), Hyderabad (15). Hot food gross margin of 60–65% vs. grocery's 20% means a ₹150 Bistro order contributes ₹90 in gross profit vs. grocery's ₹25–30. If Bistro hits 100 stores, Blinkit becomes a vertically integrated food + grocery + pharmacy platform, a fundamentally different company.",
          },
        ],
      },
      { kind: "h2", text: "North Star" },
      {
        kind: "p",
        text: "Blinkit has built dense, profitable last-mile infrastructure in India's most chaotic urban markets. The infrastructure is now an asset. The company's next decade is about what it does with the real estate (ads, food, pharmacy, B2B) and not about whether it can deliver in 10 minutes. That question has been answered. The next one is harder: can a grocery app become the operating system of urban Indian commerce?",
      },
    ],
  },
  {
    kind: "teardown",
    slug: "groww",
    product: "Groww",
    title: "Groww teardown",
    year: 2026,
    thumb: { src: "/projects/teardowns/groww.webp", alt: "Groww teardown thumbnail" },
    hook: "Groww's best users generate the least revenue. Three moves to fix that.",
    brief:
      "Groww built India's largest retail investing platform on a zero-commission promise, then discovered its most loyal users generate almost no revenue. The monetization gap between the SIP investor and the F&O trader is the defining product problem of India's fintech decade.",
    authoredAt: "November 2022",
    deckHref: "/cases/groww.pdf",
    deckCover: "/cases/groww-cover.png",
    deckPages: 23,
    prose: [
      { kind: "h2", text: "The Setup" },
      {
        kind: "p",
        text: "Groww became India's largest retail investment platform not by being the most sophisticated product, but by removing the advisor conflict-of-interest and making mutual fund investing completely free. The scale is real: 40M+ registered users, #1 by active mutual fund folios. The monetization question is harder. The free lunch problem is structural: Groww built its brand on exactly the users who pay nothing to use it.",
      },
      { kind: "h2", text: "By the Numbers" },
      {
        kind: "ul",
        items: [
          "40M+ registered users as of 2024, largest by mutual fund active folios in India",
          "₹0 brokerage on direct mutual funds, the feature that built the user base",
          "₹20 flat fee per F&O / intraday order, the main brokerage revenue source",
          "$3B valuation at Series E (2022), one of India's fastest-growing fintech unicorns",
        ],
      },
      { kind: "h2", text: "Business Model" },
      {
        kind: "p",
        text: "Groww makes almost nothing from its most loyal users. The structural mismatch: the users who made Groww famous are not the users who make Groww money.",
      },
      {
        kind: "ul",
        items: [
          "Direct mutual funds: ₹0 commission; Groww earns only trail commission from AMCs (0.1–0.5% of AUM annually); small, slow to accumulate, and capped by AUM growth.",
          "F&O and equity trading: ₹20 flat per executed order, the real revenue engine; a trader doing 50 orders/day generates ₹1,000/day, more than a SIP investor generates in a year of trail commission.",
          "Gold, US stocks, fixed deposits: minimal incremental revenue; expand wallet share but do not solve the monetization equation.",
          "Structural mismatch: Groww's brand is first-time SIP investors doing 1–2 transactions/month at zero brokerage; revenue-generating F&O traders are a small minority, and SEBI's 2024 reforms made even that smaller.",
        ],
      },
      { kind: "h2", text: "The Win" },
      { kind: "h3", text: "The Flywheel" },
      {
        kind: "p",
        text: "Before Groww, mutual funds were sold by distributors who earned front-end commissions, a structural conflict of interest that made investors distrust the process. Groww removed the middleman, went direct, and made it free. That single decision built 40M users. Direct plans with zero commission made the platform's interests align with the investor's, a radical departure from how mutual funds were sold in India before 2016.",
      },
      { kind: "h3", text: "UX Simplification" },
      {
        kind: "p",
        text: "Legacy mutual fund platforms required physical documentation, branch visits, and multiple verification steps. Groww compressed this to a fully digital KYC flow. The UI was deliberately sparse: categories, performance charts, SIP amounts, no jargon, no complex screeners to confuse a beginner. KYC in minutes, SIP in 3 taps.",
      },
      { kind: "h3", text: "The Compounding Advantage" },
      {
        kind: "p",
        text: "A user who starts their first SIP on Groww at 25 is unlikely to migrate at 35. Migrating an investment portfolio means redemptions, tax events, and re-KYC friction. Groww's early user acquisition created a moat that isn't obvious on the surface: inertia. The beginner who started in 2020 is now a 6-year relationship with growing AUM and deepening product dependency.",
      },
      { kind: "h2", text: "The Trap" },
      { kind: "h3", text: "The Monetization Gap" },
      {
        kind: "p",
        text: "40M registered users and most of them contribute almost nothing to brokerage. A user doing ₹5,000/month SIP for 5 years generates roughly ₹250–500 in trail commission annually. One active F&O trader doing 30–50 orders/day generates ₹13,200–22,000 in brokerage in a single month. One power user generates what it takes hundreds of SIP investors to produce collectively.",
      },
      { kind: "h3", text: "Regulatory Headwind" },
      {
        kind: "p",
        text: "SEBI's 2023 study found 89% of individual F&O traders booked net losses in FY22; average annual loss per trader ~₹1.1 lakh. SEBI's October 2024 reforms directly hit discount broker revenue: minimum contract size raised to ₹15 lakh, weekly expiry options restricted to one per exchange, upfront premium collection required. The result: significant reduction in retail F&O trading volumes across all discount brokers.",
      },
      { kind: "h3", text: "Competitive Landscape" },
      {
        kind: "p",
        text: "Zerodha is profitable with fewer registered users (~7M active clients). The difference isn't features; it's that Zerodha's users actually trade. Zerodha's Kite platform has TradingView integration, 100+ indicators, GTT orders, basket orders, and Sensibull F&O analytics. Angel One (5–6M active clients) is listed and profitable. Neither Groww nor Upstox has disclosed profitability; both are in the same monetization race.",
      },
      { kind: "h2", text: "The Product" },
      { kind: "h3", text: "Core Product: What Works" },
      {
        kind: "p",
        text: "Groww's mutual fund experience is best-in-class for first-time investors: visual portfolio analysis with category splits, transparent NAV history, sector allocation, fund category split, company-level exposure, and returns vs. benchmark, all in a clean mobile interface a beginner can understand without an advisor or a Bloomberg terminal.",
      },
      { kind: "h3", text: "Feature Ceiling: What's Missing" },
      {
        kind: "p",
        text: "The features intermediate and expert traders need don't exist on Groww. Groww lacks: advanced charting with technical indicators, GTT orders, stock screener with PE/market cap/sector filters, basket orders, and F&O open interest analytics. Every intermediate user who migrates to Zerodha is a user Groww acquired through zero-brokerage MF investing and handed to a competitor at the exact moment they became revenue-generating.",
      },
      { kind: "h2", text: "The PM Take: Three Moves" },
      {
        kind: "ol",
        items: [
          {
            lead: "60 days: Build the SIP Graduation Path.",
            rest: "Surface direct equity via the stocks users already own through their mutual funds. A user who holds Nifty 50 Index Fund has indirect exposure to HDFC Bank, Reliance, TCS; show them what's inside their funds and add a one-tap 'Own HDFC Bank directly' flow. If 5% of 20M MF-only users make one stock trade per month: 1M orders × ₹20 = ₹2 crore/month in incremental brokerage. Primary KPI: MF-only user to first stock trade conversion rate within 90 days.",
          },
          {
            lead: "3–6 months: Launch Groww Pro at ₹499/month.",
            rest: "Stop giving Zerodha the intermediate user for free. Pro feature set: TradingView-style advanced charts, GTT orders, stock screener with PE/market cap/sector filters, F&O open interest and PCR data. Revenue math: 1 lakh Pro subscribers doing 10 trades/month = ₹2 crore/month in brokerage plus ₹5 crore in subscription revenue. The real win is the prevented migration to Zerodha.",
          },
          {
            lead: "12–18 months: Make Groww the primary salary account.",
            rest: "Partner with a scheduled commercial bank. Build a savings account where salary comes in, SIP is deducted first, and the remainder sweeps to a liquid mutual fund earning 6–7% instead of sitting at 3.5%. A user who pays rent, splits bills, and tracks returns from the same app has 20+ monthly sessions vs. once-a-month SIP checkers, creating more opportunities for Pro CTAs and loan-against-securities offers at the right moment.",
          },
        ],
      },
      { kind: "h2", text: "North Star" },
      {
        kind: "p",
        text: "Groww has 40M users, India's largest MF folio base, and the best beginner investing experience in the country. None of that generates meaningful brokerage. The north star metric is revenue-generating active users as a percentage of total registered users, closing the gap between the scale story and the monetization reality.",
      },
    ],
  },
  {
    kind: "teardown",
    slug: "spotify",
    product: "Spotify",
    title: "Spotify teardown",
    year: 2026,
    thumb: { src: "/projects/teardowns/spotify.webp", alt: "Spotify teardown thumbnail" },
    hook: "Spotify's real competitor isn't Apple. It's its own royalty contract.",
    brief:
      "Spotify has 675M users, 18 years of behavioral data, and the best discovery engine in music. None of that changes the fact that 70 cents of every dollar it earns leaves immediately as royalties, and that structure hasn't changed since 2006.",
    authoredAt: "July 2022",
    deckHref: "/cases/spotify.pdf",
    deckCover: "/cases/spotify-cover.png",
    deckPages: 23,
    prose: [
      { kind: "h2", text: "The Setup" },
      {
        kind: "p",
        text: "Spotify is the undisputed leader in audio streaming: 675M monthly active users, 263M premium subscribers, $10B in royalties paid to rights holders in 2024 alone, and a presence in 180+ markets. FY2024 marked its first full year of operating profit in 18 years of existence: revenue €15.7B (+18.3% YoY), operating income +€1.4B. But for 18 years, market leadership and profit were two different things. The margins say the war isn't over.",
      },
      { kind: "h2", text: "The Business Model" },
      {
        kind: "p",
        text: "Free converts at 39% to Premium. The free tier (412M users) runs on ads (12–13% of revenue), shuffle-only album playback, 6 skips/hour, and 90–120 second ad breaks. Premium ($11.99/month in the US, raised from $9.99 in 2023) contributes 87–88% of total revenue. Gross margin expanded to 32.2% in Q4 2024, up 555bps YoY. The royalty structure is unchanged: ~70% of every Premium dollar leaves as royalties to labels, publishers, and collecting societies. A SaaS company at this scale would have 70–80% gross margins. Spotify has 30%.",
      },
      { kind: "h2", text: "The Win: Spotify's Moat" },
      { kind: "h3", text: "Behavioral Data at Scale" },
      {
        kind: "p",
        text: "Apple has 1.5B devices. YouTube has the world's largest video catalog. Amazon has Prime bundling. Spotify has something harder to acquire: 18 years of listening context built across 675M users and billions of sessions. Every new user makes the recommendation engine smarter for everyone else. Competitors cannot replicate this dataset from scratch.",
      },
      { kind: "h3", text: "Personalization Engine" },
      {
        kind: "p",
        text: "Discover Weekly (2015) proved an algorithm could outperform human curators at finding music users didn't know they needed. AI DJ (launched February 2023, now active in 60+ markets) uses synthesized voice to introduce song sets and reference your specific listening history; engagement doubled year-over-year by late 2024. AI Playlist (April 2024) converts natural language to playlists, expanded to 40+ new markets in 2025.",
      },
      { kind: "h3", text: "Switching Cost" },
      {
        kind: "p",
        text: "The average Spotify user has 10+ personal playlists and a recommendation history the platform understands better than they do. Migrating to Apple Music means starting from zero. That accumulation is the moat no one talks about in the competitive landscape.",
      },
      { kind: "h2", text: "The Trap: Structural Problems" },
      { kind: "h3", text: "The 70/30 Royalty Problem" },
      {
        kind: "p",
        text: "Spotify paid $10B to rights holders in 2024, a record for any single company in one year. More users means more royalties owed, linearly. Unlike SaaS infrastructure costs that grow slower than revenue, Spotify's royalty obligations scale in near-perfect proportion to usage. There is no operating leverage in the music licensing model. Apple Music pays approximately $6.20 per 1,000 streams vs. Spotify's ~$3.00, but the royalty structure has not meaningfully changed even as Spotify's gross margin improved from 25% to 32% between 2022–2024.",
      },
      { kind: "h3", text: "The Competitive Gap" },
      {
        kind: "p",
        text: "Apple Music includes lossless audio and Dolby Atmos at $10.99/month, $1 cheaper than Spotify with better audio quality. YouTube Music (~80–125M subscribers) is the fastest-growing DSP in 2024, with the full YouTube catalog including live performances and unofficial uploads. Amazon Music (115M including Prime bundling) includes HD/Ultra HD audio at the same price as Spotify. Spotify announced HiFi in February 2021. Apple launched lossless in June 2021 at no extra cost. Spotify still hadn't fully shipped it as of early 2026, 4+ years later.",
      },
      { kind: "h3", text: "The Artist Economics Problem" },
      {
        kind: "p",
        text: "In early 2024, Spotify implemented a 1,000-stream-per-year minimum to generate any royalties at all. Roughly 87% of all tracks on the platform now earn $0, their accumulated streams pooled and redistributed to artists already above the threshold. $47M was redirected. The top 1,450 artists each earned $1M+ in 2024. Spotify's defense: total 2024 royalty payouts hit a record $10B, up from $7B in 2022.",
      },
      { kind: "h2", text: "The Product: Observations" },
      { kind: "h3", text: "Core UX: Strong Music, Fragmented Home Screen" },
      {
        kind: "p",
        text: "The music experience remains best-in-class: playback controls, crossfade, 320kbps, Spotify Connect for multi-device handoff, collaborative playlists. The problem is what surrounds it. Spotify's home screen is a battleground between three product visions: the music app it was built as, the podcast platform it tried to become, and the audio super-app it wants to be. Users who came for music encounter podcast cards and audiobook recommendations they didn't ask for.",
      },
      { kind: "h3", text: "Library: Still Broken After a Decade" },
      {
        kind: "p",
        text: "No nested folders. No custom tagging despite being the top user request since 2016. Smart filters were added in 2024 but don't solve the structural library organization problem. Power users compensate with naming conventions and search, a workaround, not a fix.",
      },
      { kind: "h3", text: "The Bundle Bet: Podcasts and Audiobooks" },
      {
        kind: "p",
        text: "Spotify acquired Findaway in 2022 and embedded 15 hours/month of audiobook listening into standard Premium, a direct shot at Audible's $15/month. Audiobook distribution margin is better than music royalties. The Spotify Partner Program (January 2025) offers a 50/50 ad revenue split for podcast creators, with video podcast consumption up 20%+ since launch. This is the right strategic bet: increasing perceived Premium value without changing the royalty structure underneath.",
      },
      { kind: "h2", text: "Escape Attempts" },
      { kind: "h3", text: "The $1B Podcast Lesson" },
      {
        kind: "p",
        text: "Spotify spent over $1B on exclusive podcasts (2020–2023): Joe Rogan (~$200M), Call Her Daddy (~$60M), The Obamas (~$25M), Prince Harry and Meghan (~$20M). The thesis: own exclusive audio content, drive Premium conversion, build the Netflix of audio. The result: exclusivity didn't convert listeners to Premium; they followed the content on the free tier. Spotify scrapped exclusivity in February 2024. What survived: infrastructure (Anchor, Megaphone, Parcast) generates returns. The content bets didn't.",
      },
      { kind: "h3", text: "What Actually Worked: Price Hikes and Cost Cuts" },
      {
        kind: "p",
        text: "FY2024 operating income of +€1.4B was driven by 9–22% price increases across 50+ markets (Premium ARPU grew to €4.71, +9% YoY) and 2,300 job cuts across three rounds in 2023. Lower churn than analysts feared on the price hikes suggests the discovery moat creates genuine switching costs. But the royalty structure is unchanged, and no new high-margin product line has hit meaningful scale.",
      },
      { kind: "h2", text: "The PM Take: Three Moves" },
      {
        kind: "ol",
        items: [
          {
            lead: "Superfan Score (60 days).",
            rest: "Calculate an engagement score using: session frequency, unique artist discovery rate, playlist curation depth, concert saves, and cross-format consumption. Surface in profile and in Wrapped as a shareable identity signal. Add a Music Pro waitlist CTA for users in the top 15%. No new ML required; the signals already exist. Primary KPI: Superfan-to-Premium conversion rate at 2x baseline.",
          },
          {
            lead: "Music Pro at $17/month (3–6 months).",
            rest: "10% of 263M Premium subscribers at +$5/month = $1.56B in incremental annual revenue. Even 5% adoption adds $780M ARR. Bundle: lossless audio, concert presales via data partnerships with AXS and Ticketmaster, and extended AI DJ sessions. The Superfan Score waitlist de-risks launch day.",
          },
          {
            lead: "Artist-Fan Direct Layer (12–18 months).",
            rest: "Build the CRM between artists and their top 1% of listeners, a margin stack not subject to the 70/30 royalty split. Three components: Artist Direct Messaging (artists send messages and unreleased content to most-engaged fans); Fan Demand Data API (license listening data to venue promoters as a paid API product, more accurate than Pollstar or Ticketmaster data, zero royalty exposure); Merch and Limited Releases (in-app merch drops during listening, Spotify takes 10–15% commission on a $4.7B market that already exists).",
          },
        ],
      },
      { kind: "h2", text: "The North Star" },
      {
        kind: "p",
        text: "Spotify's problem isn't Apple or YouTube. It's that music will always pay 70 cents on the dollar. The real bet of the next three years is whether Music Pro, video podcasts, and the artist-fan direct layer can together build a margin stack meaningfully above 30%, before Apple's device ecosystem or YouTube's catalog depth makes the discovery moat irrelevant. A PM at Spotify right now isn't competing against rivals. They're competing against the contract their company signed with the music industry in 2006.",
      },
    ],
  },
  {
    kind: "teardown",
    slug: "cult-fit",
    product: "Cult.Fit",
    title: "Cult.Fit teardown",
    year: 2026,
    thumb: { src: "/projects/teardowns/cult-fit.webp", alt: "Cult.Fit teardown thumbnail" },
    hook: "Cult.Fit won the gym. Then the gym stopped mattering.",
    brief:
      "Cult.Fit won India's group fitness market with gamification and a subscription flywheel, then COVID exposed that six verticals on one offline anchor is a fragile bet. A teardown of the trap, the product gaps, and the data moat nobody else can build.",
    authoredAt: "February 2022",
    deckHref: "/cases/cult-fit.pdf",
    deckCover: "/cases/cult-fit-cover.png",
    deckPages: 23,
    prose: [
      { kind: "h2", text: "The Win: How Cult Cornered Group Fitness" },
      {
        kind: "p",
        text: "Cult.Fit didn't compete with gyms. It made gyms obsolete by selling the workout as a social experience with a score. Traditional gyms sell equipment access. Cult.Fit sold a trainer-led class, a live Energy Meter rank among 18 people, and a streak. Premium pricing at ₹1,999–2,499/month felt like belonging, not a membership fee. Monthly subscriptions drove sunk-cost attendance psychology, and every renewal was an upsell door into five other verticals.",
      },
      { kind: "h2", text: "The Subscription Flywheel" },
      {
        kind: "p",
        text: "The integration thesis was elegant: acquire a user once through the gym, then cross-sell food (Eat.fit), healthcare (Care.Fit), mental wellness (Mind.fit), grocery (Whole.Fit), and equipment (Cult Sports) inside the same app, all at zero incremental CAC. Post-workout Eat.fit nudges, Care.Fit bridges built from months of longitudinal fitness data, and one Cult Pass covering all six verticals. The economics only compounded if the gym subscription never broke.",
      },
      { kind: "h2", text: "Who Uses Cult.Fit" },
      {
        kind: "ul",
        items: [
          "Urban fitness enthusiasts: group class regulars motivated by live rank, streak tracking, and 30+ session formats including HIIT, boxing, yoga, and cycling.",
          "Health-conscious urban professionals: using Eat.fit for macro-transparent meals and Care.Fit for doctor consults within the same post-workout app session.",
          "Corporate HR buyers: bulk employee wellness subscriptions post-COVID, with mental and physical wellness budgets up ~40% in 2021.",
          "Digital-first users in Tier-2/3 cities: Cult.Live subscribers at ₹499–999/month who will never live near a Cult.Fit center.",
        ],
      },
      { kind: "h2", text: "Feature Observations" },
      { kind: "h3", text: "Energy Meter: Best Retention Mechanic, Broken Mid-Workout" },
      {
        kind: "p",
        text: "Live movement tracking and class rank create genuine gamified accountability; users book again to defend position, not just for fitness. But the score is rendered on a small display mid-HIIT that no active user can read or act on. The Fitness Journey section shows history without recommending a next step, turning passive tracking into a missed retention lever every month.",
      },
      { kind: "h3", text: "Eat.fit: Right Nutrition Problem, Wrong Conversion Moment" },
      {
        kind: "p",
        text: "Macro transparency on every item (calories, protein, carbs, and ingredients) is a genuinely defensible differentiator no Swiggy or Zomato competitor matches for health-conscious users. But delivery time is hidden until after payment, a single UX decision that kills the highest-intent moment in the product. There is also no menu search: finding 'paneer' requires scrolling the full menu. These individually small failures collectively send high-intent users to Swiggy.",
      },
      { kind: "h3", text: "Care.Fit: Full Stack Coverage, Zero Trust Signals" },
      {
        kind: "p",
        text: "Doctor teleconsults, therapy sessions, at-home lab tests via Healthians, and supplements in one platform; the architecture of a health OS is real. What is missing is the signal that closes a trust-critical purchase: Practo has millions of verified patient reviews; Care.Fit has zero. A user choosing a doctor will not do so in an app they know as their gym. The brand gap (Cult means fitness, not medical) is strategic, not a UX fix.",
      },
      { kind: "h2", text: "The Trap" },
      { kind: "h3", text: "COVID and the Offline Collapse" },
      {
        kind: "p",
        text: "When lockdowns hit in March 2020, the primary revenue engine went to zero overnight. Revenue fell from ~₹400 Cr in FY2020 to ₹226 Cr in FY2021, a 43% collapse, while net losses hit ₹856 Cr, nearly 4x revenue. Monthly burn peaked at ~₹70–80 Cr. Unlike a SaaS company, Cult.Fit's cost base is almost entirely fixed: gym leases, trainer salaries, equipment amortization. Revenue stopped; costs did not.",
      },
      { kind: "h3", text: "Cult.Live: The Digital Escape That Cannibalizes the Recovery" },
      {
        kind: "p",
        text: "Cult.Live reached 1.5M digital subscribers during lockdown, then most churned when centers reopened. Digital ARPU at ₹8,000–12,000/year is structurally lower than the ₹18,000–22,000/year offline pass, with similar content costs. A subscriber paying ₹800/month for Cult.Live has no financial incentive to return to a ₹2,000/month center pass. And YouTube is free; Nike Training Club is free; Peloton has hardware lock-in. Cult.Live's premium pricing needs to deliver something none of them can.",
      },
      { kind: "h3", text: "Six Verticals, Six Category Battles" },
      {
        kind: "p",
        text: "Each vertical faces at least one well-funded specialist with no multi-product execution drag: Fitternity's 8,000+ asset-light studio partners vs. Cult.Fit's fixed-cost centers; Swiggy and Zomato's density and 30-minute delivery vs. Eat.fit; Practo's 20M+ patients and decade of doctor-trust equity vs. Care.Fit; YourDOST and Wysa's therapist credibility vs. Mind.fit; Zepto's 10-minute q-commerce vs. Whole.Fit (wound down by 2022–23); Decathlon's price and 80+ India stores vs. Cult Sports. FY2022 net loss was ~₹800 Cr on ₹650 Cr revenue.",
      },
      { kind: "h2", text: "The Escape Routes" },
      { kind: "h3", text: "The Rebrand Signal" },
      {
        kind: "p",
        text: "The 2021 rename from Cure.Fit to Cult.Fit was a clear-eyed admission: fitness is the only vertical where the brand earns trust without explanation. 'Cult' has cultural resonance in India's fitness community; 'Cure' implied a medical promise the product couldn't own against Practo and Apollo. The rebrand resolved the brand question but left the strategy unresolved; the company still runs six verticals, each needing to win.",
      },
      { kind: "h3", text: "Cult.Live: Tier-2/3 India as the Real Scale Play" },
      {
        kind: "p",
        text: "270 centers across 18 cities is a ceiling; Cult.Live has zero marginal cost beyond the first stream. Cities like Jaipur, Lucknow, Coimbatore, and Bhopal where no Cult.Fit center will open for years have millions of health-conscious urban millennials who can subscribe today. At-home fitness subscriptions have structurally higher dropout than center bookings, but the addressable market expansion is the thesis the rebrand enables.",
      },
      { kind: "h3", text: "Corporate Wellness: Best CAC Math, No B2B Product Yet" },
      {
        kind: "p",
        text: "A 500-person corporate deal at ₹1,200/employee/month generates ₹7.2L/month recurring with zero performance-marketing spend. Post-COVID corporate wellness budgets in India grew ~40% in 2021. But there is no HR admin dashboard, no group challenge mechanics, no usage reporting for budget approvers. The current product is B2C sold in bulk, not a B2B product. Enterprise renewal decisions need a tool built for the buyer, not just the user.",
      },
      { kind: "h2", text: "Three PM Moves" },
      {
        kind: "ol",
        items: [
          {
            lead: "60 days: Fix five UX failures killing high-intent conversions.",
            rest: "Surface Eat.fit delivery time on the menu page (not post-checkout), expected to lift first-order completion by 15–25%. Add menu search and a bottom-nav category popup to Eat.fit. Ship a verified post-consult review module for Care.Fit doctors using the UI component already in Cult Sports, building the trust signal Practo spent 10 years accumulating. No new backend required for any of these.",
          },
          {
            lead: "3–6 months: Build the B2B product layer.",
            rest: "HR admin dashboard with enrollment rates, weekly session averages, and department-level wellness scores. Department vs. department group challenge mechanics using existing Cult.Live sessions, zero incremental content cost. Bake Eat.fit meal credits and supplement allowances into the corporate plan as a contract line item, making cross-vertical upsell automatic rather than per-user.",
          },
          {
            lead: "12–18 months: Build the longitudinal health data engine.",
            rest: "A user who works out on Cult.Fit, eats from Eat.fit, and gets Care.Fit lab tests generates a multi-dimensional health profile no insurer, hospital, or fitness app can replicate. An Expert.fit AI layer parsing fitness history, meal patterns, lab results, and energy scores recommends next workouts and when to see a doctor, turning a transaction platform into a health intelligence platform. Anonymized longitudinal profiles are a second B2B revenue stream for insurers pricing wellness-adjusted premiums.",
          },
        ],
      },
      { kind: "h2", text: "North Star" },
      {
        kind: "p",
        text: "The metric that matters is not center count or digital subscriber peaks; it is multi-vertical ARPU: the revenue per user who uses gym, food, and healthcare verticals together. Cult.Fit's real moat is not the group fitness format any competitor can copy; it is the longitudinal health data from all three layers in one user profile. Fix the UX today. Build the corporate product in six months. Launch the data engine before someone else does.",
      },
    ],
  },
  {
    kind: "teardown",
    slug: "zerodha",
    product: "Zerodha",
    title: "Zerodha teardown",
    year: 2026,
    thumb: { src: "/projects/teardowns/zerodha.webp", alt: "Zerodha teardown thumbnail" },
    hook: "Zerodha built its moat on F&O volume. SEBI just drained it.",
    brief:
      "Zerodha built India's most profitable fintech on zero-commission equity and a ₹20 flat F&O fee, then SEBI rewrote the rules that made it work. A teardown of the paradox, the product, and the three moves left.",
    authoredAt: "February 2022",
    deckHref: "/cases/zerodha.pdf",
    deckCover: "/cases/zerodha-cover.png",
    deckPages: 28,
    prose: [
      { kind: "h2", text: "The Paradox: Zero Brokerage, Maximum Profit" },
      {
        kind: "p",
        text: "Zerodha charges ₹0 on equity delivery and makes ₹4,700 Cr profit a year. The math only works because of F&O. The zero-brokerage promise that built 8M clients is structurally irrelevant to actual revenue: 70% of earnings come from the ₹20 flat fee on F&O trades, the highest-frequency, highest-loss activity on the platform. At a 56% net margin, bootstrapped and VC-free, it is exceptional for any fintech globally.",
      },
      { kind: "h2", text: "The SEBI Moment" },
      {
        kind: "p",
        text: "SEBI's October 2024 F&O reforms (reducing weekly expiries from 5 to 1 per exchange, tripling minimum contract lot sizes from ₹5–7L to ₹15–20L, and adding 3% upfront margin on expiry days) directly struck at 70% of Zerodha's revenue stream. Industry estimates point to a 30–40% decline in F&O volume, putting ₹2,000–3,000 Cr of annual revenue at risk. Zerodha founder Nithin Kamath had publicly warned that 9 in 10 F&O traders lose money. SEBI heard him, then regulated accordingly.",
      },
      { kind: "h2", text: "Who Uses Kite" },
      {
        kind: "ul",
        items: [
          "Expert traders: GTT chains, basket orders (20 legs), and 20-level market depth for systematic entries and options strategies.",
          "Algo developers: 100,000+ on Kite Connect API at ₹2,000/month, routing high-frequency orders that generate more brokerage per account than 20 retail users.",
          "Long-term investors: Coin (direct MF, zero trail) and Console (portfolio analytics, tax P&L) lock in the investor who doesn't trade daily.",
          "Fintech builders: SmallCase, Sensibull, Streak, and Rupeezy are all built on Kite Connect, making Zerodha a platform with hard switching costs.",
        ],
      },
      { kind: "h2", text: "Feature Observations" },
      { kind: "h3", text: "Trading Layer: GTT and Basket Orders" },
      {
        kind: "p",
        text: "GTT (Good Till Triggered) orders remain valid across market sessions; set once, execute automatically for months. Basket orders let traders execute up to 20 legs simultaneously, critical for options strategies where leg timing affects P&L by hundreds of rupees. No other broker at this price point offers equivalent functionality. Margin availability is surfaced in the order window before execution, eliminating a class of costly error for intermediate traders.",
      },
      { kind: "h3", text: "Charts and Analysis: Tickertape + Streak Integration" },
      {
        kind: "p",
        text: "Kite integrates Tickertape fundamentals (PE, EPS, dividend history) and Streak no-code backtesting directly in the chart view, for free. Trendlines and indicators persist across sessions, unlike competitors that reset on logout. The 20-level market depth upgrade addressed the legacy 5-bid limitation. No other free broker bundles this quality of analysis integrated with live execution.",
      },
      { kind: "h3", text: "Watchlists: 7 Lists × 50 Stocks, No Dynamic Filter" },
      {
        kind: "p",
        text: "Rearrangeable stock order within lists is a high-stickiness feature. But there is no filter by sector, market cap, or custom tag; an intermediate trader running a small-cap IT screen must manually update lists. Zerodha's Tickertape (a separate product) has excellent screeners; the integration that would let screener results populate Kite watchlists dynamically does not exist. Groww and Dhan offer screener-watchlist integration.",
      },
      { kind: "h3", text: "Kite Connect API: India's Largest Algo Infrastructure Layer" },
      {
        kind: "p",
        text: "100,000+ developers pay ₹2,000/month for API access, placing high-frequency orders that earn Zerodha ₹20 each. An active algo account generates more brokerage than 20 retail accounts. The fintech ecosystem built on Kite Connect (SmallCase, Sensibull, Streak) is structurally locked in: if Zerodha changes API terms, these companies' products break. This platform leverage no other Indian broker has built.",
      },
      { kind: "h2", text: "The Cracks" },
      { kind: "h3", text: "Analysis Isolation" },
      {
        kind: "p",
        text: "Charts cannot be exported, shared, or downloaded. Users work around this by taking screenshots and sharing in WhatsApp groups; Zerodha loses the engagement credit to external platforms. Switching instrument loses the current chart setup entirely; there is no named analysis state save. A community of 100,000+ traders created their own Zerodha Discord and Telegram channels, which Zerodha does not own.",
      },
      { kind: "h3", text: "Expert-Only UX Leaves Novice Acquisition to Groww" },
      {
        kind: "p",
        text: "Bond search requires ISN codes. Options chain shows Greeks without explanation. Corporate actions and ex-dividend dates are not marked on charts, sending users to MoneyControl to understand price anomalies. Groww overtook Zerodha in active client count in 2024 (7.5M vs. 6.5M) by designing explicitly for novices. Today's novice Groww user has a 60–70% probability of staying on Groww as their sophistication grows.",
      },
      { kind: "h2", text: "The Bets: Strategic Pivots" },
      { kind: "h3", text: "Nudge: Behavioral Finance as Competitive Moat" },
      {
        kind: "p",
        text: "Nudge shows real-time P&L warnings to F&O traders with historical loss records, two years before SEBI mandated similar disclosures. The bet: informed consent builds deeper loyalty than addictive design. A trader who was warned, understood the risk, and traded anyway is more likely to return than to blame the platform. Regulatory alignment as competitive advantage compounds quietly.",
      },
      { kind: "h3", text: "Zerodha Fund House + Coin: The Full Financial Stack" },
      {
        kind: "p",
        text: "Coin (3M+ investors, zero trail commission) deliberately forgoes ₹300–500 Cr in potential annual trail fees to stay transparent. Zerodha Fund House then manufactures its own passive, low-expense-ratio index funds targeting the same Varsity-educated retail investor. The vertical stack thesis: Varsity educates → Kite trades → Coin diversifies → Fund House manages. AUM-based revenue grows with market performance, not trading volumes.",
      },
      { kind: "h3", text: "International Equities via GIFT City" },
      {
        kind: "p",
        text: "LRS remittance for international investment is $5–7B annually and growing. GIFT City's IFSC framework enables SEBI-registered brokers to offer US stocks and ETFs without LRS complexity. Existing competitors (Winvesta, Vested Finance) charge $5–15 per trade with poor UX. Zerodha could offer Apple and Tesla inside Kite at ₹20 flat, the same terminal and same UX, leveraging 6.5M trust-loaded accounts.",
      },
      { kind: "h2", text: "Three PM Moves" },
      {
        kind: "ol",
        items: [
          {
            lead: "60 days: Chart Analysis Sharing.",
            rest: "TradingView's chart sharing API is publicly available and Kite Connect authentication already exists. A one-click PNG export or permanent shareable link converts Kite from a private tool to a social analysis surface. Saved analysis templates (RSI-momentum setup, earnings-event overlay) become a switching cost no ₹20 competitor can overcome.",
          },
          {
            lead: "3–6 months: Watchlist Intelligence.",
            rest: "Phase 1: a 'Save as Watchlist' button in Tickertape screener results creates a Kite watchlist from any screen output in one click. Phase 2: live watchlists that update nightly as stocks enter or exit the filter criteria. Phase 3: custom stock tags ('#earnings-Q3') cross-linked across watchlists, orders, and alerts. This converts passive screener users into daily Kite active users.",
          },
          {
            lead: "12–18 months: Trader Community Platform.",
            rest: "Identity-verified (Zerodha account + PAN) traders sharing analysis linked to actual trading history ('this user has a 68% win rate on Nifty calls over 24 months') is a signal no external platform can provide. Chart sharing (Move 1) is the content layer that makes it valuable from day one. A trader with 200 followers and 50 cited analyses on Kite Community will never leave for Dhan or Upstox.",
          },
        ],
      },
      { kind: "h2", text: "North Star" },
      {
        kind: "p",
        text: "The core metric to watch is not trade volume (compressing under SEBI reforms) but long-term investor ARPU: the revenue per user who holds Coin MF investments, uses Console for tax P&L, and has a multi-year history on the platform. Zerodha's structural advantage (₹4,700 Cr profit reserves, zero debt, bootstrapped with no investor pressure) gives it 2–3 years to absorb volume compression while pivoting to AUM and subscription revenue.",
      },
    ],
  },
  {
    kind: "teardown",
    slug: "instagram",
    product: "Instagram",
    title: "Instagram teardown",
    year: 2026,
    thumb: { src: "/projects/teardowns/instagram.webp", alt: "Instagram teardown thumbnail" },
    hook: "Instagram's real moat isn't Reels. It's 15 years of creator DMs.",
    brief:
      "Instagram invented the aspirational internet, then got trapped inside it: losing teens to TikTok, breaking the creator-follower contract with a reach collapse from 50% to 5%, and launching six surfaces with no clear answer for what it actually is.",
    authoredAt: "January 2022",
    deckHref: "/cases/instagram.pdf",
    deckCover: "/cases/instagram-cover.png",
    deckPages: 23,
    prose: [
      { kind: "h2", text: "Company Snapshot" },
      {
        kind: "p",
        text: "1.2–1.3B MAU, ~$47–50B in ad revenue (2021 est.), and ~40–45% of Meta's total advertising revenue. Analyst estimates value Instagram standalone at $300–500B. TikTok crossed 1B MAU in September 2021, and internal Meta research leaked in October 2021 showed Instagram losing the war for teens; US TikTok daily time ~45 min/day vs. Instagram ~28–30 min/day.",
      },
      { kind: "h2", text: "The Win" },
      {
        kind: "p",
        text: "Instagram didn't just build a photo app. It built the grammar of how the internet shows off, and a generation learned to perform through it. Filters democratized aesthetic quality, the grid created a curated identity with real switching costs, and the 2016 Stories clone outgrew Snapchat's entire platform within a year, significantly lifting DAU/MAU ratios.",
      },
      { kind: "h2", text: "The Creator-Follower Contract" },
      {
        kind: "p",
        text: "Influencer marketing as a category was invented on Instagram. Pre-2016, organic reach was ~50%; a creator with 100K followers could reliably reach 50,000 people per post. Brands moved billions of ad spend here because the targeting was precise and the content was trusted. Instagram kept ~100% of the ad revenue while creators earned from brand deals arranged entirely off-platform. The influencer economy peaked at an estimated $13B in 2021.",
      },
      { kind: "h2", text: "The Trap" },
      { kind: "h3", text: "TikTok made curation feel inauthentic" },
      {
        kind: "p",
        text: "TikTok didn't out-feature Instagram. It made raw, imperfect, authentic video more compelling than a decade of curated grids. The interest graph proved more engaging than the social graph for entertainment. Leaked Meta internal data showed Instagram usage among 13–17-year-olds in the US was down ~13% between 2019 and 2021.",
      },
      { kind: "h3", text: "The algorithmic reach collapse" },
      {
        kind: "p",
        text: "Organic reach fell from ~50% (2015) to ~20% (2018) to 5–15% (2022). Creators who invested years building 100K followers now needed to buy back reach through paid promotion. The July 2022 full-screen test, which triggered Kylie Jenner (355M followers) and Kim Kardashian (330M followers) resharing a petition of 200,000+ signatures, made the invisible shift visible. Instagram rolled back the test. The underlying Reels-weighting continued.",
      },
      { kind: "h3", text: "Identity crisis across six surfaces" },
      {
        kind: "p",
        text: "Instagram's home screen now competes for attention across Feed, Stories, Reels, Explore, Shop, and DMs, each with a different content type, discovery algorithm, and user intent. By 2022, an average user's feed contained more posts from accounts they don't follow than from accounts they do. In 2020 Instagram replaced the Activity tab with a Shop tab; Instagram Shopping never reached projected GMV, and the tab remains as a monument to a bet that didn't convert.",
      },
      { kind: "h3", text: "Creator monetization gap" },
      {
        kind: "p",
        text: "YouTube pays creators 55% of ad revenue (~$1,000–5,000 per 1M views). TikTok's Creator Fund pays ~$20–40 per 1M views. Instagram's Reels Play Bonus was invite-only, paid $500–8,000/month to at most ~10,000 US creators, and was quietly discontinued in early 2023. The vast majority of Instagram creators earn zero from the platform itself.",
      },
      { kind: "h2", text: "The Product" },
      { kind: "h3", text: "Reels creation UX: five fixable failures" },
      {
        kind: "ul",
        items: [
          "Works: Speed control (0.5x–3x per clip), rich filter library, and hands-free recording, genuinely competitive for casual creators.",
          "Broken: Cannot DM a Reel before posting; the only options are 'Share to Feed' or 'Save as Draft,' a public-or-nothing choice with no parallel in TikTok.",
          "Broken: Cannot rearrange clips after recording; a 5-clip Reel with clips in the wrong order requires a full restart, forcing creators to CapCut.",
          "Broken: Saving to camera roll strips the licensed audio, penalizing creators for trying to repurpose content cross-platform.",
        ],
      },
      { kind: "h3", text: "DMs: 1B daily conversations, features frozen since 2018" },
      {
        kind: "ul",
        items: [
          "Works: Vanish Mode ephemeral messaging and Watch Together co-viewing during video calls, genuinely differentiated vs. iMessage.",
          "Critical gap: No search inside a conversation; finding a link or address shared 6 months ago requires manual scrolling, despite WhatsApp shipping this in 2017.",
          "Missing: All shared media sits in chronological order with no Media/Links/Docs tab equivalent.",
          "Opportunity: A creator's DM thread history (brand collabs, fan conversations, team communications) is an irreplaceable archive and the highest-retention surface on the platform.",
        ],
      },
      { kind: "h3", text: "Business Insights: data without direction" },
      {
        kind: "ul",
        items: [
          "Comprehensive data: reach, impressions, saves, follower demographics, per-post performance by format, free and accessible in-app.",
          "Missing: No hashtag recommendation engine; third-party tools like Flick charge $15–50/month for intelligence Instagram has natively.",
          "Missing: No product reviews on Instagram Shopping listings; the highest-converting trust signal is absent at the purchase moment.",
          "Opportunity: Smart Promoter, AI influencer matching inside Ads Manager for SMBs running small campaigns.",
        ],
      },
      { kind: "h2", text: "The Escape" },
      { kind: "h3", text: "The three-tab feed" },
      {
        kind: "p",
        text: "In 2023 Instagram introduced 'For You' (algorithmic default), 'Following' (semi-chronological social graph), and 'Favorites' (user-curated). This was a direct response to the creator backlash, and an admission that one ranked feed cannot satisfy two contradictory user intentions. Facebook introduced a 'Most Recent' toggle in 2009; it still exists; nobody uses it. The default is what the product actually is.",
      },
      { kind: "h3", text: "Instagram Shopping retreat" },
      {
        kind: "p",
        text: "Meta launched Checkout on Instagram in 2019, shut Live Shopping in the US in March 2023, and discontinued the Affiliate Commerce program in August 2022. TikTok Shop launched in the US in 2023 and hit $20B GMV globally by end of 2023. Meta had a 4-year head start and retreated anyway.",
      },
      { kind: "h3", text: "Threads: 100M users in 5 days, then −80% retention" },
      {
        kind: "p",
        text: "Launched July 5, 2023, six days after Elon Musk's Twitter rate-limiting crisis, Threads broke every growth record on the back of Instagram's social graph import. Daily active users fell ~80% within weeks. Text-first public conversation is a different behavior than visual content consumption, and the overlap between heavy Instagram and heavy Twitter users is smaller than Threads assumed.",
      },
      { kind: "h2", text: "PM Take" },
      {
        kind: "ol",
        items: [
          {
            lead: "60 days: Fix Reels creation and DM search.",
            rest: "Drag-and-drop clip reordering (TikTok and CapCut have shipped this; it's a drag-gesture on an existing timeline component), pre-posting DM sharing of your own Reel (the infrastructure exists; Reels can be forwarded post-publish), and in-conversation message/media search (WhatsApp shipped this in 2017; it's a UI layer over existing indexed data).",
          },
          {
            lead: "3–6 months: Creator monetization layer and Smart Promoter.",
            rest: "A unified creator revenue dashboard showing subscriptions + badges + brand deals + bonuses in one screen. Post-purchase review prompts on Instagram Checkout transactions. Smart Promoter: a business sets budget and audience, and Instagram surfaces 5–10 creators with matching demographics and a one-click collab request.",
          },
          {
            lead: "12–18 months: Creator DM CRM as irreplaceable infrastructure.",
            rest: "A CRM layer inside DMs: tag fans by type (superfan, brand lead, collab request), set follow-up reminders, auto-respond to common questions, and see DM history alongside each fan's engagement history on your posts. Surface an algorithmic follower quality score showing which 10% of followers drive 90% of engagement.",
          },
        ],
      },
      { kind: "h2", text: "North Star" },
      {
        kind: "p",
        text: "TikTok will always be more entertaining. YouTube will always pay creators better. Instagram's exit from the trap is not winning either of those fights; it is winning the one neither competitor is fighting. A creator's 5-year DM history, fan relationship graph, and collab archive live on Instagram and nowhere else. The switching cost no competitor can build around is not the grid or Reels; it is the creator's professional infrastructure living in the DMs.",
      },
    ],
  },
  {
    kind: "teardown",
    slug: "zoom",
    product: "Zoom",
    title: "Zoom teardown",
    year: 2026,
    thumb: { src: "/projects/teardowns/zoom.webp", alt: "Zoom teardown thumbnail" },
    hook: "Zoom's biggest threat isn't Microsoft. It's the CFO asking why both are installed.",
    brief:
      "Zoom became a verb during COVID, but offices reopened, Teams came pre-installed for free, and Google Meet eliminated the friction that drove conversions; the question now is whether Zoom can become a platform before the CFO asks why both are installed.",
    authoredAt: "January 2022",
    deckHref: "/cases/zoom.pdf",
    deckCover: "/cases/zoom-cover.png",
    deckPages: 23,
    prose: [
      { kind: "h2", text: "Company Snapshot" },
      {
        kind: "p",
        text: "From $622M to $4.1B revenue in two years, the fastest B2C product adoption in enterprise software history. 300M daily meeting participants at peak (April 2020), 509,800 customers with 10+ employees (Q3 FY2022), net revenue retention >130% for enterprise. Then the stock fell 70%+ from its $568 peak (Oct 2020) to ~$150 (Jan 2022). The market priced Zoom as a pandemic beneficiary, not a platform.",
      },
      { kind: "h2", text: "The Before" },
      {
        kind: "p",
        text: "Zoom didn't win a product category. It won human psychology: a one-click join changed what 'video call' meant. WebEx required plugins. Google Meet required a Google account. Skype required a download, an account, and a prayer. Zoom required a link click. A guest could attend without creating an account or downloading an app; every competitor required at least one of these. Zoom's UDP-based transport protocol, optimized for lossy home broadband, delivered consistently better audio than Teams or Meet during the March–April 2020 surge.",
      },
      { kind: "h2", text: "The Freemium Flywheel" },
      {
        kind: "p",
        text: "Free users with 40-min group call limits created organic urgency to upgrade. The growth loop: free users experience the product, hit the friction point, convert to Pro, expand to Business, get discovered by IT, then standardize at enterprise. CAC at the top of the funnel: zero. The 40-minute limit is not a product decision; it is a conversion mechanic. Cloud recording was the feature enterprises discovered and immediately escalated to IT, the trojan horse into the procurement conversation.",
      },
      { kind: "h2", text: "The Forcing Function" },
      { kind: "h3", text: "Offices reopened into hybrid, and hybrid is Teams' home turf" },
      {
        kind: "p",
        text: "In full-remote, Zoom wins by default. In hybrid, conference rooms matter. Microsoft Teams Rooms, Google Meet hardware, and Cisco Webex Desk Pro are replacing Zoom as the default in physical meeting spaces. 60% of enterprise workers returned 3+ days/week by 2022. The 'default to Zoom' habit is breaking as teams rely on in-person and use whatever IT installed in the conference room for the other days.",
      },
      { kind: "h3", text: "Microsoft Teams: free with Office 365, pre-installed" },
      {
        kind: "p",
        text: "Teams grew from 75M DAU (April 2020) to 270M DAU (early 2022), not because the product is better, but because it is already paid for. Microsoft 365 Business Basic starts at $6/user/month and includes Teams. The average Zoom Business plan costs $19.99/host/month on top of the Office 365 the same organization already pays. The CFO conversation: consolidate on Teams, save $240/user/year. Teams also auto-links meetings to shared OneNote, SharePoint, and Outlook calendar entries, workflow integration Zoom has no native answer to.",
      },
      { kind: "h3", text: "Google Meet and the free tier war" },
      {
        kind: "p",
        text: "By 2022, Google Meet is free with no time limit for 1:1 calls and 60-minute group calls with 100 participants. The friction that drove Zoom Pro conversions is being absorbed by a free Google product. Cisco Webex adds enterprise hardware incumbency in banks, telcos, and government. Zoom is being squeezed at every price point simultaneously: free users go to Meet, SMBs stay on the Zoom free tier, enterprise consolidates on Teams, large enterprise stays with Cisco.",
      },
      { kind: "h3", text: "The point-solution trap" },
      {
        kind: "p",
        text: "The failed $14.7B Five9 acquisition (September 2021) was the clearest signal that Zoom knows being the best meeting app is insufficient. Five9 is a contact center platform, not video or meetings. The bid said: we understand that best video is not enough. The collapse said: we don't have a clear path to what we need to become. Zoom Apps, Zoom Phone, Zoom Rooms, and Zoom Events are all the right products; none has enough distribution yet to make Zoom feel like a platform rather than a meeting app with add-ons.",
      },
      { kind: "h2", text: "The Product" },
      { kind: "h3", text: "Core meeting UX: best in class video, broken peripherals" },
      {
        kind: "ul",
        items: [
          "Best in class: Touch Up Appearance, noise suppression, and virtual backgrounds work better than any competitor at comparable bandwidth, the reason 509K enterprises pay when Teams is free.",
          "Broken: Accidental mute is the most universally reported Zoom frustration, triggered when clicking back to the window, OS audio routing switches, or host mutes all. No detection, no visual alert.",
          "Broken: Chat search is effectively unusable; in a 60-person all-hands where 40 people posted links, the important one is buried with no file-type filter and no pinned links section.",
          "Missing: No attentiveness signal for hosts; in a 30-person class, the host cannot tell who is watching the screen vs. reading Twitter.",
        ],
      },
      { kind: "h3", text: "Breakout Rooms: frictionless mechanic, broken host control" },
      {
        kind: "ul",
        items: [
          "What works: One-click assignment to sub-groups, auto-balanced or manual, smooth join and return. The core mechanic is solid.",
          "Broken: Host must physically enter each room to observe, disrupting the discussion. Monitoring 6 rooms means entering and exiting 6 separate video calls.",
          "Missing: Broadcasting a message to all rooms sends only a text notification. No way to speak to multiple rooms simultaneously without ending all breakouts.",
          "The fix: A host dashboard showing all rooms as tiles: audio levels visible without joining, one-click voice broadcast to all rooms, elapsed time per group.",
        ],
      },
      { kind: "h3", text: "Zoom Chat: a Slack competitor that nobody knows exists" },
      {
        kind: "ul",
        items: [
          "The latent asset: Zoom Chat is already installed on 509K enterprise accounts at zero incremental cost; the distribution to displace Slack is already achieved, but the activation is not.",
          "Broken: In-meeting chat and persistent Zoom Chat are different data stores that look identical; users discover this when they can't find a meeting link in chat history.",
          "Missing: No Q&A layer separated from general chat in standard meetings; questions disappear in any group above 20 people.",
          "Opportunity: Smart Chat with auto-categorized Q&A, Links, and Files tabs. No competitor has shipped this; Zoom has all the data to build it.",
        ],
      },
      { kind: "h2", text: "The Response" },
      { kind: "h3", text: "Zoom Apps: the right platform bet, weak activation" },
      {
        kind: "p",
        text: "Launched 2021, Zoom Apps embeds Asana, Miro, Dropbox, and HubSpot directly inside a meeting. The thesis: the meeting becomes the context for every workflow tool. The gap: most Zoom users have never opened the Apps panel. No featured moment in the join flow, no onboarding that surfaces apps, no notification when a host activates an app mid-call. Salesforce AppExchange proved this model can build $200B in platform switching costs; Zoom Apps has the right architecture and no activation loop.",
      },
      { kind: "h3", text: "Zoom Phone: UCaaS trojan horse" },
      {
        kind: "p",
        text: "Launched 2019, grew to 2M+ seats by 2021. Competes in the $50B global UCaaS market replacing desk phones, against RingCentral, 8x8, and Teams Phone. The leverage: a Zoom Phone call escalates to a full meeting with screen share in one tap. Every Zoom Phone customer has unified their communication stack with Zoom as the anchor.",
      },
      { kind: "h3", text: "Zoom Events: B2B expansion with no direct Microsoft competitor" },
      {
        kind: "p",
        text: "Zoom Events and Webinars target virtual conferences, summits, all-hands, and product launches. Microsoft Teams Live Events exists but is not positioned as an event platform. Hopin was valued at $7.75B in 2021, proving the category is real; Zoom can serve the same demand with better video and no new download for attendees. Pricing: Webinars start at $149/month for 500 attendees, significantly higher ARPU than standard plans.",
      },
      { kind: "h2", text: "PM Take" },
      {
        kind: "ol",
        items: [
          {
            lead: "60 days: Smart Mute, structured Chat tabs, and AI Meeting Summary as defaults.",
            rest: "Zoom's noise suppression engine already detects voice audio; detecting speech on a muted mic is a minor extension of existing signal processing. Structured chat uses rule-based classification (question marks = Q&A, URLs = Links, attachments = Files), no ML model needed for v1. AI Meeting Summary on transcripts already exists on paid plans; making it default-on for Business and Enterprise is the single feature most likely to block a Teams migration.",
          },
          {
            lead: "3–6 months: Breakout Rooms host dashboard and Zoom Calendar layer.",
            rest: "A host overview panel with all rooms as tiles: participant count, audio level indicator, elapsed time, and one-click voice broadcast to all rooms without ending breakouts. Zoom Calendar as a native tab surfacing all calendar integrations: upcoming meetings, one-click join, availability view. Context-aware Zoom Apps discovery: if the meeting invite title contains an Asana link, suggest the Asana app automatically at meeting start.",
          },
          {
            lead: "12–18 months: AI Companion and Zoom as system of record.",
            rest: "A persistent AI layer linking meeting summaries, tracking commitments across calls, surfacing action items to completion, and sending pre-meeting briefs with context from previous sessions. Every meeting generates a structured artifact (summary, decisions, owners, deadlines) stored in searchable, linkable format integrating with Notion, Confluence, and Salesforce. Migration from Zoom then means losing 18 months of institutional memory.",
          },
        ],
      },
      { kind: "h2", text: "North Star" },
      {
        kind: "p",
        text: "Zoom won the pandemic by being the simplest video tool in a world that suddenly needed one. The features that defended Zoom during COVID (one-click join, reliable audio, 40-minute free tier) are now table stakes, not moats. Zoom's survival play is becoming the system of record for how decisions get made in meetings. Ship the AI layer before Microsoft bundles Copilot into every Teams call. The window is 18 months.",
      },
    ],
  },
];

// ---------- Helpers ----------

export const allProjects: Project[] = [
  ...projectCaseStudies,
  ...projectTeardowns,
];

export function getProject(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}

export function getCaseStudy(slug: string): ProjectCaseStudy | undefined {
  return projectCaseStudies.find((c) => c.slug === slug);
}

export function getTeardown(slug: string): ProjectTeardown | undefined {
  return projectTeardowns.find((t) => t.slug === slug);
}

/** Cross-case-study pagination — only walks the case-study list (Netflix and
 *  Amazon Prime), not the teardowns. Mirrors the Work-section pattern. */
export function getCaseStudyNeighbors(slug: string): {
  prev?: ProjectCaseStudy;
  next?: ProjectCaseStudy;
} {
  const idx = projectCaseStudies.findIndex((c) => c.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? projectCaseStudies[idx - 1] : undefined,
    next:
      idx < projectCaseStudies.length - 1
        ? projectCaseStudies[idx + 1]
        : undefined,
  };
}

/** Cross-teardown pagination — walks the teardown list. Used by the
 *  teardown deep-dive footer for next/prev navigation. */
export function getTeardownNeighbors(slug: string): {
  prev?: ProjectTeardown;
  next?: ProjectTeardown;
} {
  const idx = projectTeardowns.findIndex((t) => t.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? projectTeardowns[idx - 1] : undefined,
    next:
      idx < projectTeardowns.length - 1
        ? projectTeardowns[idx + 1]
        : undefined,
  };
}
