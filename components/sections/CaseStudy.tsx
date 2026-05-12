import Link from "next/link";
import type {
  CaseStudy as CaseStudyData,
  ProseBlock,
} from "@/content/experience";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { StatRibbon } from "@/components/ui/StatRibbon";
import { TagPill } from "@/components/ui/TagPill";
import { TextLink } from "@/components/ui/TextLink";
import { cn } from "@/lib/cn";

interface CaseStudyProps {
  caseStudy: CaseStudyData;
  prev?: CaseStudyData;
  next?: CaseStudyData;
}

// Short brand label for cross-case nav. Keeping the lookup local to this
// component because it's purely presentational (the content file owns the
// long titles; the deep-dive nav reads better with a tight brand mark).
const shortLabels: Record<CaseStudyData["slug"], string> = {
  nwn: "Nation With NaMo",
  hebe: "HEBE",
};

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
                className="mt-20 max-w-[24ch] text-balance first-of-type:mt-16"
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
                className="mt-12 max-w-[28ch] text-balance"
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
        }
      })}
    </div>
  );
}

function MetaColumn({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  return (
    <div>
      <Eyebrow>{label}</Eyebrow>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <TagPill key={item}>{item}</TagPill>
        ))}
      </div>
    </div>
  );
}

// Mirror of TextLink with the arrow on the LEFT and a leftward hover
// translate. Kept local to this file rather than baked into TextLink because
// the prev/next pagination is the only place on the site that needs it.
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

export function CaseStudy({ caseStudy, prev, next }: CaseStudyProps) {
  return (
    <article className="section-y pt-40 md:pt-48">
      <Container width="narrow">
        {/* ---------- Header ---------- */}
        <header>
          <Eyebrow>{caseStudy.eyebrow}</Eyebrow>

          <Heading
            variant="h1"
            className="mt-8 max-w-[24ch] text-balance"
          >
            {caseStudy.title}
          </Heading>

          <p
            className={cn(
              "mt-8 max-w-[58ch] font-display italic text-ink/85",
              "text-xl leading-snug md:text-2xl",
            )}
          >
            {caseStudy.dek.long}
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {caseStudy.tags.map((tag) => (
              <TagPill key={tag}>{tag}</TagPill>
            ))}
          </div>
        </header>

        {/* ---------- Stat ribbon ---------- */}
        <StatRibbon
          items={caseStudy.ribbon}
          className="mt-16 md:mt-20"
        />

        {/* ---------- Prose body ---------- */}
        <ProseBody blocks={caseStudy.prose} />

        {/* ---------- Methods · Tools · Collaborators ---------- */}
        <div
          className={cn(
            "mt-24 md:mt-28 border-t border-rule pt-12",
            "grid gap-12 md:grid-cols-3 md:gap-10",
          )}
        >
          <MetaColumn label="Methods" items={caseStudy.methods} />
          <MetaColumn label="Tools" items={caseStudy.tools} />
          <MetaColumn label="Collaborators" items={caseStudy.collaborators} />
        </div>

        {/* ---------- Cross-case pagination ---------- */}
        <nav
          aria-label="Case study pagination"
          className={cn(
            "mt-20 border-t border-rule pt-10 md:mt-28",
            "flex flex-col gap-4",
            "md:grid md:grid-cols-3 md:items-center md:gap-4",
          )}
        >
          {prev ? (
            <div className="md:justify-self-start">
              <PrevLink href={`/experience/${prev.slug}`}>
                Previous: {shortLabels[prev.slug]}
              </PrevLink>
            </div>
          ) : (
            <div aria-hidden="true" className="hidden md:block" />
          )}

          <div className="md:justify-self-center">
            <TextLink href="/#work">All work</TextLink>
          </div>

          {next ? (
            <div className="md:justify-self-end">
              <TextLink href={`/experience/${next.slug}`}>
                Next: {shortLabels[next.slug]}
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
