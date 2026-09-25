// Builds the site from src/page.html + the prompt files.
// Outputs: dist/index.html (full site for Cloudflare Pages) and artifact/artifact.html (claude.ai Artifact, kept out of dist so it is never deployed).
// Run: node build.ts
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const SITE_URL = process.env.SITE_URL ?? "https://fax.dreytools.com";
const GPT_LIMIT = 8000; // ChatGPT's GPT builder caps the Instructions box at 8,000 characters.

const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const read = (p: string): string => readFileSync(p, "utf8").trim();

const full = read("prompt/fax.md");
const gpt = read("prompt/fax-gpt.md");
const aiLogos = read("src/ai-logos.html").replace(/<!--[\s\S]*?-->\s*/, "");
if (gpt.length > GPT_LIMIT) {
  throw new Error(`prompt/fax-gpt.md is ${gpt.length} characters. It must be ${GPT_LIMIT} or fewer to fit a custom GPT.`);
}

// Page content lives in content/site.json so it can be edited without touching HTML.
type Site = {
  cards: { book: string; idea: string; what: string; remix: string; wide?: boolean }[];
  notes: string[];
  chat: { who: "you" | "fax"; html: string }[];
  chatNotes: { pen: string; text: string }[];
  books: { year: string; title: string; idea: string }[];
  footer: string[];
};
const site: Site = JSON.parse(read("content/site.json"));
const attr = (s: string): string => esc(s).replace(/"/g, "&quot;");
const blocks: Record<string, string> = {
  "<!-- CARDS -->": site.cards
    .map((c) => `<article class="card paper"><span class="og">From: ${esc(c.book)}</span><h3>${esc(c.idea)}</h3><p>${esc(c.what)}<span class="remix"><b>Fax's remix:</b> ${esc(c.remix)}</span></p></article>`)
    .join("\n"),
  "<!-- NOTES -->": site.notes
    .map((n) => `<div class="note"><p>${esc(n)}</p><button class="ghost" type="button" data-copy="" data-text="${attr(n)}" data-label="Copy" aria-label="Copy prompt: ${attr(n.split(/\s+/).slice(0, 6).join(" "))}">Copy</button></div>`)
    .join("\n"),
  // chat html is hand-authored (p, b, ul, ol, li only), so it is inserted as-is.
  "<!-- CHAT -->": site.chat
    .map((m) => (m.who === "you" ? `<span class="who r">You</span><div class="msg me">${m.html}</div>` : `<span class="who">Fax</span><div class="msg them">${m.html}</div>`))
    .join("\n"),
  "<!-- CHAT-NOTES -->": site.chatNotes.map((n) => `<div><p class="pen">${esc(n.pen)}</p><p>${esc(n.text)}</p></div>`).join("\n"),
  // First ten books show; the rest sit behind a toggle so phones aren't scrolling for seven screens.
  "<!-- BOOKS -->": ((): string => {
    const row = (b: Site["books"][number]): string =>
      `<div class="book"><span class="yr">${esc(b.year)}</span><div><b>${esc(b.title)}</b><span>${esc(b.idea)}</span></div></div>`;
    const first = site.books.slice(0, 10).map(row).join("\n");
    const rest = site.books.slice(10);
    return rest.length
      ? `${first}\n<details class="more"><summary><span class="closed">Show all ${site.books.length} books</span><span class="opened">Show fewer books</span></summary><div class="list">${rest.map(row).join("\n")}</div><button class="ghost less" type="button" data-close-details>Show fewer books</button></details>`
      : first;
  })(),
  "<!-- FOOTER -->": site.footer.map((p) => `<p>${p}</p>`).join("\n"),
};

const fill = (s: string): string => {
  for (const [slot, html] of Object.entries(blocks)) s = s.replace(slot, html);
  const out = s
    .replaceAll("{{PROMPT_FULL}}", esc(full))
    .replaceAll("{{PROMPT_GPT}}", esc(gpt))
    .replaceAll("{{FULL_CHARS}}", full.length.toLocaleString("en-US"))
    .replaceAll("{{GPT_CHARS}}", gpt.length.toLocaleString("en-US"))
    .replaceAll("{{SITE_URL}}", SITE_URL)
    .replaceAll("{{AI_LOGOS}}", aiLogos);
  const missed = out.match(/{{[A-Z_]+}}/);
  if (missed) throw new Error(`Unfilled placeholder ${missed[0]}.`);
  return out;
};

// src/page.html = head content (title, fonts, style), then "<!-- BODY -->", then body markup + script.
const parts = read("src/page.html").split("<!-- BODY -->");
if (parts.length !== 2) throw new Error('src/page.html needs exactly one "<!-- BODY -->" marker.');
const head = fill(parts[0]);
const body = fill(parts[1]);
const meta = fill(read("src/meta.html"));

// Never ship layout filler or an empty section.
const filler = body.match(/sample layout|layout sample|sample reply for layout|lorem ipsum/i);
if (filler) throw new Error(`Placeholder text "${filler[0]}" is still in the page. Replace it in content/site.json.`);
for (const [name, list] of Object.entries({ cards: site.cards, notes: site.notes, chat: site.chat, books: site.books, footer: site.footer })) {
  if (!list.length) throw new Error(`content/site.json "${name}" is empty, so that section would render blank.`);
}

mkdirSync("dist", { recursive: true });
mkdirSync("artifact", { recursive: true });
// The Artifact host adds its own doctype/html/head/body, so it gets the bare page.
writeFileSync("artifact/artifact.html", `${head}\n${body}\n`);
writeFileSync(
  "dist/index.html",
  `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${meta}\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>\n`,
);

// Link-preview image: src/og.svg -> dist/og.png (rsvg-convert ships with librsvg).
execFileSync("rsvg-convert", ["-w", "1200", "-h", "630", "-o", "dist/og.png", "src/og.svg"]);
// iOS rounds the corners itself and turns transparent pixels black, so fill the corners with the brand blue.
execFileSync("rsvg-convert", ["-w", "180", "-h", "180", "-b", "#1F3DF0", "-o", "dist/apple-touch-icon.png", "src/favicon.svg"]);
copyFileSync("src/favicon.svg", "dist/favicon.svg");
// With a 404.html, Cloudflare Pages returns a real 404 for unknown paths instead of the homepage with a 200.
copyFileSync("src/404.html", "dist/404.html");

// Security headers for Cloudflare Pages. The CSP allows only this page's own inline script, by hash.
const scripts = [...body.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const hashes = scripts.map((s) => `'sha256-${createHash("sha256").update(s).digest("base64")}'`).join(" ");
const csp = [
  "default-src 'none'",
  `script-src ${hashes}`,
  "style-src 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join("; ");
writeFileSync(
  "dist/_headers",
  `/*\n  Content-Security-Policy: ${csp}\n  X-Frame-Options: DENY\n  X-Content-Type-Options: nosniff\n  Strict-Transport-Security: max-age=31536000; includeSubDomains\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`,
);

console.log(`Built dist/ - full prompt ${full.length} chars, GPT-size ${gpt.length}/${GPT_LIMIT} chars.`);
