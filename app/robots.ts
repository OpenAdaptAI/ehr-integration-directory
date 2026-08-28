import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://ehr-integration-directory.abr.chatgpt.site/sitemap.xml",
  };
}
