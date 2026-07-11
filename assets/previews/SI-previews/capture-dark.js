const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const DURATION = 9;
const FPS = 20;
const TOTAL_FRAMES = DURATION * FPS;
const WIDTH = 360;
const HEIGHT = 225;

const HTML_PATH = path.resolve(__dirname, 'animation-dark.html');
const FRAMES_DIR = path.resolve(__dirname, 'frames-dark');
const OUT_PREVIEW = path.resolve(__dirname, 'session-indicator-preview-dark.mp4');
const OUT_THUMB   = path.resolve(__dirname, 'session-indicator-thumb-dark.gif');

if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true });
fs.mkdirSync(FRAMES_DIR);

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });
  await page.goto(`file://${HTML_PATH}`);
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    document.getAnimations().forEach(a => { a.pause(); a.currentTime = 0; });
  });

  console.log(`Capturing ${TOTAL_FRAMES} frames...`);
  const frameMs = 1000 / FPS;

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    await page.evaluate((ms) => {
      document.getAnimations().forEach(a => { a.currentTime = ms; });
    }, i * frameMs);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.screenshot({ path: path.join(FRAMES_DIR, `frame${String(i).padStart(4,'0')}.png`), clip: { x:0, y:0, width:WIDTH, height:HEIGHT } });
    if (i % 20 === 0) process.stdout.write(`  frame ${i}/${TOTAL_FRAMES}\r`);
  }

  await browser.close();
  console.log('\nEncoding...');

  // MP4 for hover preview
  execSync(`ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame%04d.png" \
    -vf "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos,format=yuv420p" \
    -c:v libx264 -crf 18 -preset slow -movflags +faststart \
    "${OUT_PREVIEW}"`, { stdio: 'inherit' });

  // GIF for thumbnail (full res, CSS scales it down to 160x100)
  execSync(`ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame%04d.png" \
    -vf "fps=${FPS},scale=${WIDTH}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=256:stats_mode=diff[p];[s1][p]paletteuse=dither=floyd_steinberg" \
    "${OUT_THUMB}"`, { stdio: 'inherit' });

  console.log('Done.');
  console.log('Preview MP4:', OUT_PREVIEW);
  console.log('Thumb GIF:  ', OUT_THUMB);
})();
