import { launch } from "puppeteer";
import { install as installBrowser } from "@puppeteer/browsers";
import http from "http";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DIST = path.resolve("dist");
const PORT = 4174;
const BASE = `http://localhost:${PORT}`;
const CACHE_DIR = path.resolve(".puppeteer-cache");

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

function systemChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium.chromium",
  ].filter(Boolean);
  return candidates.find((c) => existsSync(c)) || null;
}

async function ensureChrome() {
  if (process.platform !== "win32") {
    try {
      const { default: chromium } = await import("@sparticuz/chromium");
      const exec = await chromium.executablePath();
      if (exec && existsSync(exec)) {
        return { executablePath: exec, args: chromium.args };
      }
    } catch {}
  }
  try {
    const { default: puppeteer } = await import("puppeteer");
    const p = await puppeteer.executablePath();
    if (existsSync(p)) return { executablePath: p, args: [] };
  } catch {}
  const sys = systemChrome();
  if (sys) return { executablePath: sys, args: [] };
  console.log("PRERENDER: downloading Chrome (first run only)...");
  const installed = await installBrowser({
    browser: "chrome",
    buildId: "latest",
    cacheDir: CACHE_DIR,
  });
  return { executablePath: installed.executablePath, args: [] };
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
  if (!existsSync(DIST)) {
    console.log("PRERENDER: no dist folder, skipping");
    return;
  }
  let chromeCfg;
  try {
    chromeCfg = await ensureChrome();
  } catch (e) {
    console.log("PRERENDER: no Chrome available, skipping:", e.message);
    return;
  }
  console.log("PRERENDER: using chrome at", chromeCfg.executablePath);

  const server = serve();
  try {
    const browser = await launch({
      executablePath: chromeCfg.executablePath,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--disable-dev-shm-usage", ...(chromeCfg.args || [])],
    });
    const html = await renderPage(browser, "/");
    await writeFile(path.join(DIST, "index.html"), html, "utf8");
    console.log(`PRERENDER: saved dist/index.html (${html.length} bytes)`);
    await browser.close();
  } catch (e) {
    console.log("PRERENDER: rendering failed, keeping original build:", e.message);
  } finally {
    server.close();
  }
}

main().catch((e) => {
  console.log("PRERENDER: skipped, keeping original build:", e.message);
});