#!/usr/bin/env node
// Builds a letter-size HTML deck from a project's six markdown documents.
// Usage: node scripts/build-deck.mjs <project-folder> [--out file.html] [--allow-missing]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const dirArg = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--out');
const outIdx = args.indexOf('--out');
const allowMissing = args.includes('--allow-missing');
if (!dirArg) {
  console.error('Usage: node scripts/build-deck.mjs <project-folder> [--out file.html] [--allow-missing]');
  process.exit(1);
}
const projectDir = path.resolve(process.cwd(), dirArg);
const outFile = outIdx > -1 ? path.resolve(process.cwd(), args[outIdx + 1]) : path.join(projectDir, 'deck.html');

const readJson = (p, fallback) => {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { if (fallback !== undefined) return fallback; throw new Error(`Could not read ${p}: ${e.message}`); }
};
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cssStr = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');

const config = readJson(path.join(ROOT, 'kit.config.json'), {});
const project = readJson(path.join(projectDir, 'project.json'));
for (const k of ['projectName', 'author']) {
  if (!project[k]) { console.error(`project.json is missing "${k}".`); process.exit(1); }
}

const DOCS = [
  { n: 1, file: '01-product-requirements.md', title: 'Product Requirements', tag: 'What it does',
    blurb: 'What the product does, feature by feature. If a feature is not on this list, it is not in the build.',
    check: 'Anything you assumed would be included but is not listed. And every "done when": could you check it yourself in under a minute?' },
  { n: 2, file: '02-technical-requirements.md', title: 'Technical Requirements', tag: 'What it is built on',
    blurb: 'The tools it runs on, decided once and written down, so nobody is guessing halfway through.',
    check: 'Every tool you already pay for should appear under "Connects to", and you should understand each "why" well enough to explain it to a colleague.' },
  { n: 3, file: '03-app-flow.md', title: 'App Flow', tag: 'How people move through it',
    blurb: 'Which page comes next, what every button does, and where people land when something goes wrong.',
    check: 'Dead ends. Walk each journey as one of your own customers. Every red path should still let the person finish what they came to do.' },
  { n: 4, file: '04-design-brief.md', title: 'Design Brief', tag: 'How it looks and sounds',
    blurb: 'Colours, fonts and tone, so the tenth screen looks as on-brand as the first.',
    check: 'Your real colour codes and fonts, not close matches. If this brief could describe any company\'s site, it is not specific enough.' },
  { n: 5, file: '05-backend-schema.md', title: 'Backend Schema', tag: 'Where the data lives',
    blurb: 'What gets stored, how it connects, and exactly who can see or change each piece.',
    check: 'For each record, ask: should this person really be able to see it? Nothing about children, health or payments should surprise you.' },
  { n: 6, file: '06-implementation-plan.md', title: 'Implementation Plan', tag: 'What gets built, in what order',
    blurb: 'The build order, with the points where you sign off before the next stage starts.',
    check: 'A sign-off you can do yourself at every stage. If you cannot test it, you will only find out at the end.' },
];

// ---------- flow diagrams (```flow blocks) ----------
function renderFlow(text) {
  const out = [];
  let open = false;
  const start = (title, role) => {
    if (open) out.push('</div>');
    out.push(`<div class="flow"><div class="flow-head"><b>${esc(title)}</b>${role ? `<span>${esc(role)}</span>` : ''}</div>`);
    open = true;
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const j = line.match(/^journey:\s*(.+)$/i);
    if (j) { const [t, r] = j[1].split('|').map((s) => s.trim()); start(t, r); continue; }
    if (!open) start('Journey', '');
    const isErr = /^error:/i.test(line);
    const steps = line.replace(/^(error|ok):\s*/i, '').split('>').map((s) => s.trim()).filter(Boolean);
    const width = Math.min(100, steps.length * 22);
    out.push(`<ol class="rail ${isErr ? 'rail-err' : 'rail-ok'}" style="width:${width}%">` + steps.map((s, i) => {
      const last = i === steps.length - 1;
      const mark = isErr ? (i === 0 ? '!' : last ? '↻' : '') : (last ? '✓' : String(i + 1));
      return `<li class="${last ? 'end' : ''}"><i>${mark}</i><span>${esc(s)}</span></li>`;
    }).join('') + '</ol>');
  }
  if (open) out.push('</div>');
  return out.join('');
}

marked.use({
  gfm: true,
  renderer: {
    code(a, b) {
      const text = typeof a === 'object' ? a.text : a;
      const lang = ((typeof a === 'object' ? a.lang : b) || '').trim();
      if (lang === 'flow') return renderFlow(text);
      return `<pre><code>${esc(text)}</code></pre>`;
    },
  },
});

// ---------- design-brief swatches ----------
function addSwatches(html, md) {
  const sec = md.split(/^##\s+/m).find((s) => /^colou?rs/i.test(s)) || '';
  const rows = [...sec.matchAll(/^\|\s*([^|]+?)\s*\|\s*(#[0-9a-fA-F]{6})\s*\|\s*([^|]*?)\s*\|/gm)];
  if (!rows.length) return html;
  const sw = '<div class="swatches">' + rows.map(([, name, hex, use]) =>
    `<div class="swatch"><div class="chip" style="background:${hex}"></div><div class="meta"><b>${esc(name)}</b>${esc(hex)}<br>${esc(use)}</div></div>`
  ).join('') + '</div>';
  html = html.replace(/(<h2[^>]*>\s*Colou?rs\s*<\/h2>)/i, `$1${sw}`);
  return html.replace(/<td>(#[0-9a-fA-F]{6})<\/td>/g, (m, h) => `<td><span class="sw" style="background:${h}"></span>${h}</td>`);
}

// ---------- images ----------
const MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml', webp: 'image/webp', gif: 'image/gif' };
function dataUri(rel) {
  if (!rel) return '';
  const candidates = [path.resolve(projectDir, rel), path.resolve(rel)];
  const p = candidates.find((c) => fs.existsSync(c));
  if (!p) { console.warn(`! Image not found: ${rel} (skipped)`); return ''; }
  const mime = MIME[path.extname(p).slice(1).toLowerCase()];
  if (!mime) { console.warn(`! Unsupported image type: ${rel} (skipped)`); return ''; }
  return `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
}
const luminance = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return 1;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// ---------- build document sections ----------
const missing = [];
const docSections = [];
const present = {};
for (const d of DOCS) {
  const p = path.join(projectDir, d.file);
  if (!fs.existsSync(p)) { missing.push(d); present[d.n] = false; continue; }
  present[d.n] = true;
  let md = fs.readFileSync(p, 'utf8').replace(/^﻿/, '').replace(/^\s*#\s+[^\n]*\n/, '');
  let html = marked.parse(md);
  if (d.n === 4) html = addSwatches(html, md);
  docSections.push(`
<section class="sheet doc" id="doc-${d.n}" data-view="doc-${d.n}" data-group="doc">
  <header class="doc-head"><div class="num">${d.n}</div><div>
    <p class="eyebrow">Document ${d.n} of 6 · ${esc(d.tag)}</p><h1>${esc(d.title)}</h1><p class="blurb">${esc(d.blurb)}</p></div></header>
  <div class="proj-line">${esc(project.projectName)} · Version ${esc(project.version || '1')} · ${esc(project.date || '')}</div>
  <aside class="check"><b>Before you approve, check</b>${esc(d.check)}</aside>
  <div class="prose">${html}</div>
</section>`);
}
if (missing.length && !allowMissing) {
  console.error('These documents are missing: ' + missing.map((d) => d.file).join(', ') + '\nWrite them first, or pass --allow-missing for a partial preview.');
  process.exit(1);
}

// ---------- cover ----------
const logo = dataUri(project.logo);
const coverImg = dataUri(project.coverImage);
const brandBg = project.brand?.primary && luminance(project.brand.primary) < 0.35 ? project.brand.primary : '';
const coverStyle = [brandBg ? `--cover-bg:${brandBg}` : '', coverImg ? `background-image:url('${coverImg}')` : ''].filter(Boolean).join(';');
const cover = `
<section class="sheet cover ${coverImg ? 'has-img' : ''}" id="cover" data-view="cover" ${coverStyle ? `style="${coverStyle}"` : ''}>
  <div class="motif">${[1, 2, 3, 4, 5, 6].map((n, i) => `<i style="--k:${i}">${n}</i>`).join('')}</div>
  <div class="c-top">${logo ? `<div class="logo-chip"><img src="${logo}" alt="logo"></div>` : '<span></span>'}<span class="kit-tag">${esc(config.kitName || 'Plan-First Kit')}</span></div>
  <div class="c-title"><p class="eyebrow">Pre-build planning pack</p><h1>${esc(project.projectName)}</h1>
    <p class="sub">${esc(project.whatIsBeingBuilt || '')}</p></div>
  <div class="c-meta">
    <div><b>Prepared by</b>${esc(project.author)}${project.company ? `<br>${esc(project.company)}` : ''}</div>
    <div><b>Date</b>${esc(project.date || '')}</div>
    <div><b>Version</b>${esc(project.version || '1')}</div>
    <div><b>Contains</b>6 documents</div>
  </div>
</section>`;

// ---------- contents ----------
const toc = `
<section class="sheet" id="contents" data-view="contents">
  <p class="eyebrow">Inside this pack</p><h1>Six documents, one plan</h1>
  <p class="lead">Written in order. Each one builds on the ones before it, so the build starts from decisions, not guesses.</p>
  <ol class="toc">${DOCS.map((d) => `<li data-goto="doc-${d.n}"><span class="n">${d.n}</span><div><b>${esc(d.title)}</b><span class="d">${esc(d.blurb)}</span></div><span class="st ${present[d.n] ? '' : 'todo'}">${present[d.n] ? 'Ready' : 'Not written'}</span></li>`).join('')}</ol>
  <div class="howto"><b>How to read this pack.</b> Your job is the reading, not the writing. At the end of each document there is a short check. If something is wrong, now is the cheapest moment to change it.</div>
</section>`;

// ---------- checklist + approval ----------
const allPresent = DOCS.every((d) => present[d.n]);
const checklistItems = [
  ['A feature list, read and agreed to', 1], ['The tools it runs on, written down and fixed', 2],
  ['A map of every page and what each click does', 3], ['A design brief with real colours and fonts', 4],
  ['A plan for where data lives and who sees it', 5], ['A build order with points where you sign off', 6],
];
const checklist = `
<section class="sheet" id="checklist" data-view="checklist">
  <p class="eyebrow">Before building starts</p><h1>The six-box check</h1>
  <p class="lead">Tick a box only if you have read the document and agree with it.</p>
  <ul class="checklist">${checklistItems.map(([t, n]) => `<li><span class="box ${present[n] ? '' : 'no'}">${present[n] ? '✓' : '·'}</span><span>${esc(t)}</span></li>`).join('')}</ul>
  <p>${allPresent ? 'All six documents exist. Once you have read them, this plan is ready to hand to whoever builds it.' : 'Some documents are still missing. Finish them before anyone starts building.'}</p>
  <div class="sign"><div>Approved by (name)</div><div>Date</div></div>
</section>`;

// ---------- services page ----------
const link = (url, label) => url ? `<a class="cta" href="${esc(url)}">${esc(label)}</a>` : '';
const services = config.showServicesPage === false ? '' : `
<section class="sheet" id="help" data-view="help">
  <p class="eyebrow">Next step</p><h1>Want a second pair of eyes?</h1>
  <p class="lead">You now have a plan most projects never get. If you would like help using it, there are three ways to go from here.</p>
  <div class="cards">
    <div class="card"><span class="tag">On your own</span><h3>Build from this pack</h3><p>Hand these six documents to your builder, freelancer or AI tool, and sign off stage by stage.</p></div>
    <div class="card"><span class="tag">Done with you</span><h3>Plan review or sprint</h3><p>${esc(config.creator || 'Your guide')} reviews your six documents with you, fixes the gaps, and runs the interviews with your team if needed.</p>${link(config.bookingUrl, 'Book a call')}</div>
    <div class="card"><span class="tag">Done for you</span><h3>Managed build</h3><p>Hand over the project and have it planned, built and managed for you and your team.</p>${link(config.bookingUrl, 'Book a call')}</div>
  </div>
  <div class="links">
    ${config.tutorialUrl ? `<p>Learn the whole method on video: <a href="${esc(config.tutorialUrl)}">${esc(config.tutorialUrl)}</a></p>` : ''}
    ${config.kitPageUrl ? `<p>Get the Plan-First Kit and updates: <a href="${esc(config.kitPageUrl)}">${esc(config.kitPageUrl)}</a></p>` : ''}
    <p>${esc(config.creator || '')} · <a href="${esc(config.website || '')}">${esc(config.website || '')}</a></p>
  </div>
</section>`;

// ---------- page chrome ----------
const css = fs.readFileSync(path.join(ROOT, 'templates', 'deck.css'), 'utf8');
const pageCss = `
@page{size:letter;margin:.55in .75in .65in;
  @top-right{content:"${cssStr(project.projectName)}";font:8pt Helvetica,Arial,sans-serif;color:#5B6B7A}
  @bottom-left{content:"${cssStr(config.footerText || '')}";font:7.5pt Helvetica,Arial,sans-serif;color:#5B6B7A}
  @bottom-right{content:"Page " counter(page);font:7.5pt Helvetica,Arial,sans-serif;color:#5B6B7A}}
@page cover{margin:0;@top-right{content:none}@bottom-left{content:none}@bottom-right{content:none}}`;
const navButtons = [['all', 'Everything'], ['cover', 'Cover'], ['contents', 'Contents'],
  ...DOCS.map((d) => [`doc-${d.n}`, `${d.n} · ${d.title.split(' ')[0]}`]), ['checklist', 'Checklist'],
  ...(services ? [['help', 'Next step']] : [])];

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(project.projectName)} · Planning pack</title>
<style>${css}${pageCss}</style></head>
<body>
<nav class="topbar"><span class="brand">${esc(project.projectName)}</span>${navButtons.map(([v, l]) => `<button data-v="${v}">${esc(l)}</button>`).join('')}</nav>
<div class="approve-note"><b>Reviewing?</b> Use the buttons above to view one page or everything. Then go back to Claude and say <b>"approved"</b> to export the PDF, or <b>"change Doc 2: …"</b> and the deck will be rebuilt.</div>
${cover}${toc}${docSections.join('\n')}${checklist}${services}
<script>
const sheets=[...document.querySelectorAll('.sheet')],btns=[...document.querySelectorAll('.topbar button')];
function show(v){sheets.forEach(s=>s.classList.toggle('is-hidden',!(v==='all'||s.dataset.view===v)));
  btns.forEach(b=>b.classList.toggle('on',b.dataset.v===v));try{history.replaceState(null,'','#'+v)}catch(e){}window.scrollTo(0,0)}
btns.forEach(b=>b.addEventListener('click',()=>show(b.dataset.v)));
document.querySelectorAll('[data-goto]').forEach(el=>el.addEventListener('click',()=>show(el.dataset.goto)));
show((location.hash||'#all').slice(1)||'all');
</script>
</body></html>`;

fs.writeFileSync(outFile, html);
const warn = [];
if (config.bookingUrl && /REPLACE/i.test(config.bookingUrl)) warn.push('bookingUrl still has a placeholder');
console.log(`Deck written: ${outFile}`);
if (missing.length) console.log(`Partial preview. Not written yet: ${missing.map((d) => d.title).join(', ')}`);
warn.forEach((w) => console.warn('! ' + w));
