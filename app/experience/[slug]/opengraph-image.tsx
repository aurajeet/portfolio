import { buildOgImage } from "@/lib/og";
import { getCase } from "@/content/experience";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCase(slug);
  return buildOgImage(c?.title ?? "Experience", c?.dek.short);
}
