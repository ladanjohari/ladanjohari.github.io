// Usage: node capture-x.js <option-a|option-b|option-c> [draft|final]
const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const name = process.argv[2] || 'option-a';
const mode = process.argv[3] || 'draft';

const DURATION = 15;
const FPS = mode === 'final' ? 30 : 15;
const DSF = mode === 'final' ? 4 : 2; // final captures at 1440x900
const TOTAL_FRAMES = DURATION * FPS;
const WIDTH = 360;
const HEIGHT = 225;

const HTML_PATH = path.resolve(__dirname, `${name}.html`);
const FRAMES_DIR = path.resolve(__dirname, `frames-${name}`);
const OUT = path.resolve(__dirname, `si-x-${name}-${mode}.mp4`);

if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true });
fs.mkdirSync(FRAMES_DIR);

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: DSF });
  await page.goto(`file://${HTML_PATH}`);
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    document.getAnimations().forEach(a => { a.pause(); a.currentTime = 0; });
  });

  console.log(`Capturing ${TOTAL_FRAMES} frames (${mode})...`);
  const frameMs = 1000 / FPS;

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    await page.evaluate((ms) => {
      document.getAnimations().forEach(a => { a.currentTime = ms; });
    }, i * frameMs);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.screenshot({ path: path.join(FRAMES_DIR, `frame${String(i).padStart(4,'0')}.png`), clip: { x:0, y:0, width:WIDTH, height:HEIGHT } });
    if (i % 30 === 0) process.stdout.write(`  frame ${i}/${TOTAL_FRAMES}\r`);
  }

  await browser.close();
  console.log('\nEncoding...');

  // X/Twitter MP4: capture is WIDTH*DSF wide; keep native size, h264 even dims
  execSync(`ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame%04d.png" \
    -vf "fps=${FPS},scale=${WIDTH*DSF}:-2:flags=lanczos,format=yuv420p" \
    -c:v libx264 -crf 18 -preset slow -movflags +faststart \
    "${OUT}"`, { stdio: 'inherit' });

  fs.rmSync(FRAMES_DIR, { recursive: true });
  console.log('Done:', OUT);
})();
