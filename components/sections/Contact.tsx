import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FadeUp } from "@/components/ui/FadeUp";
import { cn } from "@/lib/cn";

// Locked Contact constants. Exported so the AI bot's knowledge assembler
// (`lib/bot/knowledge.ts`) shares the same source-of-truth values the
// recruiter sees on the landing page — no drift between rendered contact
// info and what the bot reads back.
export const EMAIL = "aurajeetm@gmail.com";
// Display format with grouping; href stripped of spaces for the `tel:` URI.
export const PHONE_DISPLAY = "+91 85509 64470";
export const PHONE_HREF = "tel:+918550964470";
export const LINKEDIN_URL = "https://www.linkedin.com/in/aurajeet-mahapatra/";

export const STATUS_LINE =
  "Looking for PM roles. Open to relocate or work remotely.";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-y border-t border-rule"
    >
      <Container>
        <FadeUp>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Eyebrow tone="accent">Contact</Eyebrow>
            {/* Hidden h2 satisfies the section's `aria-labelledby` and outline
                hierarchy without competing with the email-as-headline visual
                weight. The email link below is the visual headline. */}
            <h2 id="contact-heading" className="sr-only">
              Contact Aurajeet Mahapatra
            </h2>

            <p
              className={cn(
                "mt-8 max-w-[42ch] font-display italic text-ink/85",
                "text-xl leading-snug md:text-2xl",
              )}
            >
              {STATUS_LINE}
            </p>

            <a
              href={`mailto:${EMAIL}`}
              className={cn(
                "group mt-12 inline-flex flex-wrap items-baseline justify-center",
                "gap-x-3 gap-y-1 lowercase text-ink",
                "font-display font-normal tracking-[-0.01em]",
                "text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.05]",
                "transition-opacity duration-300 ease-[var(--ease-luxe)] hover:opacity-90",
                "md:mt-14 md:gap-x-4",
              )}
              aria-label={`Email Aurajeet at ${EMAIL}`}
            >
              <span className="border-b border-current pb-1">{EMAIL}</span>
              <span
                aria-hidden="true"
                className={cn(
                  "inline-block text-ink-accent transition-transform duration-300",
                  "ease-[var(--ease-luxe)] group-hover:translate-x-1.5",
                )}
              >
                →
              </span>
            </a>

            <p
              className={cn(
                "mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2",
                "font-sans text-[11px] font-medium uppercase",
                "tracking-[var(--tracking-eyebrow)] text-ink",
                "md:mt-14 md:text-xs",
              )}
            >
              <a
                href={PHONE_HREF}
                className="inline-block py-1 transition-opacity duration-300 ease-[var(--ease-luxe)] hover:opacity-60"
                aria-label={`Call Aurajeet at ${PHONE_DISPLAY}`}
              >
                {PHONE_DISPLAY}
              </a>
              <span aria-hidden="true" className="text-mute">
                ·
              </span>
              <Link
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener"
                className={cn(
                  "group inline-flex items-center gap-2 py-1",
                  "transition-opacity duration-300 ease-[var(--ease-luxe)] hover:opacity-60",
                )}
              >
                <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-current">
                  LinkedIn
                </span>
                <span
                  aria-hidden="true"
                  className="text-ink-accent transition-transform duration-300 ease-[var(--ease-luxe)] group-hover:translate-x-1"
                >
                  ↗
                </span>
              </Link>
            </p>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
