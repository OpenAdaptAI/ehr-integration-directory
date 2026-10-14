import { llmsText } from "@/lib/ehrs";
import { CANONICAL_ORIGIN } from "@/lib/links";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsText(CANONICAL_ORIGIN), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
