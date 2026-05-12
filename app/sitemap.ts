import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { caseStudies } from "@/content/experience";
import { projectCaseStudies, projectTeardowns } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  const staticRoutes = ["/", "/about", "/projects"].map((path) => ({
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
