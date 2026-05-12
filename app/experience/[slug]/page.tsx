import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import { caseStudies, getCase, getNeighbors } from "@/content/experience";

// Next.js 16 / 15+: dynamic route `params` is a Promise that must be
// awaited. Verified against `node_modules/next/dist/docs/01-app/03-api-
// reference/03-file-conventions/page.md` (Reference > Props > params).
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.dek.long,
    openGraph: {
      type: "website",
      siteName: "Aurajeet Mahapatra",
      locale: "en_IN",
      title: `${c.title} · Aurajeet Mahapatra`,
      description: c.dek.long,
      url: `/experience/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${c.title} · Aurajeet Mahapatra`,
      description: c.dek.long,
    },
  };
}

export default async function ExperienceCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  const { prev, next } = getNeighbors(slug);

  return (
    <>
      <TrackEvent event="case_study_opened" properties={{ slug }} />
      <CaseStudy caseStudy={c} prev={prev} next={next} />
    </>
  );
}
