import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("uses the production domain in discoverability metadata", async () => {
  const [layout, robots, sitemap, page] = await Promise.all([
    read("app/layout.tsx"),
    read("app/robots.ts"),
    read("app/sitemap.ts"),
    read("app/page.tsx"),
  ]);

  for (const source of [layout, robots, sitemap, page]) {
    assert.match(source, /https:\/\/ehrintegrationdirectory\.com/);
    assert.doesNotMatch(source, /chatgpt\.site/);
  }

  assert.match(layout, /EHR Integration Directory/);
  assert.match(robots, /sitemap\.xml/);
  assert.match(page, /application\/ld\+json/);
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
});
