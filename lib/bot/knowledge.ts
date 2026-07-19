// AI Recruiter Bot — knowledge assembler.
//
// v1 "website-only mode": the single source of truth is the typed TS content
// modules (`content/experience.ts`, `content/projects.ts`, `content/about.ts`)
// plus the locked Hero + Contact constants. The bot trains on what the site
// actually says — no markdown parser, no separate knowledge file in v1.
//
// TODO when `content/bot-knowledge.md` lands: import + merge a parsed overlay
// into the knowledge object additively. The overlay should layer on top of the
// website-derived knowledge here — Tier 3 anecdotes, candid FAQ entries, voice
// samples, weakness/why-looking framing — without replacing it. The shape
// below is intentionally additive-friendly (add fields like `faq`, `tone`,
// `anecdotes` later; don't rename the existing ones).
//
// ## Why no markdown parser
//
// The content already lives as typed TS arrays — the same arrays the
// rendered pages read. Building a second parsing layer for the same data
// would invite drift. When the markdown overlay lands, it answers what the
// site can't (off-site logistics narrative, FAQ, "what would you do
// differently"), and merges in additively.
//
// ## Logistics
//
// The four locked starter chips are
//   `30-second overview` · `Are they looking?` · `Open to remote?` · `Notice period?`.
// Three resolve from website content (Hero `OPEN TO ROLES`, Contact status
// line `Open to relocate or work remotely`). The fourth, notice period, is
// not on the public site, so it's an inline stub captured here. If notice
// period or relocation posture changes, edit the `logistics` object below.

import { aboutSections } from "@/content/about";
import { caseStudies, type ProseBlock as ExperienceProseBlock } from "@/content/experience";
import {
  projectCaseStudies,
  projectTeardowns,
  type ProseBlock as ProjectProseBlock,
} from "@/content/projects";
import {
  EMAIL,
  LINKEDIN_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  STATUS_LINE,
} from "@/components/sections/Contact";
// HERO_NAME is intentionally not imported: the bot uses the proper-cased
// "Aurajeet Mahapatra" in `bio.name` rather than the lowercase site
// rendering ("aurajeet mahapatra"). The lowercase form is a typographic
// choice for the Hero h1 only.
import { HERO_EYEBROW, HERO_TAGLINE } from "@/components/sections/Hero";

// ---------- Public types ----------

export interface BotBio {
  name: string;
  /** Hero italic tagline — the one-line elevator pitch on the site. */
  tagline: string;
  /** "Bangalore, India". */
  location: string;
  /** Hero eyebrow line — `PRODUCT MANAGER · BASED IN BANGALORE · OPEN TO ROLES`. */
  eyebrow: string;
}

export interface BotLogistics {
  /** Whether the candidate is actively looking, passively, etc. */
  status: string;
  /** Where the candidate is based. */
  location: string;
  /** Remote / relocation posture. */
  remote: string;
  /** Notice period — off-site stub; the only logistics field not on the
   *  public portfolio. */
  noticePeriod: string;
  /** Languages enforced by the system prompt (decision O6). */
  languages: string;
}

export interface BotContact {
  email: string;
  phone: string;
  phoneHref: string;
  linkedin: string;
  /** The italic line on the Contact section — verbatim. */
  statusLine: string;
}

export interface BotExperience {
  /** `HEBE` / `Nation With NaMo` — display brand. */
  company: string;
  /** Title / function at the company. */
  role: string;
  /** Date range, free-form text. */
  dates: string;
  /** Big-picture title from the case study. */
  headline: string;
  /** Short one-line dek. */
  dek: string;
  /** Locked landing-card metrics (3 strings). */
  metrics: string[];
  /** Capability tags. */
  tags: string[];
  /** Flattened prose body — the full case-study narrative as readable text,
   *  ready to drop into the system prompt. */
  narrative: string;
  /** The "Reflections" section flattened, if present. Empty string if the
   *  case study has no Reflections. */
  reflections: string;
  /** Where the deep dive lives, for the bot's `navigateTo` tool semantics. */
  deepDiveHref: string;
}

export interface BotCaseStudy {
  /** Project slug — must match `PROJECT_SLUGS` in `lib/bot/tools.ts`. */
  slug: string;
  brand: string;
  title: string;
  /** Card metadata (e.g., `SPEC EXERCISE · SELF-DIRECTED · 2026`). */
  eyebrow: string;
  dek: string;
  /** The italic disclaimer at the top of every spec exercise. */
  disclaimer: string;
  metrics: string[];
  tags: string[];
  /** Flattened prose body. */
  narrative: string;
  /** Original-deck PDF path. */
  deckHref: string;
  /** Slide count for the deck. */
  deckPages: number;
}

export interface BotTeardown {
  /** Project slug — must match `PROJECT_SLUGS` in `lib/bot/tools.ts`. */
  slug: string;
  product: string;
  /** Argument-led headline, when present. */
  hook?: string;
  /** One-line summary. */
  brief: string;
  authoredAt: string;
  /** Capability tags. Currently empty for teardowns; reserved for the
   *  future overlay. */
  tags: string[];
  /** Flattened prose body if `prose` exists on the source, else falls back
   *  to `brief`. The bot is told to keep teardown summaries short and let
   *  `openProject` deep-link to the full deep dive. */
  narrative: string;
  /** Original-deck PDF path, when present. */
  deckHref?: string;
  /** Slide count for the deck, when present. */
  deckPages?: number;
}

export interface BotAboutSection {
  /** Section eyebrow (`01 · Childhood`, etc.). */
  eyebrow: string;
  /** Section headline. */
  headline: string;
  /** Section body — what the section is about. Currently bodies on the
   *  About page are `[PLACEHOLDER · …]` strings; until they're fleshed
   *  out the bot describes the section's intent rather than quoting copy. */
  brief: string;
}

export interface BotKnowledge {
  bio: BotBio;
  logistics: BotLogistics;
  contact: BotContact;
  experience: BotExperience[];
  caseStudies: BotCaseStudy[];
  teardowns: BotTeardown[];
  about: BotAboutSection[];
}

// ---------- Prose flattening ----------
//
// `content/experience.ts` and `content/projects.ts` carry case-study bodies
// as `ProseBlock[]` arrays — h2 / h3 / p / ul / ol structured blocks rendered
// to HTML on the deep-dive routes. For the LLM, we want clean prose that
// reads naturally inside a system prompt. The flattener concatenates the
// blocks with markdown-style separators so the model parses structure
// without us shipping HTML or JSX.

type AnyProseBlock = ExperienceProseBlock | ProjectProseBlock;

function flattenProse(prose: AnyProseBlock[] | undefined): string {
  if (!prose || prose.length === 0) return "";
  const parts: string[] = [];
  for (const block of prose) {
    switch (block.kind) {
      case "h2":
        parts.push(`\n## ${block.text}`);
        break;
      case "h3":
        parts.push(`\n### ${block.text}`);
        break;
      case "p":
        parts.push(block.text);
        break;
      case "ul":
        parts.push(block.items.map((item) => `- ${item}`).join("\n"));
        break;
      case "ol":
        parts.push(
          block.items
            .map((item, idx) => {
              const n = idx + 1;
              if (typeof item === "string") return `${n}. ${item}`;
              return `${n}. ${item.lead} ${item.rest}`;
            })
            .join("\n"),
        );
        break;
    }
  }
  return parts.join("\n\n").trim();
}

/**
 * Pull the "Reflections" subtree out of a case-study prose body. Used to
 * surface "what I'd do differently" / "what I underestimated" content into
 * its own field, which the system prompt can quote directly when a recruiter
 * asks `tell me about a time you struggled` or `what would you change?`.
 *
 * Walks the prose blocks, captures everything between `## Reflections` and
 * the next `h2`. Returns an empty string if no Reflections section exists.
 */
function extractReflections(prose: AnyProseBlock[] | undefined): string {
  if (!prose) return "";
  const start = prose.findIndex(
    (b) => b.kind === "h2" && /reflections/i.test(b.text),
  );
  if (start === -1) return "";
  const after = prose.slice(start + 1);
  const end = after.findIndex((b) => b.kind === "h2");
  const slice = end === -1 ? after : after.slice(0, end);
  return flattenProse(slice);
}

// ---------- Assembly ----------

/**
 * Pull a section's intent out of the About page. Bodies on the live site
 * are still `[PLACEHOLDER · …]` strings; until they're written out, the
 * bot describes the section by what it's *about* (per the eyebrow +
 * headline) rather than quoting placeholder copy.
 */
function aboutBrief(eyebrow: string, headline: string, body: string[]): string {
  const real = body.find((p) => !p.startsWith("[PLACEHOLDER"));
  if (real) return real;
  return `${eyebrow} — ${headline}. (Section body still in draft on the About page.)`;
}

/** Maps a case-study slug from `content/experience.ts` to the friendly
 *  brand label and role title used in the bot's narrative voice. */
const EXPERIENCE_BRAND_MAP: Record<string, { company: string; role: string }> =
  {
    amberlink: {
      company: "AmberLink",
      role: "Product Lead & Co-Founder",
    },
    hebe: {
      company: "HEBE",
      role: "Product & Operations Lead",
    },
    nwn: {
      company: "Nation With NaMo (NWN)",
      role: "Associate Consultant",
    },
  };

let cachedKnowledge: BotKnowledge | null = null;

/**
 * Assemble the canonical knowledge object the system prompt embeds. Memoized
 * per-process — the underlying TS content is static, so we build it once.
 *
 * In a future revision, when `content/bot-knowledge.md` is authored, this
 * function should additively merge a parsed overlay onto the object below
 * (FAQ entries, voice samples, Tier 3 anecdotes). The TODO at the top of
 * this file marks the merge point.
 */
export function getKnowledge(): BotKnowledge {
  if (cachedKnowledge) return cachedKnowledge;

  const bio: BotBio = {
    name: "Aurajeet Mahapatra",
    tagline: HERO_TAGLINE,
    location: "Bangalore, India",
    eyebrow: HERO_EYEBROW,
  };

  const logistics: BotLogistics = {
    // Mirrors Hero `OPEN TO ROLES` and Contact status line.
    status: "Actively looking for PM roles.",
    location: "Bangalore, India.",
    // Lifted verbatim from the Contact `STATUS_LINE`.
    remote: "Open to relocate or work remotely.",
    // Off-site inline stub — not on the public portfolio.
    noticePeriod: "Can join immediately.",
    // Decision O6 in `AI Bot.md` §3.
    languages: "English only — replies are always in English regardless of input language.",
  };

  const contact: BotContact = {
    email: EMAIL,
    phone: PHONE_DISPLAY,
    phoneHref: PHONE_HREF,
    linkedin: LINKEDIN_URL,
    statusLine: STATUS_LINE,
  };

  const experience: BotExperience[] = caseStudies.map((c) => {
    const brand = EXPERIENCE_BRAND_MAP[c.slug] ?? {
      company: c.slug,
      role: "Product",
    };
    // Pull the date range out of the eyebrow (e.g. `... · JUL '25 TO PRESENT`).
    // The eyebrow is canonical; the dates live as the last `·`-separated
    // segment.
    const dates = c.eyebrow.split("·").pop()?.trim() ?? "";
    return {
      company: brand.company,
      role: brand.role,
      dates,
      headline: c.title,
      dek: c.dek.long,
      metrics: c.metrics.map((m) => `${m.value} — ${m.label}`),
      tags: [...c.tags],
      narrative: flattenProse(c.prose),
      reflections: extractReflections(c.prose),
      deepDiveHref: `/experience/${c.slug}`,
    };
  });

  const caseStudiesOut: BotCaseStudy[] = projectCaseStudies.map((p) => ({
    slug: p.slug,
    brand: p.brand,
    title: p.title,
    eyebrow: p.eyebrow,
    dek: p.dek.long,
    disclaimer: p.disclaimer,
    metrics: [...p.metrics],
    tags: [...p.tags],
    narrative: flattenProse(p.prose),
    deckHref: p.deckHref,
    deckPages: p.deckPages,
  }));

  const teardowns: BotTeardown[] = projectTeardowns.map((t) => ({
    slug: t.slug,
    product: t.product,
    hook: t.hook,
    brief: t.brief,
    authoredAt: t.authoredAt,
    tags: [],
    // Token-budget call: only the brief goes into the system prompt for
    // teardowns (see `system-prompt.ts`). We still flatten the full prose
    // here in case a future revision wants on-demand expansion — the cost
    // of computing it is one-time.
    narrative: flattenProse(t.prose) || t.brief,
    deckHref: t.deckHref,
    deckPages: t.deckPages,
  }));

  const about: BotAboutSection[] = aboutSections.map((s) => ({
    eyebrow: s.eyebrow,
    headline: s.headline,
    brief: aboutBrief(s.eyebrow, s.headline, s.body),
  }));

  cachedKnowledge = {
    bio,
    logistics,
    contact,
    experience,
    caseStudies: caseStudiesOut,
    teardowns,
    about,
  };
  return cachedKnowledge;
}
