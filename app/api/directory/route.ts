import { ehrs } from "@/lib/ehrs";

export function GET() {
  return Response.json({
    name: "EHR Integration Directory",
    publisher: "OpenAdapt",
    license: "CC-BY-4.0",
    lastReviewed: "2026-08-28",
    methodology: "/methodology",
    records: ehrs,
  }, {
    headers: {
      "Content-Disposition": "attachment; filename=ehr-integration-directory.json",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
