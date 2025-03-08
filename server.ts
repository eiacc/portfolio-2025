import { file, serve } from "bun";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { extname } from "path";
import * as qrcode from "qrcode-terminal"

const distPath = "./dist"; // Change if needed

const mimeTypes: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
};

const port = 3000

const server = serve({
  port,
  async fetch(req) {
    let url = new URL(req.url);
    let filePath = `${distPath}${url.pathname}`;

    // Serve index.html for root and directory requests
    if (url.pathname === "/" || url.pathname.endsWith("/")) {
      filePath += "index.html";
    }

    // console.log('file path', filePath)

    // Check if file exists
    if (!existsSync(filePath)) {
      return new Response("404 Not Found", { status: 404 });
    }

    try {
      const file = await readFile(filePath);
      const ext = extname(filePath);
      const contentType = mimeTypes[ext] || "application/octet-stream";
      return new Response(file, { headers: { "Content-Type": contentType } });
    } catch (err) {
      return new Response("500 Internal Server Error", { status: 500 });
    }
  },
});

console.log(`listening on http://localhost:${port}`)
console.log(`Scan here to view on mobile \n`)
qrcode.generate("https://concise-trusty-gelding.ngrok-free.app", { small: true });