import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const runId = `workspace-layout-${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}`;
// The published acceptance set lives in docs/screenshots; pass --scratch to
// write a throw-away run under .codex-scratch instead.
const outputDir = process.argv.includes("--scratch")
  ? path.join(repoRoot, ".codex-scratch", "screenshots", runId)
  : path.join(repoRoot, "docs", "screenshots");
const serverPort = 8787;
const serverUrl = `http://127.0.0.1:${serverPort}`;
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

await mkdir(outputDir, { recursive: true });

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? "/", serverUrl);
  if (requestUrl.pathname === "/health") {
    response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ ok: false, screenshot_stub: true }));
    return;
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405).end();
    return;
  }
  const relativePath = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
  const filePath = path.resolve(repoRoot, `.${relativePath}`);
  if (filePath !== repoRoot && !filePath.startsWith(`${repoRoot}${path.sep}`)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      "content-type": mimeTypes[path.extname(filePath)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(serverPort, "127.0.0.1", resolve);
});

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function launchEdge(width, height) {
  const profileDir = await mkdtemp(path.join(tmpdir(), "retaining-edge-"));
  const child = spawn(edgePath, [
    "--headless=new",
    "--disable-gpu",
    "--disable-background-networking",
    "--disable-extensions",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${profileDir}`,
    `--window-size=${width},${height}`,
    "about:blank",
  ], { windowsHide: true, stdio: "ignore" });
  let exited = false;
  const childExit = new Promise((resolve) => child.once("exit", resolve));
  child.once("exit", () => { exited = true; });
  const activePortPath = path.join(profileDir, "DevToolsActivePort");
  let debuggingPort = 0;
  for (let attempt = 0; attempt < 150; attempt += 1) {
    if (exited) {
      throw new Error("Headless Edge exited before opening its debugging endpoint.");
    }
    try {
      debuggingPort = Number((await readFile(activePortPath, "utf8")).split(/\r?\n/)[0]);
      if (debuggingPort > 0) break;
    } catch {}
    await delay(100);
  }
  if (!debuggingPort) {
    child.kill();
    throw new Error("Headless Edge did not expose its debugging endpoint within 15 seconds.");
  }
  const targetResponse = await fetch(`http://127.0.0.1:${debuggingPort}/json/new?about%3Ablank`, { method: "PUT" });
  if (!targetResponse.ok) {
    child.kill();
    throw new Error(`Unable to create a headless Edge tab (HTTP ${targetResponse.status}).`);
  }
  const target = await targetResponse.json();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 600,
  });
  return {
    send,
    socket,
    child,
    profileDir,
    async close() {
      socket.close();
      child.kill();
      await childExit;
      await delay(200);
      await rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 250 });
    },
  };
}

async function evaluate(browser, expression) {
  const result = await browser.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text ?? "Browser evaluation failed.");
  }
  return result.result.value;
}

async function waitForPage(browser, demo) {
  const condition = demo
    ? 'document.querySelector("[data-demo-label]")?.hidden === false && document.querySelector(".depth-plot-grid svg.plot-svg")'
    : 'document.querySelector("[data-project-input]") && document.querySelector("[data-service-status]")?.textContent.trim() === "Service offline"';
  for (let attempt = 0; attempt < 160; attempt += 1) {
    if (await evaluate(browser, `Boolean(document.readyState === "complete" && (${condition}))`)) return;
    await delay(125);
  }
  throw new Error(`Timed out waiting for the ${demo ? "demo result" : "input"} page to render.`);
}

async function saveViewportScreenshot(browser, outputPath) {
  const screenshot = await browser.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(outputPath, Buffer.from(screenshot.data, "base64"));
}

const apiParam = `api=${encodeURIComponent(serverUrl)}`;
const metrics = [];
try {
  for (const viewport of [
    { width: 1920, height: 1200, label: "1920x1200" },
    { width: 1440, height: 900, label: "1440x900" },
    { width: 390, height: 844, label: "390x844" },
  ]) {
    const browser = await launchEdge(viewport.width, viewport.height);
    try {
      await browser.send("Page.navigate", { url: `${serverUrl}/?${apiParam}` });
      await waitForPage(browser, false);
      const beforeName = `${viewport.label}-before-run.png`;
      await saveViewportScreenshot(browser, path.join(outputDir, beforeName));

      await browser.send("Page.navigate", { url: `${serverUrl}/?${apiParam}&demo=1` });
      await waitForPage(browser, true);
      const afterName = `${viewport.label}-demo-result.png`;
      await saveViewportScreenshot(browser, path.join(outputDir, afterName));
      metrics.push({
        viewport: viewport.label,
        before: beforeName,
        demo: afterName,
        layout: await evaluate(browser, `(() => ({innerWidth, documentWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth, pageHeight: document.documentElement.scrollHeight, plotCount: document.querySelectorAll(".depth-plot-grid > .depth-plot-card").length, overflowElements: [...document.body.querySelectorAll("*")].filter((element) => { const rect = element.getBoundingClientRect(); let parent = element.parentElement; let contained = false; while (parent) { const overflow = getComputedStyle(parent).overflowX; if ((overflow === "auto" || overflow === "scroll") && parent.scrollWidth > parent.clientWidth) { contained = true; break; } parent = parent.parentElement; } return !contained && (rect.left < -1 || rect.right > innerWidth + 1) && getComputedStyle(element).overflowX === "visible"; }).slice(0, 12).map((element) => ({tag: element.tagName, className: String(element.className), left: Math.round(element.getBoundingClientRect().left), right: Math.round(element.getBoundingClientRect().right)}))}))()`),
      });
      if (viewport.width < 600) {
        await evaluate(browser, 'window.scrollTo(0, document.querySelector(".canvas-pane").getBoundingClientRect().top + window.scrollY)');
        await delay(250);
        const canvasName = `${viewport.label}-demo-canvas.png`;
        await saveViewportScreenshot(browser, path.join(outputDir, canvasName));
        metrics[metrics.length - 1].mobileCanvas = canvasName;
        await evaluate(browser, 'document.querySelector(".plots-panel").scrollIntoView({block: "start"})');
        await delay(250);
        const plotsName = `${viewport.label}-demo-plots.png`;
        await saveViewportScreenshot(browser, path.join(outputDir, plotsName));
        metrics[metrics.length - 1].mobilePlots = plotsName;
      }
    } finally {
      await browser.close();
    }
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}

console.log(JSON.stringify({ runId, outputDir, metrics }, null, 2));
