import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { TextLink } from "@/components/ui/TextLink";
import {
  projectCaseStudies,
  projectTeardowns,
  type ProjectCaseStudy,
  type ProjectTeardown,
} from "@/content/projects";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every project, sorted by recency. Two case studies (Netflix India, Amazon Prime Video) and eight product teardowns from the SIGMA · PM & Tech Club series.",
  openGraph: {
    type: "website",
    siteName: "Aurajeet Mahapatra",
    locale: "en_IN",
    title: "Projects · Aurajeet Mahapatra",
    description:
      "Every project, sorted by recency. Two case studies (Netflix India, Amazon Prime Video) and eight product teardowns from the SIGMA · PM & Tech Club series.",
    url: "/projects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects · Aurajeet Mahapatra",
    description:
      "Every project, sorted by recency. Two case studies (Netflix India, Amazon Prime Video) and eight product teardowns from the SIGMA · PM & Tech Club series.",
  },
};

export default function ProjectsPage() {
  return (
    <article className="section-y pt-40 md:pt-48">
      <Container>
        {/* ---------- Header ---------- */}
        <header>
          <Eyebrow tone="accent">All work</Eyebrow>
          <Heading
            variant="display"
            italic
            className="mt-6 max-w-[14ch] text-balance"
          >
            Projects
          </Heading>
          <p className="mt-10 max-w-[60ch] font-display italic text-ink/85 text-lg leading-snug md:text-xl">
            Two self-directed case studies on the Indian streaming market, and
            eight product teardowns authored as part of the SIGMA · PM &amp;
            Tech Club series.
          </p>
        </header>

        {/* ---------- Case studies tier ---------- */}
        <section
          aria-labelledby="case-studies-heading"
          className="mt-24 border-t border-rule pt-16 md:mt-32 md:pt-20"
        >
          <Eyebrow>Case studies</Eyebrow>
          <h2
            id="case-studies-heading"
            className="sr-only"
          >
            Case studies
          </h2>

          <div
            className={cn(
              "mt-10 grid grid-cols-1 gap-16",
              "md:mt-12 md:grid-cols-2 md:gap-10",
            )}
          >
            {projectCaseStudies.map((cs) => (
              <CaseStudyIndexCard key={cs.slug} project={cs} />
            ))}
          </div>
        </section>

        {/* ---------- Teardowns tier ---------- */}
        <section
          aria-labelledby="teardowns-heading"
          className="mt-24 border-t border-rule pt-16 md:mt-32 md:pt-20"
        >
          <Eyebrow>Product teardowns</Eyebrow>
          <h2 id="teardowns-heading" className="sr-only">
            Product teardowns
          </h2>

          <div
            className={cn(
              "mt-10 grid grid-cols-2 gap-8",
              "md:mt-12 md:grid-cols-3 md:gap-10",
              "lg:grid-cols-4",
            )}
          >
            {projectTeardowns.map((t) => (
              <TeardownIndexCard key={t.slug} teardown={t} />
            ))}
          </div>
        </section>

        {/* ---------- Footer link ---------- */}
        <div className="mt-24 border-t border-rule pt-10 md:mt-32 md:pt-12">
          <TextLink href="/" arrow={false} prefixArrow>
            Back to portfolio
          </TextLink>
        </div>
      </Container>
    </article>
  );
}

// ---------- Index cards ----------

interface CaseStudyIndexCardProps {
  project: ProjectCaseStudy;
}

function CaseStudyIndexCard({ project }: CaseStudyIndexCardProps) {
  return (
    <article>
      <Link
        href={`/projects/${project.slug}`}
        className="group block"
      >
        <div className="aspect-[4/3] overflow-hidden border border-rule bg-paper-pure md:aspect-[3/2]">
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
              className="block h-full w-full object-cover"
            />
          </picture>
        </div>

        <div className="mt-6 md:mt-8">
          <Eyebrow>{project.eyebrow}</Eyebrow>
          <p
            className={cn(
              "mt-4 font-display text-xl leading-snug text-ink",
              "transition-opacity duration-300 ease-[var(--ease-luxe)] group-hover:opacity-60",
              "md:text-2xl",
            )}
          >
            {project.title}
          </p>
          <span
            className={cn(
              "mt-5 inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase",
              "tracking-[var(--tracking-eyebrow)] text-ink",
            )}
          >
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
      </Link>
    </article>
  );
}

interface TeardownIndexCardProps {
  teardown: ProjectTeardown;
}

function TeardownIndexCard({ teardown }: TeardownIndexCardProps) {
  // Magazine-style: hook (or brief fallback) leads, product name is the
  // byline below. Mirrors the landing TeardownCard pattern in
  // `components/sections/Projects.tsx` so both surfaces read the same.
  const lineOne = teardown.hook ?? teardown.brief;
  return (
    <article>
      <Link
        href={`/projects/${teardown.slug}`}
        className="group block"
      >
        <div className="aspect-square overflow-hidden border border-rule bg-paper-pure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={teardown.thumb.src}
            alt={teardown.thumb.alt}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover"
          />
        </div>

        <p
          className={cn(
            "mt-4 font-display text-base leading-snug text-ink md:text-lg",
            "transition-opacity duration-300 ease-[var(--ease-luxe)] group-hover:opacity-60",
          )}
        >
          {lineOne}
        </p>
        <p
          className={cn(
            "mt-2 font-sans text-[11px] font-medium uppercase text-mute",
            "tracking-[var(--tracking-eyebrow)]",
          )}
        >
          {teardown.product}
        </p>
      </Link>
    </article>
  );
}
