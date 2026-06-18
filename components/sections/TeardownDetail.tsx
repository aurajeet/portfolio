import Link from "next/link";
import type { ProjectTeardown, ProseBlock } from "@/content/projects";
import { Container } from "@/components/layout/Container";
import { DeckLink } from "@/components/ui/DeckLink";
import { ExternalTextLink } from "@/components/ui/ExternalTextLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { TextLink } from "@/components/ui/TextLink";
import { cn } from "@/lib/cn";

interface TeardownDetailProps {
  teardown: ProjectTeardown;
  prev?: ProjectTeardown;
  next?: ProjectTeardown;
}

/**
 * Prose body shared in shape with ProjectCaseStudy's renderer — same h2/h3/p/
 * ul/ol kind set from `content/projects.ts`. Duplicated rather than extracted
 * to keep the component graph flat; if a third consumer ever needs it, this
 * is the moment to lift it into a shared module.
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

// Mirror of `TextLink` with the arrow on the LEFT and a leftward hover
// translate. Same local pattern as the experience CaseStudy component.
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

/**
 * Per-teardown deep dive. Lighter than the project case study — no stat
 * ribbon, no methods/tools/collaborators meta block, no disclaimer. When the
 * teardown carries `prose` (lifted from the source SIGMA · PM & Tech Club
 * deck), renders a full deep dive: header → prose body → original deck
 * download → cross-teardown pagination. When `prose` is absent, falls back
 * to the "Deep dive — coming soon" placeholder card.
 *
 * Cross-teardown pagination walks the teardown list (not the case studies),
 * keeping the navigation cohesive within the bottom-tier content class.
 */
export function TeardownDetail({ teardown, prev, next }: TeardownDetailProps) {
  return (
    <article className="section-y pt-40 md:pt-48">
      <Container width="narrow">
        {/* ---------- Header ---------- */}
        <header>
          {/* Eyebrow signals the page category + locks the company; year is
              dropped (was locked-to-2026 across all 9, contradicting the real
              `authoredAt` shown in the deck-link block). H1 leads with the
              hook — argument first, artifact label second. Falls back to the
              legacy title until each hook is finalized. */}
          <Eyebrow>
            PRODUCT TEARDOWN · {teardown.product.toUpperCase()}
          </Eyebrow>

          <Heading
            variant="h1"
            className="mt-8 max-w-[24ch] text-balance"
          >
            {teardown.hook ?? teardown.title}
          </Heading>

          <p
            className={cn(
              "mt-8 max-w-[58ch] font-display italic text-ink/85",
              "text-xl leading-snug md:text-2xl",
            )}
          >
            {teardown.brief}
          </p>

          {/* Deck-discovery link — same treatment as the case-study deep
              dive, kept consistent across both content tiers. Renders only
              when a deck is available; gracefully omits for any teardown
              still on the placeholder template. */}
          {teardown.deckHref ? (
            <ExternalTextLink href={teardown.deckHref} className="mt-8">
              Open the original deck
            </ExternalTextLink>
          ) : null}
        </header>

        {/* ---------- Body: prose if present, placeholder otherwise ---------- */}
        {teardown.prose ? (
          <ProseBody blocks={teardown.prose} />
        ) : (
          <div
            className={cn(
              "mt-20 border border-rule bg-paper-pure px-8 py-14 md:mt-24 md:px-12 md:py-20",
              "flex flex-col items-center gap-3 text-center",
            )}
          >
            <Eyebrow>Deep dive · coming soon</Eyebrow>
            <p className="max-w-[44ch] font-display text-base italic text-mute md:text-lg">
              Full teardown content (research notes, feature analysis, and the
              original SIGMA · PM &amp; Tech Club deck) lifts in from the source
              in a later pass.
            </p>
            <p className="font-sans text-xs text-mute">
              Original deck authored {teardown.authoredAt}.
            </p>
          </div>
        )}

        {/* ---------- Original deck download ---------- */}
        {teardown.deckHref && teardown.deckCover && teardown.deckPages ? (
          <DeckLink
            href={teardown.deckHref}
            cover={teardown.deckCover}
            pages={teardown.deckPages}
            authoredAt={teardown.authoredAt}
            className="mt-20 md:mt-24"
          />
        ) : null}

        {/* ---------- Cross-teardown pagination ---------- */}
        <nav
          aria-label="Teardown pagination"
          className={cn(
            "mt-20 border-t border-rule pt-10 md:mt-28",
            "flex flex-col gap-4",
            "md:grid md:grid-cols-3 md:items-center md:gap-4",
          )}
        >
          {prev ? (
            <div className="md:justify-self-start">
              <PrevLink href={`/projects/${prev.slug}`}>
                Previous: {prev.product}
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
                Next: {next.product}
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
