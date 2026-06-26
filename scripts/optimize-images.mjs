#!/usr/bin/env node
/**
 * Automatic image optimizer for the NARA site.
 *
 * What it does (idempotent — safe to run on every build):
 *   1. Walks public/ for raster images (.png .jpg .jpeg .webp).
 *   2. Downscales each to a sane max edge for how it's displayed
 *      (logos 600px, heroes 1920px, gallery 1280px, default 1600px).
 *   3. Re-encodes everything to WebP (quality ~80).
 *   4. For png/jpg/jpeg it converts to .webp, deletes the original, and
 *      rewrites every reference to it across src/, index.html and public/*.json
 *      so nothing breaks. webp files are resized/recompressed in place.
 *   5. Skips PWA icons, favicons, splash screens and OG/social images, which
 *      must keep their original format.
 *
 * Run:  node scripts/optimize-images.mjs            (optimize)
 *       node scripts/optimize-images.mjs --dry      (report only, no writes)
 */
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');
const DRY = process.argv.includes('--dry');

// Assets that must keep their original format/path (PWA, favicons, OG/social, splash).
const PROTECTED = /(^|\/)(icons|splash)\/|favicon|og-default|og-nara|apple-touch|manifest|nara-logo\.png$/i;

const RASTER = new Set(['.png', '.jpg', '.jpeg', '.webp']);

// Max longest-edge (px) + webp quality, chosen by what the asset is.
function ruleFor(rel) {
  const p = rel.toLowerCase();
  if (/logo|emblem|badge|crest|partner/.test(p)) return { max: 600, q: 82 };
  if (/hero|banner|cover/.test(p))               return { max: 1920, q: 80 };
  if (/gallery|achiev|acrhiev|milestone|media/.test(p)) return { max: 1280, q: 80 };
  return { max: 1600, q: 80 };
}

async function walk(dir, out = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

function fmtMB(bytes) { return (bytes / 1048576).toFixed(2) + ' MB'; }

async function main() {
  const files = (await walk(PUBLIC)).filter(f => RASTER.has(path.extname(f).toLowerCase()));
  const renameMap = new Map(); // "/old/path.png" -> "/new/path.webp"
  let before = 0, after = 0, touched = 0, converted = 0;

  for (const file of files) {
    const rel = '/' + path.relative(PUBLIC, file).split(path.sep).join('/');
    const ext = path.extname(file).toLowerCase();
    if (PROTECTED.test(rel)) continue;

    const origBytes = (await fs.stat(file)).size;
    let img, meta;
    try {
      img = sharp(file, { failOn: 'none' });
      meta = await img.metadata();
    } catch (e) {
      console.warn(`  skip (unreadable): ${rel} — ${e.message}`);
      continue;
    }

    const { max, q } = ruleFor(rel);
    const longest = Math.max(meta.width || 0, meta.height || 0);
    const needsResize = longest > max;

    let buf;
    try {
      let pipe = sharp(file, { failOn: 'none' });
      if (needsResize) pipe = pipe.resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true });
      buf = await pipe.webp({ quality: q, effort: 5 }).toBuffer();
    } catch (e) {
      console.warn(`  skip (encode failed): ${rel} — ${e.message}`);
      continue;
    }

    const isWebp = ext === '.webp';
    const target = isWebp ? file : file.slice(0, -ext.length) + '.webp';
    const targetRel = isWebp ? rel : rel.slice(0, -ext.length) + '.webp';

    // For webp: only rewrite if we actually saved meaningful bytes.
    if (isWebp && !needsResize && buf.length >= origBytes * 0.95) {
      before += origBytes; after += origBytes;
      continue;
    }

    before += origBytes;
    after += buf.length;
    touched++;

    if (DRY) {
      const note = isWebp ? 'resize' : `→webp`;
      console.log(`  ${note}: ${rel}  ${fmtMB(origBytes)} → ${fmtMB(buf.length)}${needsResize ? `  (${longest}px→${max}px)` : ''}`);
      if (!isWebp) renameMap.set(rel, targetRel);
      continue;
    }

    await fs.writeFile(target, buf);
    if (!isWebp) {
      await fs.unlink(file);
      renameMap.set(rel, targetRel);
      converted++;
    }
  }

  // Rewrite references for converted files (png/jpg/jpeg → webp).
  let refEdits = 0;
  if (renameMap.size) {
    const codeFiles = [
      ...(await walk(path.join(ROOT, 'src'))),
      path.join(ROOT, 'index.html'),
      ...(await walk(PUBLIC)).filter(f => f.endsWith('.json')),
    ].filter(f => /\.(jsx?|tsx?|html|json|css|mjs)$/.test(f));

    for (const cf of codeFiles) {
      let text;
      try { text = await fs.readFile(cf, 'utf8'); } catch { continue; }
      let changed = text;
      for (const [oldRel, newRel] of renameMap) {
        if (changed.includes(oldRel)) changed = changed.split(oldRel).join(newRel);
        // also handle references without the leading slash
        const oldNoSlash = oldRel.slice(1), newNoSlash = newRel.slice(1);
        if (changed.includes(oldNoSlash)) changed = changed.split(oldNoSlash).join(newNoSlash);
      }
      if (changed !== text) {
        if (!DRY) await fs.writeFile(cf, changed);
        refEdits++;
      }
    }
  }

  console.log('\n── Image optimization summary ──');
  console.log(`  files re-encoded : ${touched}`);
  console.log(`  png/jpg→webp     : ${renameMap.size}`);
  console.log(`  source files w/ rewritten refs: ${refEdits}`);
  console.log(`  total image bytes: ${fmtMB(before)} → ${fmtMB(after)}  (saved ${fmtMB(before - after)})`);
  if (DRY) console.log('  (dry run — nothing written)');
}

main().catch(e => { console.error(e); process.exit(1); });
