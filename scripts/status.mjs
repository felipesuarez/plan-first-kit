#!/usr/bin/env node
// Prints where each project stands. Usage: node scripts/status.mjs [project-folder]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILES = ['01-product-requirements.md', '02-technical-requirements.md', '03-app-flow.md', '04-design-brief.md', '05-backend-schema.md', '06-implementation-plan.md'];
const NAMES = ['Product requirements', 'Technical requirements', 'App flow', 'Design brief', 'Backend schema', 'Implementation plan'];
const arg = process.argv[2];
const base = path.join(ROOT, 'projects');
const dirs = arg ? [path.resolve(process.cwd(), arg)]
  : (fs.existsSync(base) ? fs.readdirSync(base).map((d) => path.join(base, d)).filter((d) => fs.existsSync(path.join(d, 'project.json'))) : []);
if (!dirs.length) { console.log('No projects yet. Start one with /plan-project'); process.exit(0); }

for (const dir of dirs) {
  const proj = JSON.parse(fs.readFileSync(path.join(dir, 'project.json'), 'utf8'));
  console.log(`\n${proj.projectName}  (${path.relative(ROOT, dir)})`);
  let newest = 0, done = 0;
  FILES.forEach((f, i) => {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) { const s = fs.statSync(p); newest = Math.max(newest, s.mtimeMs); done++;
      console.log(`  ${i + 1}. ${NAMES[i].padEnd(24)} written (${fs.readFileSync(p, 'utf8').split(/\s+/).length} words)`); }
    else console.log(`  ${i + 1}. ${NAMES[i].padEnd(24)} not written yet`);
  });
  const deck = path.join(dir, 'deck.html');
  const pdf = path.join(dir, `${path.basename(dir)}-planning-pack.pdf`);
  console.log(`  Deck: ${fs.existsSync(deck) ? (fs.statSync(deck).mtimeMs < newest ? 'built, but OUT OF DATE (a document changed since)' : 'built and up to date') : 'not built'}`);
  console.log(`  PDF:  ${fs.existsSync(pdf) ? (fs.statSync(pdf).mtimeMs < newest ? 'exported, but OUT OF DATE' : 'exported') : 'not exported'}`);
  console.log(`  ${done}/6 documents written`);
}
