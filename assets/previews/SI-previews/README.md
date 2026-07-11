# Session Indicator — Preview Source Files

Source files for generating the SI project card animations on the homepage.

## Files

| File | What it is |
|---|---|
| `animation-dark.html` | Dark mode animation — 360×225px self-contained scene |
| `animation-light.html` | Light mode animation — same structure, light colors |
| `capture-dark.js` | Puppeteer script to render dark animation → MP4 + GIF |
| `capture-light.js` | Puppeteer script to render light animation → MP4 + GIF |
| `helios-dark.jpg` | macOS Helios wallpaper (dark) — referenced by animation-dark.html |
| `helios-light.jpg` | macOS Helios wallpaper (light) — referenced by animation-light.html |

## Output destinations (copy these after running)

| Output file | Copy to |
|---|---|
| `session-indicator-preview-dark.mp4` | `assets/previews/session-indicator-frame.mp4` |
| `session-indicator-thumb-dark.gif` | `assets/thumbs/session-indicator.gif` |
| `session-indicator-preview-light.mp4` | `assets/previews/session-indicator-frame-light.mp4` |
| `session-indicator-thumb-light.gif` | `assets/thumbs/session-indicator-light.gif` |

## Setup (one-time)

```bash
cd assets/previews/SI-previews
npm init -y
npm install puppeteer
```

Requires: `node`, `npm`, `ffmpeg` (install via `brew install ffmpeg`)

## Regenerate

```bash
# Dark mode
node capture-dark.js
cp session-indicator-preview-dark.mp4 ../session-indicator-frame.mp4
cp session-indicator-thumb-dark.gif ../../thumbs/session-indicator.gif

# Light mode
node capture-light.js
cp session-indicator-preview-light.mp4 ../session-indicator-frame-light.mp4
cp session-indicator-thumb-light.gif ../../thumbs/session-indicator-light.gif
```

Then commit and push.

## How to adapt for another project

1. Duplicate `animation-dark.html` and `animation-light.html`, rename for your project
2. Replace the wallpaper `url()` with your project's background image (or a solid color)
3. Replace the pill/popover content with your project's UI element
4. Adjust the cursor `@keyframes cursorMove` `right` value to land on your element
5. Duplicate `capture-dark.js`, point `HTML_PATH` and output filenames to your new files
6. Run and copy outputs as above

## Key specs

- Canvas: 360×225px, `deviceScaleFactor: 2` (captures at 720×450 for sharpness)
- 20fps, 9s loop = 180 frames
- MP4: h264, crf 18, scale with `-2` (h264 requires even pixel dimensions)
- GIF: 256 colors, floyd_steinberg dithering — serve at 360×225, let CSS scale to 160×100
- Menu bar right-side order: `[SI pill] → [wifi] → [battery] → [date+time]`
