#!/usr/bin/env node
// Renders a project's deck.html to a letter-size PDF using headless Chromium.
// Usage: node scripts/export-pdf.mjs <project-folder>
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dirArg = process.argv[2];
if (!dirArg) { console.error('Usage: node scripts/export-pdf.mjs <project-folder>'); process.exit(1); }
const dir = path.resolve(process.cwd(), dirArg);
const deck = path.join(dir, 'deck.html');
if (!fs.existsSync(deck)) { console.error('deck.html not found. Build the deck first: npm run deck -- ' + dirArg); process.exit(1); }
const slug = path.basename(dir);
const out = path.join(dir, `${slug}-planning-pack.pdf`);

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { console.error('Playwright is not installed. Run: npm install'); process.exit(1); }

let browser;
try { browser = await chromium.launch(); }
catch (e) {
  console.error('Could not start the browser. Run: npm run setup\n' + e.message.split('\n')[0]);
  process.exit(1);
}
const page = await browser.newPage();
await page.goto(pathToFileURL(deck).href, { waitUntil: 'load' });
await page.emulateMedia({ media: 'print' });
await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
await browser.close();
console.log(`PDF written: ${out}`);
