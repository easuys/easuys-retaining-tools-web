# Retaining Workspace Screenshots

Acceptance screenshots of the real `index.html`, rendered with headless Edge at
1920×1200, 1440×900 and 390×844, before a run and with the labelled demo result
(`?demo=1`; no calculation request is made, the health check is stubbed).

Regenerate them with:

```bash
npm run screenshots:render
```

(`npm run screenshots:render -- --scratch` writes a throw-away run under
`.codex-scratch/screenshots/` instead.)
