import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FadeUp } from "@/components/ui/FadeUp";
import { Heading } from "@/components/ui/Heading";
import { TagPill } from "@/components/ui/TagPill";
import { caseStudies } from "@/content/experience";
import { cn } from "@/lib/cn";

export function Work() {
  return (
    <section id="work" className="section-y border-t border-rule">
      <Container>
        <FadeUp>
          <Eyebrow tone="accent">EXPERIENCE</Eyebrow>
        </FadeUp>

        <div className="mt-12 md:mt-16">
          {caseStudies.map((c, i) => (
            <FadeUp key={c.slug} delay={i * 0.06}>
              <article
                className={cn(
                  "pt-12 md:pt-16",
                  i > 0 && "mt-12 border-t border-rule md:mt-16",
                )}
              >
                <Link
                  href={`/experience/${c.slug}`}
                  aria-label={`Read case study: ${c.title}`}
                  className="group block"
                >
                  <Eyebrow>{c.eyebrow}</Eyebrow>

                  <Heading
                    variant="h3"
                    as="h2"
                    className="mt-6 max-w-[24ch] text-balance"
                  >
                    {c.title}
                  </Heading>

                  <p
                    className={cn(
                      "mt-6 max-w-[58ch] font-display italic text-ink/85",
                      "text-[1.125rem] leading-snug md:text-xl",
                    )}
                  >
                    {c.dek.short}
                  </p>

                  <div
                    className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-rule py-4"
                  >
                    {c.metrics.map((m) => (
                      <div key={m.label} className="flex flex-col gap-0.5">
                        <span className="font-display text-sm text-ink md:text-base">
                          {m.value}
                        </span>
                        <span
                          className={cn(
                            "font-sans text-[10px] font-medium uppercase text-mute",
                            "tracking-[var(--tracking-eyebrow)]",
                          )}
                        >
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {c.tags.slice(0, 4).map((tag) => (
                      <TagPill key={tag}>{tag}</TagPill>
                    ))}
                  </div>

                  <span
                    className={cn(
                      "mt-8 inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase",
                      "tracking-[var(--tracking-eyebrow)] text-ink",
                    )}
                  >
                    <span className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-current">
                      Read case study
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-ink-accent transition-transform duration-300 ease-[var(--ease-luxe)] group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </article>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
