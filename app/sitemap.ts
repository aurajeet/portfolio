import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { caseStudies } from "@/content/experience";
import { projectCaseStudies, projectTeardowns } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  // "/about" is temporarily unlisted while the page is reworked (route lives
  // at app/_about/ — a private folder — so it is not served).
  const staticRoutes = ["/", "/projects"].map((path) => ({
    url: `${base}${path}`,
  }));

  const experienceRoutes = caseStudies.map((c) => ({
    url: `${base}/experience/${c.slug}`,
  }));

  const projectRoutes = [...projectCaseStudies, ...projectTeardowns].map((p) => ({
    url: `${base}/projects/${p.slug}`,
  }));

  return [...staticRoutes, ...experienceRoutes, ...projectRoutes];
}
