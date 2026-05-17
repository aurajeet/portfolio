"use client";

import Link from "next/link";
import { useState } from "react";
import { EMAIL, LINKEDIN_URL } from "@/components/sections/Contact";
import type { NavigateToSection, ProjectSlug } from "@/lib/bot/tools";
import { NAVIGATE_TO_SECTION_HREF } from "@/lib/bot/tools";
import { cn } from "@/lib/cn";

// ---------------------------------------------------------------------------
// Project card lookup
//
// Per the orchestrator's brief, the bot's project-card surface needs `title`,
// `outcome`, and `thumb` for each of the 11 valid slugs. We keep this table
// inside `components/chat/` (rather than importing the prose-heavy
// `content/projects.ts` into a client bundle) so the chat module stays
// self-contained. Titles + outcomes are hand-shortened so the card reads in
// two lines max; thumbnails point to the same SVG/WebP assets the Projects
// section already loads.
// ---------------------------------------------------------------------------

type ProjectCard = {
  title: string;
  outcome: string;
  thumb: string;
};

const PROJECT_CARDS: Record<ProjectSlug, ProjectCard> = {
  netflix: {
    title: "Netflix India",
    outcome: "Two product bets to close the social-viewing gap.",
    thumb: "/projects/netflix-mobile.svg",
  },
  "amazon-prime": {
    title: "Amazon Prime Video",
    outcome: "RICE-scored fix for browse decision fatigue.",
    thumb: "/projects/amazon-prime-mobile.svg",
  },
  cred: {
    title: "CRED",
    outcome: "Punctuality rewards for the credit-conscious millennial.",
    thumb: "/projects/teardowns/cred.svg",
  },
  blinkit: {
    title: "Blinkit",
    outcome: "Ten-minute groceries on a dark-store network.",
    thumb: "/projects/teardowns/blinkit.svg",
  },
  groww: {
    title: "Groww",
    outcome: "Investing simplified for first-time Indian investors.",
    thumb: "/projects/teardowns/groww.svg",
  },
  spotify: {
    title: "Spotify",
    outcome: "Freemium music and podcasts across 180+ countries.",
    thumb: "/projects/teardowns/spotify.svg",
  },
  "cult-fit": {
    title: "Cult.Fit",
    outcome: "Preventive health across six wellness verticals.",
    thumb: "/projects/teardowns/cult-fit.svg",
  },
  zerodha: {
    title: "Zerodha",
    outcome: "India's discount broker; 15% of retail trading volume.",
    thumb: "/projects/teardowns/zerodha.svg",
  },
  instagram: {
    title: "Instagram",
    outcome: "Meta's dominant short-form creator surface.",
    thumb: "/projects/teardowns/instagram.svg",
  },
  zoom: {
    title: "Zoom",
    outcome: "Synchronous video for the remote-work era.",
    thumb: "/projects/teardowns/zoom.svg",
  },
};

// Contact card pulls the canonical email + LinkedIn from the Contact
// section's exported constants — single source of truth. The display form
// of the LinkedIn URL is derived locally so the card shows a tighter line
// than the full https:// URL.
const CONTACT_LINKEDIN_DISPLAY = LINKEDIN_URL.replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

const RESUME_FILENAME = "Aurajeet_Mahapatra_Product.pdf";
const RESUME_HREF = "/resume.pdf";

// ---------------------------------------------------------------------------
// Shape primitives
// ---------------------------------------------------------------------------

const cardBase = cn(
  "block w-full max-w-full border border-rule bg-paper-pure",
  "transition-colors duration-200 ease-[var(--ease-luxe)]",
);

const cardHover = "hover:border-ink";

const eyebrowCls = cn(
  "font-sans text-[10px] font-medium uppercase",
  "tracking-[var(--tracking-eyebrow)] text-mute",
);

const ctaCls = cn(
  "inline-flex items-center gap-1 font-sans text-[10px] font-medium uppercase",
  "tracking-[var(--tracking-eyebrow)] text-ink",
);

// ---------------------------------------------------------------------------
// Card variants — each tool gets a discriminated render
// ---------------------------------------------------------------------------

type ProjectCardProps = {
  kind: "project";
  slug: ProjectSlug;
};

type ResumeCardProps = {
  kind: "resume";
};

type ContactCardProps = {
  kind: "contact";
};

type NavigateCardProps = {
  kind: "navigate";
  section: NavigateToSection;
  /** Called on click — drawer uses this to close itself before the Lenis
   *  smooth-scroll provider runs the actual anchor jump. */
  onNavigate?: () => void;
};

export type ChatActionCardProps =
  | ProjectCardProps
  | ResumeCardProps
  | ContactCardProps
  | NavigateCardProps;

export function ChatActionCard(props: ChatActionCardProps) {
  switch (props.kind) {
    case "project":
      return <ProjectCardView slug={props.slug} />;
    case "resume":
      return <ResumeCardView />;
    case "contact":
      return <ContactCardView />;
    case "navigate":
      return (
        <NavigatePillView
          section={props.section}
          onNavigate={props.onNavigate}
        />
      );
  }
}

// ---------- 1. Project (rich) — ~140px ----------

function ProjectCardView({ slug }: { slug: ProjectSlug }) {
  const card = PROJECT_CARDS[slug];
  if (!card) return null;

  return (
    <Link
      href={`/projects/${slug}`}
      className={cn(cardBase, cardHover, "group p-4")}
      aria-label={`Open ${card.title} project`}
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className={eyebrowCls}>PROJECT</p>
          <p
            className={cn(
              "mt-2 font-display text-[20px] leading-tight text-ink",
              "tracking-[-0.01em]",
            )}
          >
            {card.title}
          </p>
          <p className="mt-2 text-[11px] leading-snug text-mute">
            {card.outcome}
          </p>
        </div>
        <div
          aria-hidden="true"
          className="relative size-14 flex-shrink-0 overflow-hidden border border-rule bg-paper"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.thumb}
            alt=""
            width={56}
            height={56}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <span className={ctaCls}>
          OPEN
          <span
            aria-hidden="true"
            className="text-ink-accent transition-transform duration-200 ease-[var(--ease-luxe)] group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

// ---------- 2. Resume (minimal) — ~80px ----------

function ResumeCardView() {
  return (
    <a
      href={RESUME_HREF}
      download
      className={cn(cardBase, cardHover, "group flex items-center gap-3 p-4")}
      aria-label="Download resume PDF"
    >
      <PdfLineIcon className="flex-shrink-0 text-ink" />
      <div className="min-w-0 flex-1">
        <p className={eyebrowCls}>RESUME</p>
        <p
          className={cn(
            "mt-1 truncate font-display text-[14px] leading-tight text-ink",
            "tracking-[-0.005em]",
          )}
        >
          {RESUME_FILENAME}
        </p>
      </div>
      <span className={cn(ctaCls, "flex-shrink-0")}>
        DOWNLOAD
        <span
          aria-hidden="true"
          className="text-ink-accent transition-transform duration-200 ease-[var(--ease-luxe)] group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
    </a>
  );
}

// ---------- 3. Contact (medium) — ~100px ----------

function ContactCardView() {
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    // Clipboard API may reject (insecure context, denial). Treat any failure
    // as a silent miss — the user can still click the email line directly.
    void navigator.clipboard?.writeText(EMAIL).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      },
      () => {},
    );
  }

  return (
    <div className={cn(cardBase, "p-4")}>
      <p className={eyebrowCls}>CONTACT</p>
      <div className="mt-2 space-y-1.5">
        <a
          href={`mailto:${EMAIL}`}
          className="block text-[13px] text-ink underline-offset-2 hover:underline"
        >
          {EMAIL}
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-[13px] text-mute underline-offset-2 hover:underline"
        >
          {CONTACT_LINKEDIN_DISPLAY}
        </a>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            ctaCls,
            "cursor-pointer transition-opacity duration-200 ease-[var(--ease-luxe)] hover:opacity-70",
          )}
          aria-label={
            copied ? "Email copied to clipboard" : "Copy email to clipboard"
          }
        >
          {copied ? (
            <>
              COPIED
              <span aria-hidden="true" className="text-ink">
                ✓
              </span>
            </>
          ) : (
            <>
              COPY
              <span aria-hidden="true" className="text-ink-accent">
                →
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ---------- 4. Navigate (inline pill) — ~36px ----------

function NavigatePillView({
  section,
  onNavigate,
}: {
  section: NavigateToSection;
  onNavigate?: () => void;
}) {
  const label = section.toUpperCase();
  return (
    <Link
      href={NAVIGATE_TO_SECTION_HREF[section]}
      onClick={onNavigate}
      className={cn(
        "group inline-flex items-center gap-2 border border-rule bg-paper px-3 py-2",
        "font-sans text-[10px] font-medium uppercase tracking-[var(--tracking-eyebrow)] text-ink",
        "transition-colors duration-200 ease-[var(--ease-luxe)]",
        "hover:bg-ink hover:text-paper",
      )}
    >
      TAKE ME TO {label}
      <span
        aria-hidden="true"
        className="transition-transform duration-200 ease-[var(--ease-luxe)] group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

// ---------- PDF line icon ----------
//
// Hairline, square-cornered, monochrome — matches the chrome of the rest of
// the action-card surface. ~20×24 to feel like a folio.
function PdfLineIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="24"
      viewBox="0 0 20 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      className={className}
    >
      <path d="M2 1.5 H13 L18 6.5 V22.5 H2 Z" />
      <path d="M13 1.5 V6.5 H18" />
      <text
        x="10"
        y="17"
        textAnchor="middle"
        fontSize="6"
        fontFamily="sans-serif"
        fontWeight="500"
        stroke="none"
        fill="currentColor"
        letterSpacing="0.5"
      >
        PDF
      </text>
    </svg>
  );
}
