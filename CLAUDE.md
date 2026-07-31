# Portfolio Website — Claude Instructions

## Who Ladan is
Designer, not an engineer. She directs like a creative director. Never present technical housekeeping as a decision she has to make — do it and report in one plain sentence. Reserve her decisions for design direction and anything visible on the live site.

## How to communicate
- Plain language, no file-path dumps, no option lists for infrastructure choices
- End every conversation with a to-do list: ✅ done items + numbered open items in priority order
- One question maximum per response, only if the answer would change what I do next
- No em dashes in copy she'll read as her own voice (they read as AI)

## THIS REPO IS PUBLIC - publishing rules
Everything committed here is world-readable, including git history, and history
survives deleting the file. Before pushing:
- **Never push work Ladan has not said is public.** Applications, proposals,
  unreleased projects, tailored resumes, private skills: these live in their own
  repo, not here. Ask before pushing anything you did not personally add to a
  public-facing page.
- **Never push on your own initiative.** Committing locally is fine. Pushing is
  publishing, so it needs her go-ahead.
- A `pre-push` hook blocks known-private filename patterns (`.githooks/pre-push`,
  copy it to `.git/hooks/` on a fresh clone). Add new patterns as private work appears.
- Private material currently lives in: `~/projects/gray-area` (private GitHub repo
  `ladanjohari/gray-area`), `~/.claude/skills/clear-glass`.

## The site
- Live at ladanjohari.com
- Repo: git@github.com:ladanjohari/ladanjohari.github.io.git
- Deploys automatically to GitHub Pages on push to `main`
- One file: `index.html` — everything is in here (homepage, all styles, all scripts)
- Preview locally: `python3 -m http.server 8000` (already in .claude/launch.json as "portfolio")

## Component vocabulary (use in commit messages)
NavBar, HeroBlock, WorkList, WorkRow, ThumbSmall, HoverPreview, CursorDot, StackSection, WorkflowReel, AboutStrip, FooterBar

## Commit format
`component(ComponentName): description`

## Design system (do not invent)
- Font: Geist, self-hosted at `assets/fonts/geist-latin{,-ext}.woff2`
- Tokens: `--bg #F7F6F3` `--ink #111111` `--mid #6B6B6B` `--rule rgba(0,0,0,0.10)` `--accent #0066FF`
- Dark mode tokens: `--bg #1A1A1A` `--ink #E8E8E8` `--mid #9A9A9A` `--rule #333` `--accent #4D94FF`
- Max content width: 700px, 28px padding (20px mobile ≤540px)
- No gradients, no shadows, no invented colors — 1px var(--rule) dividers only
- Concentric border-radius, capsules exact, HIG-informed spacing
- Full spec: `.claude/skills/frontend.md`

## Project card structure (index.html)
Each project row uses:
- `<img class="work-thumb">` — static SVG thumbnail, 196×122 viewBox, dark background
- `<video class="thumb-video">` — animated hover preview MP4, dark+light sources via `data-src-dark` / `data-src-light`
- Hover JS already wired: crossfade on `.work-row:hover`, theme-swap on color-scheme change

## Animated preview workflow
Source files live in `assets/previews/SI-previews/` with a README — use that as the template for any new project preview. The system: self-contained HTML animation → Puppeteer frame capture → ffmpeg MP4 + GIF. Full setup in the README.

Output sizes:
- Thumbnail GIF: serve at 360×225, CSS scales to display size (browser scaling is sharper than ffmpeg re-encode)
- Hover preview MP4: 360×225, h264 crf18, `scale=-2` (h264 needs even dimensions)

## Adding a new project (two steps, nothing else)
1. **The page.** Copy `projects/_template.html` to `projects/<slug>.html` and fill in
   every `{{PLACEHOLDER}}`. Put the three interaction stills in `assets/img/<slug>/`.
   The template's structure is the locked pattern, proven on PromptedFind:
   claim → the interaction as hero → why it matters + who it's for → the idea
   (named, then shown as a diagram) → optional where else → what's next.
   Rules baked in: no keyword eyebrow, never open on a title card, step captions
   describe only what that still actually shows, "what's next" reads as capability
   not apology.
2. **The row.** Copy an existing `<a class="work-row">` block in `index.html`,
   swap the thumbnail SVG, hover-preview MP4 paths, title, description, tags,
   year, and href.

Reference implementation: `projects/promptedfind.html`. Archived earlier versions
live in `process/` and must not be deleted.

## Project pages
- PromptedFind: `projects/promptedfind.html`
- Session Indicator: `projects/session-indicator.html` (redirect stub → session-indicator.ladanjohari.com)
- Xcode Symbol Browser + Trails: case-study pages not yet built, currently link to YouTube demos

## What's in progress
- About section: not yet built, will go above the Elsewhere section. Short bio, résumé link (hidden until PDF exists). Options brainstormed in `process/about-section-options.html`
- Hover previews for Xcode + Trails: designed, signed off, shipped. SI is the designed prototype style (not a screen recording)
- WorkflowReel section: markup exists in index.html but is `hidden` — not ready to show yet, do not delete

## What's parked (don't touch without her asking)
- Xcode Symbol Browser + Trails case-study pages (she's driving)
- SI page design system alignment (she wants it to stay its own thing)
- PromptedFind live-embed / driver.js tour (Option 2 — deferred until video compression solved)
- Art section (no material yet)
- Résumé link (no PDF yet)

## Key files to know about
- `process/` — all brainstorm HTML files, keep for reference, never delete
- `assets/previews/SI-previews/` — source animations + capture scripts for all SI motion assets
- `process/promptedfind-punchlist.html` — canonical punch list for the PF page
- `ui-design-principles-universal.md` — HIG/Liquid Glass principles she wants applied
