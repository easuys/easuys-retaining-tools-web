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
  const forbidden = ["aster", "salome", "code_aster", "openfoam", "plaxis"];
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
