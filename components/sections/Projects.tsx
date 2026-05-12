import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FadeUp } from "@/components/ui/FadeUp";
import { Heading } from "@/components/ui/Heading";
import { TextLink } from "@/components/ui/TextLink";
import { TeardownMarquee } from "@/components/sections/TeardownMarquee";
import {
  projectCaseStudies,
  projectTeardowns,
  type ProjectCaseStudy,
} from "@/content/projects";
import { cn } from "@/lib/cn";

export function Projects() {
  return (
    <section id="projects" className="section-y border-t border-rule">
      <Container>
        <FadeUp>
          <Eyebrow tone="accent">PROJECTS</Eyebrow>
        </FadeUp>

        {/* ---------- Top tier ---------- */}
        <div
          className={cn(
            "mt-12 grid grid-cols-1 gap-16",
            "md:mt-16 md:grid-cols-2 md:gap-10",
          )}
        >
          {projectCaseStudies.map((cs, i) => (
            <FadeUp key={cs.slug} delay={i * 0.08}>
              <ProjectCard project={cs} />
            </FadeUp>
          ))}
        </div>

        {/* ---------- Bottom tier (teardown marquee) ---------- */}
        <TeardownMarquee
          teardowns={projectTeardowns}
          className="mt-24 md:mt-32"
        />

        {/* ---------- View all link ---------- */}
        <FadeUp>
          <div className="mt-12 flex justify-end md:mt-16">
            <TextLink href="/projects">View all projects</TextLink>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}

// ---------- Top-tier card ----------

interface ProjectCardProps {
  project: ProjectCaseStudy;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article>
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`Read case study: ${project.title}`}
        className="group block"
      >
        <div className="overflow-hidden border border-rule bg-paper-pure">
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet={project.banner.desktop}
            />
            <img
              src={project.banner.mobile}
              alt={project.banner.alt}
              loading="lazy"
              decoding="async"
              className={cn(
                "block w-full h-auto",
                "aspect-[4/3] md:aspect-[3/2]",
                "object-cover",
              )}
            />
          </picture>
        </div>

        <div className="mt-8 md:mt-10">
          <Eyebrow>{project.eyebrow}</Eyebrow>

          <Heading
            variant="h3"
            as="h2"
            className="mt-5 max-w-[28ch] text-balance"
          >
            {project.title}
          </Heading>

          <p
            className={cn(
              "mt-5 max-w-[48ch] font-display italic text-ink/85",
              "text-base leading-snug md:text-lg",
            )}
          >
            {project.dek.short}
          </p>

          <div
            className={cn(
              "mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3",
              "border-y border-rule py-4",
              "font-sans text-[11px] uppercase",
              "tracking-[var(--tracking-eyebrow)] text-ink",
            )}
          >
            <span>{project.metrics.join(" · ")}</span>
            <span className="inline-flex items-center gap-2">
              <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-current">
                Read case study
              </span>
              <span
                aria-hidden="true"
                className="text-ink-accent transition-transform duration-300 ease-[var(--ease-luxe)] group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
