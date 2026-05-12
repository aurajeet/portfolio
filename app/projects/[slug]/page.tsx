import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCaseStudy } from "@/components/sections/ProjectCaseStudy";
import { TeardownDetail } from "@/components/sections/TeardownDetail";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import {
  allProjects,
  getCaseStudy,
  getCaseStudyNeighbors,
  getTeardown,
  getTeardownNeighbors,
} from "@/content/projects";

// Next.js 16 / 15+: dynamic route `params` is a Promise that must be
// awaited. Verified against `node_modules/next/dist/docs/01-app/03-api-
// reference/03-file-conventions/page.md` (Reference > Props > params).
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const caseStudy = getCaseStudy(slug);
  if (caseStudy) {
    return {
      title: caseStudy.title,
      description: caseStudy.dek.long,
      openGraph: {
        type: "website",
        siteName: "Aurajeet Mahapatra",
        locale: "en_IN",
        title: `${caseStudy.title} · Aurajeet Mahapatra`,
        description: caseStudy.dek.long,
        url: `/projects/${slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${caseStudy.title} · Aurajeet Mahapatra`,
        description: caseStudy.dek.long,
      },
    };
  }

  const teardown = getTeardown(slug);
  if (teardown) {
    const title = teardown.hook ?? teardown.title;
    return {
      title,
      description: teardown.brief,
      openGraph: {
        type: "website",
        siteName: "Aurajeet Mahapatra",
        locale: "en_IN",
        title: `${title} · Aurajeet Mahapatra`,
        description: teardown.brief,
        url: `/projects/${slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} · Aurajeet Mahapatra`,
        description: teardown.brief,
      },
    };
  }

  return {};
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  // Look up case studies first (Netflix + Amazon Prime get the rich
  // template); fall back to teardowns (lighter template); 404 otherwise.
  const caseStudy = getCaseStudy(slug);
  if (caseStudy) {
    const { prev, next } = getCaseStudyNeighbors(slug);
    return (
      <>
        <TrackEvent event="project_opened" properties={{ slug }} />
        <ProjectCaseStudy project={caseStudy} prev={prev} next={next} />
      </>
    );
  }

  const teardown = getTeardown(slug);
  if (teardown) {
    const { prev, next } = getTeardownNeighbors(slug);
    return (
      <>
        <TrackEvent event="project_opened" properties={{ slug }} />
        <TeardownDetail teardown={teardown} prev={prev} next={next} />
      </>
    );
  }

  notFound();
}
