// Regenerate tests/fixtures/example_presets_results.json: the EXAMPLE_PRESETS
// of app.ts, posted exactly as the browser posts them (formatJson, JSON.parse,
// buildAnalysisPayload, JSON.stringify) to the retaining API, trimmed to the
// fields the design summary card reads. Three POST requests to
// RETAINING_API_BASE_URL (default: the production Worker). With
// EXAMPLE_PAIRS_DIR set, the script reads <id>.pair.json files of an earlier
// run ({ request_sha256, response }) instead of calling the API.
// Run `npm run build` first and review the diff before committing.
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = await import(pathToFileURL(path.join(repoRoot, "app.js")).href);
const apiBaseUrl = process.env.RETAINING_API_BASE_URL ?? app.API_BASE_URL;
const pairsDir = process.env.EXAMPLE_PAIRS_DIR;

const round = (value) => (typeof value === "number" && !Number.isInteger(value) ? Number(value.toPrecision(6)) : value);
const trimPhase = (phase) => ({
  name: phase?.name,
  phase_index: phase?.phase_index,
  converged: phase?.converged,
  iterations: phase?.iterations,
  support_reactions: phase?.support_reactions ?? [],
  envelope: phase?.envelope,
});
const trimResult = (result) => JSON.parse(JSON.stringify({
  calculator_id: result.calculator_id,
  formula_version: result.formula_version,
  earth_pressure_method: result.earth_pressure_method,
  normalized_input: result.normalized_input,
  phases: (result.phases ?? []).map(trimPhase),
  governing: result.governing,
  design_checks: result.design_checks,
  warnings: result.warnings,
  ec7_verification: result.ec7_verification
    ? {
        partial_factors: result.ec7_verification.partial_factors,
        sets: (result.ec7_verification.sets ?? []).map((set) => ({
          set: set.set,
          converged: set.converged,
          governing: set.governing,
          phases: (set.phases ?? []).map((phase) => ({ name: phase.name, converged: phase.converged })),
        })),
      }
    : undefined,
}), (key, value) => round(value));

const presets = {};
for (const preset of app.EXAMPLE_PRESETS) {
  const body = JSON.stringify(app.buildAnalysisPayload(JSON.parse(app.formatJson(structuredClone(preset.project)))));
  const requestSha256 = createHash("sha256").update(body).digest("hex");
  let response;
  let source;
  if (pairsDir) {
    const pair = JSON.parse(await readFile(path.join(pairsDir, `${preset.id}.pair.json`), "utf8"));
    if (pair.request_sha256 !== requestSha256) {
      throw new Error(`${preset.id}: cached request ${pair.request_sha256} does not match the current preset ${requestSha256}`);
    }
    response = pair.response;
    source = `cached run of ${pair.fetched_at}`;
  } else {
    const reply = await fetch(`${apiBaseUrl}${app.ANALYSIS_ROUTE}`, { method: "POST", headers: { "content-type": "application/json" }, body });
    response = await reply.json();
    if (!reply.ok) throw new Error(`${preset.id}: HTTP ${reply.status} ${JSON.stringify(response)}`);
    source = `${apiBaseUrl} ${new Date().toISOString()}`;
  }
  presets[preset.id] = { request_sha256: requestSha256, source, result: trimResult(response) };
  console.log(preset.id, response.formula_version, `overall_pass=${response.design_checks?.overall_pass}`, response.warnings);
}
const fixturePath = path.join(repoRoot, "tests", "fixtures", "example_presets_results.json");
await writeFile(fixturePath, `${JSON.stringify({ note: "Trimmed retaining API results for EXAMPLE_PRESETS; regenerate with scripts/build_example_presets_fixture.mjs.", presets }, null, 1)}\n`);
console.log("Example preset fixture written:", fixturePath);
