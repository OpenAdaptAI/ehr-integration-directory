import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

// Next.js 16.3.8 is the first release outside every range npm audit reported
// for 16.2.6, including the critical Image Optimization and next/og RCEs.
const MIN_NEXT = "16.3.8";

const atLeast = (version, minimum) => {
  const have = version.split(".").map(Number);
  const want = minimum.split(".").map(Number);
  for (let i = 0; i < want.length; i += 1) {
    if (have[i] !== want[i]) return have[i] > want[i];
  }
  return true;
};

test("locks a Next.js release with the published security fixes", async () => {
  const [pkg, lock] = await Promise.all([
    read("package.json").then(JSON.parse),
    read("package-lock.json").then(JSON.parse),
  ]);
  const next = lock.packages["node_modules/next"].version;

  assert.ok(atLeast(next, MIN_NEXT), `next ${next} is older than ${MIN_NEXT}`);
  assert.equal(pkg.dependencies.next, next);
  assert.equal(pkg.devDependencies["eslint-config-next"], next);
  assert.equal(lock.packages["node_modules/eslint-config-next"].version, next);
});

test("CI fails on high or critical advisories in production dependencies", async () => {
  const ci = await read(".github/workflows/ci.yml");
  const steps = ci.split("\n").map((line) => line.trim());
  const install = steps.indexOf("- run: npm ci");
  const audit = steps.indexOf("- run: npm audit --omit=dev --audit-level=high");

  assert.ok(install >= 0, "CI no longer runs npm ci");
  assert.ok(audit > install, "CI must run npm audit after npm ci");
  assert.doesNotMatch(ci, /continue-on-error:\s*true/, "CI must stop on a failed audit");
});

test("Dependabot proposes npm updates and groups Next.js packages", async () => {
  const config = await read(".github/dependabot.yml");

  assert.match(config, /package-ecosystem: npm\n/);
  assert.match(config, /- next\n/);
  assert.match(config, /- eslint-config-next\n/);
});

test("workflows pin every remote action to a full commit SHA", async () => {
  const dir = new URL("../.github/workflows/", import.meta.url);
  const files = (await readdir(dir)).filter((name) => /\.ya?ml$/.test(name));
  const unpinned = [];

  assert.ok(files.length > 0, "no workflow files found");
  for (const file of files) {
    const lines = (await readFile(new URL(file, dir), "utf8")).split("\n");
    lines.forEach((line, index) => {
      const ref = line.match(/^\s*(?:-\s+)?uses:\s*["']?([^\s"'#]+)/)?.[1];
      if (!ref || ref.startsWith("./")) return;
      const pinned = ref.startsWith("docker://")
        ? /@sha256:[0-9a-f]{64}$/.test(ref)
        : /@[0-9a-f]{40}$/.test(ref);
      if (!pinned) unpinned.push(`${file}:${index + 1} ${ref}`);
    });
  }

  assert.deepEqual(unpinned, [], "pin these actions to a commit SHA");
});

test("Dependabot proposes updates to pinned GitHub Actions", async () => {
  const config = await read(".github/dependabot.yml");

  assert.match(config, /package-ecosystem: github-actions\n/);
});
