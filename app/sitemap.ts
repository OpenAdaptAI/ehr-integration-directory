import type { MetadataRoute } from "next";
import { ehrs, latestReview, workflows } from "@/lib/ehrs";
import { CANONICAL_ORIGIN } from "@/lib/links";

const origin = CANONICAL_ORIGIN;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${latestReview}T00:00:00.000Z`);

  return [
    { url: origin, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/methodology`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${origin}/data`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${origin}/canada`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${origin}/no-write-api`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...ehrs.map((ehr) => ({
      url: `${origin}/ehr/${ehr.slug}`,
      lastModified: new Date(`${ehr.lastReviewed}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...workflows.map((workflow) => ({
      url: `${origin}/workflows/${workflow.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
