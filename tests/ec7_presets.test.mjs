import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import {
  DEMO_RESULT,
  EC7_PARTIAL_FACTOR_DEFAULTS,
  EC7_PRESET_FACTORS,
  EC7_PRESETS_VERSION,
  EXAMPLE_PRESETS,
  SAMPLE_PROJECT,
  applyQuickEditorPatch,
  buildAnalysisPayload,
  buildDesignSummary,
  buildEc7VerificationHtml,
  buildQuickEditorHtml,
  buildReportHtml,
  buildResultHtml,
  normalizeProject,
  readableWarningMessage,
  reconcileQuickEditorEventPatch,
  resetEc7PartialFactors,
  runAnalysis,
} from "../app.js";

const STORED_RESULT = JSON.parse(await readFile(new URL("./fixtures/ec7_sample_result.json", import.meta.url), "utf8"));

// exact value/field pins for EC7_PRESETS_VERSION, including read-only fields.
// Column order is independent of the implementation's object order.
const columns = [
  "permanent_unfavourable", "permanent_favourable", "variable_unfavourable", "variable_favourable",
  "tan_phi", "cohesion", "subgrade_modulus", "effect", "overdig_fraction", "overdig_max_m",
];
const guidelineColumns = [...columns, "soil_unit_weight", "undrained_shear_strength", "wall_friction_rule"];
const expected = {
  be_rk1: {
    set1: Object.fromEntries(guidelineColumns.map((key, index) => [key, [1, 1, 1.1, 0, 1, 1, 1, 1.2, 0, 0, 1, 1, "tan_factor"][index]])),
    set2: Object.fromEntries([...guidelineColumns, "overdig_dry_m"].map((key, index) => [key, [1, 1, 1.1, 0, 1.1, 1.1, 1, 1, 0.1, 0.5, 1, 1.25, "tan_factor", 0.3][index]])),
  },
  be_rk2: {
    set1: Object.fromEntries(guidelineColumns.map((key, index) => [key, [1, 1, 1.1, 0, 1, 1, 1, 1.35, 0, 0, 1, 1, "tan_factor"][index]])),
    set2: Object.fromEntries([...guidelineColumns, "overdig_dry_m"].map((key, index) => [key, [1, 1, 1.1, 0, 1.25, 1.25, 1, 1, 0.1, 0.5, 1, 1.4, "tan_factor", 0.3][index]])),
  },
  be_rk3: {
    set1: Object.fromEntries(guidelineColumns.map((key, index) => [key, [1, 1, 1.2, 0, 1, 1, 1, 1.5, 0, 0, 1, 1, "tan_factor"][index]])),
    set2: Object.fromEntries([...guidelineColumns, "overdig_dry_m"].map((key, index) => [key, [1, 1, 1.2, 0, 1.4, 1.4, 1, 1, 0.1, 0.5, 1, 1.55, "tan_factor", 0.3][index]])),
  },
  r1n8_dsheet: {
    set1: Object.fromEntries(columns.map((key, index) => [key, [1, 1, 1.2, 0, 1, 1, 1, 1.5, 0.1, 0.5][index]])),
    set2: Object.fromEntries(columns.map((key, index) => [key, [1, 1, 1.1, 0, 1.25, 1.25, 1, 1, 0.1, 0.5][index]])),
  },
};

test("risk class: pins every mirrored factor, field and preset version", () => {
  assert.equal(EC7_PRESETS_VERSION, "ec7-be-presets-2026-10-24-a");
  assert.deepEqual(EC7_PRESET_FACTORS, expected);
  assert.deepEqual(EC7_PARTIAL_FACTOR_DEFAULTS, expected.r1n8_dsheet);
});

for (const ec7_preset of Object.keys(expected)) {
  test(`risk class: ${ec7_preset} selects its factors, resets and sends only edited public fields`, async () => {
    const project = { ...structuredClone(SAMPLE_PROJECT), design_mode: "ec7", ec7_preset };
    const html = buildQuickEditorHtml(project);
    for (const set of ["set1", "set2"]) {
      for (const field of columns) {
        const value = expected[ec7_preset][set][field] * (field === "overdig_fraction" ? 100 : 1);
        assert.match(html, new RegExp(`data-qe-ec7-factor="${set}\\.${field}"[^>]*value="${value}"`));
      }
    }
    assert.equal(buildAnalysisPayload(project).ec7_preset, ec7_preset);
    assert.equal("ec7_partial_factors" in buildAnalysisPayload(project), false);
    const fullDefaults = { ...project, ec7_partial_factors: structuredClone(expected[ec7_preset]) };
    assert.equal("ec7_partial_factors" in buildAnalysisPayload(fullDefaults), false);
    const edited = applyQuickEditorPatch(fullDefaults, 0, { ec7_partial_factors: { set1: { effect: 1.8 } } });
    let sent;
    await runAnalysis(edited, async (_url, options) => {
      sent = JSON.parse(options.body);
      return { ok: true, json: async () => ({ phases: [] }) };
    });
    assert.equal(sent.ec7_preset, ec7_preset);
    assert.deepEqual(sent.ec7_partial_factors, { set1: { effect: 1.8 } });
    const reverted = applyQuickEditorPatch(edited, 0, { ec7_partial_factors: { set1: { effect: expected[ec7_preset].set1.effect } } });
    assert.equal("ec7_partial_factors" in buildAnalysisPayload(reverted), false);
    const reset = resetEc7PartialFactors(edited);
    assert.equal(reset.ec7_preset, ec7_preset);
    assert.deepEqual(reset.ec7_partial_factors, expected[ec7_preset]);
    assert.equal("ec7_partial_factors" in buildAnalysisPayload(reset), false);
    assert.deepEqual(project.ec7_partial_factors, undefined);
    const twoEdits = applyQuickEditorPatch(edited, 0, { ec7_partial_factors: { set2: { tan_phi: 1.6 } } });
    assert.deepEqual(buildAnalysisPayload(twoEdits).ec7_partial_factors, { set1: { effect: 1.8 }, set2: { tan_phi: 1.6 } });
  });
}

test("risk class: older imported projects retain R1N8 and preserve their edited factors", () => {
  const imported = JSON.parse(JSON.stringify(SAMPLE_PROJECT));
  delete imported.ec7_preset;
  imported.design_mode = "ec7";
  assert.equal(normalizeProject(imported).ec7_preset, "r1n8_dsheet");
  assert.equal(imported.ec7_preset, undefined);
  assert.equal(buildAnalysisPayload(imported).ec7_preset, "r1n8_dsheet");
  assert.equal("ec7_partial_factors" in buildAnalysisPayload(imported), false);
  assert.match(buildQuickEditorHtml(imported), /value="r1n8_dsheet" selected/);
  imported.ec7_partial_factors = structuredClone(expected.r1n8_dsheet);
  imported.ec7_partial_factors.set2.cohesion = 1.3;
  const roundTrip = normalizeProject(JSON.parse(JSON.stringify(applyQuickEditorPatch(imported, 0, { phase_name: "Imported stage" }))));
  assert.equal(roundTrip.ec7_preset, "r1n8_dsheet");
  assert.deepEqual(buildAnalysisPayload(roundTrip).ec7_partial_factors, { set2: { cohesion: 1.3 } });
  assert.equal(applyQuickEditorPatch({ ...imported, design_mode: "classic" }, 0, { design_mode: "ec7" }).ec7_preset, "r1n8_dsheet");
});

test("risk class: new projects and every EC7 example explicitly select RK2", () => {
  assert.equal(SAMPLE_PROJECT.ec7_preset, "be_rk2");
  for (const { project } of EXAMPLE_PRESETS) {
    assert.equal(project.ec7_preset, "be_rk2");
    assert.equal(buildAnalysisPayload(project).ec7_preset, "be_rk2");
    assert.equal("ec7_partial_factors" in buildAnalysisPayload(project), false);
  }
});

test("risk class: EC7 selectors are next to Design mode and a preset change discards the previous form factors", () => {
  const project = { ...structuredClone(SAMPLE_PROJECT), design_mode: "ec7" };
  const html = buildQuickEditorHtml(project);
  assert.match(html, /data-qe-design-mode[\s\S]*?Risk class \(EC7-BE guideline 2022\)[\s\S]*?data-qe-ec7-preset[\s\S]*?Excavation condition/);
  for (const label of ["RK1 (lighter, inferred)", "RK2 (default)", "RK3 (stricter, inferred)", "R1N8 (D-Sheet office values)"]) {
    assert.ok(html.includes(label));
  }
  assert.match(html, /value="be_rk2" selected/);
  assert.match(html, /value="" selected>not stated/);
  assert.match(html, /Undrained shear strength/);
  assert.match(html, /Dry excavation overdig/);
  assert.match(html, /Factor on tan δ/);
  assert.doesNotMatch(html, /data-qe-ec7-factor="(?:set1|set2)\.(?:soil_unit_weight|undrained_shear_strength|overdig_dry_m|wall_friction_rule)"/);
  assert.doesNotMatch(buildQuickEditorHtml(SAMPLE_PROJECT), /data-qe-ec7-preset|data-qe-ec7-excavation-condition/);
  const edited = applyQuickEditorPatch(project, 0, { ec7_partial_factors: { set1: { effect: 1.8 } } });
  const patch = reconcileQuickEditorEventPatch("ec7_preset", {
    ec7_preset: "be_rk3", ec7_partial_factors: structuredClone(expected.be_rk2),
  });
  const changed = applyQuickEditorPatch(edited, 0, patch);
  assert.equal(changed.ec7_preset, "be_rk3");
  assert.equal("ec7_partial_factors" in buildAnalysisPayload(changed), false);
  assert.match(buildQuickEditorHtml(changed), /data-qe-ec7-factor="set1.effect"[^>]*value="1.5"/);
  const unchanged = applyQuickEditorPatch(edited, 0, { ec7_preset: "be_rk2", phase_name: "Renamed" });
  assert.deepEqual(buildAnalysisPayload(unchanged).ec7_partial_factors, { set1: { effect: 1.8 } });
});

test("risk class: excavation condition is optional, round trips dry/wet and preserves phase conditions", () => {
  let project = { ...structuredClone(SAMPLE_PROJECT), design_mode: "ec7" };
  assert.equal("ec7_excavation_condition" in buildAnalysisPayload(project), false);
  for (const condition of ["dry", "wet"]) {
    project = applyQuickEditorPatch(project, 0, { ec7_excavation_condition: condition });
    assert.equal(buildAnalysisPayload(project).ec7_excavation_condition, condition);
    assert.match(buildQuickEditorHtml(project), new RegExp(`value="${condition}" selected>${condition}`));
  }
  project.phases[1].excavation_condition = "dry";
  const imported = normalizeProject(JSON.parse(JSON.stringify(project)));
  const payload = buildAnalysisPayload(imported);
  assert.equal(payload.ec7_excavation_condition, "wet");
  assert.equal(payload.phases[1].excavation_condition, "dry");
  assert.equal("ec7_partial_factors" in payload, false);
  const cleared = applyQuickEditorPatch(imported, 0, { ec7_excavation_condition: "" });
  assert.equal("ec7_excavation_condition" in buildAnalysisPayload(cleared), false);
  const classic = buildAnalysisPayload({ ...project, design_mode: "classic" });
  assert.equal("ec7_preset" in classic, false);
  assert.equal("ec7_excavation_condition" in classic, false);
  assert.equal("excavation_condition" in classic.phases[1], false);
});

test("risk class: public payloads exclude preset-only overrides, including imported factor objects", () => {
  const project = {
    ...structuredClone(SAMPLE_PROJECT), design_mode: "ec7", ec7_preset: "be_rk1",
    ec7_partial_factors: {
      set1: { soil_unit_weight: 2, wall_friction_rule: "ratio_to_phi", effect: 1.4 },
      set2: { undrained_shear_strength: 2, overdig_dry_m: 0.9 },
    },
  };
  assert.deepEqual(buildAnalysisPayload(project).ec7_partial_factors, { set1: { effect: 1.4 } });
  assert.doesNotMatch(buildQuickEditorHtml(project), />0.9<|>ratio_to_phi</);
});

test("risk class: result and report use the API preset label, basis and inferred fields independently of the editor", () => {
  const result = structuredClone(STORED_RESULT);
  result.ec7_verification.preset = {
    id: "be_rk3", label: "EC7-BE guideline 2022, risk class RK3", basis: "inferred",
    inferred_fields: ["set1.variable_unfavourable", "set1.effect"],
  };
  result.ec7_verification.partial_factors = structuredClone(expected.be_rk3);
  result.warnings = ["EC7_PRESET_INFERRED_FACTORS", "EC7_OVERDIG_CONDITION_NOT_STATED"];
  for (const html of [buildResultHtml(result, 0), buildReportHtml(SAMPLE_PROJECT, result, 0)]) {
    assert.match(html, /Risk class used: <strong>EC7-BE guideline 2022, risk class RK3/);
    assert.match(html, /Basis: Includes inferred factors/);
    assert.match(html, /Inferred fields: Set 1: variable unfavourable; Set 1: effect/);
    assert.match(html, /The selected risk class includes inferred factors/);
    assert.match(html, /The excavation condition was not stated/);
    assert.doesNotMatch(html, /EC7_PRESET_INFERRED_FACTORS|EC7_OVERDIG_CONDITION_NOT_STATED/);
  }
  const summary = buildDesignSummary(SAMPLE_PROJECT, result);
  assert.match(summary.ec7.detail, /risk class RK3: preset partial factors/);
  assert.doesNotMatch(summary.ec7.detail, /R1N8|RK2/);
  result.ec7_verification.preset = { label: "EC7-BE guideline 2022, risk class RK2 (public default)", basis: "cited", inferred_fields: [] };
  assert.match(buildEc7VerificationHtml(result), /Basis: Cited in the EC7-BE guideline 2022\. Inferred fields: none/);
  assert.doesNotMatch(buildEc7VerificationHtml(result), /public default/);
  result.ec7_verification.preset = { label: "R1N8 (D-Sheet office values)", basis: "project_files", inferred_fields: [] };
  assert.match(buildEc7VerificationHtml(result), /Basis: D-Sheet office files/);
  result.ec7_verification.preset.label = "<script>example</script>";
  assert.doesNotMatch(buildEc7VerificationHtml(result), /<script>example<\/script>/);
});

test("risk class: stored results identify R1N8 and warning codes with suffixes stay readable", () => {
  assert.match(buildEc7VerificationHtml(STORED_RESULT), /R1N8 \(D-Sheet office values\) \(stored result; preset metadata unavailable\)/);
  // The embedded demo is a stored classic analysis and has no EC7 factors to label.
  assert.equal(DEMO_RESULT.normalized_input.design_mode, "classic");
  assert.equal(DEMO_RESULT.ec7_verification, undefined);
  for (const code of ["EC7_PRESET_INFERRED_FACTORS", "EC7_OVERDIG_CONDITION_NOT_STATED"]) {
    assert.equal(readableWarningMessage(`${code}:be_rk3`), readableWarningMessage(code));
    assert.doesNotMatch(readableWarningMessage(code), /EC7_/);
  }
});
