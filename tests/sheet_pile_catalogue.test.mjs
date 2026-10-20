import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import {
  DEMO_RESULT,
  SAMPLE_PROJECT,
  SAMPLE_RESULT,
  STEEL_SHEET_PILE_LIBRARY,
  applyQuickEditorPatch,
  buildQuickEditorHtml,
  buildReportHtml,
  buildResultDownloadText,
  buildResultHtml,
} from "../app.js";

// The web section library must hold exactly the cited catalogue rows of the
// API (same fixture as easuys-retaining-tools-api
// tests/fixtures/sheet_pile_catalogue_sources.json). Absolute tolerances are
// in the units of each quantity.
const sources = JSON.parse(
  await readFile(new URL("./fixtures/sheet_pile_catalogue_sources.json", import.meta.url), "utf8")
);
const EC7_SAMPLE_RESULT = JSON.parse(
  await readFile(new URL("./fixtures/ec7_sample_result.json", import.meta.url), "utf8")
);

function parseRow(row, columns) {
  const cells = row.split("|").map((cell) => cell.trim());
  assert.equal(cells.length, columns.length, `column count of '${row}'`);
  return Object.fromEntries(
    columns.map((column, index) => [column, index === 0 ? cells[0] : Number(cells[index].replaceAll(" ", ""))])
  );
}

function near(actual, expected, tolerance, label) {
  assert.ok(
    Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance,
    `${label}: ${actual} vs ${expected} (tolerance ${tolerance})`
  );
}

test("web section library equals the cited catalogue rows", () => {
  assert.deepEqual(
    Object.keys(STEEL_SHEET_PILE_LIBRARY).sort(),
    sources.rows.map((row) => row.id).sort()
  );
  for (const row of sources.rows) {
    const section = STEEL_SHEET_PILE_LIBRARY[row.id];
    const db = parseRow(row.database_row, sources.database_columns);
    const flyer = parseRow(row.flyer_row, sources.flyer_columns);
    assert.equal(section.section_name, db.section, row.id);
    near(section.width_mm, db.b_mm, 1e-9, `${row.id} b (mm)`);
    near(section.height_mm, db.h_mm, 1e-9, `${row.id} h (mm)`);
    near(section.flange_thickness_mm, db.tf_mm, 1e-9, `${row.id} tf (mm)`);
    near(section.web_thickness_mm, db.tw_mm, 1e-9, `${row.id} tw (mm)`);
    near(section.sectional_area_cm2_per_m, db.A_cm2_per_m, 1e-9, `${row.id} A (cm2/m)`);
    near(section.mass_single_pile_kg_per_m, db.Gsp_kg_per_m, 1e-9, `${row.id} Gsp (kg/m)`);
    near(section.mass_wall_kg_per_m2, flyer.Gw_kg_per_m2, 1e-9, `${row.id} Gw (kg/m2)`);
    near(section.moment_of_inertia_cm4_per_m, db.Iy_cm4_per_m, 1e-9, `${row.id} I (cm4/m)`);
    near(section.elastic_section_modulus_cm3_per_m, db.Wel_y_cm3_per_m, 1e-9, `${row.id} Wel (cm3/m)`);
    near(section.plastic_section_modulus_cm3_per_m, db.Wpl_y_cm3_per_m, 1e-9, `${row.id} Wpl (cm3/m)`);
    // EN 1993-5 5.2.2(4): Av = tw (h - tf) per web, one web per width b.
    near(section.shear_area_cm2_per_m, row.expected_shear_area_cm2_per_m, 0.005 + 1e-9, `${row.id} Av (cm2/m)`);
    near(section.ei_kNm2_per_m, 210e6 * db.Iy_cm4_per_m * 1e-8, 1e-6, `${row.id} EI (kNm2/m)`);
    assert.equal(section.label, section.width_mm === 630 ? `${db.section} (630 mm series)` : db.section);
  }
  // Former wrong entries: AZ 18 Wpl 1183 / Av 13.7, AZ 26 Wpl 1650, GU 22N 960.
  near(STEEL_SHEET_PILE_LIBRARY.AZ_18.plastic_section_modulus_cm3_per_m, 2104, 0, "AZ 18 Wpl (cm3/m)");
  near(STEEL_SHEET_PILE_LIBRARY.AZ_18.shear_area_cm2_per_m, 55.87, 0.005, "AZ 18 Av (cm2/m)");
  near(STEEL_SHEET_PILE_LIBRARY.AZ_26.plastic_section_modulus_cm3_per_m, 3059, 0, "AZ 26 Wpl (cm3/m)");
  assert.equal(STEEL_SHEET_PILE_LIBRARY.GU_22N, undefined);
  assert.notEqual(STEEL_SHEET_PILE_LIBRARY.AZ_18_700.label, STEEL_SHEET_PILE_LIBRARY.AZ_18.label);
});

test("quick editor: choosing a catalogue section sets EI = E I of that section", () => {
  const focus = { segmentIndex: 0 };
  const switched = applyQuickEditorPatch(SAMPLE_PROJECT, 0, { library_section_id: "AZ_18_700", segment_ei_kNm2_per_m: 71820 }, focus);
  assert.equal(switched.wall_geometry.segments[0].steel_section.library_section_id, "AZ_18_700");
  near(switched.wall_geometry.segments[0].ei_kNm2_per_m, 79380, 1e-6, "AZ 18-700 EI (kNm2/m)");

  // Same section kept: an edited EI is respected.
  const edited = applyQuickEditorPatch(switched, 0, { library_section_id: "AZ_18_700", segment_ei_kNm2_per_m: 60000 }, focus);
  assert.equal(edited.wall_geometry.segments[0].ei_kNm2_per_m, 60000);

  // Manual section: EI stays as entered.
  const manual = applyQuickEditorPatch(edited, 0, { library_section_id: "", segment_ei_kNm2_per_m: 55000 }, focus);
  assert.equal(manual.wall_geometry.segments[0].steel_section.library_section_id, undefined);
  assert.equal(manual.wall_geometry.segments[0].ei_kNm2_per_m, 55000);

  const editorHtml = buildQuickEditorHtml(SAMPLE_PROJECT, 0, focus);
  assert.match(editorHtml, /<option value="AZ_18" selected>AZ 18 \(630 mm series\)<\/option>/);
  assert.match(editorHtml, /<option value="AZ_18_700" >AZ 18-700<\/option>/);
  assert.match(editorHtml, /data-qe-library-note>AZ 18 \(630 mm series\), ArcelorMittal catalogue: Wpl 2104 cm3\/m, Wel 1800 cm3\/m, Av 55\.9 cm2\/m/);
  assert.match(editorHtml, /EI 71820 kNm2\/m/);
});

test("demo and sample results show catalogue resistances for the AZ 18 sample", () => {
  const wall = DEMO_RESULT.design_checks.wall;
  // 2104 cm3/m x 355 MPa / 1.0 and 55.869 cm2/m x 355 / sqrt(3)
  near(wall.bending_capacity_kNm_per_m, 746.92, 0.01, "demo MRd (kNm/m)");
  near(wall.shear_capacity_kN_per_m, 1145.09, 0.01, "demo VRd (kN/m)");
  near(SAMPLE_RESULT.design_checks.wall.bending_capacity_kNm_per_m, 746.92, 0.01, "sample MRd (kNm/m)");
  near(SAMPLE_RESULT.design_checks.wall.shear_capacity_kN_per_m, 1145.088, 0.001, "sample VRd (kN/m)");
  near(EC7_SAMPLE_RESULT.normalized_input.wall_geometry.segments[0].ei_kNm2_per_m, 71820, 1e-6, "EC7 sample EI (kNm2/m)");
  near(DEMO_RESULT.normalized_input.wall_geometry.segments[0].ei_kNm2_per_m, 71820, 1e-6, "demo EI (kNm2/m)");
});

const INTERNAL_PATH_PATTERNS = [
  /\/home\//i,
  /\/Users\//,
  /\/mnt\/[a-z]\//i,
  /plan\.md/i,
  /solver_notes/i,
  /Engineering-Scripts/i,
  /\.codex-scratch/i,
  /OneDrive/i,
  /\\\\[A-Za-z0-9.]+\\/,
  /\b[A-Za-z]:\\/,
  /\b[A-Za-z]:\//,
];

function assertNoInternalPaths(text, label) {
  for (const pattern of INTERNAL_PATH_PATTERNS) {
    assert.doesNotMatch(text, pattern, `${label} contains an internal path (${pattern})`);
  }
}

test("shipped results, fixtures and rendered pages contain no internal paths", async () => {
  assertNoInternalPaths(JSON.stringify(DEMO_RESULT), "DEMO_RESULT");
  assertNoInternalPaths(JSON.stringify(SAMPLE_RESULT), "SAMPLE_RESULT");
  assertNoInternalPaths(JSON.stringify(EC7_SAMPLE_RESULT), "EC7 sample fixture");
  for (const result of [DEMO_RESULT, SAMPLE_RESULT, EC7_SAMPLE_RESULT]) {
    assertNoInternalPaths(buildResultHtml(result, 2), "result html");
    assertNoInternalPaths(buildReportHtml(SAMPLE_PROJECT, result, 2), "report html");
    assertNoInternalPaths(buildResultDownloadText(SAMPLE_PROJECT, result), "result download");
  }
  for (const file of ["../index.html", "../app.js"]) {
    assertNoInternalPaths(await readFile(new URL(file, import.meta.url), "utf8"), file);
  }
  assert.throws(() => assertNoInternalPaths("see /home/user/plan.md", "probe"));
  assert.throws(() => assertNoInternalPaths("C:\\EA\\scratch", "probe"));
});
