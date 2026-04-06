// Render scripts/og-image.svg → public/og-image.png (1200x630).
// Run with: node scripts/generate-og.mjs
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(here, "og-image.svg");
const outPath = resolve(here, "..", "public", "og-image.png");

const svg = await readFile(svgPath);
const png = await sharp(svg, { density: 300 })
  .resize(1200, 630, { fit: "cover" })
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(outPath, png);
console.log(`✓ Wrote ${outPath} (${(png.length / 1024).toFixed(1)} kB)`);
