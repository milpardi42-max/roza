#!/usr/bin/env node
/**
 * grade-8d.mjs — پردازش دائمی «گرید 8D» روی تصاویر سایت
 * رنگ سینمایی هماهنگ با پالت برند + کشش + وینت + گرین + شارپنس
 *
 * نحوهٔ استفاده:
 *   node scripts/grade-8d.mjs            → گرید همهٔ عکس‌های جدید/تغییرکرده (مانیفست)
 *   node scripts/grade-8d.mjs --force    → بازگردانی از بکاپ و گرید مجدد همه
 *   node scripts/grade-8d.mjs path/...   → فقط مسیر/پوشهٔ داده‌شده
 *
 * عکس‌های آپلودشدهٔ آینده: فایل را در public/assets/... بگذارید و دوباره اجرا کنید
 * (یا `npm run grade`). مانیفست باعث می‌شود هر عکس فقط یک‌بار گرید شود.
 */

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(process.cwd(), "public");
const BACKUP = path.resolve(process.cwd(), "assets-originals");
const MANIFEST = path.resolve(process.cwd(), "scripts/.graded-manifest.json");

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const SKIP_DIRS = ["brand"]; // لوگوها — بدون گرید رنگی
const MIN_BYTES = 6 * 1024; // آیکن‌های ریز

const force = process.argv.includes("--force");
const onlyPath = process.argv
  .filter((a) => !a.startsWith("--"))
  .slice(2)[0];

/* ── پروفایل گرید برند: سایه‌های سردِ نیلی + هایلایت‌های گرم برنجی ── */
const RECOMB = [
  // نیلی #2E4A5C در سایه‌ها + گرمای برنجی #C0973F در هایلایت
  [1.06, -0.02, -0.02],
  [-0.01, 1.02, -0.03],
  [-0.04, -0.02, 1.10],
];

async function* walk(dir) {
  for (const d of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const hash = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 16);

function vignetteSVG(w, h) {
  // وینت ظریفِ دراماتیک: از سفید (خنثی) در مرکز تا خاکستری تیرهٔ ۸۰٪ در لبه
  return Buffer.from(
    `<svg width="${w}" height="${h}">
      <radialGradient id="v" cx="50%" cy="46%" r="78%">
        <stop offset="52%" stop-color="rgb(255,255,255)"/>
        <stop offset="80%" stop-color="rgb(216,216,216)"/>
        <stop offset="100%" stop-color="rgb(82,82,82)"/>
      </radialGradient>
      <rect width="100%" height="100%" fill="url(#v)"/>
    </svg>`
  );
}

function grainSVG(w, h) {
  // گرین واقعی: نویز را به کانال آلفا می‌بریم تا overlay سیاه‌سفید بدهد
  return Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="t"/>
        <feColorMatrix in="t" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0.7 0.7 0.7 0 -0.35"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#n)"/>
    </svg>`
  );
}

async function gradeOne(file) {
  const rel = path.relative(ROOT, file);
  const backupPath = path.join(BACKUP, rel);
  await fs.mkdir(path.dirname(backupPath), { recursive: true });

  // بکاپ اورجینال (فقط اگر وجود ندارد) یا بازگردانی در حالت --force
  try {
    await fs.access(backupPath);
    if (force) await fs.copyFile(backupPath, file);
  } catch {
    await fs.copyFile(file, backupPath);
  }

  const src = await fs.readFile(force ? backupPath : file);
  const img = sharp(src, { failOn: "none" });
  const meta = await img.metadata();
  const w = meta.width ?? 800;
  const h = meta.height ?? 600;

  let pipe = sharp(await img.toBuffer(), { failOn: "none" })
    .rotate() // احترام به EXIF
    .recomb(RECOMB)
    .linear(1.05, -7) // کنتراست سینمایی
    .modulate({ saturation: 1.12, brightness: 1.01 })
    .composite([
      { input: grainSVG(w, h), blend: "overlay" },
      { input: vignetteSVG(w, h), blend: "multiply" },
    ])
    .sharpen({ sigma: 1.1, m1: 0.9, m2: 2.2 });

  const ext = path.extname(file).toLowerCase();
  let outBuf;
  if (ext === ".png") outBuf = await pipe.png({ compressionLevel: 9, palette: w * h < 500 * 500 }).toBuffer();
  else if (ext === ".webp") outBuf = await pipe.webp({ quality: 84 }).toBuffer();
  else outBuf = await pipe.jpeg({ quality: 84, mozjpeg: true }).toBuffer();

  await fs.writeFile(file, outBuf);
  return hash(await fs.readFile(backupPath));
}

async function main() {
  let manifest = {};
  try {
    manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  } catch {}

  const targets = [];
  for await (const f of walk(onlyPath ? path.resolve(onlyPath) : ROOT)) {
    const ext = path.extname(f).toLowerCase();
    if (!EXTS.has(ext)) continue;
    const rel = path.relative(ROOT, f);
    if (SKIP_DIRS.some((d) => rel.startsWith(d + path.sep) || rel.startsWith(d + "/"))) continue;
    const st = await fs.stat(f);
    if (st.size < MIN_BYTES) continue;
    targets.push({ f, rel });
  }

  let done = 0, skipped = 0, failed = 0;
  for (const { f, rel } of targets) {
    try {
      const curHash = hash(await fs.readFile(f));
      if (!force && manifest[rel] === curHash) { skipped++; continue; }
      const origHash = await gradeOne(f);
      manifest[rel] = origHash;
      done++;
      console.log("graded:", rel);
    } catch (e) {
      failed++;
      console.error("FAIL:", rel, e.message);
    }
  }

  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 1));
  console.log(`\n✓ graded=${done}  skipped(unchanged)=${skipped}  failed=${failed}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
