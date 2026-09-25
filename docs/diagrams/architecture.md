# Just Fax: how the pieces fit

Status as of 2026-09-25: live at https://fax.dreytools.com (Cloudflare Pages project "justfax", also at justfax.pages.dev).

```mermaid
flowchart LR
  R["research/CORPUS.md<br/>fact-checked Kennedy research"] --> P["prompt/fax.md<br/>full prompt"]
  P --> G["prompt/fax-gpt.md<br/>GPT-size, under 8,000 chars"]
  R --> C["content/site.json<br/>cards, starter prompts, books, sample chat, footer"]
  T["Test workflows<br/>blind graders, Claude + GLM"] -.->|found failures, drove fixes| P
  S["src/page.html<br/>layout, styles, copy script"] --> B["build.ts"]
  M["src/meta.html, og.svg, favicon.svg"] --> B
  P --> B
  G --> B
  C --> B
  B -->|fails on filler, empty sections, GPT over 8,000| X["build error"]
  B --> D["dist/index.html + og.png + _headers (CSP)"]
  B --> A["artifact/artifact.html<br/>kept out of dist"]
  D -->|wrangler pages deploy --branch main| CF["Cloudflare Pages<br/>fax.dreytools.com"]
  A -.->|optional| AR["claude.ai Artifact (private link)"]
  CF --> U["Visitor on a phone"]
  U -->|taps Copy Fax| CB["Clipboard"] --> AI["ChatGPT / Claude / Gemini"]
```

- The Copy buttons read the prompt straight out of the page, so what people read is exactly what they copy.
- Nothing is collected from visitors: no forms, no analytics, no email capture (see README launch rules).
