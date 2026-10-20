import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import {
  EXAMPLE_PRESETS,
  STEEL_SHEET_PILE_LIBRARY,
  STUDY_REQUEST_EMAIL,
  VALIDATION_PAGE_URL,
  buildAnalysisPayload,
  buildDesignSummary,
  buildDesignSummaryHtml,
  buildExamplePresetsHtml,
  buildGeometryPreviewSvg,
  buildReportHtml,
  buildStudyRequestMailto,
  examplePresetById,
  formatJson,
  governingPhaseIndex,
  printReportDocument,
  withSubscripts,
} from "../app.js";

const FIXTURE = JSON.parse(
  await readFile(new URL("./fixtures/example_presets_results.json", import.meta.url), "utf8")
);
const EC7_SAMPLE_RESULT = JSON.parse(
  await readFile(new URL("./fixtures/ec7_sample_result.json", import.meta.url), "utf8")
);
const INTERNAL_OR_PRIVATE_FIELDS = [
  "earth_pressure_method",
  "surface_profile_left_m",
  "surface_profile_right_m",
  "strip_surcharges_left",
  "strip_surcharges_right",
  "initial_state",
  "dsheet_left_envelope_samples",
  "dsheet_right_envelope_samples",
  "phase_result_seed_samples",
  "phase_result_seed_support_reactions",
];

const browserRequestBody = (preset) =>
  JSON.stringify(buildAnalysisPayload(JSON.parse(formatJson(structuredClone(preset.project)))));

test("three one-click examples cover a cantilever, an anchored sheet pile and a propped diaphragm wall", () => {
  assert.deepEqual(EXAMPLE_PRESETS.map((preset) => preset.id), [
    "cantilever-sand",
    "anchored-sheet-pile",
    "propped-diaphragm-wall",
  ]);
  const [cantilever, anchored, propped] = EXAMPLE_PRESETS;
  assert.equal(cantilever.project.supports.length, 0);
  assert.equal(cantilever.project.wall_type, "steel_sheet_pile");
  assert.deepEqual(anchored.project.supports.map((support) => support.type), ["anchor"]);
  assert.equal(anchored.project.wall_type, "steel_sheet_pile");
  assert.deepEqual(propped.project.supports.map((support) => support.type), ["strut", "strut"]);
  assert.equal(propped.project.wall_type, "diaphragm_wall");
  assert.equal(examplePresetById("anchored-sheet-pile"), anchored);
  assert.equal(examplePresetById("culmann"), undefined);
});

test("examples use public API features only and never the on-request methods", () => {
  for (const preset of EXAMPLE_PRESETS) {
    const body = browserRequestBody(preset);
    const payload = JSON.parse(body);
    assert.doesNotMatch(body.toLowerCase(), /culmann|strip_surcharge|surface_profile|dsheet_|seed_/, preset.id);
    const keys = new Set();
    JSON.stringify(payload, (key, value) => {
      keys.add(key);
      return value;
    });
    for (const field of INTERNAL_OR_PRIVATE_FIELDS) {
      assert.equal(keys.has(field), false, `${preset.id} sends ${field}`);
    }
    assert.equal(payload.design_mode, "ec7");
    assert.ok(payload.design_options.max_wall_displacement_mm > 0);
    assert.equal(payload.design_options.target_element_length_m, 0.25);
    for (const phase of payload.phases) {
      assert.equal(phase.surface_level_left_m, undefined);
      assert.equal(phase.surface_level_right_m, undefined);
      assert.ok(phase.excavation_level_left_m <= payload.wall_geometry.top_level_m);
      assert.ok(phase.excavation_level_left_m > payload.wall_geometry.toe_level_m);
      assert.ok(phase.groundwater_level_left_m <= phase.excavation_level_left_m);
      assert.ok(phase.groundwater_level_right_m <= phase.excavation_level_right_m);
    }
    for (const support of payload.supports) {
      assert.ok(support.capacity_kN_per_m > 0, `${preset.id} ${support.id} capacity`);
      assert.ok(support.stiffness_kN_per_m > 0, `${preset.id} ${support.id} stiffness`);
      // The API side is the direction of the support force: towards the retained (right) side.
      assert.equal(support.side, "right", `${preset.id} ${support.id} side`);
    }
    for (const segment of payload.wall_geometry.segments) {
      if (payload.wall_type === "steel_sheet_pile") {
        const section = STEEL_SHEET_PILE_LIBRARY[segment.steel_section.library_section_id];
        assert.ok(section, `${preset.id} library section`);
        assert.equal(segment.ei_kNm2_per_m, Math.round(section.ei_kNm2_per_m));
      } else {
        assert.equal(segment.steel_section, undefined);
        assert.ok(segment.moment_resistance_kNm_per_m > 0);
        assert.ok(segment.shear_resistance_kN_per_m > 0);
      }
    }
  }
});

test("the example fixture matches the request the browser sends for each preset", () => {
  for (const preset of EXAMPLE_PRESETS) {
    const entry = FIXTURE.presets[preset.id];
    assert.ok(entry, `fixture for ${preset.id}`);
    const sha = createHash("sha256").update(browserRequestBody(preset)).digest("hex");
    assert.equal(entry.request_sha256, sha, `${preset.id} changed: rerun scripts/build_example_presets_fixture.mjs`);
    assert.equal(entry.result.earth_pressure_method, "coulomb");
  }
});

test("design summary reports governing values, EC7 set and pass state for the examples", () => {
  const anchored = buildDesignSummary(
    EXAMPLE_PRESETS[1].project,
    FIXTURE.presets["anchored-sheet-pile"].result,
    EXAMPLE_PRESETS[1].title
  );
  assert.equal(anchored.overall, "pass");
  assert.equal(anchored.overallText, "All assessed checks pass");
  assert.equal(anchored.wallLabel, "AZ 26-700 · fy 355 MPa");
  assert.equal(anchored.ec7.label, "EC7-BE, design approach 1, sets 1 and 2");
  assert.match(anchored.ec7.detail, /Default EC7-BE partial factors; overdig 10 % of H, at most 0\.5 m; bending governed by set 2, shear by set 1/);
  const figures = Object.fromEntries(anchored.figures.map((figure) => [figure.id, figure]));
  assert.equal(figures.moment.value, "510 kNm/m");
  assert.match(figures.moment.detail, /^EC7 set 2 · at -6\.3 m$/);
  assert.equal(figures.shear.value, "189 kN/m");
  assert.equal(figures.displacement.value, "14.8 mm");
  assert.equal(figures.support.label, "Anchor force (design)");
  assert.equal(figures.support.value, "254 kN/m");
  assert.match(figures.support.detail, /A1 · axial · EC7 set 1 · characteristic 136 kN\/m/);
  assert.equal(figures.utilisation.label, "Profile utilisation");
  assert.equal(figures.utilisation.value, "0.52");
  assert.deepEqual(anchored.checks.map((check) => [check.id, check.status]), [
    ["wall-bending", "pass"],
    ["wall-shear", "pass"],
    ["support-A1", "pass"],
    ["displacement", "pass"],
    ["equilibrium", "pass"],
  ]);
  const anchorCheck = anchored.checks.find((check) => check.id === "support-A1");
  assert.equal(anchorCheck.demand, "254.1 kN/m");
  assert.equal(anchorCheck.capacity, "400.0 kN/m");

  const cantilever = buildDesignSummary(EXAMPLE_PRESETS[0].project, FIXTURE.presets["cantilever-sand"].result, EXAMPLE_PRESETS[0].title);
  assert.equal(cantilever.overall, "pass");
  assert.equal(cantilever.figures.find((figure) => figure.id === "support").value, "None");

  const propped = buildDesignSummary(EXAMPLE_PRESETS[2].project, FIXTURE.presets["propped-diaphragm-wall"].result, EXAMPLE_PRESETS[2].title);
  assert.equal(propped.overall, "pass");
  assert.equal(propped.figures.find((figure) => figure.id === "support").label, "Prop force (design)");
  assert.equal(propped.figures.find((figure) => figure.id === "utilisation").label, "Section utilisation");
  assert.deepEqual(propped.checks.filter((check) => check.id.startsWith("support-")).map((check) => check.label), ["Prop P1", "Prop P2"]);
  assert.equal(propped.checks[0].basis, "Entered design moment resistance");
});

test("design summary fails the equilibrium check when an EC7 set has no equilibrium", () => {
  const summary = buildDesignSummary(EXAMPLE_PRESETS[0].project, EC7_SAMPLE_RESULT);
  const equilibrium = summary.checks.find((check) => check.id === "equilibrium");
  assert.equal(equilibrium.status, "fail");
  assert.match(equilibrium.note, /EC7 set 2: Excavate left side to -4\.0 m/);
  assert.equal(summary.overall, "fail");
  assert.equal(summary.overallText, "One or more checks fail");
  assert.match(buildDesignSummaryHtml(summary), /class="status-chip status-fail">✗ Fail/);
});

test("design summary card links the validation page and the study request", () => {
  const summary = buildDesignSummary(EXAMPLE_PRESETS[1].project, FIXTURE.presets["anchored-sheet-pile"].result, EXAMPLE_PRESETS[1].title);
  const html = buildDesignSummaryHtml(summary);
  assert.match(html, /href="validation\.html" data-validation-link/);
  assert.match(html, /data-study-mailto href="mailto:info@easuys\.be\?subject=Retaining%20wall%20study%20-%20request%20for%20a%20fixed-price%20offer%20\(Anchored%20sheet%20pile/);
  assert.match(html, /Request a study · fixed-price offer/);
  assert.match(html, /Sloping ground and strip loads \(for example a crane platform or a neighbouring foundation\) are available on request\./);
  assert.match(html, /M<sub>Rd<\/sub> = W<sub>pl<\/sub> f<sub>y<\/sub> \/ γ<sub>M0<\/sub>/);
  assert.doesNotMatch(html, /culmann|aster|salome/i);

  const reportCard = buildDesignSummaryHtml(summary, { forReport: true });
  assert.match(reportCard, new RegExp(`href="${VALIDATION_PAGE_URL.replaceAll(".", "\\.")}"`));
  assert.doesNotMatch(reportCard, /data-study-mailto/);
  assert.match(reportCard, /Request a study or a fixed-price offer: info@easuys\.be/);
});

test("study request mailto carries the subject and the screening values", () => {
  assert.equal(STUDY_REQUEST_EMAIL, "info@easuys.be");
  const plain = buildStudyRequestMailto();
  assert.match(plain, /^mailto:info@easuys\.be\?subject=Retaining%20wall%20study%20-%20request%20for%20a%20fixed-price%20offer&body=/);
  const body = decodeURIComponent(plain.split("&body=")[1]);
  assert.match(body, /Soil investigation \(CPT \/ borehole\) available: yes \/ no/);

  const summary = buildDesignSummary(EXAMPLE_PRESETS[2].project, FIXTURE.presets["propped-diaphragm-wall"].result, EXAMPLE_PRESETS[2].title);
  const withResult = decodeURIComponent(buildStudyRequestMailto(summary).split("&body=")[1]);
  assert.match(withResult, /Screening result from the workspace \(Propped diaphragm wall, not a design\):/);
  assert.match(withResult, /- Prop force \(design\): 243 kN\/m/);
  assert.ok(buildStudyRequestMailto(summary).length < 2000);
});

test("examples render as cards with one run button each and a final-stage sketch", () => {
  const html = buildExamplePresetsHtml("anchored-sheet-pile");
  assert.equal((html.match(/data-example-preset="/g) ?? []).length, 3);
  assert.equal((html.match(/<svg class="example-thumb"/g) ?? []).length, 3);
  assert.match(html, /class="example-card is-active" data-example-card="anchored-sheet-pile"/);
  assert.match(html, />Run again</);
  assert.match(html, />Run this example</);
  assert.doesNotMatch(html, /culmann/i);
});

test("props are drawn in the excavation, on the side opposite their force direction", () => {
  const preset = examplePresetById("propped-diaphragm-wall");
  const svg = buildGeometryPreviewSvg(preset.project, preset.project.phases.length - 1);
  assert.match(svg, /text-anchor="end">P1 prop</);
  assert.match(svg, /text-anchor="end">P2 prop</);
  const anchored = examplePresetById("anchored-sheet-pile");
  assert.match(buildGeometryPreviewSvg(anchored.project, 3), /text-anchor="start">A1 anchor</);
});

test("printable report starts with the design summary and carries print CSS", () => {
  const preset = examplePresetById("cantilever-sand");
  const result = FIXTURE.presets[preset.id].result;
  const report = buildReportHtml(preset.project, result, governingPhaseIndex(result, preset.project.phases.length), new Date("2026-10-20T14:00:00Z"), "characteristic", preset.title);
  assert.match(report, /<title>EA Suys Retaining Wall Report · Cantilever sheet pile in sand<\/title>/);
  assert.match(report, /@page \{ size: A4;/);
  assert.match(report, /@media print/);
  assert.ok(report.indexOf("1. Design summary") < report.indexOf("2. Input"));
  assert.ok(report.indexOf("2. Input") < report.indexOf("3. Figures"));
  assert.ok(report.indexOf("3. Figures") < report.indexOf("Appendix A. Result lines"));
  assert.match(report, /<h3>Construction stages<\/h3>/);
  assert.match(report, /No anchors or props \(cantilever wall\)\./);
  assert.match(report, /Validation: https:\/\/retaining\.easuys\.com\/validation\.html/);
  assert.match(report, /20\/10\/2026/);
  assert.doesNotMatch(report, /culmann|aster|salome/i);
});

test("print button prints the report from a hidden frame instead of a noopener window", () => {
  const listeners = {};
  const calls = [];
  const appended = [];
  const frame = {
    style: {},
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(type, handler) { listeners[type] = handler; },
    remove() { calls.push("remove"); },
    contentWindow: {
      focus() { calls.push("focus"); },
      print() { calls.push("print"); },
      addEventListener(type) { calls.push(`listen:${type}`); },
    },
  };
  const documentRef = {
    createElement(tag) {
      assert.equal(tag, "iframe");
      return frame;
    },
    body: { appendChild(node) { appended.push(node); } },
  };
  let failed = false;
  printReportDocument("<!DOCTYPE html><p>report</p>", () => { failed = true; }, documentRef);
  assert.equal(appended[0], frame);
  assert.equal(frame.srcdoc, "<!DOCTYPE html><p>report</p>");
  assert.equal(frame.attributes["aria-hidden"], "true");
  listeners.load();
  assert.deepEqual(calls, ["listen:afterprint", "focus", "print"]);
  assert.equal(failed, false);

  const source = withSubscripts("V_Ed and A_v");
  assert.equal(source, "V<sub>Ed</sub> and A<sub>v</sub>");
});

test("workspace page has the examples band, summary slot, study request link and validation link", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../app.ts", import.meta.url), "utf8");
  assert.match(html, /<h2 id="examples-title">Start from a typical Belgian case<\/h2>/);
  assert.match(html, /data-example-presets/);
  assert.match(html, /data-design-summary aria-label="Design summary" hidden/);
  assert.match(html, /data-study-mailto href="mailto:info@easuys\.be\?subject=/);
  assert.match(html, /Sloping ground and strip loads are available on request\./);
  assert.match(html, /<a href="validation\.html">Validation<\/a>/);
  assert.doesNotMatch(app, /window\.open\(/);
});
