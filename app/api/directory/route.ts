import { latestReview, publicRecords } from "@/lib/ehrs";

export function GET() {
  return Response.json({
    name: "EHR Integration Directory",
    publisher: "OpenAdapt",
    license: "CC-BY-4.0",
    lastReviewed: latestReview,
    methodology: "/methodology",
    records: publicRecords,
  }, {
    headers: {
      "Content-Disposition": "attachment; filename=ehr-integration-directory.json",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
