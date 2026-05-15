// AI Recruiter Bot — tool surface (the contract between the edge route and
// the chat UI).
//
// Per the locked spec in `AI Bot.md` §7, the bot calls four tools. Each is
// rendered by the client as a styled action card (never as raw JSON). The
// `tool({...})` definitions live here so both ends of the wire share one
// source of truth.
//
// ## Why server-side `tool({...})` with a near-no-op `execute`
//
// The four cards are *pure rendering surfaces* with side effects driven by
// user clicks (smooth-scroll, route push, download, copy). The model's job
// is to *emit the card* at the right moment in the conversation; the model
// does not need a round-trip "result" to reason further.
//
// We give each tool an `execute` that returns a tiny acknowledgment object
// so the streaming step completes cleanly without the model hanging waiting
// for client-side `addToolOutput`. The actual side effect happens client-side
// when the recruiter clicks the rendered card's CTA — the card reads the
// tool's input from the `tool-{name}` UIMessage part and wires its own
// onClick handlers (see `components/chat/ChatActionCard.tsx`).
//
// ## Slug enums for `openProject`
//
// We enumerate the 11 valid project slugs explicitly so the model can never
// hallucinate a slug that 404s. The list mirrors `content/projects.ts`'s
// `ProjectCaseStudySlug | ProjectTeardownSlug` union.
//
// ## Section enum for `navigateTo`
//
// The plan's API surface uses `'experience'` as the friendly section name.
// The actual landing page uses `id="work"` for the Experience section.
// The client-side handler maps `'experience'` → `#work` at click time so
// the recruiter-facing vocabulary stays clean while the implementation
// detail stays correct.

import {
  type InferUITools,
  type ToolSet,
  type UIDataTypes,
  type UIMessage,
  tool,
} from "ai";
import { z } from "zod";

/** All landing-page anchor targets the bot can scroll to. */
export const NAVIGATE_TO_SECTIONS = [
  "hero",
  "experience",
  "projects",
  "contact",
] as const;

export type NavigateToSection = (typeof NAVIGATE_TO_SECTIONS)[number];

/** Mapping from the friendly section vocabulary to the actual DOM `id`s. */
export const NAVIGATE_TO_SECTION_HREF: Record<NavigateToSection, string> = {
  hero: "/#hero",
  experience: "/#work",
  projects: "/#projects",
  contact: "/#contact",
};

/** All 10 valid project slugs (2 case studies + 8 teardowns). Mirrors
 *  `ProjectCaseStudySlug | ProjectTeardownSlug` in `content/projects.ts`. */
export const PROJECT_SLUGS = [
  "netflix",
  "amazon-prime",
  "cred",
  "blinkit",
  "groww",
  "spotify",
  "cult-fit",
  "zerodha",
  "instagram",
  "zoom",
] as const;

export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

/** The bot's four-tool surface. Each tool is server-defined (so the schema
 *  is enforced) but its `execute` is near-no-op — the rendering and side
 *  effects happen client-side via the `tool-{name}` UIMessage parts. */
export const tools = {
  navigateTo: tool({
    description:
      "Smooth-scroll the recruiter to a specific section of the landing page. " +
      "Use this when the user asks about an area of the portfolio that lives on " +
      "the home page (e.g. 'show me your experience', 'where are your projects?').",
    inputSchema: z.object({
      section: z
        .enum(NAVIGATE_TO_SECTIONS)
        .describe(
          "Which landing-page section to scroll to. " +
            "'experience' = the Work section (HEBE + NWN). " +
            "'projects' = the Projects section (case studies + teardowns).",
        ),
    }),
    execute: async ({ section }) => ({ ok: true, section }) as const,
  }),
  openProject: tool({
    description:
      "Deep-link the recruiter to a specific project case study or teardown at " +
      "/projects/{slug}. Use this when the user asks about a specific named project, " +
      "or when the recruiter would benefit from seeing the full deep dive (the bot's " +
      "summary is only the appetizer; the full prose is on the route).",
    inputSchema: z.object({
      slug: z
        .enum(PROJECT_SLUGS)
        .describe(
          "The project slug. Must be exactly one of the 11 known projects.",
        ),
    }),
    execute: async ({ slug }) => ({ ok: true, slug }) as const,
  }),
  downloadResume: tool({
    description:
      "Surface the resume PDF for download. Use this when the recruiter asks for the " +
      "resume, CV, or wants to take the candidate's profile elsewhere. Also surfaces " +
      "automatically as part of the brief-mode (30-second) reply.",
    inputSchema: z.object({}),
    execute: async () => ({ ok: true }) as const,
  }),
  getContact: tool({
    description:
      "Surface the candidate's email + LinkedIn for direct contact. Use this when the " +
      "recruiter wants to reach out, or when a question is best handled directly " +
      "(comp questions, anything sensitive). Also surfaces automatically in brief mode.",
    inputSchema: z.object({}),
    execute: async () => ({ ok: true }) as const,
  }),
} satisfies ToolSet;

/** Inferred UI-side type for each tool — drives part-discrimination in the
 *  chat UI (e.g. `case 'tool-openProject':`). */
export type ChatTools = InferUITools<typeof tools>;

/** The chat message shape transported between client and server. The first
 *  type parameter is `never` because we don't ship custom data parts in v1.
 *  `UIDataTypes` is the AI SDK default. `ChatTools` carries the tool surface. */
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;
