// Renders animation.html to the Starling homepage clip.
//
//     node assets/previews/starling-previews/capture.js
//
// Same method as SI-previews/capture-dark.js: pause every CSS animation,
// scrub it frame by frame, screenshot at 2x, encode with ffmpeg.
// Puppeteer is the copy installed in SI-previews/node_modules (not committed;
// from a git worktree, set NODE_PATH to the main checkout's copy).
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const local = path.resolve(__dirname, '../SI-previews/node_modules/puppeteer');
const puppeteer = require(fs.existsSync(local) ? local : 'puppeteer');

const DURATION = 8;
const FPS = 20;
const WIDTH = 392;
const HEIGHT = 245;
const HTML_PATH = path.resolve(__dirname, 'animation.html');
const FRAMES_DIR = path.resolve(__dirname, 'frames');
const OUT = path.resolve(__dirname, '../starling-frame.mp4');

if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true });
fs.mkdirSync(FRAMES_DIR);

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });
  await page.goto(`file://${HTML_PATH}`);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => document.getAnimations().forEach(a => { a.pause(); a.currentTime = 0; }));

  const total = DURATION * FPS;
  for (let i = 0; i < total; i++) {
    await page.evaluate(ms => document.getAnimations().forEach(a => { a.currentTime = ms; }), i * 1000 / FPS);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.screenshot({ path: path.join(FRAMES_DIR, `frame${String(i).padStart(4, '0')}.png`), clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
  }
  await browser.close();

  // 784x490: the same size as the other homepage clips.
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i "${FRAMES_DIR}/frame%04d.png" \
    -vf "scale=784:-2:flags=lanczos,format=yuv420p" -c:v libx264 -crf 18 -preset slow -movflags +faststart "${OUT}"`);
  fs.rmSync(FRAMES_DIR, { recursive: true });
  console.log('Wrote', OUT);
})();
