// Re-exports one of the resume HTML files to PDF. Run from this folder, which
// is the only place puppeteer is installed.
//   node _resume-pdf.js <source.html> <out.pdf>
const puppeteer = require('puppeteer');

(async () => {
  const [src, out] = process.argv.slice(2);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file://' + src, { waitUntil: 'networkidle0' });
  // The page declares Geist as a local woff2. Wait for it, or the PDF silently
  // falls back to Helvetica and every line break moves.
  await page.evaluateHandle('document.fonts.ready');
  const geist = await page.evaluate(() => document.fonts.check("12px 'Geist'"));
  if (!geist) {
    console.error('Geist did not load. Stopping rather than shipping a fallback.');
    await browser.close();
    process.exit(1);
  }
  await page.pdf({
    path: out,
    format: 'letter',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  await browser.close();
  console.log('geist loaded:', geist, '->', out);
})();
