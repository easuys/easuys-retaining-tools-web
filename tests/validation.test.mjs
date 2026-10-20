import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const validationUrl = new URL("../validation.html", import.meta.url);

test("validation page exists and is linked from the workspace navigation", async () => {
  const html = await readFile(validationUrl, "utf8");
  const index = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.ok(html.length > 0);
  assert.match(index, /<a\s+href="validation\.html">Validation<\/a>/);
});

test("validation page contains no forbidden names", async () => {
  const html = await readFile(validationUrl, "utf8");
  const forbidden = ["aster", "salome", "code_aster", "openfoam", "plaxis", "abaqus", "ansys", "calculix"];
  const lowerHtml = html.toLowerCase();

  for (const word of forbidden) {
    assert.equal(lowerHtml.includes(word), false, `validation.html contains forbidden text: ${word}`);
  }
});

test("every relative href and src in the validation page resolves", async () => {
  const html = await readFile(validationUrl, "utf8");
  const references = [...html.matchAll(/\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi)];

  for (const [, , reference] of references) {
    if (!reference || reference.startsWith("#") || reference.startsWith("//")) continue;
    if (/^[a-z][a-z\d+.-]*:/i.test(reference)) continue;

    const targetUrl = new URL(reference, validationUrl);
    assert.equal(targetUrl.protocol, "file:", `unexpected relative URL: ${reference}`);
    await access(fileURLToPath(targetUrl));
  }
});

test("every in-page anchor of the validation page has a target id", async () => {
  const html = await readFile(validationUrl, "utf8");
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  const anchors = [...html.matchAll(/\bhref="#([^"]+)"/g)].map((match) => match[1]);

  assert.ok(anchors.length > 0);
  for (const anchor of anchors) {
    assert.ok(ids.has(anchor), `validation.html links #${anchor}, which has no target`);
  }
});

test("validation page is part of the published Pages artifact", async () => {
  const workflow = await readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8");
  const copied = [...workflow.matchAll(/^\s+cp (?!-R)(.+) page-dist\/$/gm)]
    .flatMap((match) => match[1].trim().split(/\s+/));

  assert.ok(copied.includes("validation.html"), "deploy-pages.yml must copy validation.html");
  for (const page of ["../index.html", "../validation.html"]) {
    const html = await readFile(new URL(page, import.meta.url), "utf8");
    for (const [, , reference] of html.matchAll(/\bhref\s*=\s*(["'])([^"'#?]+\.html)\1/gi)) {
      if (/^[a-z][a-z\d+.-]*:/i.test(reference)) continue;
      assert.ok(copied.includes(reference), `${page} links ${reference}, which the Pages artifact does not copy`);
    }
  }
});

test("validation page shows the larger differences with their explanation", async () => {
  const html = await readFile(validationUrl, "utf8");

  assert.doesNotMatch(html, /<!--\s*DRAFT/i);
  assert.match(html, /0\.83 \(33\.0%\)/);
  assert.match(html, /8 m: 188\.2 \/ 234\.1/);
  assert.match(html, /id="staging-title"/);
  assert.ok((html.match(/href="#staging-title"/g) ?? []).length >= 2);
  assert.equal((html.match(/class="staging-row"/g) ?? []).length, 4);
  assert.match(html, /href="mailto:info@easuys\.be\?subject=/);
});

// Owner 20/10/2026: publish only the SPW 2006 comparison (public data); the reference-manual
// tutorial comparison stays internal.
test("validation page publishes only the SPW 2006 comparison", async () => {
  const html = await readFile(validationUrl, "utf8");

  assert.match(html, /SPW 2006/);
  assert.match(html, /id="spw-title"/);
  assert.doesNotMatch(html, /D-Sheet|Deltares|tutorial|Culmann|tutorials-title/i);
});
