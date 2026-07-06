---
name: code-checks
description: Repo-specific verification commands, pre-edit checks, and failure recoveries for the Portfolio-Website repo. Extracted from real sessions in this repo. Load before editing index.html, project pages, or assets. Companion to working-process (how work runs) and portfolio-design (what we make) — this file covers only what those two do not: the exact commands and this repo's failure history.
---

# Code Checks — Portfolio-Website

Every rule below comes from a failure or near-failure in this repo. Nothing here
is general advice. General process lives in `working-process`; the quality
checklist lives in `portfolio-design`. This file is the command layer under both.

---

## 1. Read the git log before proposing a layout direction

This repo's history is a record of tried-and-reverted experiments. Check it
before designing, or you will re-propose something that already failed.

```
git log --oneline -30
```

**The real example:** the hover preview panel. `620f42e` moved it to a fixed
side panel; `a8822d4` reverted. `19a475d` fixed its position; `79de49d`
reverted. `9e3b56e` made it a two-column layout "works at 1020px+"; `ffd1049`
reverted — it fights narrow screens. In the July 6 2026 session, one log check
killed a duplicate proposal in a single line: "you already tried this and
reverted it. Skip." The final fix (`0e4f1b0`, play video in-thumbnail) only
emerged after ruling out what the log had already ruled out.

---

## 2. One experiment per commit, so recovery is one revert

The preview-panel saga survived three dead ends because each direction was its
own commit. Recovery was `git revert <sha>`, not manual unpicking of mixed
changes. Before starting a risky visual experiment on `index.html`, commit the
current working state first. A direction that fails after twenty edits costs
nothing if it is one commit deep.

**Check before editing:** `git status` — if the file already has uncommitted
changes from a previous direction, commit or stash them before layering a new
experiment on top.

---

## 3. Verify over HTTP on the ports launch.json defines

This site is static HTML with no build step, but `file://` is not how it ships.
Serve it the way `.claude/launch.json` already defines:

- `portfolio` — repo root at `localhost:8000`
- `portfolio-review` — repo root at `localhost:8010`
- `promptedfind` — `~/projects/PromptedFind` at `localhost:8001`
- `session-indicator` — `~/projects/session-indicator` at `localhost:8002`

Start with the preview tools (`preview_start`), not a hand-rolled server.
What deploys is exactly what `git push` to `main` sends to GitHub Pages
(`CNAME` → ladanjohari.com), so a page verified at `localhost:8000` is the
page that ships. Note `projects/session-indicator.html` is a 219-byte redirect
stub to `session-indicator.ladanjohari.com` — verifying that page means
verifying the other repo.

---

## 4. Check media size before `git add`

GitHub rejects files over 100 MB and the push fails after the work is done.

```
find . -size +50M -not -path "./.git/*"
```

**The real example:** `nasa-talk-clean.mp4` came out of screen recording at
569 MB. Recovery was an ffmpeg compression run in the background while other
work continued: 854×480, 24 fps, `-movflags +faststart` (so the video streams
on the web instead of waiting for full download), targeting ~90 MB. Run the
size check before staging, not after the push fails.

---

## 5. Never retype a macOS screen-recording filename

macOS names recordings like `Screen Recording 2026-07-01 at 9.15.32 AM.mov` —
and the space before "AM" is U+202F, a narrow no-break space. It looks
identical to a normal space. ffmpeg could not open the file because the
retyped name did not match the bytes on disk.

**Recovery that worked:** list the directory programmatically and reuse the
exact string —

```
python3 -c "import os; [print(repr(f)) for f in os.listdir('assets/screen recordings')]"
```

Shell globs (`assets/screen\ recordings/*.mov`) also work. Typing what the
Finder shows does not.

---

## 6. Read DOM geometry at interaction time, not at load

`394ab36` — "Fix preview position: read shell rect on mouseenter not at load."
The hover preview cached `getBoundingClientRect()` once at page load. After a
resize, a scroll, or late font load, the cached rect was stale and the preview
appeared in the wrong place.

**Check before shipping any hover interaction in this repo:** every
`getBoundingClientRect` that feeds a pointer-driven element must run inside
the event handler (`mouseenter`, `mousemove`), not at initialization.

---

## 7. Sibling repos carry their own locked rules — read them before crossing over

Portfolio work regularly crosses into `~/projects/session-indicator` (this
repo's `projects/session-indicator.html` redirects there). That repo's
`CLAUDE.md` locks decisions that are not derivable from the code:

- One self-contained `index.html`. No build process, no file splitting,
  no bundler. React loads from CDN inline. "Open the file in a browser"
  is the point.
- No `localStorage` or `sessionStorage` — state starts fresh on load.
- Z-index only through the `zCounter` in state, never in CSS.
- Dragging only from title bars (`.term-chrome`, popover headers).

**Check before editing any sibling repo:** `cat CLAUDE.md` first. Each rule
there exists because a session once did the opposite and it was reverted.

---

## 8. Verify a CLAUDE.md rule is executable before repeating it

A rule in a memory file can describe a setup that no longer exists — or
never did. Before obeying or citing one, run the command it implies.

**The real example:** `session-indicator/CLAUDE.md` says "Run existing
Playwright tests first. Run tests again after change." Checked on
July 6 2026: `package.json` has no test script ("Error: no test
specified"), the repo contains no spec files, and zero commits mention
tests. Playwright is installed for the video *recording* pipeline
(`3b64a1a`), not tests. The rule is aspirational — flag it as unconfirmed,
do not report test runs that cannot happen.

**Check:** `npm test` (or locate the files the rule names) before treating
any memory-file rule as fact. Same failure class as the missing-README
discovery in `working-process` lesson 1.
