// Render public/favicon.svg → apple-touch-icon (180), favicon-32, favicon-16,
// and a multi-size favicon.ico. Run via: pnpm run favicons (or as part of prebuild).
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const svgPath = resolve(root, "public", "favicon.svg");
const svg = await readFile(svgPath);

async function pngOf(size) {
  return sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const sizes = {
  "apple-touch-icon.png": 180,
  "favicon-32x32.png": 32,
  "favicon-16x16.png": 16,
};

for (const [name, size] of Object.entries(sizes)) {
  const buf = await pngOf(size);
  const out = resolve(root, "public", name);
  await writeFile(out, buf);
  console.log(`✓ ${name} (${size}px, ${(buf.length / 1024).toFixed(1)} kB)`);
}

// Sharp 0.34+ supports writing ICO directly via .toFormat("ico"); fall back
// to a single-size 32×32 PNG-in-ICO container the manual way if needed.
try {
  const ico = await sharp(svg, { density: 384 })
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFormat("png")
    .toBuffer();
  // Build a minimal 1-image ICO wrapping the 32×32 PNG.
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(1, 4); // count
  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(32, 0); // width
  dirEntry.writeUInt8(32, 1); // height
  dirEntry.writeUInt8(0, 2);  // palette
  dirEntry.writeUInt8(0, 3);  // reserved
  dirEntry.writeUInt16LE(1, 4);  // planes
  dirEntry.writeUInt16LE(32, 6); // bpp
  dirEntry.writeUInt32LE(ico.length, 8); // size
  dirEntry.writeUInt32LE(22, 12); // offset (6 + 16)
  const out = resolve(root, "public", "favicon.ico");
  await writeFile(out, Buffer.concat([header, dirEntry, ico]));
  console.log(`✓ favicon.ico (32px PNG-in-ICO, ${((ico.length + 22) / 1024).toFixed(1)} kB)`);
} catch (err) {
  console.warn("⚠ favicon.ico generation skipped:", err?.message ?? err);
}
