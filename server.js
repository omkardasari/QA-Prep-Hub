const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 4173);
const root = __dirname;
const linkedInHosts = new Set(["linkedin.com", "www.linkedin.com"]);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

http.createServer(async (request, response) => {
  if (request.url.startsWith("/api/fetch-linkedin")) {
    await fetchLinkedin(request, response);
    return;
  }

  const urlPath = decodeURIComponent(request.url.split("?")[0]);
  const filePath = path.join(root, urlPath === "/" ? "index.html" : urlPath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
    response.end(content);
  });
}).listen(port, () => {
  console.log(`Automation QA Interview Tracker running at http://localhost:${port}`);
});

async function fetchLinkedin(request, response) {
  try {
    const requestUrl = new URL(request.url, `http://localhost:${port}`);
    const target = new URL(requestUrl.searchParams.get("url") || "");

    if (!linkedInHosts.has(target.hostname.toLowerCase())) {
      sendJson(response, 400, { error: "Only linkedin.com post URLs are supported." });
      return;
    }

    const result = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 Automation QA Interview Tracker",
        "Accept": "text/html,text/plain"
      }
    });

    if (!result.ok) {
      sendJson(response, result.status, { error: `LinkedIn returned HTTP ${result.status}.` });
      return;
    }

    const html = await result.text();
    const text = htmlToText(html);
    if (!text || text.length < 40) {
      sendJson(response, 422, { error: "Could not extract useful text from this LinkedIn page." });
      return;
    }

    sendJson(response, 200, { text });
  } catch (error) {
    sendJson(response, 400, { error: "Could not fetch this LinkedIn URL." });
  }
}

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}
