#!/usr/bin/env node
// Creates projects/<slug>/ with a starter project.json and status.json.
// Usage: node scripts/new-project.mjs "Project Name" [--author "Name"] [--company "Co"] [--builds "one-line description"]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const name = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const opt = (k) => { const i = args.indexOf('--' + k); return i > -1 ? args[i + 1] : ''; };
if (!name) { console.error('Usage: node scripts/new-project.mjs "Project Name" [--author ""] [--company ""] [--builds ""]'); process.exit(1); }

const slug = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project';
const dir = path.join(ROOT, 'projects', slug);
if (fs.existsSync(dir)) { console.error(`projects/${slug} already exists. Pick another name or resume it with /plan-project.`); process.exit(1); }
fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(dir, 'project.json'), JSON.stringify({
  projectName: name, whatIsBeingBuilt: opt('builds'), author: opt('author'), company: opt('company'),
  date: today, version: '1', logo: '', coverImage: '', brand: { primary: '', accent: '' },
}, null, 2) + '\n');
fs.writeFileSync(path.join(dir, 'status.json'), JSON.stringify({
  docs: { 1: 'todo', 2: 'todo', 3: 'todo', 4: 'todo', 5: 'todo', 6: 'todo' }, deckBuilt: false, approved: false,
}, null, 2) + '\n');
console.log(`Created projects/${slug}`);
