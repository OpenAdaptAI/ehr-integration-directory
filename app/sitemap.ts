import type { MetadataRoute } from "next";
import { ehrs, workflows } from "@/lib/ehrs";

const origin = "https://ehrintegrationdirectory.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-28T00:00:00.000Z");

  return [
    { url: origin, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/methodology`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${origin}/data`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    ...ehrs.map((ehr) => ({
      url: `${origin}/ehr/${ehr.slug}`,
      lastModified,
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
