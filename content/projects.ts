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
  | "sportskeeda"
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
    deckCover: "/cases/netflix-cover.svg",
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
    deckCover: "/cases/amazon-prime-cover.svg",
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
    brief:
      "Indian credit-card management unicorn: bill payment, rewards, and a holistic financial layer for the credit-conscious millennial.",
    authoredAt: "August 2023",
    deckHref: "/cases/cred.pdf",
    deckCover: "/cases/cred-cover.svg",
    deckPages: 6,
    prose: [
      { kind: "h2", text: "The product" },
      {
        kind: "p",
        text: "CRED is the Indian unicorn that turned credit-card management into a membership product. Bill payment, punctuality rewards, exclusive deals, and a holistic financial layer for the credit-conscious millennial. ~11.2M users, ~₹397 Cr ARR, 1Cr+ downloads. The surface has since expanded into peer-to-peer credit, rent and merchant payments, credit-score management, and Cred Mint investments.",
      },

      { kind: "h2", text: "Audience" },
      {
        kind: "ul",
        items: [
          "Tech-savvy millennials: early adopters who default to digital tools.",
          "Reward hunters: actively chasing cashback, deals, and points.",
          "Casual spenders: heavy card users who don't extract full card benefits.",
          "Credit builders: new to credit, or rebuilding a damaged score.",
        ],
      },

      { kind: "h2", text: "Feature observations" },

      { kind: "h3", text: "Bill payment" },
      {
        kind: "p",
        text: "One-click pay with PIN, fingerprint, and pattern security; push reminders for the due amount; full transparency on hidden statement charges. The friction: a bill-due push still fires on zero-expense months, treating quiet periods as a checklist item the user has to clear.",
      },

      { kind: "h3", text: "Holistic dashboard" },
      {
        kind: "p",
        text: "A single surface for card utilization, rewards earned, and lifestyle spend. The CRED scan score, however, sits one navigation step away. The tile most directly tied to the platform's reward loop is the one that doesn't surface on the dashboard.",
      },

      { kind: "h3", text: "Credit score visibility" },
      {
        kind: "p",
        text: "Fast access to credit score with healthy / unhealthy color coding; Experian and CRIF visibility built in. The gap: there's no way to generate a statement in-app to dispute charges, which is exactly the action the most score-conscious users need.",
      },

      { kind: "h2", text: "Recommendations" },
      {
        kind: "ol",
        items: [
          {
            lead: "Context-aware payment reminders.",
            rest: "Replace the universal due-date push with a check-state notification on zero-expense months, confirming quiet periods instead of asking the user to verify them.",
          },
          {
            lead: "Spend-to-reward ratio on the dashboard.",
            rest: "Surface the CRED-paid-spend to rewards-earned ratio prominently. Reinforces the timely-payment habit that the rewards engine is designed to incentivize.",
          },
          {
            lead: "In-app statement and dispute generation.",
            rest: "Let users generate a credit report in-app and use it to file a dispute. Closes the most common reason a user has to leave CRED for their card issuer's portal.",
          },
        ],
      },

      { kind: "h2", text: "Metrics" },
      {
        kind: "p",
        text: "North star: number of transactions per month, the single metric that ties acquisition, monetization, and retention together. L1: recurring transactions per user. L2: average transaction value. DAU/MAU and 6-month retention track engagement; conversion to bill payment and partner-offer engagement tracks the activation loop.",
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
    brief:
      "Quick-commerce grocery delivery that promises 10-minute fulfilment from a network of dark stores; acquired by Zomato in 2022.",
    authoredAt: "February 2023",
    deckHref: "/cases/blinkit.pdf",
    deckCover: "/cases/blinkit-cover.svg",
    deckPages: 9,
    prose: [
      { kind: "h2", text: "The product" },
      {
        kind: "p",
        text: "Blinkit (formerly Grofers) is an online grocery delivery service operating in 500+ localities across 30+ Indian cities, with 13,000 SKUs and 400 dark stores. The pivot to quick commerce in late 2021 (and the subsequent rebrand) set up the $568M Zomato acquisition in 2022. The promise: groceries in 10 minutes, in the blink of an eye.",
      },

      { kind: "h2", text: "Audience" },
      {
        kind: "ul",
        items: [
          "The planned shopper: urban, weekly grocery cadence, prefers digital convenience.",
          "The spontaneous shopper: young, tech-savvy, makes impulse one-off purchases.",
          "The discount hunter: price-sensitive, comparison-shops across platforms.",
        ],
      },

      { kind: "h2", text: "Feature observations" },

      { kind: "h3", text: "Item search and listing" },
      {
        kind: "p",
        text: "Product pages give a comprehensive description (storage tips, shelf life, country of origin, current offer) that frequently exceeds in-store signage. Online grocery often loses on tactile inspection; Blinkit's information density is its compensating advantage.",
      },

      { kind: "h3", text: "Brand stores" },
      {
        kind: "p",
        text: "Each brand gets a single page housing its full SKU set, including new launches. Useful for product discovery beyond the search query, and quietly important for retaining premium-brand visibility on a category page where dark-store assortment is otherwise the constraint.",
      },

      { kind: "h3", text: "Re-ordering" },
      {
        kind: "p",
        text: "Reorder a complete past order in a tap; the favourites page bypasses search entirely. The right design choice for a category where most orders are repeat baskets.",
      },

      { kind: "h3", text: "Adjacent fulfilment" },
      {
        kind: "p",
        text: "The Delhi-NCR printout service is the clearest signal that Blinkit thinks of itself as a 10-minute fulfilment network, not a grocery store. Adjacency rather than expansion.",
      },

      { kind: "h2", text: "Recommendations" },
      {
        kind: "ol",
        items: [
          {
            lead: "Expiry visibility.",
            rest: "Show expiry on perishables (milk, bread, curd) at the SKU level. Removes the most common moment of in-app doubt for daily-essentials orders.",
          },
          {
            lead: "Collaborative shopping list.",
            rest: "Shared, multi-user grocery list for households. Converts the single-user app into a household account with low engineering lift.",
          },
          {
            lead: "Pattern-based reorder reminders.",
            rest: "Detect periodicity in a user's order history (milk weekly, atta monthly) and prompt before they need to think about it.",
          },
          {
            lead: "Solo-pack baskets.",
            rest: "A \"groceries for one\" SKU bundle for working professionals living alone, sized to a week of perishables in small amounts.",
          },
          {
            lead: "Recipe-pack bundles.",
            rest: "Pre-portioned \"cook biryani tonight\" packages (every ingredient in the right amount) solve the \"I want to cook X but I don't know what to buy\" problem that retail grocery has owned for decades.",
          },
          {
            lead: "Daily-essentials subscriptions.",
            rest: "Standing orders for milk, bread, water. The sticky retention play that turns a transactional app into infrastructure.",
          },
        ],
      },

      { kind: "h2", text: "Metrics" },
      {
        kind: "p",
        text: "North star: items delivered on time per week. The 10-minute promise is the brand; on-time fulfilment is the only metric that captures whether that promise is real. Acquisition tracked via downloads and signups; activation via signup-to-first-order conversion; revenue via AOV and basket size; retention via DAU/MAU; referral via invite-link share rate.",
      },
    ],
  },
  {
    kind: "teardown",
    slug: "sportskeeda",
    product: "Sportskeeda",
    title: "Sportskeeda teardown",
    year: 2026,
    thumb: {
      src: "/projects/teardowns/sportskeeda.webp",
      alt: "Sportskeeda teardown thumbnail",
    },
    brief:
      "Global sports and esports news platform built for hardcore fans: exclusive content, live scores, and journalist-led depth.",
    authoredAt: "February 2023",
    deckHref: "/cases/sportskeeda.pdf",
    deckCover: "/cases/sportskeeda-cover.svg",
    deckPages: 5,
    prose: [
      { kind: "h2", text: "The product" },
      {
        kind: "p",
        text: "Sportskeeda is a global sports and esports news platform, founded in 2009 and built for hardcore fans: exclusive content, live scores, journalist-led depth. Nazara Technologies acquired a 67% stake in 2019 for ₹44 Cr, betting on the digital migration of sports consumption in India.",
      },

      { kind: "h2", text: "Macro context" },
      {
        kind: "p",
        text: "Cricket queries are up 80% in two years. Football has extended past metro audiences. The ISL drives Tier 2 traction even as the EPL holds metros. Olympic-medal moments translate directly into sustained interest in hero-led sports like badminton (Sindhu, Nehwal). Kabaddi is opening as a digital category with a fresh, untapped audience.",
      },

      { kind: "h2", text: "Audience" },
      {
        kind: "ul",
        items: [
          "The Digital Native: mobile-first, social-active, consumes scores and updates in bite-sized form.",
          "The Micro-Influencer: organizes watch parties, books premium seating, attends games occasionally; influences the group's content choice.",
          "The Neo-Classical: the modernized super-fan; watches matches on TV, craves behind-the-scenes content and player access.",
        ],
      },

      { kind: "h2", text: "Feature observations" },

      { kind: "h3", text: "Predictions and rewards" },
      {
        kind: "p",
        text: "Vote-and-predict popups before kickoff give passive readers a participation surface. Coins won are redeemable on partner apps, closing the loop from engagement to value.",
      },

      { kind: "h3", text: "Merchandising and bidding" },
      {
        kind: "p",
        text: "Limited surface today: users can't buy team merchandise from within Sportskeeda, and there's no loyalty mechanic for repeat fans. Two interventions: third-party vendor partnerships, and time-limited auctions of original-edition exclusive merchandise.",
      },

      { kind: "h3", text: "Community pages" },
      {
        kind: "p",
        text: "Fans can't talk to other fans through the product. Player- and team-specific community pages (chat, comment, photo-share) would convert solo readers into a network. Location-specific watch-party organization with pub and restaurant partnerships extends the surface offline.",
      },

      { kind: "h2", text: "Recommendations" },
      {
        kind: "ol",
        items: [
          {
            lead: "Pre-match prediction popups.",
            rest: "Open hours before kickoff; coins redeemable cross-app. Lifts engagement on every match a user already opens the app to track.",
          },
          {
            lead: "Merchandise auction.",
            rest: "Exclusive original-edition items, limited-time bidding hosted by Sportskeeda. Creates a high-intent purchase moment for the most loyal segment.",
          },
          {
            lead: "Player and team community pages.",
            rest: "Chat, comment, photo-share. The engagement floor for any fan-led platform.",
          },
          {
            lead: "Location-based watch parties.",
            rest: "Partner with pubs and restaurants for live screening; users opt in by location and team affiliation.",
          },
        ],
      },

      { kind: "h2", text: "Monetization" },
      {
        kind: "p",
        text: "Revenue is largely advertising and sponsorship-driven, with Nazara expanding into premium and subscription tiers. The COVID pivot to esports and gaming quadrupled revenue from April 2020. Wrestling has been the largest in-COVID revenue driver, a useful proof that adjacent vertical expansion works on this audience.",
      },

      { kind: "h2", text: "Metrics" },
      {
        kind: "p",
        text: "North star: Daily Active Users. New signups, returning user count, average session time, monthly revenue per source, NPS, and customer lifetime value round out the dashboard.",
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
    brief:
      "Investing platform simplifying mutual funds, stocks, and FDs for first-time Indian investors; expanding into neobanking.",
    authoredAt: "November 2022",
    deckHref: "/cases/groww.pdf",
    deckCover: "/cases/groww-cover.svg",
    deckPages: 12,
    prose: [
      { kind: "h2", text: "The product" },
      {
        kind: "p",
        text: "Groww simplifies investing for first-time and young Indian investors: fixed deposits, stocks, gold, mutual funds, and an integrated savings portfolio. The platform is moving toward neobanking, betting that a single surface for banking and investing is the natural expansion path for users who started with their first mutual-fund SIP.",
      },

      { kind: "h2", text: "Audience" },
      {
        kind: "ul",
        items: [
          "Beginner: new to finance, wealth-creation oriented, anxious about loss without guidance.",
          "Intermediate trader: self-taught, comfortable but not expert; struggles with technical terms (tracking error, expense ratio, exit load).",
          "Expert trader: long market tenure, demands a glitch-free trading experience, low guidance need.",
        ],
      },

      { kind: "h2", text: "Feature observations" },

      { kind: "h3", text: "Portfolio analysis" },
      {
        kind: "p",
        text: "Mutual fund analysis is compact and visually clear (category split, company split, performance), giving the investor strong situational awareness without analyst depth.",
      },

      { kind: "h3", text: "Fund transactions" },
      {
        kind: "p",
        text: "A clean audit trail of fund-level transactions and NAV history. Useful for the intermediate user who wants to verify, not just trust, the platform's reporting.",
      },

      { kind: "h3", text: "Switch" },
      {
        kind: "p",
        text: "Fund-switch is built in but limited to switches within a single AMC, and currently triggers a full redemption, which can attract exit loads. The simplest UX fix is also a meaningful product fix.",
      },

      { kind: "h2", text: "Recommendations" },
      {
        kind: "ol",
        items: [
          {
            lead: "Chart analysis sharing.",
            rest: "Allow users to share chart analysis with other users in-app, and as image / PDF export for cross-platform sharing.",
          },
          {
            lead: "Trader forum.",
            rest: "A free in-product forum for strategy, opinion, grievance, and connection. Community is the retention play for any platform whose users want to learn.",
          },
          {
            lead: "Debt easy finder.",
            rest: "Search debt by name, maturity, or coupon, not just ISN code. Lists results conveniently against user filter.",
          },
          {
            lead: "Watchlist filter.",
            rest: "Filter watchlist stocks by market cap and sector (small/mid/large, tech/FMCG/pharma), surfacing useful slices of an otherwise undifferentiated list.",
          },
          {
            lead: "Stock tagging.",
            rest: "Custom tags on stocks for quick filtering and cross-screen identification. The power-user retention play.",
          },
          {
            lead: "Planned announcements on the chart.",
            rest: "Mark internal company announcements (bonuses, dividends, splits, rights) directly on the chart, correlating sudden price moves with the cause.",
          },
          {
            lead: "Virtual investment leaderboard.",
            rest: "Monthly virtual money on a simulation platform tracking real markets. Builds confidence in users learning through Groww and Groww Pro. Leaderboard ranks top performers by category.",
          },
          {
            lead: "Crypto learning and simulation.",
            rest: "Indian regulation rules out crypto trading on Groww, but a learning + simulation product would attract Gen Z investors looking for a regulated entry into the category.",
          },
        ],
      },

      { kind: "h2", text: "Metrics" },
      {
        kind: "p",
        text: "North star: Daily Active Users. Acquisition tracked via downloads and signup completion; activation via wallet funding and first trade; revenue via brokerage by category; retention via 6-month churn; referral via invite-link share rate.",
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
    brief:
      "Music + podcast streaming subscription with a freemium model, deep personalization, and 180+ country distribution.",
    authoredAt: "July 2022",
    deckHref: "/cases/spotify.pdf",
    deckCover: "/cases/spotify-cover.svg",
    deckPages: 8,
    prose: [
      { kind: "h2", text: "The product" },
      {
        kind: "p",
        text: "Spotify is the Swedish music-streaming subscription with 82M+ tracks, 182M+ subscribers across 180+ countries, and a freemium model splitting Free (ad-supported, low quality, no download) from Premium (ad-free, full quality, downloads). 24 acquisitions to date have extended the catalogue from music into podcasts, comedy, sports, lifestyle, and stories.",
      },

      { kind: "h2", text: "Audience" },
      {
        kind: "ul",
        items: [
          "Active listener: listens with intent, by genre or saved playlist.",
          "Seekers: searching for a particular genre or label.",
          "Casual listener: listens while doing something else.",
          "Procrastinators: defaults to auto-generated playlists, low active selection.",
          "Artists: have a Spotify agreement, upload music or podcasts.",
        ],
      },

      { kind: "h2", text: "Feature observations" },

      { kind: "h3", text: "Music streaming" },
      {
        kind: "p",
        text: "Crossfade and transition smooths song-to-song listening; streaming and download quality is user-controlled around storage and bandwidth; playlists are reorderable and sortable across multiple axes; offline downloads work; the web interface streams from desktop. The reordering caveat: custom drag-reorder is desktop-only, a glaring gap on a primarily-mobile product.",
      },

      { kind: "h3", text: "Device connectivity" },
      {
        kind: "p",
        text: "Direct streaming to Bluetooth speakers, voice-control via Alexa and Siri (on Echo / HomePod, not within Spotify mobile), Spotify-in-Uber integration, and Car Thing as a hardware accessory. Voice control on the mobile app itself remains absent, a usability cost that breaks parity with how users already interact with their connected speakers.",
      },

      { kind: "h3", text: "Music curation" },
      {
        kind: "p",
        text: "Collaborative playlists for trips and parties; Radio for genre / artist similarity; Weekly Discovery and Daily Mixes for algorithmic recommendation. Two real-world misses: tune-recall search (\"the song that goes…\") is impossible, and there's no concept of a music profile that lets users find friends with similar taste.",
      },

      { kind: "h2", text: "Recommendations" },
      {
        kind: "ol",
        items: [
          {
            lead: "Beginner-artist program.",
            rest: "Curated mentorship and resourcing for emerging artists. Helps the supply side scale below the long tail.",
          },
          {
            lead: "Music profiles.",
            rest: "Personal archive of listening history: first listens, play counts, recently discovered tracks, mutual songs with friends. The social-graph layer Spotify has been missing.",
          },
          {
            lead: "Music recognition.",
            rest: "Identify a song by playing or singing it. The most-requested feature for a use case Spotify solves badly today.",
          },
          {
            lead: "Social playlist.",
            rest: "Multi-user shared playlists for parties and family events. Extends collaborative playlists from \"trip-with-friends\" to \"occasion\".",
          },
          {
            lead: "Custom music tagging.",
            rest: "User-defined tags on tracks for cross-playlist filtering and identification.",
          },
          {
            lead: "New-music tagging.",
            rest: "Surface new releases by an artist a user already listens to, or whose style closely matches, explicitly tagged as \"new\" so the discovery moment is visible.",
          },
        ],
      },

      { kind: "h2", text: "Metrics" },
      {
        kind: "p",
        text: "North star: Daily Active Users. Acquisition tracked via downloads and Premium signup completion; revenue via Premium subscriptions and ad volume; retention via 6-month listening churn; referral via invite-link share rate.",
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
    brief:
      "Preventive-health and fitness platform spanning trainer-led group classes, cloud kitchen meals, mental-fitness centres, and pharmacies.",
    authoredAt: "February 2022",
    deckHref: "/cases/cult-fit.pdf",
    deckCover: "/cases/cult-fit-cover.svg",
    deckPages: 13,
    prose: [
      { kind: "h2", text: "The product" },
      {
        kind: "p",
        text: "Cult.Fit (formerly Cure.Fit) is a preventive and curative healthcare platform spanning six verticals: Cult.Fit (group fitness centres and gyms), Eat.fit (cloud kitchen), Mind.fit (mental fitness centres), Care.Fit (health centres with pharmacies), Whole.fit (clean-label grocery marketplace), and Cult Sports (online fitness equipment). Founded by Nagori and Mukesh Bansal in 2016, with 270 centres across 18 Indian cities by 2020. The thesis: fitness, food, mental health, and primary care belong on a single membership product.",
      },

      { kind: "h2", text: "Audience" },
      {
        kind: "ul",
        items: [
          "Novice user: occasional exerciser, takes small steps to lose weight; needs reminders and progress tracking.",
          "Health user: has health issues that compel fitness; needs to keep all metrics in one platform and surface them to a doctor.",
          "Fitness enthusiast: frequent gym-goer, tech-savvy; struggles to fit workouts in, wants progressive load tracking.",
        ],
      },

      { kind: "h2", text: "Feature observations" },

      { kind: "h3", text: "Cure.fit (workouts)" },
      {
        kind: "p",
        text: "Energy meter rates the user's coordination with the trainer in real time; Fitness Journey summarizes calories and class minutes; Trending Sessions and Collections curate by popularity and intensity. The weak points: the energy meter is hard to read mid-workout (live tracking with no useful real-time feedback), the journey is a high-level number with no actionable inference, and the collection volume is overwhelming for a novice.",
      },

      { kind: "h3", text: "Cult.fit store (apparel and gear)" },
      {
        kind: "p",
        text: "Designer's Note adds product trivia; Shop-by-Workout categorizes by intensity; Deal of the Day and Bestsellers shortcut to high-intent purchase. Friction: no review or feedback mechanism, vague designer copy with no credibility, limited filter set per category.",
      },

      { kind: "h3", text: "Eat.fit (cloud kitchen)" },
      {
        kind: "p",
        text: "Individual orders show calories and ingredients; Meal Plan offers a weekly subscription menu; Dietician consults curate a personalized plan. Friction: delivery time isn't visible until checkout (kills \"order now, eat in 30 minutes\"), no menu search, awkward category navigation, and meal plans aren't user-customizable.",
      },

      { kind: "h3", text: "Wellness (Care.Fit, Whole.fit)" },
      {
        kind: "p",
        text: "Doctor consult, therapy sessions, lab tests fulfilled by Healthians, supplements, and recipes. The credibility gap: no review or feedback mechanism for doctors, lab reports, or supplements; no recipe search by available ingredients.",
      },

      { kind: "h2", text: "Recommendations" },
      {
        kind: "ol",
        items: [
          {
            lead: "Voice-led energy meter feedback.",
            rest: "Real-time motivational announcements during the workout. Turns a number on screen into a coaching voice in the user's ear.",
          },
          {
            lead: "Workout recommendations from history.",
            rest: "Use the user's fitness journey to suggest the next workout. Closes the discovery loop on the existing data.",
          },
          {
            lead: "expert.fit chatbot.",
            rest: "AI navigation across the app. Onboarding the most overwhelming part of Cult's omni-vertical surface.",
          },
          {
            lead: "Reviews on the store.",
            rest: "Users post photos and product reviews. The credibility gap-closer that every commerce surface eventually needs.",
          },
          {
            lead: "Estimated delivery time on Eat.fit.",
            rest: "Surface a real ETA before checkout. The simplest fix that recovers the \"I'm hungry now\" moment that the product currently fumbles.",
          },
          {
            lead: "Customizable weekly meal plan.",
            rest: "Let users build their own week's plan with dynamic pricing. Converts a fixed subscription into a flexible one.",
          },
          {
            lead: "Reviews + ingredient-match recipe search.",
            rest: "Add reviews to wellness products, and let users search recipes by ingredients they already have.",
          },
        ],
      },

      { kind: "h2", text: "Metrics" },
      {
        kind: "p",
        text: "North star: Daily Active Users. Acquisition tracked via downloads and signup completion; revenue via Cult Subscription, fit.store, and eat.fit AOV; retention via 6-month subscription renewal; referral via invite-link share rate.",
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
    brief:
      "India's largest discount broker: Kite trading platform, Coin for direct mutual funds, and a 15% share of all retail trading volume.",
    authoredAt: "February 2022",
    deckHref: "/cases/zerodha.pdf",
    deckCover: "/cases/zerodha-cover.svg",
    deckPages: 9,
    prose: [
      { kind: "h2", text: "The product" },
      {
        kind: "p",
        text: "Zerodha is India's largest discount broker: Kite (trading), Console (dashboard), Coin (direct mutual funds), Varsity (financial education). The name combines \"zero\" with \"rodha\", barrier in Sanskrit. Launched in 2010, 8M+ clients, 15% of all retail trading volume in India. ₹0 brokerage on equity delivery and direct mutual funds, with a transparency-led pricing model that's the category's reference point.",
      },

      { kind: "h2", text: "Audience" },
      {
        kind: "ul",
        items: [
          "Novice trader: disposable income, looking to invest, exploring trading.",
          "Intermediate trader: has made trades, wants to learn and improve returns.",
          "Expert trader: long market tenure, perfecting strategy, daily market tracker.",
        ],
      },

      { kind: "h2", text: "Feature observations" },

      { kind: "h3", text: "Trading" },
      {
        kind: "p",
        text: "Good Till Triggered orders persist across sessions; customizable alerts push when a share hits a trigger; intra-day positions are separated for tracking; share gifting is built in for nominal fees; margin availability is shown before order placement; baskets save up to 20 orders for batch trading.",
      },

      { kind: "h3", text: "Charts and analysis" },
      {
        kind: "p",
        text: "Free trading charts with deep customization that persists across logins; multi-stock comparison; market depth showing top 5 bids and offers; integrated fundamentals and governance from Tickertape; technical analysis from Streak. Friction: limited bid-depth (5 only) reads as a constraint for serious options traders, bond search by ISN-only is awkward, no analysis-export-and-share, multi-instrument analysis in a single pane is cumbersome, and there's no way to save a state of analysis before pivoting to a different framing.",
      },

      { kind: "h3", text: "Watchlists" },
      {
        kind: "p",
        text: "Up to 7 lists, 50 stocks each, with manual reordering. The miss: no filters on market cap, sector, or other meaningful dimensions. The watchlist is exactly as useful as the user's manual maintenance.",
      },

      { kind: "h2", text: "Recommendations" },
      {
        kind: "ol",
        items: [
          {
            lead: "Chart analysis sharing.",
            rest: "Share single- or multi-instrument analysis with other Kite users in-app, plus image / PDF export for cross-platform sharing.",
          },
          {
            lead: "Trader forum.",
            rest: "Free Kite-user forum for strategy, opinion, grievance, and connection.",
          },
          {
            lead: "Debt easy finder.",
            rest: "Search debt by name, maturity, or coupon, replacing the ISN-only search.",
          },
          {
            lead: "Watchlist filter.",
            rest: "Filter watchlist stocks by market cap (small / mid / large) and sector (tech / FMCG / pharma).",
          },
          {
            lead: "Stock tagging.",
            rest: "Custom tags on stocks for quick filtering and cross-screen identification.",
          },
          {
            lead: "Planned announcements on the chart.",
            rest: "Mark internal company announcements directly on the chart for cause-and-effect visibility on price movements.",
          },
        ],
      },

      { kind: "h2", text: "Metrics" },
      {
        kind: "p",
        text: "North star: Daily Active Users. Acquisition tracked via downloads and signup completion; revenue via brokerage by trading category; retention via 6-month trading churn; referral via invite-link share rate.",
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
    brief:
      "Photo and video sharing social network owned by Meta: Reels, Stories, and the dominant short-form creator distribution surface in India.",
    authoredAt: "January 2022",
    deckHref: "/cases/instagram.pdf",
    deckCover: "/cases/instagram-cover.svg",
    deckPages: 13,
    prose: [
      { kind: "h2", text: "The product" },
      {
        kind: "p",
        text: "Instagram is Meta's photo and video sharing platform (mobile-first, web-extended) with chat, video calls, Stories, Reels, and an integrated commerce surface. Originally iOS in 2010, 1M users in two months, 10M in a year, 1B+ as of 2018. Currently the 4th most popular social network globally by user count; in India, the dominant short-form creator distribution surface.",
      },

      { kind: "h2", text: "Audience" },
      {
        kind: "ul",
        items: [
          "Personal use: 18 to 24 year-olds make up the largest segment.",
          "Professional use: brands, businesses, artists, celebrities, meme pages, influencers, content creators.",
        ],
      },

      { kind: "h2", text: "Feature observations" },

      { kind: "h3", text: "Reels" },
      {
        kind: "p",
        text: "Filters and effects, variable speed (0.5x to 3x), self-timer, layout, audio. The friction surface: a self-created Reel can't be shared as a DM (only to feed or drafts); Reels can't be saved to a collection (Posts can); clip rearrangement during creation isn't possible (the user has to start over); save-to-gallery strips the audio.",
      },

      { kind: "h3", text: "Business account" },
      {
        kind: "p",
        text: "Reach and content insights, post-promotion via Boost Reach, saved replies for common questions. Friction: hashtag selection is largely guesswork, no review surface for products on the platform, search and explore is identical to a regular account.",
      },

      { kind: "h3", text: "Messaging and calls" },
      {
        kind: "p",
        text: "Watch Together inside video calls, Vanish Mode for ephemeral chat, Hidden Requests for suspicious accounts, Accept/Decline message requests with no read-receipt tell. Friction: chat search returns nothing useful, no way to mark or highlight messages, no media categorization (Reels / images / docs in one bucket), no swipe-to-reply on Reels, no sticker sharing.",
      },

      { kind: "h3", text: "Search and explore" },
      {
        kind: "p",
        text: "Search by category (accounts, audios, tags, places) and suggestive search via doodle / recipe / hobby keywords. Friction: products sold by businesses on Instagram aren't a separate searchable surface; the explore page mixes content, ads, and shop into one cluttered scroll.",
      },

      { kind: "h2", text: "Recommendations" },
      {
        kind: "ol",
        items: [
          {
            lead: "Reels DM sharing.",
            rest: "Share self-created Reels via DM (individually or in groups) with the option to forward from chat back to profile. Adds a review-before-publish step.",
          },
          {
            lead: "Smarter chat.",
            rest: "Search messages by keyword, sticker library plus customization, swipe-to-reply on Reels, and Star Messages for marking important threads.",
          },
          {
            lead: "Reels collection saving.",
            rest: "Long-press save-to-collection for Reels, mirroring Posts.",
          },
          {
            lead: "Media manager in chat.",
            rest: "Categorize chat media into Reels, images / videos, audio, documents. Saves search time on long threads.",
          },
          {
            lead: "Search products on Instagram Shop.",
            rest: "Searchable product catalogue with hashtag and description filters, plus trending product surfacing.",
          },
          {
            lead: "Hashtag suggestions.",
            rest: "AI-suggested hashtags by image content (color, object) and current trends. Closes the gap that businesses currently fill with educated guessing.",
          },
          {
            lead: "Product reviews.",
            rest: "In-product reviews on Instagram Shop listings. Replaces today's pattern of buyers leaving reviews in the comments.",
          },
          {
            lead: "Smart promoter.",
            rest: "AI-matched influencer suggestions for businesses by reach, budget, and location filters. Turns paid-promotion into a discoverable surface.",
          },
        ],
      },

      { kind: "h2", text: "Metrics" },
      {
        kind: "p",
        text: "North star: Daily Active Users. Acquisition tracked via signups and download conversion; activation via 15-minute first-session and profile completion; revenue via ad impressions, ad clicks, and shopping conversion; retention via monthly churn; referral via invite-link share rate.",
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
    brief:
      "Cloud video conferencing across desktop, mobile, and browser: group calls, webinars, and the de facto remote-work meeting platform post-2020.",
    authoredAt: "January 2022",
    deckHref: "/cases/zoom.pdf",
    deckCover: "/cases/zoom-cover.svg",
    deckPages: 8,
    prose: [
      { kind: "h2", text: "The product" },
      {
        kind: "p",
        text: "Zoom is the cloud audio/video conferencing platform with chat, on desktop, mobile, and browser. Chat sessions, group calls, webinars, training sessions; tiered Free / Pro / Business / Enterprise pricing (₹0 to ₹21,600), with 100 to 500 participant ceilings and 40-minute to unlimited meeting times. The category-defining product of the post-2020 remote-work era; the dominant default for synchronous communication.",
      },

      { kind: "h2", text: "Audience" },
      {
        kind: "ul",
        items: [
          "Students in schools and colleges.",
          "Teachers and educators.",
          "Working professionals.",
          "HR recruiters using Zoom for interviews.",
          "Individual users for friends and family calls.",
          "Trainers running online workshops.",
        ],
      },

      { kind: "h2", text: "Feature observations" },

      { kind: "h3", text: "Schedule and invite" },
      {
        kind: "p",
        text: "Outlook calendar integration, chat-to-email invite. Friction: people forget to schedule, plans change without notification, scheduling depends on knowing when people are free.",
      },

      { kind: "h3", text: "Join" },
      {
        kind: "p",
        text: "Easy meeting links, password handling. Friction: links get lost, passwords are annoying to remember, late joiners miss meeting context, audio/microphone failures are common.",
      },

      { kind: "h3", text: "In-meeting" },
      {
        kind: "p",
        text: "Touch Up appearance, polling, annotation, breakout rooms, screen sharing, whiteboarding, live language interpretation. Friction: chat search is poor, files require download to view, breakout rooms force the host to manually move between rooms, attentiveness is invisible to the host, Q&A gets buried in chat, presentation control is single-user, accidental mute/unmute is a regular meeting failure mode.",
      },

      { kind: "h3", text: "Recording and follow-up" },
      {
        kind: "p",
        text: "Cloud recording for Pro+, easy video sharing, auto-transcription in multiple languages. Friction: no video editing, action items have to be manually noted, follow-up scheduling is a separate flow.",
      },

      { kind: "h2", text: "Recommendations" },
      {
        kind: "ol",
        items: [
          {
            lead: "Zoom Calendars.",
            rest: "In-app calendar with cross-meeting visibility and reminders before each meeting.",
          },
          {
            lead: "Meeting summary.",
            rest: "AI-generated rolling summary of the meeting that's accessible at any point during the discussion.",
          },
          {
            lead: "Smart chat.",
            rest: "AI-driven Q&A side panel; image attachments without a separate flow; separated tabs for Q&A, chat, and media.",
          },
          {
            lead: "Smart monitoring.",
            rest: "AI-tracked attentiveness, surfaced to the host so they can adjust pace or check comprehension.",
          },
          {
            lead: "Smart mute.",
            rest: "Voice-activity-based mute / unmute. Eliminates the most common meeting failure mode.",
          },
          {
            lead: "Advanced presentation.",
            rest: "Multiple presenters visible alongside a shared deck as background, with shared slide control.",
          },
          {
            lead: "Video edit.",
            rest: "Basic trim and crop on cloud recordings, in-product.",
          },
          {
            lead: "Single-pane breakout rooms.",
            rest: "Host sees all breakout rooms in one view and can address each individually without manually moving between them.",
          },
        ],
      },

      { kind: "h2", text: "Risks" },
      {
        kind: "p",
        text: "Each AI feature requires meaningful infra investment. Smart chat may spam the chat surface and reduce discussion clarity. Smart mute could mistake background noise for speech. The cumulative cost: feature bombardment that erodes Zoom's \"join in one click\" simplicity.",
      },

      { kind: "h2", text: "Metrics" },
      {
        kind: "p",
        text: "North star: weekly hosted meetings. Acquisition tracked via downloads and account creation; activation via download-to-first-meeting and 60+ minute first sessions; revenue via Pro / Business / Enterprise subscriptions plus Zoom Rooms, Zoom Phones, and Zoom Webinars; retention via thrice-monthly visit and 120+ minute weekly use; referral via invite-link conversion.",
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
