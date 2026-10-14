import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// lib/ehrs.ts has no imports, so Node's built-in type stripping can load it directly.
const data = await import("../lib/ehrs.ts");
const { ehrs, statusLabels } = data;

const matching = (option) => ehrs.filter((ehr) => data.matchesSurface(ehr, option)).map((ehr) => ehr.slug);

test("every interface and status option finds at least one profile", () => {
  assert.ok(Array.isArray(data.surfaceOptions), "lib/ehrs.ts must export surfaceOptions");
  assert.ok(Array.isArray(data.statusOptions), "lib/ehrs.ts must export statusOptions");

  for (const option of data.surfaceOptions) {
    assert.ok(matching(option).length > 0, `interface option "${option}" finds no profile`);
  }
  for (const status of data.statusOptions) {
    assert.ok(status in statusLabels, `"${status}" has no label`);
    assert.ok(ehrs.some((ehr) => ehr.status === status), `status option "${status}" finds no profile`);
  }
  for (const ehr of ehrs) {
    assert.ok(data.statusOptions.includes(ehr.status), `${ehr.slug}'s status has no filter option`);
  }
});

test("the FHIR and REST options find every profile that lists that interface", () => {
  const fhir = ehrs
    .filter((ehr) => ehr.surfaces.some((surface) => /FHIR/i.test(surface) && surface !== "SMART on FHIR"))
    .map((ehr) => ehr.slug);
  assert.ok(fhir.length > 1);
  assert.deepEqual(matching("FHIR"), fhir);

  const rest = ehrs.filter((ehr) => ehr.surfaces.some((surface) => /^REST\b/i.test(surface))).map((ehr) => ehr.slug);
  assert.ok(rest.length > 1);
  assert.deepEqual(matching("REST API"), rest);

  // SMART on FHIR stays its own option.
  assert.ok(data.surfaceOptions.includes("SMART on FHIR"));
});

test("no interface option repeats another with a version or suffix added", () => {
  for (const a of data.surfaceOptions) {
    for (const b of data.surfaceOptions) {
      if (a !== b) assert.ok(!b.toLowerCase().startsWith(`${a.toLowerCase()} `), `"${b}" duplicates "${a}"`);
    }
  }
});

test("the explorer builds its filters from the shared options", async () => {
  const explorer = await readFile(new URL("../components/directory-explorer.tsx", import.meta.url), "utf8");

  assert.match(explorer, /surfaceOptions\.map/);
  assert.match(explorer, /statusOptions\.map/);
  assert.match(explorer, /matchesSurface\(ehr, surface\)/);
  assert.doesNotMatch(explorer, /ehr\.surfaces\.includes\(surface\)/);
  assert.doesNotMatch(explorer, /Object\.entries\(statusLabels\)/);
});
