# No Cap, Just Fax

A free, copy-paste AI marketing coach. His brain is the classic direct-response
playbook, mostly from Dan Kennedy's books. His voice is Gen Z. People copy the prompt
from the website and paste it into ChatGPT, Claude, or Gemini.

Fax is an independent, fan-made character. He is not Dan Kennedy and is not
affiliated with or endorsed by Dan Kennedy, Magnetic Marketing, or their publishers.

## What's in here

```
prompt/fax.md          The full clone prompt (paste as a first message, or into a Claude Project / Gemini Gem)
prompt/fax-gpt.md      The GPT-size prompt (under 8,000 characters, fits a custom GPT's Instructions box)
prompt/drafts/         The three competing drafts the final prompt was merged from
research/CORPUS.md     The fact-checked research every Fax idea comes from (bio, books, frameworks, Gen Z layer, legal notes)
research/raw/          Per-topic fact-check files behind CORPUS.md
content/site.json      Website copy: idea cards, starter prompts, sample chat, book list, footer
src/page.html          Website layout + styles + copy-button script
src/meta.html          Link-preview tags (Open Graph / Twitter)
src/og.svg             Link-preview image source (rendered to og.png)
src/ai-logos.html      ChatGPT / Claude / Gemini icons (Simple Icons, CC0), inserted where {{AI_LOGOS}} appears
src/favicon.svg        Tab icon (also rendered to apple-touch-icon.png)
src/404.html           "Wrong number" page for unknown paths (no script allowed, see CSP)
build.ts               Builds dist/ from all of the above
dist/                  Build output (deploy this folder)
```

## How it works

Full diagram: [docs/diagrams/architecture.md](docs/diagrams/architecture.md)

```
prompt/*.md + content/site.json + src/page.html
        -> node build.ts
        -> dist/index.html  (the website, with both prompts embedded)
        -> dist/og.png, favicon.svg, apple-touch-icon.png, _headers (security headers)
        -> artifact/artifact.html (same page, for a claude.ai Artifact; outside dist so it never deploys)
```

The Copy buttons read the prompt straight out of the page, so the prompt you read
in "Read him before you paste him" is exactly what gets copied.

## Build

Needs Node 22.18+ (runs TypeScript directly) and `rsvg-convert` (`brew install librsvg`).

```bash
node build.ts
```

The build fails loudly if the GPT-size prompt goes over 8,000 characters or a
placeholder is left unfilled.

Set the real domain before a production build so link previews point at it:

```bash
SITE_URL=https://your-domain.com node build.ts
```

## Preview locally

```bash
python3 -m http.server 8899 --directory dist
```

Then open http://localhost:8899.

## Deploy (Cloudflare Pages)

```bash
node build.ts
```

```bash
npx wrangler pages deploy dist --project-name justfax --branch main
```

`--branch main` sends it to the production URL (this folder is not a git repo, so wrangler can't
guess the branch). If wrangler says it needs an account ID, set `CLOUDFLARE_ACCOUNT_ID` first.
Live site: https://fax.dreytools.com (custom domain on the dreytools.com Cloudflare zone, a proxied CNAME
`fax` -> `justfax.pages.dev`). https://justfax.pages.dev still serves the same site, and the canonical tag
points search engines at fax.dreytools.com.

`dist/_headers` sets the security headers (CSP, X-Frame-Options, HSTS, nosniff).
After deploying, check the link preview:

```bash
curl -sI https://fax.dreytools.com/og.png
```

## Editing Fax

- Change what he says or does: edit `prompt/fax.md`, then make the same change in
  `prompt/fax-gpt.md` (keep it under 8,000 characters), then rebuild.
- Change the website copy: edit `content/site.json`, then rebuild.
- Before adding a new Kennedy idea or book, check it against `research/CORPUS.md`.
  Only verified facts go in. Never add quotes or page numbers from his books.

## Environment variables

| Name | Needed? | What it does |
|------|---------|--------------|
| `SITE_URL` | For production builds | Absolute URL used in link previews and the canonical tag. Defaults to `https://fax.dreytools.com`. |

## Legal notes (read before a public launch)

This is research, not legal advice. See `research/CORPUS.md` section 8 for sources.

- NO B.S., MAGNETIC MARKETING, and RENEGADE MILLIONAIRE are live trademarks of Etison LLC
  (the ClickFunnels company). None of them go in the name, domain, logo, or handles.
- Ohio (Kennedy's likely home state) protects any "clearly identifying reference" to a person
  for commercial use. That is why the character has an original name and Kennedy is only
  mentioned factually (credit lines, book list, "this idea comes from this book").
- The site footer and the prompt's opening line both carry an AI notice and a not-affiliated line.
- Have a trademark/IP lawyer review before a public launch.

### Launch rules (from the pre-launch skeptic review)

- Announce it as "Fax, a marketing coach built on Dan Kennedy's books." Never "Gen Z Dan Kennedy",
  never "Dan Kennedy bot", never his nicknames. Kennedy's name stays out of the link-preview text.
- Keep the site free and collecting nothing (no email capture, no link to a paid offer) until an IP
  lawyer signs off. A free page that sells nothing is its strongest protection under Ohio R.C. 2741,
  which only covers commercial use.
- Custom GPTs: OpenAI no longer lets personal ChatGPT accounts create GPTs and plans to retire them
  (help.openai.com/en/articles/8554397, checked 2026-09-25). Re-check before Dec 11, 2026 and update
  the GPT-size copy on the page.
- Tested: the full prompt on Claude (12 scenarios plus retests), GLM-5.3, ChatGPT's model (via Codex) and the real
  Gemini app (2026-09-26). The GPT-size prompt on Claude.
