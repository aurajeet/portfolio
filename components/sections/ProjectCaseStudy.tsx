import Link from "next/link";
import type {
  ProjectCaseStudy as ProjectCaseStudyData,
  ProseBlock,
} from "@/content/projects";
import { Container } from "@/components/layout/Container";
import { DeckLink } from "@/components/ui/DeckLink";
import { ExternalTextLink } from "@/components/ui/ExternalTextLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { StatRibbon } from "@/components/ui/StatRibbon";
import { TagPill } from "@/components/ui/TagPill";
import { TextLink } from "@/components/ui/TextLink";
import { cn } from "@/lib/cn";

interface ProjectCaseStudyProps {
  project: ProjectCaseStudyData;
  prev?: ProjectCaseStudyData;
  next?: ProjectCaseStudyData;
}

/**
 * Project case-study prose body. Mirrors the experience CaseStudy `<ProseBody>`
 * pattern but adds an `ol` block kind for the ranked recommendation lists in
 * the Netflix + Amazon Prime decks (each `ol` item supports an optional bold
 * `lead` followed by descriptive `rest` — the standard "1. Recommendation
 * name. Description." format both decks use).
 */
function ProseBody({ blocks }: { blocks: ProseBlock[] }) {
  return (
    <div className="mt-20 md:mt-24">
      {blocks.map((block, idx) => {
        switch (block.kind) {
          case "h2":
            return (
              <Heading
                key={idx}
                variant="h2"
                as="h2"
                className="mt-14 max-w-[24ch] text-balance first-of-type:mt-12"
              >
                {block.text}
              </Heading>
            );
          case "h3":
            return (
              <Heading
                key={idx}
                variant="h3"
                as="h3"
                className="mt-10 max-w-[28ch] text-balance"
              >
                {block.text}
              </Heading>
            );
          case "p":
            return (
              <p
                key={idx}
                className="mt-5 max-w-[68ch] text-base leading-relaxed text-ink/90 md:text-lg"
              >
                {block.text}
              </p>
            );
          case "ul":
            return (
              <ul
                key={idx}
                className="mt-8 max-w-[68ch] divide-y divide-rule"
              >
                {block.items.map((item, i) => (
                  <li
                    key={i}
                    className="py-4 text-base leading-relaxed text-ink/90 md:text-lg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol
                key={idx}
                className="mt-8 max-w-[68ch] divide-y divide-rule"
              >
                {block.items.map((item, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[2.5rem_1fr] gap-x-2 py-4 text-base leading-relaxed text-ink/90 md:text-lg"
                  >
                    <span
                      aria-hidden="true"
                      className="font-sans text-[11px] font-medium uppercase tracking-[var(--tracking-eyebrow)] text-ink-accent pt-2"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {typeof item === "string" ? (
                      <span>{item}</span>
                    ) : (
                      <span>
                        <strong className="font-medium text-ink">
                          {item.lead}
                        </strong>{" "}
                        {item.rest}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            );
        }
      })}
    </div>
  );
}

// Mirror of TextLink with the arrow on the LEFT and a leftward hover
// translate. Same local pattern as `CaseStudy.tsx`.
function PrevLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase",
        "tracking-[var(--tracking-eyebrow)] text-ink",
        "transition-opacity duration-300 ease-[var(--ease-luxe)] hover:opacity-60",
      )}
    >
      <span
        aria-hidden="true"
        className="text-ink-accent transition-transform duration-300 ease-[var(--ease-luxe)] group-hover:-translate-x-1"
      >
        ←
      </span>
      <span className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-current">
        {children}
      </span>
    </Link>
  );
}

export function ProjectCaseStudy({
  project,
  prev,
  next,
}: ProjectCaseStudyProps) {
  return (
    <article className="section-y pt-40 md:pt-48">
      <Container width="narrow">
        {/* ---------- Header ---------- */}
        <header>
          <Eyebrow>{project.eyebrow}</Eyebrow>

          <Heading
            variant="h1"
            className="mt-8 max-w-[24ch] text-balance"
          >
            {project.title}
          </Heading>

          <p
            className={cn(
              "mt-8 max-w-[58ch] font-display italic text-ink/85",
              "text-xl leading-snug md:text-2xl",
            )}
          >
            {project.dek.long}
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <TagPill key={tag}>{tag}</TagPill>
            ))}
          </div>

          {/* Deck-discovery link — surfaces the original deck within the
              first viewport so a skim-reader sees the artifact exists before
              committing to the writeup. The substantive deck CTA (with cover
              image) lives further down, after the prose body. */}
          <ExternalTextLink href={project.deckHref} className="mt-8">
            Open the original deck
          </ExternalTextLink>
        </header>

        {/* ---------- Stat ribbon ---------- */}
        <StatRibbon items={project.ribbon} className="mt-16 md:mt-20" />

        {/* ---------- Disclaimer ---------- */}
        <p
          className={cn(
            "mt-16 max-w-[68ch] border-l-2 border-rule pl-5",
            "font-display italic text-mute",
            "text-sm leading-relaxed md:text-base",
          )}
        >
          {project.disclaimer}
        </p>

        {/* ---------- Prose body ---------- */}
        <ProseBody blocks={project.prose} />

        {/* ---------- Original deck download ---------- */}
        <DeckLink
          href={project.deckHref}
          cover={project.deckCover}
          pages={project.deckPages}
          className="mt-24 md:mt-32"
        />

        {/* ---------- Cross-case pagination ---------- */}
        <nav
          aria-label="Project case study pagination"
          className={cn(
            "mt-20 border-t border-rule pt-10 md:mt-28",
            "flex flex-col gap-4",
            "md:grid md:grid-cols-3 md:items-center md:gap-4",
          )}
        >
          {prev ? (
            <div className="md:justify-self-start">
              <PrevLink href={`/projects/${prev.slug}`}>
                Previous: {prev.shortTitle}
              </PrevLink>
            </div>
          ) : (
            <div aria-hidden="true" className="hidden md:block" />
          )}

          <div className="md:justify-self-center">
            <TextLink href="/projects">All projects</TextLink>
          </div>

          {next ? (
            <div className="md:justify-self-end">
              <TextLink href={`/projects/${next.slug}`}>
                Next: {next.shortTitle}
              </TextLink>
            </div>
          ) : (
            <div aria-hidden="true" className="hidden md:block" />
          )}
        </nav>
      </Container>
    </article>
  );
}
