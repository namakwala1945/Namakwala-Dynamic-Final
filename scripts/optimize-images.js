const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");

// 📂 Input = public/assets, Output = public/optimized
const INPUT_DIR = path.join(__dirname, "..", "public", "assets");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "optimized");

// responsive sizes
const sizes = [
  { name: "small", width: 480, quality: 70 },
  { name: "medium", width: 1000, quality: 75 },
  { name: "large", width: 1600, quality: 80 },
];

// ensure folder exists
async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

// walk all subfolders and collect files
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath)); // 👈 recursive
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

// optimize one file
async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return;

  const relative = path.relative(INPUT_DIR, file);
  const basename = path.basename(relative, ext);
  const subdir = path.dirname(relative);

  const outDir = path.join(OUTPUT_DIR, subdir);
  await ensureDir(outDir);

  for (const s of sizes) {
    const outBase = `${basename}-${s.name}`;

    const img = sharp(file).resize({
      width: s.width,
      withoutEnlargement: true,
    });

    await img.clone().webp({ quality: s.quality }).toFile(path.join(outDir, `${outBase}.webp`));
    await img.clone().avif({ quality: s.quality }).toFile(path.join(outDir, `${outBase}.avif`));
    await img.clone().jpeg({ quality: Math.max(60, s.quality - 10) }).toFile(path.join(outDir, `${outBase}.jpg`));
  }
  console.log("✅ Optimized:", relative);
}

// main runner
(async () => {
  await ensureDir(OUTPUT_DIR);
  const files = await walk(INPUT_DIR);
  for (const f of files) {
    try {
      await processFile(f);
    } catch (err) {
      console.error("❌ Failed:", f, err.message);
    }
  }
  console.log("🎉 Done. Optimized images in /public/optimized/");
})();
