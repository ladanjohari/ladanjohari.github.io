# Art page — handoff for a new session

Everything below is committed locally and **not pushed**. The live site still shows the
old art page. Nothing here goes public until Ladan says so.

---

## Paste this to start the new session

> Continue the art page for ladanjohari.com. Load memory `project-art-page`,
> `feedback-no-em-dashes`, and `feedback-public-repo-publishing`, and read
> `process/ART-PAGE-HANDOFF.md` before touching anything. The work is committed
> locally and unpushed. Start by opening `http://localhost:8000/art.html`
> (`python3 -m http.server 8000`, or the "portfolio" entry in .claude/launch.json)
> and showing me where it stands. Then we work through the open items in that file.
> Do not push without my go-ahead.

---

## What the page is now

`art.html`, one page, linked from the homepage. Order top to bottom:

1. "Art" label, then two paragraphs (the "Architecture. Bronze sculpture…" lead, then
   the "Bronze and ceramic works…" line ending in italic).
2. Career constellation — a static diagram. The click-to-open phase card was removed;
   `updatePanel()` is now an empty function. Nodes still drift slowly.
3. Studio casting photograph.
4. **Sculptures**: Urban Lion, Edge, Inner Conflict, Inverted City, Weightlessness.
   Each is text left / hero right, then an image block.
5. **Wearable sculptures** — masonry, 7 photos.
6. **Contemporary jewelry** — masonry, 9 photos.
7. "← Works" back link, 80px of air, footer.

## Where the pictures are

- **Published, optimized**: `art/img/*.jpg`, 36 files, 6.8MB total, 1500px max, clean
  names (`urban-lion-01`, `edge-02`, `jewelry-07`…).
- **Originals**: `art/images/`, including `Desktop-art projects.pdf`, which is a
  full-page capture of the OLD website and is the reference for arrangement.
  This folder is gitignored and stays local. Do not publish it.
- **Homepage strip**: `assets/album/strip-1..4.jpg`, cut from the art photos.
  The older `physical-1..4.jpg` are flat colour placeholders, unused now.

## Arrangement rule (Ladan was firm about this)

The layout must follow the old website, page by page, as captured in the PDF. Do not
re-arrange photographs for visual preference. The one exception she granted: Urban Lion,
where the old block cropped landscape photos into tall slots. It is now two portraits
across the top and three landscapes below, with each cell's aspect ratio matched to the
real photograph, so nothing is cut off.

## What was removed, and where it went

Nothing was deleted. Archived copies:
- `process/art-v1-archive.html` — the constellation page as it was before this session
- `process/sculptures-archive.html` — the old second page, full content
- `process/light-cube-archive.html` — the light cube page

`art/sculptures.html` and `art/light-cube.html` are now redirect stubs pointing at
`/art.html`, because Ladan wants exactly one art page linked from home.

## Open items

1. **Interactions.** She said "it needs some interactions" and has not specified which.
   Ask before building. Candidates: lightbox on click, hover states on the photographs,
   scroll reveal per section.
2. **Descriptions.** Urban Lion, Edge and Weightlessness have no artist statement. The
   old site had Squarespace boilerplate ("Call out a feature, benefit, or value of your
   site") and one placeholder ("kjdhcdsdhsd hsdhsdh"), so nothing was carried over.
   These need her words. Do not invent them.
3. **Jewelry photo order** is my best reading of the PDF, not confirmed. Ten photos of
   hands against the same earth wall. Worth checking against the PDF with her.
4. **Constellation.** Now decorative. Decide whether it stays, gets its click behaviour
   back, or comes out.
5. **Masonry orphan.** The last jewelry column can end with a single image depending on
   viewport width.

## Hard rules for this page

- **No em dashes.** Anywhere, including `<title>` and meta. `grep -c "—" art.html` must
  return 0 before anything ships.
- **Never push without her go-ahead.** The repo is public; pushing is publishing.
- Design tokens only, 8px radius throughout this page, 1px `var(--rule)` borders.
- Verify in light, dark and mobile before calling anything done.
