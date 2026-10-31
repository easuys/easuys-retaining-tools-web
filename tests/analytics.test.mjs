import assert from "node:assert/strict";
import { readFile as readRawFile } from "node:fs/promises";
import { test } from "node:test";

// Cloudflare Web Analytics (A2 step 0): one beacon with the retaining.easuys.com token per page, after the app,
// no cookies, and a note on how visits are counted.
const readFile = async (...args) => (await readRawFile(...args)).replace(/\r\n/g, "\n");
const TOKEN = "7a4e7fe205804bda84d6dcb175b9f32f";

for (const page of ["index.html", "validation.html"]) {
  test(`${page} carries one analytics beacon and the visit note`, async () => {
    const html = await readFile(new URL(`../${page}`, import.meta.url), "utf8");
    assert.equal([...html.matchAll(/static\.cloudflareinsights\.com\/beacon\.min\.js/g)].length, 1);
    assert.ok(html.includes(`"token": "${TOKEN}"`));
    assert.ok(html.indexOf("cloudflareinsights") < html.indexOf("</body>"));
    assert.match(html, /<p class="analytics-note">Visits are counted with Cloudflare Web Analytics, without cookies/);
    if (page === "index.html") {
      assert.ok(html.indexOf("cloudflareinsights") > html.indexOf('src="app.js"'), "beacon after the app script");
    }
  });
}
