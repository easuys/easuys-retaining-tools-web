// Regenerate the `?demo=1` result embedded in app.ts from the retaining API
// engine (sibling checkout ../easuys-retaining-tools-api, built with
// `npm run build`). The demo is labelled "not a calculation" in the UI, but it
// must still show what the verified engine returns for SAMPLE_PROJECT.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiRoot = process.env.RETAINING_API_ROOT ?? path.resolve(repoRoot, "..", "easuys-retaining-tools-api");
const { calculateFlexibleWallAnalysis } = await import(pathToFileURL(path.join(apiRoot, "dist", "calculators.js")).href);
const { SAMPLE_PROJECT } = await import(pathToFileURL(path.join(repoRoot, "app.js")).href);

const result = calculateFlexibleWallAnalysis(structuredClone(SAMPLE_PROJECT));
const compact = JSON.parse(JSON.stringify(result, (key, value) =>
  typeof value === "number" && !Number.isInteger(value) ? Number(value.toPrecision(6)) : value
));
const appPath = path.join(repoRoot, "app.ts");
const source = await readFile(appPath, "utf8");
const begin = "// BEGIN GENERATED DEMO_RESULT";
const end = "// END GENERATED DEMO_RESULT";
const block = `${begin} (scripts/build_demo_result.mjs, engine formula ${result.formula_version})\nexport const DEMO_RESULT: any = ${JSON.stringify(compact)};\n${end}`;
const start = source.indexOf(begin);
const stop = source.indexOf(end);
if (start < 0 || stop < 0) throw new Error("DEMO_RESULT markers not found in app.ts");
await writeFile(appPath, source.slice(0, start) + block + source.slice(stop + end.length));
console.log("DEMO_RESULT regenerated:", result.formula_version, result.phases.map((p) => p.envelope.max_abs_moment_kNm_per_m.toFixed(1)));
