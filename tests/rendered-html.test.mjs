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

test("product links go to Execute or partners, not a workflow marketplace", async () => {
  const files = [
    "lib/links.ts",
    "app/page.tsx",
    "app/ehr/[slug]/page.tsx",
    "app/workflows/[slug]/page.tsx",
    "components/site-header.tsx",
  ];
  const sources = await Promise.all(files.map(read));

  assert.match(sources[0], /https:\/\/openadapt\.ai\/execute/);
  assert.match(sources[0], /https:\/\/openadapt\.ai\/partners/);
  assert.match(sources[0], /Do not infer that/);
  assert.match(sources[0], /system-of-record read/);
  assert.match(sources[0], /issues a Seal only after that read/);

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
