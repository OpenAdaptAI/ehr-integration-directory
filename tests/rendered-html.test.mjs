import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("uses the production domain in discoverability metadata", async () => {
  const [links, layout, robots, sitemap, page] = await Promise.all([
    read("lib/links.ts"),
    read("app/layout.tsx"),
    read("app/robots.ts"),
    read("app/sitemap.ts"),
    read("app/page.tsx"),
  ]);

  assert.match(links, /https:\/\/ehrintegrationdirectory\.com/);
  assert.doesNotMatch(links, /vercel\.app/);
  assert.doesNotMatch(links, /chatgpt\.site/);

  for (const source of [layout, robots, sitemap, page]) {
    assert.match(source, /CANONICAL_ORIGIN/);
    assert.doesNotMatch(source, /vercel\.app/);
    assert.doesNotMatch(source, /chatgpt\.site/);
  }

  assert.match(layout, /EHR Integration Directory/);
  assert.match(robots, /sitemap\.xml/);
  assert.match(page, /application\/ld\+json/);
  assert.match(page, /"@type": "Dataset"/);
});

test("publishes a directory API and evidence-linked dataset", async () => {
  const [route, data] = await Promise.all([
    read("app/api/directory/route.ts"),
    read("lib/ehrs.ts"),
  ]);

  assert.match(route, /export (?:async )?function GET/);
  assert.match(route, /ehrs/);
  assert.match(data, /sources:/);
  assert.match(data, /url: "https:\/\//);
  assert.match(data, /documented/);
  assert.match(data, /export type EhrRecord/);
  assert.match(data, /capabilities:/);
  assert.match(data, /lastReviewed:/);
});

test("keeps five evidence states and refuses not-found as cannot", async () => {
  const [data, methodology] = await Promise.all([
    read("lib/ehrs.ts"),
    read("app/methodology/page.tsx"),
  ]);

  assert.match(data, /documented: "Documented"/);
  assert.match(data, /"partner-gated": "Partner-gated"/);
  assert.match(data, /"site-specific": "Site-specific"/);
  assert.match(data, /"not-found": "Not found publicly"/);
  assert.match(data, /unknown: "Unknown"/);

  for (const status of ["documented", "partner-gated", "site-specific", "not-found", "unknown"]) {
    assert.match(methodology, new RegExp(`\\["${status}"`));
  }

  assert.match(data, /this is not a claim of non-support/);
  assert.match(methodology, /This is not proof that it is unsupported/);
});

test("product links go to the explainer or partners, not a workflow marketplace", async () => {
  const files = [
    "lib/links.ts",
    "app/page.tsx",
    "app/ehr/[slug]/page.tsx",
    "app/workflows/[slug]/page.tsx",
    "app/no-write-api/page.tsx",
    "app/canada/page.tsx",
    "components/site-header.tsx",
  ];
  const sources = await Promise.all(files.map(read));

  assert.match(sources[0], /https:\/\/openadapt\.ai\/partners/);
  assert.match(sources[0], /NO_WRITE_API_PATH = "\/no-write-api"/);
  assert.match(sources[0], /Do not infer that/);
  assert.match(sources[0], /read the saved record back before it reports/);

  for (const source of sources) {
    assert.doesNotMatch(source, /openadapt\.ai\/qualify/);
    assert.doesNotMatch(source, /gist\.github/);
    assert.doesNotMatch(source, /procedure pack/i);
    assert.doesNotMatch(source, /install this workflow/i);
    assert.doesNotMatch(source, /ExtraDup/);
    assert.doesNotMatch(source, /21\/23/);
    assert.doesNotMatch(source, /2,?689/);
  }
});

const canadianSlugs = ["accuro", "ps-suite", "med-access", "telus-chr", "oscar-pro", "juno", "ocean"];

function recordBlock(data, slug) {
  const start = data.indexOf(`slug: "${slug}"`);
  assert.notEqual(start, -1, `missing record ${slug}`);
  const next = data.indexOf("slug: \"", start + 1);
  return data.slice(start, next === -1 ? undefined : next);
}

test("covers the Canadian ambulatory EMRs and Ocean with sourced, dated records", async () => {
  const data = await read("lib/ehrs.ts");

  for (const slug of canadianSlugs) {
    const block = recordBlock(data, slug);
    assert.match(block, /market: "Canadian /, `${slug} must be marked Canadian`);
    assert.match(block, /lastReviewed: "\d{4}-\d{2}-\d{2}"/, `${slug} needs a review date`);
    assert.match(block, /capabilities: \[/, `${slug} needs capability rows`);
    assert.match(block, /sources: \[[\s\S]*(url: "https:\/\/|[A-Z_]+,)/, `${slug} needs sources`);
  }

  assert.match(data, /export function isCanadian/);
  assert.match(data, /isCanadian\(ehr\) \? "Canada"/);
});

test("review dates come from the data, not hardcoded strings", async () => {
  const [profile, explorer, home, data, route, sitemap] = await Promise.all([
    read("app/ehr/[slug]/page.tsx"),
    read("components/directory-explorer.tsx"),
    read("app/page.tsx"),
    read("app/data/page.tsx"),
    read("app/api/directory/route.ts"),
    read("app/sitemap.ts"),
  ]);

  assert.match(profile, /formatReviewDate\(ehr\.lastReviewed\)/);
  for (const source of [profile, explorer, home, data, route, sitemap]) {
    assert.doesNotMatch(source, /2026-08-28|August 28, 2026/);
  }
  assert.match(sitemap, /\/canada/);
  assert.match(sitemap, /\/no-write-api/);
});

test("the explainer labels its illustration, cites its numbers, and discloses OpenAdapt", async () => {
  const [explainer, canada, links] = await Promise.all([
    read("app/no-write-api/page.tsx"),
    read("app/canada/page.tsx"),
    read("lib/links.ts"),
  ]);

  assert.match(explainer, /Illustration\./);
  assert.match(explainer, /Disclosure/);
  assert.match(explainer, /no partnership with any vendor listed here/);
  assert.match(explainer, /pmc\.ncbi\.nlm\.nih\.gov\/articles\/PMC7660949/);
  assert.match(explainer, /hfma\.org\.uk/);
  assert.match(explainer, /it doesn't retry on its own/);

  const banned = /seamless|robust|leverage|crucial|delve|unlock|empower|cutting-edge|game-changer|transformative|\bSeal\b|VERIFIED|HALTED|RECONCILIATION_REQUIRED|\u2014/i;
  for (const source of [explainer, canada, links]) {
    assert.doesNotMatch(source, banned);
  }
});
