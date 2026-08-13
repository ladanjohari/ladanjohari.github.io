/* Trails hover preview.
     node capture.js          light clip  -> trails-frame.mp4
     node capture.js dark     dark clip   -> trails-frame-dark.mp4
   Output matches the shipped files: 392x244 CSS at 2x = 784x486, 20fps, 10s. */
/* puppeteer is installed once, in ../SI-previews. */
const puppeteer = require('../SI-previews/node_modules/puppeteer');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const DARK = process.argv[2] === 'dark';
const DURATION = 10;
const FPS = 20;
const TOTAL_FRAMES = DURATION * FPS;
const WIDTH = 392, HEIGHT = 244;

const HTML_PATH = path.resolve(__dirname, 'animation.html');
const FRAMES_DIR = path.resolve(__dirname, DARK ? 'frames-dark' : 'frames-light');
const OUT = path.resolve(__dirname, '..', DARK ? 'trails-frame-dark.mp4' : 'trails-frame.mp4');

if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true });
fs.mkdirSync(FRAMES_DIR);

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });
  await page.goto(`file://${HTML_PATH}${DARK ? '?theme=dark' : ''}`);
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    document.getAnimations().forEach(a => { a.pause(); a.currentTime = 0; });
  });

  console.log(`${DARK ? 'dark' : 'light'}: capturing ${TOTAL_FRAMES} frames`);
  const frameMs = 1000 / FPS;
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    await page.evaluate((ms) => {
      document.getAnimations().forEach(a => { a.currentTime = ms; });
    }, i * frameMs);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.screenshot({ path: path.join(FRAMES_DIR, `frame${String(i).padStart(4,'0')}.png`),
                            clip: { x:0, y:0, width:WIDTH, height:HEIGHT } });
  }
  await browser.close();

  execSync(`ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame%04d.png" \
    -vf "fps=${FPS},scale=${WIDTH*2}:-2:flags=lanczos,format=yuv420p" \
    -c:v libx264 -crf 18 -preset slow -movflags +faststart "${OUT}"`, { stdio: 'inherit' });

  fs.rmSync(FRAMES_DIR, { recursive: true });
  console.log('done:', OUT);
})();
