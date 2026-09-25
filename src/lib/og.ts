// Open Graph images: a 1200×630 card for the site and one for each product,
// rendered at build time by src/pages/og/[card].png.ts. The same cards at
// GitHub's size are the social previews of the repositories (at the end of
// this file).
//
// A card carries the product name, the headline of the product's page and the
// platforms the product runs on, and nothing else. The text comes from the page
// copy, so a card changes when its page does. Cards are drawn in English (the
// name and platforms are the same in both languages); og:image:alt gives the
// same text in the page's language, without repeating what the headline says.
//
// Text is drawn as outlines from the Geist font files in node_modules, so the
// image does not depend on the fonts installed on the machine that builds it:
// the same commit gives the same card locally and in CI.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { create, type Font } from "fontkit";
import sharp from "sharp";
import { getProduct, productName, type ProductId } from "~/content/docs/_meta";
import type { Lang } from "~/i18n";
import { coreCopy } from "~/i18n/pages/core";
import { homeCopy } from "~/i18n/pages/home";
import { liteCopy } from "~/i18n/pages/lite";
import { thinkwatchCopy } from "~/i18n/pages/thinkwatch";

export const ogCards = ["home", "lite", "core", "enterprise"] as const;
export type OgCard = (typeof ogCards)[number];

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const ogImagePath = (card: OgCard) => `/og/${card}.png`;

/** The card each product's documentation is shared with */
export const docsOgCard: Record<ProductId, OgCard> = { thinkwatch: "enterprise", lite: "lite", core: "core" };

interface CardText {
  name: string;
  line: string;
  labels: string[];
}

/** Where each product runs. The site card lists the products instead. */
const platforms: Record<Exclude<OgCard, "home">, Record<Lang, string[]>> = {
  lite: { en: ["macOS", "Windows", "Linux"], "zh-CN": ["macOS", "Windows", "Linux"] },
  core: { en: ["Linux server", "macOS", "Windows"], "zh-CN": ["Linux 服务器", "macOS", "Windows"] },
  enterprise: { en: ["Docker Compose", "Kubernetes"], "zh-CN": ["Docker Compose", "Kubernetes"] },
};

export function cardText(card: OgCard, lang: Lang): CardText {
  switch (card) {
    case "home": {
      const c = homeCopy[lang];
      return {
        name: "ThinkWatch",
        line: `${c.h1a} ${c.h1b}`,
        labels: (["thinkwatch", "lite", "core"] as const).map((id) => productName(getProduct(id), lang)),
      };
    }
    case "lite":
      return { name: "ThinkWatch Lite", line: headline(liteCopy[lang].hero), labels: platforms.lite[lang] };
    case "core":
      return { name: "ThinkWatch Core", line: headline(coreCopy[lang].hero), labels: platforms.core[lang] };
    case "enterprise":
      return {
        name: productName(getProduct("thinkwatch"), lang),
        line: headline(thinkwatchCopy[lang].hero),
        labels: platforms.enterprise[lang],
      };
  }
}

/** A product page's h1, which is split in two for the highlight */
const headline = (hero: { titleA: string; titleHighlight: string }) => `${hero.titleA}${hero.titleHighlight}`;

/**
 * og:image:alt: the card's text, in the page's language. Labels the headline
 * already names are said once: the Lite headline lists the platforms itself.
 */
export function ogImageAlt(card: OgCard, lang: Lang): string {
  const { name, line, labels } = cardText(card, lang);
  const named = line.toLowerCase();
  const rest = labels.filter((label) => !named.includes(label.toLowerCase()));
  const zh = lang === "zh-CN";
  const text = zh ? `${name}：${line}` : `${name}: ${line}`;
  if (!rest.length) return text;
  return zh ? `${text}（${rest.join("、")}）` : `${text} (${rest.join(", ")})`;
}

// ---------- Rendering ----------

// Resolved from the project root: the endpoint runs from a bundled chunk.
const require = createRequire(join(process.cwd(), "package.json"));
const fonts = new Map<string, Font>();

function font(file: string): Font {
  let f = fonts.get(file);
  if (!f) {
    f = create(readFileSync(require.resolve(file))) as Font;
    fonts.set(file, f);
  }
  return f;
}

const sans = (weight: 400 | 600) => font(`@fontsource/geist/files/geist-latin-${weight}-normal.woff2`);
const mono = () => font("@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff2");

/** Width of a run of text in pixels, with `tracking` pixels added between glyphs */
function measure(f: Font, text: string, size: number, tracking = 0): number {
  const run = f.layout(text);
  const scale = size / f.unitsPerEm;
  const advance = run.positions.reduce((sum, p) => sum + p.xAdvance * scale, 0);
  return advance + tracking * Math.max(0, run.glyphs.length - 1);
}

/** SVG path data for a run of text whose baseline starts at (x, y) */
function outline(f: Font, text: string, size: number, x: number, y: number, tracking = 0): string {
  const run = f.layout(text);
  const scale = size / f.unitsPerEm;
  let d = "";
  run.glyphs.forEach((glyph, i) => {
    const p = run.positions[i];
    d += glyph.path.scale(scale, -scale).translate(x + p.xOffset * scale, y - p.yOffset * scale).toSVG();
    x += p.xAdvance * scale + tracking;
  });
  return d;
}

/** Greedy word wrap */
function wrap(f: Font, text: string, size: number, width: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(f, next, size) > width) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const colors = {
  bg: "#0b1220",
  text: "#e6ebf2",
  sub: "#cbd5e1",
  brand: "#3ddbd9",
  dim: "#8a96ab",
  borderStrong: "#2a3a63",
  grid: "#94a3b8",
};

/** The logo, placed as a nested SVG */
function logo(x: number, y: number, size: number): string {
  const svg = readFileSync(join(process.cwd(), "public", "favicon.svg"), "utf8");
  return svg.replace("<svg ", `<svg x="${x}" y="${y}" width="${size}" height="${size}" `);
}

export const renderOgImage = (card: OgCard) => renderCard(cardText(card, "en"), OG_WIDTH, OG_HEIGHT, card);

/** A card of `W`×`H` pixels. `card` names it in errors. */
async function renderCard({ name, line, labels }: CardText, W: number, H: number, card: string): Promise<Buffer> {
  const X = 80;
  const width = W - 2 * X;

  // Name: shrink only if a longer name ever needs it. Its baseline is a little
  // above the middle: 304 on a 630-pixel card.
  let nameSize = 88;
  while (measure(sans(600), name, nameSize, -0.025 * nameSize) > width) nameSize -= 2;
  const nameY = Math.round(H * 0.4825);

  // Headline: at most two lines, smaller type before a third line.
  let lineSize = 38;
  let lines = wrap(sans(400), line, lineSize, width);
  while (lines.length > 2 && lineSize > 30) {
    lineSize -= 2;
    lines = wrap(sans(400), line, lineSize, width);
  }
  if (lines.length > 2) throw new Error(`[og] the headline of "${card}" does not fit on the card: ${line}`);
  const lineY = nameY + 70;
  const lineGap = Math.round(lineSize * 1.32);

  // Labels along the bottom, separated by middle dots.
  const labelSize = 26;
  const labelY = H - 76;
  const sep = "  ·  ";
  let labelX = X;
  let labelPath = "";
  let sepPath = "";
  labels.forEach((label, i) => {
    if (i > 0) {
      sepPath += outline(mono(), sep, labelSize, labelX, labelY);
      labelX += measure(mono(), sep, labelSize);
    }
    labelPath += outline(mono(), label, labelSize, labelX, labelY);
    labelX += measure(mono(), label, labelSize);
  });
  if (labelX > X + width) throw new Error(`[og] the labels of "${card}" do not fit on the card`);

  // Background as on the site: the brand navy, a teal glow from the top left,
  // and the faint grid fading out towards the edges.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="0.15" cy="-0.1" r="0.9">
      <stop offset="0" stop-color="${colors.brand}" stop-opacity="0.16"/>
      <stop offset="0.6" stop-color="${colors.brand}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.9" cy="0.1" r="0.7">
      <stop offset="0" stop-color="${colors.borderStrong}" stop-opacity="0.55"/>
      <stop offset="0.6" stop-color="${colors.borderStrong}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="${colors.grid}" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
    <radialGradient id="fade" cx="0.5" cy="0.5" r="0.6">
      <stop offset="0.3" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="grid-mask"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
  </defs>
  <rect width="${W}" height="${H}" fill="${colors.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)" mask="url(#grid-mask)"/>
  ${logo(X, 72, 72)}
  <path fill="${colors.text}" d="${outline(sans(600), name, nameSize, X, nameY, -0.025 * nameSize)}"/>
  ${lines.map((l, i) => `<path fill="${colors.sub}" d="${outline(sans(400), l, lineSize, X, lineY + i * lineGap)}"/>`).join("\n  ")}
  <path fill="${colors.brand}" d="${labelPath}"/>
  <path fill="${colors.dim}" d="${sepPath}"/>
</svg>`;

  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

// ---------- GitHub ----------

// Social preview images for the repositories on GitHub, rendered at build time
// by src/pages/og/github/[card].png.ts. GitHub has no API for them: each is
// uploaded by hand from /og/github/<card>.png, under Settings → General →
// Social preview of its repository. They are the site's cards at the size
// GitHub recommends, with a line that says what the repository holds, after
// its description on GitHub (the organization's, for the profile repository).

const GITHUB_WIDTH = 1280;
const GITHUB_HEIGHT = 640;

/** The repository each card is uploaded to, and the line under the name */
const githubCards: Record<OgCard, { repo: string; line: string }> = {
  home: { repo: ".github", line: "AI gateways for organizations and individual developers" },
  lite: { repo: "ThinkWatch-Lite", line: "Desktop app for a local AI API gateway" },
  core: { repo: "ThinkWatch-Core", line: "Rust crates and the twcore binary for an AI API gateway" },
  enterprise: { repo: "ThinkWatch", line: "AI bastion host for secure AI API and MCP access" },
};

export function renderGithubPreview(card: OgCard): Promise<Buffer> {
  const { name, labels } = cardText(card, "en");
  return renderCard({ name, line: githubCards[card].line, labels }, GITHUB_WIDTH, GITHUB_HEIGHT, `github/${card}`);
}
