# EA Suys Retaining Tools Web

Public GitHub Pages frontend for `https://retaining.easuys.com/`.

This repository is intentionally frontend-only. The engineering logic stays in
the private Cloudflare Worker repository:

`https://easuys-retaining-tools-api.yellow-violet-f185.workers.dev`

The interface is a dedicated retaining-wall workspace rather than a generic
calculator list. It consumes plot-ready arrays from the API and avoids
recomputing structural mechanics client-side.

## Sheet-pile sections and sample results

`STEEL_SHEET_PILE_LIBRARY` in `app.ts` holds the same cited ArcelorMittal AZ
(630 mm series), AZ-700 and AZ-770 rows as the API catalogue; each row is
checked against `tests/fixtures/sheet_pile_catalogue_sources.json` (a copy of
the API fixture) by `tests/sheet_pile_catalogue.test.mjs`. `AZ 18` is the
630 mm section, not the AZ 18-700. Choosing a section in the editor sets the
segment EI to E I of that section.

The `?demo=1` result (`DEMO_RESULT`) and `tests/fixtures/ec7_sample_result.json`
are engine output for `SAMPLE_PROJECT`; regenerate them after an engine change
with the API built (`RETAINING_API_ROOT` points to its checkout):
`node scripts/build_demo_result.mjs` and
`node scripts/build_ec7_sample_fixture.mjs`, then review the diff.

## Pull-request checks

Pull requests run a separate read-only build and test workflow. It has no Pages
permissions, deployment steps, secrets, artifacts, push trigger, or manual
dispatch path; a green pull request therefore does not publish the preview.

## Deployment

The repo includes a GitHub Pages workflow at
`.github/workflows/deploy-pages.yml`.

Published site assumptions:

- default branch: `main`
- custom domain: `retaining.easuys.com`
- static artifact includes `index.html`, `validation.html`, compiled `app.js`,
  `styles.css`, `CNAME`, and the screenshot acceptance set under
  `docs/screenshots/`

The one-time publication and verification procedure is recorded in
[`docs/launch_runbook.md`](docs/launch_runbook.md). Pages, DNS, and the Worker
must all be activated before the public URL is considered live.
