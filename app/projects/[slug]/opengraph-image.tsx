import { buildOgImage } from "@/lib/og";
import { getCaseStudy, getTeardown } from "@/content/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const cs = getCaseStudy(slug);
  if (cs) return buildOgImage(cs.title, cs.dek.short);

  const td = getTeardown(slug);
  if (td) return buildOgImage(td.hook ?? td.title, td.brief);

  return buildOgImage("Projects");
}
