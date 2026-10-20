// Regenerate tests/fixtures/ec7_sample_result.json: SAMPLE_PROJECT in ec7
// mode (EC7-BE default partial factors), run through the retaining API engine
// (sibling checkout ../easuys-retaining-tools-api, built with `npm run build`,
// or RETAINING_API_ROOT). Numbers are kept to 6 significant digits, as in
// scripts/build_demo_result.mjs. Review the diff before committing.
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiRoot = process.env.RETAINING_API_ROOT ?? path.resolve(repoRoot, "..", "easuys-retaining-tools-api");
const { calculateFlexibleWallAnalysis } = await import(pathToFileURL(path.join(apiRoot, "dist", "calculators.js")).href);
const { SAMPLE_PROJECT } = await import(pathToFileURL(path.join(repoRoot, "app.js")).href);

const request = structuredClone(SAMPLE_PROJECT);
request.design_mode = "ec7";
const result = calculateFlexibleWallAnalysis(request);
const compact = JSON.parse(JSON.stringify(result, (key, value) =>
  typeof value === "number" && !Number.isInteger(value) ? Number(value.toPrecision(6)) : value
));
const fixturePath = path.join(repoRoot, "tests", "fixtures", "ec7_sample_result.json");
await writeFile(fixturePath, `${JSON.stringify(compact, null, 2)}\n`);
console.log(
  "EC7 sample fixture regenerated:",
  result.formula_version,
  result.ec7_verification.sets.map((set) => `${set.set}: ${set.phases.map((phase) => (phase.converged ? "ok" : "no-eq")).join("/")}`).join(", "),
  result.warnings
);
