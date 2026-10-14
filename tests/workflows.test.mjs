import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// lib/ehrs.ts has no imports, so Node's built-in type stripping can load it directly.
const data = await import("../lib/ehrs.ts");
const { workflows } = data;

const guideText = (workflow) =>
  [
    workflow.stateChange,
    workflow.verify,
    ...(workflow.resources ?? []).flatMap((resource) => [resource.name, resource.role]),
    ...(workflow.failureModes ?? []),
  ].join("\n");

test("every workflow guide carries content of its own", () => {
  for (const workflow of workflows) {
    assert.ok(workflow.stateChange?.length > 40, `${workflow.slug} needs a target state change`);
    assert.ok(workflow.verify?.length > 40, `${workflow.slug} needs a read-back step`);
    assert.ok(Array.isArray(workflow.resources) && workflow.resources.length >= 2, `${workflow.slug} needs FHIR resources`);
    for (const resource of workflow.resources) {
      assert.match(resource.name, /^[A-Z][A-Za-z]+$/, `${workflow.slug}: "${resource.name}" is not a FHIR resource name`);
      assert.ok(resource.role.length > 10, `${workflow.slug}: ${resource.name} needs a role`);
    }
    assert.ok(Array.isArray(workflow.failureModes) && workflow.failureModes.length >= 3, `${workflow.slug} needs failure modes`);
  }

  const bodies = workflows.map(guideText);
  assert.equal(new Set(bodies).size, workflows.length, "two workflow guides have the same body");

  const lines = workflows.flatMap((workflow) => [workflow.stateChange, workflow.verify, ...workflow.failureModes]);
  assert.equal(new Set(lines).size, lines.length, "a guide repeats a line from another guide");
});

test("each guide names the FHIR R4 resources for its operation", () => {
  const expected = {
    "scheduling-writeback": "Appointment",
    "patient-demographics": "Patient",
    "documents-and-notes": "DocumentReference",
    "claims-and-charge-capture": "ChargeItem",
    "referral-intake": "ServiceRequest",
    "work-queue-status": "Task",
  };
  assert.deepEqual(workflows.map((workflow) => workflow.slug).sort(), Object.keys(expected).sort());
  for (const workflow of workflows) {
    assert.ok(
      workflow.resources.some((resource) => resource.name === expected[workflow.slug]),
      `${workflow.slug} should name ${expected[workflow.slug]}`,
    );
  }
  assert.equal(data.fhirResourceUrl("DocumentReference"), "https://hl7.org/fhir/R4/documentreference.html");
});

test("the workflow page renders the guide's own fields", async () => {
  const page = await readFile(new URL("../app/workflows/[slug]/page.tsx", import.meta.url), "utf8");

  assert.match(page, /\{workflow\.stateChange\}/);
  assert.match(page, /\{workflow\.verify\}/);
  assert.match(page, /workflow\.resources\.map/);
  assert.match(page, /workflow\.failureModes\.map/);
  assert.match(page, /fhirResourceUrl\(resource\.name\)/);
});

test("workflow guides avoid banned words and never promise a safe retry", async () => {
  const page = await readFile(new URL("../app/workflows/[slug]/page.tsx", import.meta.url), "utf8");
  const banned = /seamless|robust|leverage|crucial|delve|unlock|empower|cutting-edge|game-changer|transformative|\u2014/i;
  const unsafe = /safe to (re-?run|retry|try again)|nothing (was |is )?(written|changed|saved)/i;

  for (const text of [...workflows.map(guideText), page]) {
    assert.doesNotMatch(text, banned);
    assert.doesNotMatch(text, unsafe);
  }
  // A timeout after sending is uncertain: the guide must say to look before trying again.
  assert.match(guideText(data.getWorkflow("scheduling-writeback")), /Search for the appointment before you try again/);
});
