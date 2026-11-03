#!/usr/bin/env node
// Checks that a project's six documents are complete and consistent enough to build a deck.
// Usage: node scripts/validate.mjs <project-folder>
import fs from 'node:fs';
import path from 'node:path';

const dirArg = process.argv[2];
if (!dirArg) { console.error('Usage: node scripts/validate.mjs <project-folder>'); process.exit(1); }
const dir = path.resolve(process.cwd(), dirArg);

const REQUIRED = {
  1: { file: '01-product-requirements.md', headings: ['Goal', 'Who uses it', 'Features', 'Not in this version'], tables: ['Features'] },
  2: { file: '02-technical-requirements.md', headings: ['Choices', 'Connects to', 'Decisions still needed'], tables: ['Choices'] },
  3: { file: '03-app-flow.md', headings: ['Main path', 'Journeys', 'When something goes wrong', 'Pages'], tables: ['Pages'] },
  4: { file: '04-design-brief.md', headings: ['Colours', 'Fonts', 'How things look', 'Words on screen'], tables: ['Colours', 'How things look'] },
  5: { file: '05-backend-schema.md', headings: ['Records', 'How records link', 'Rules', 'Sensitive data'], tables: ['Records'] },
  6: { file: '06-implementation-plan.md', headings: ['Stages', 'Riskiest part first', 'What you provide'], tables: ['Stages'] },
};
const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);

function sections(md) {
  const map = {}; let cur = null;
  for (const line of md.split('\n')) {
    const m = line.match(/^##\s+(.*?)\s*$/);
    if (m) { cur = m[1].toLowerCase(); map[cur] = ''; } else if (cur) map[cur] += line + '\n';
  }
  return map;
}
// Data rows of the first markdown table in a section (header and separator rows dropped)
const tableRows = (body) => body.split('\n').filter((l) => l.trim().startsWith('|')).slice(2)
  .map((r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim().replace(/\*\*/g, '')));

// project.json
try {
  const p = JSON.parse(fs.readFileSync(path.join(dir, 'project.json'), 'utf8'));
  for (const k of ['projectName', 'author', 'whatIsBeingBuilt', 'date']) if (!p[k]) err(`project.json: "${k}" is empty`);
} catch (e) { err(`project.json missing or invalid (${e.message})`); }

const texts = {};
for (const [n, spec] of Object.entries(REQUIRED)) {
  const f = path.join(dir, spec.file);
  if (!fs.existsSync(f)) { err(`Doc ${n}: ${spec.file} not found`); continue; }
  const md = fs.readFileSync(f, 'utf8');
  texts[n] = md;
  if (md.trim().length < 250) err(`Doc ${n}: file is almost empty`);
  if (/\bTODO\b|\bTBD\b|\{\{|\}\}|\[(?:your|insert|fill)[^\]]*\]/i.test(md)) err(`Doc ${n}: contains unfinished placeholders (TODO / TBD / [insert…])`);
  const sec = sections(md);
  for (const h of spec.headings) {
    const body = sec[h.toLowerCase()];
    if (body === undefined) err(`Doc ${n}: missing section "## ${h}"`);
    else if (body.trim().length < 15) err(`Doc ${n}: section "${h}" is empty`);
  }
  for (const t of spec.tables) {
    const body = sec[t.toLowerCase()] || '';
    if (body && body.split('\n').filter((l) => l.trim().startsWith('|')).length < 3) err(`Doc ${n}: "${t}" needs a table with at least one row`);
  }
}

// Doc 3 flows
if (texts[3]) {
  const blocks = [...texts[3].matchAll(/```flow\n([\s\S]*?)```/g)].map((m) => m[1]);
  if (!blocks.length) err('Doc 3: no ```flow diagrams found');
  const all = blocks.join('\n');
  if (!/^error:/im.test(all)) err('Doc 3: no error paths ("error: …") found. Every journey needs a "when it goes wrong" path');
  for (const line of all.split('\n')) {
    const steps = line.replace(/^(error|ok):/i, '').split('>').filter((s) => s.trim());
    if (!/^journey:/i.test(line.trim()) && steps.length > 6) warn(`Doc 3: a flow line has ${steps.length} steps (6 reads best): "${line.trim().slice(0, 50)}…"`);
  }
}
// Doc 4 colours
if (texts[4]) {
  const hex = new Set((texts[4].match(/#[0-9a-fA-F]{6}\b/g) || []).map((h) => h.toUpperCase()));
  if (hex.size < 3) err(`Doc 4: needs at least 3 real hex colour codes (found ${hex.size})`);
}
// Doc 6 stages
if (texts[6]) {
  const rows = tableRows(sections(texts[6])['stages'] || '');
  if (rows.length < 3) warn('Doc 6: fewer than 3 stages. Smaller stages are easier to sign off');
}
// Cross-check: every Doc 1 feature should be named in the Doc 6 build plan.
// (Doc 3 names journeys after actions, not features, so the full cross-check is the reviewer agent's job.)
if (texts[1] && texts[6]) {
  const feats = tableRows(sections(texts[1])['features'] || '').map((r) => r[0]).filter(Boolean);
  for (const f of feats) {
    if (!texts[6].toLowerCase().includes(f.toLowerCase())) warn(`Doc 1 feature "${f}" is not named in the Doc 6 build plan`);
  }
}

console.log(`Checked: ${dir}`);
warnings.forEach((w) => console.log('  warning: ' + w));
errors.forEach((e) => console.log('  ERROR:   ' + e));
console.log(errors.length ? `\n${errors.length} problem(s) to fix.` : `\nAll six documents pass${warnings.length ? ` (${warnings.length} warning(s))` : ''}.`);
process.exit(errors.length ? 1 : 0);
