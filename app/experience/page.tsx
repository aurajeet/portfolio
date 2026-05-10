import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { TextLink } from "@/components/ui/TextLink";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "A detailed walkthrough of every role — teams, decisions, and outcomes.",
};

export default function ExperiencePage() {
  return (
    <article className="section-y pt-40 md:pt-48">
      <Container>
        <Eyebrow>Detailed</Eyebrow>
        <Heading variant="display" italic className="mt-6 max-w-[14ch]">
          Experience
        </Heading>
        <p className="mt-10 max-w-lg font-sans text-sm leading-relaxed text-mute md:text-base">
          A long-form narrative of every role, every team, every decision.
          Arrives in Phase 3 alongside the landing-page experience section.
        </p>

        <div className="mt-16">
          <TextLink href="/" arrow={false}>
            ← Back to portfolio
          </TextLink>
        </div>
      </Container>
    </article>
  );
}
