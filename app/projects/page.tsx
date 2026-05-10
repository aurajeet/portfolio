import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { TextLink } from "@/components/ui/TextLink";

export const metadata: Metadata = {
  title: "Projects",
  description: "Every project, sorted by recency, filterable by category.",
};

export default function ProjectsPage() {
  return (
    <article className="section-y pt-40 md:pt-48">
      <Container>
        <Eyebrow>All work</Eyebrow>
        <Heading variant="display" italic className="mt-6 max-w-[14ch]">
          Projects
        </Heading>
        <p className="mt-10 max-w-lg font-sans text-sm leading-relaxed text-mute md:text-base">
          A complete archive of recent and past projects, sorted by recency
          with category filters. Arrives in Phase 4 alongside the recent-projects
          horizontal scroll on the landing page.
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
