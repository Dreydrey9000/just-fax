# Changelog

## [2026-09-26]

### Fixed
- Fax no longer invents a discount. Tested in real Gemini (gemini.google.com): it added an unasked "$5 off" and a permanent code GLOW5 twice. Both prompts now say never add a discount or code the user didn't ask for. Retest passed.

### Added
- Real Gemini app (Flash) and ChatGPT's model (via Codex): opening message, hook roast, US TikTok comment-to-DM trap. All pass after the fix.

## [2026-09-25]

### Changed
- Headline is now "Views get attention. Offers get paid." (page, link preview, og.png). The old "Views don't pay rent" knocked views, and Viral Editz sells views. The idea card that said views are worthless now says views bring the attention and the offer turns it into money.

### Added
- Brand icons next to ChatGPT, Claude and Gemini, so people see at a glance where Fax works.
- An arrow on every Copy Fax button (CSS, so it hides while the button says Copied).
- Custom domain: https://fax.dreytools.com, so the link people see and share is on our own domain. Link previews and the canonical tag now point there. justfax.pages.dev keeps working.
- Live at https://justfax.pages.dev (Cloudflare Pages project "justfax"), with security headers and the link preview checked on the live URL.
- "Wrong number" 404 page, so unknown paths like /.env return a real 404 instead of the homepage with a 200 (scanners were reading that as a leak).

### Changed
- The claude.ai Artifact copy now builds to artifact/artifact.html instead of dist/, so the deploy folder only holds the real site.
- Renamed the character from "Kenny" to "Fax" (site: "Just Fax"), because Ohio law protects any clearly identifying reference to Kennedy and NO B.S. / MAGNETIC MARKETING are live Etison LLC trademarks. Kennedy now appears only in factual credit lines, the book list and the disclaimer.
- Moved the GPT-size copy button out of the hero into the prompt section and labeled it for work and school ChatGPT plans, because OpenAI no longer lets personal accounts create custom GPTs and plans to retire them.
- Taught Fax that comment-to-DM automation works on Instagram/Facebook but not on TikTok in the US, UK or EU, so he tells TikTok creators to use "DM me [KEYWORD]" instead of a feature they don't have.
- Shifted Fax's jokes toward today's creator life (For You page, DMs, drops) instead of mostly 1980s-mail bits, because test graders held Gen Z voice at 7/10.
- Page title is now "Just Fax". "No cap. Just fax." appears once, as a self-aware sign-off, because the research flags "no cap" as forced when brands lead with it.
- The sample chat is now a real, unedited reply from the final prompt (a hook roast that passed a blind grade).
- Both prompts and all page copy now pass the SlopMonster copy gate (5/5). Semicolons became periods, a few three-item lists were broken up, and the villain list is now one sentence per villain. What Fax says and does did not change.

### Fixed
- Link preview: the "100% FREE" stamp text ran past its inner frame on og.png. It now fits, because iMessage keeps the first preview it fetches.
- iPhone home-screen icon had see-through corners that iOS fills with black. It is now a solid square.
- The Copy button on desktop grew 0.8px on "Copied" because it measured the tilted letter. It now uses the layout width and holds exactly.
- The sample chat said "Not edited" after we had touched up its punctuation for the copy gate. It now says "lightly edited and formatted".
- Card titles were cut by the red index-card rule, and wide cards left holes in the grid. Cards now stack in columns with ruled lines under each line of text.
- The "100% FREE" stamp covered the greeting. It now sits on the coupon's corner at every width.
- Copy that overclaimed ("every one is credited below", "works in ChatGPT, Claude and Gemini", "the P.S. is one of the most-read parts of any letter") was rewritten to what the research can back up.
- Fixed the local dan-kennedy-advisor skill, which said Kennedy died in 2023. The Library of Congress lists him as born 1954 with no death date, and he published a book in April 2026.

### Fixed (from the UI + UX inspectors, round 1)
- Copy Fax is now on the first screen at phone and desktop sizes (a quick button under the headline), because the only action sat below the fold.
- When a browser blocks copying, the page tries a second copy method before anything else, instead of jumping 11,000px and telling phone users to press Cmd+C.
- Focus ring is two-tone, because the yellow ring was invisible on the yellow sticky notes (1.03:1 contrast).
- Buttons keep their width when they flip to "Copied". Starter buttons have descriptive names for screen readers, prompt boxes are named regions, and there's a skip link.

### Fixed (from the UI + UX inspectors, round 2)
- If both copy methods are blocked, a "Copy it by hand" sheet opens with the whole prompt already selected and phone or desktop instructions. The page no longer scrolls, and closing the sheet puts focus back on the button you pressed.
- The phone dock no longer covers whatever has keyboard focus (scroll padding reserves its height).
- Focus stays on the copy button after a copy instead of dropping to the top of the page.
- Starter buttons keep a fixed width, the skip link lands on a focusable target, and the "Show all 48 books" toggle has a 44px tap target, a "Show fewer books" label when open, plus a close button at the bottom of the list.
- The GPT-size note moved out of step 2 and next to its own button. The stamp is solid instead of blended, and text selection uses the brand colors.

### Added
- Phone dock: Copy Fax + Back to top appear once the hero scrolls away, because phones had no navigation on a 19,000px page.
- The book list shows ten books with a "Show all 48" toggle, so phones aren't scrolling seven screens of titles.
- Build guard: the build fails if layout filler text ships or any content section is empty.
- README launch rules: how to announce it, and no email capture or paid-offer links until an IP lawyer signs off.

## [2026-09-24]

### Added
- Fax clone prompt (full + GPT-size) built from a fact-checked Dan Kennedy research corpus, so every idea he uses is traceable to a verified source.
- Website: sales-letter hero with a "clip & paste" coupon as the copy button, idea cards, starter prompts, sample chat, full prompt viewer and reading list, so people can copy Fax in one click and see exactly what they're pasting.
- Link-preview image plus favicon, so the link looks right in iMessage. Security headers lock the site down on deploy.
- `build.ts`, which embeds both prompts in the page and fails the build if the GPT-size prompt goes over ChatGPT's 8,000-character limit.
