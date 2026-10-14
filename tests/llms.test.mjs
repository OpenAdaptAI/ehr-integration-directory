import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// lib/ehrs.ts has no imports, so Node's built-in type stripping can load it directly.
const data = await import("../lib/ehrs.ts");
const { ehrs, statusLabels, workflows } = data;
const origin = "https://ehrintegrationdirectory.com";

test("/llms.txt is served as plain text from the shared builder", async () => {
  const route = await readFile(new URL("../app/llms.txt/route.ts", import.meta.url), "utf8");

  assert.match(route, /export (?:async )?function GET/);
  assert.match(route, /llmsText\(CANONICAL_ORIGIN\)/);
  assert.match(route, /text\/plain; charset=utf-8/);
});

test("llms.txt follows the llmstxt.org layout and links every page that matters", () => {
  assert.equal(typeof data.llmsText, "function", "lib/ehrs.ts must export llmsText");
  const text = data.llmsText(origin);
  const lines = text.split("\n");

  assert.equal(lines[0], "# EHR Integration Directory");
  assert.ok(lines.some((line) => line.startsWith("> ")), "needs a one-paragraph summary in a blockquote");
  for (const heading of ["## Data", "## Profiles", "## Workflow guides"]) {
    assert.ok(lines.includes(heading), `missing ${heading}`);
  }

  assert.ok(text.includes(`](${origin}/api/directory)`));
  assert.ok(text.includes(`](${origin}/methodology)`));
  for (const ehr of ehrs) {
    const line = lines.find((entry) => entry.startsWith(`- [${ehr.name}](${origin}/ehr/${ehr.slug}): `));
    assert.ok(line, `no entry for ${ehr.slug}`);
    assert.ok(line.includes(statusLabels[ehr.status]), `${ehr.slug} entry needs its evidence status`);
    assert.ok(line.includes(ehr.lastReviewed), `${ehr.slug} entry needs its review date`);
  }
  for (const workflow of workflows) {
    assert.ok(text.includes(`- [${workflow.name}](${origin}/workflows/${workflow.slug}): `), `no entry for ${workflow.slug}`);
  }
});

test("llms.txt keeps the evidence caveats and leaves OpenAdapt's view out", () => {
  const text = data.llmsText(origin);

  assert.match(text, /does not mean the vendor doesn't support it/);
  assert.match(text, /not a complete catalog/);
  assert.match(text, /business interest/);
  for (const ehr of ehrs) {
    assert.ok(!text.includes(ehr.openAdaptReason), `${ehr.slug}'s product view leaked into llms.txt`);
  }
  // The profile page's fit labels ("API first" also appears in plain verdicts, so it isn't checked here).
  assert.doesNotMatch(text, /UI-gap candidate|Conditional UI fit|OpenAdapt's view ·/);
  assert.doesNotMatch(text, /\b(all|every) (major )?(EHR|EMR)s?\b/i);
  assert.doesNotMatch(text, /seamless|robust|leverage|crucial|delve|unlock|empower|\u2014/i);
});
