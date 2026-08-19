import { launch } from "puppeteer";
import http from "http";
import { readFile, writeFile, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DIST = path.resolve("dist");
const PORT = 4174;
const BASE = `http://localhost:${PORT}`;

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
};

async function findChrome() {
  try {
    const { default: puppeteer } = await import("puppeteer");
    const p = await puppeteer.executablePath();
    if (existsSync(p)) return p;
  } catch {}
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium.chromium",
    process.env.LAMBDA_TASK_ROOT ? "/opt/chromium/chrome" : null,
  ].filter(Boolean);
  for (const c of candidates) {
    if (c && existsSync(c)) return c;
  }
  return null;
}

async function ensureChrome() {
  const found = await findChrome();
  if (found) return found;
  console.log("PRERENDER: Chrome not found, downloading via puppeteer...");
  try {
    const { default: puppeteer } = await import("puppeteer");
    await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    return await findChrome();
  } catch (e) {
    console.log("PRERENDER: could not obtain Chrome:", e.message);
    return null;
  }
}

function serve() {
  return http
    .createServer(async (req, res) => {
      try {
        let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
        if (urlPath.endsWith("/")) urlPath += "index.html";
        let filePath = path.join(DIST, urlPath);
        if (!existsSync(filePath)) filePath = path.join(DIST, "index.html");
        const data = await readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
      } catch (e) {
        res.writeHead(500);
        res.end(String(e));
      }
    })
    .listen(PORT);
}

async function renderPage(browser, route) {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(45000);
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 3000));
  try {
    await page.waitForSelector("#root > *", { timeout: 10000 });
  } catch {}
  await new Promise((r) => setTimeout(r, 1500));
  const html = await page.evaluate(() => "<!doctype html>\n" + document.documentElement.outerHTML);
  await page.close();
  return html;
}

async function main() {
  const chrome = await ensureChrome();
  if (!chrome) {
    console.log("PRERENDER: no Chrome available, skipping");
    return;
  }
  console.log("PRERENDER: using chrome at", chrome);

  if (!existsSync(DIST)) {
    console.log("PRERENDER: no dist folder, skipping");
    return;
  }

  const server = serve();

  try {
    const browser = await launch({
      executablePath: chrome,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
    });

    const routes = ["/"];
    for (const route of routes) {
      const html = await renderPage(browser, route);
      const outFile = route === "/" ? "index.html" : route.slice(1) + ".html";
      await writeFile(path.join(DIST, outFile), html, "utf8");
      console.log(`PRERENDER: saved dist/${outFile} (${html.length} bytes)`);
    }

    await browser.close();
  } finally {
    server.close();
  }
}

main().catch((e) => {
  console.error("PRERENDER ERROR:", e.message);
  process.exit(1);
});
