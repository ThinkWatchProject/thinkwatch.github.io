// ThinkWatch Core's configuration reference and server deployment guide are
// written in the Core repository, next to the code they describe (the field
// tables of the configuration reference are generated from it). This site
// publishes them under /docs/core rather than keeping a second copy of the
// text.
//
// At build time the documents are fetched from the latest Core release, so the
// pages describe the twcore that can be downloaded, not unreleased work on
// main. src/data/core-docs holds a committed copy of them, used when GitHub
// cannot be reached; the build warns when that copy no longer matches the
// latest release, and `pnpm core-docs` refreshes it.
//
// Plain JavaScript, so that scripts/update-core-docs.mjs can use it outside the
// site build. The content collection that renders the pages is in
// ./core-docs-loader.ts.
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { posix } from "node:path";
import { githubHeaders, productRepos } from "./releases.mjs";

/** @typedef {"en" | "zh-CN"} Lang */

export const CORE_REPO = productRepos.core;

/**
 * The Core documents published on this site, by the slug of their page under
 * /docs/core. Paths are relative to the root of the Core repository. The
 * sidebar entries for these pages are in src/content/docs/_meta.ts.
 *
 * @type {{ slug: string, files: Record<Lang, string> }[]}
 */
export const coreDocs = [
  { slug: "configuration", files: { en: "docs/config.md", "zh-CN": "docs/config.zh-CN.md" } },
  { slug: "server-deployment", files: { en: "docs/server.md", "zh-CN": "docs/server.zh-CN.md" } },
];

/** Every source file, in a fixed order */
export const coreDocSources = coreDocs.flatMap((doc) => [doc.files.en, doc.files["zh-CN"]]);

/** The committed copy, relative to the project root */
export const SNAPSHOT_DIR = "src/data/core-docs";
const MANIFEST = `${SNAPSHOT_DIR}/manifest.json`;

/** Where the committed copy of a source file is kept */
export const snapshotPath = (/** @type {string} */ source) => `${SNAPSHOT_DIR}/${posix.basename(source)}`;

const TIMEOUT = 15_000;

/** @param {string} text */
export const sha256 = (text) => createHash("sha256").update(text).digest("hex");

/**
 * @typedef {object} CoreDocsSource
 * @property {string} ref The tag (or other git ref) the files were taken from
 * @property {Record<string, string>} files Source path → text
 */

/**
 * The ref to publish: CORE_DOCS_REF when set (to preview the documents of
 * another tag or of a branch), otherwise the tag of the latest Core release.
 * Throws when GitHub cannot be reached.
 *
 * @returns {Promise<string>}
 */
export async function coreDocsRef() {
  const override = typeof process !== "undefined" ? process.env.CORE_DOCS_REF : undefined;
  if (override) return override;
  const res = await fetch(`https://api.github.com/repos/${CORE_REPO}/releases/latest`, {
    headers: githubHeaders(),
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!res.ok) throw new Error(`GitHub answered ${res.status} for the latest release of ${CORE_REPO}`);
  /** @type {{ tag_name?: string }} */
  const data = await res.json();
  if (!data.tag_name) throw new Error(`the latest release of ${CORE_REPO} has no tag`);
  return data.tag_name;
}

/**
 * The documents as they are at `ref`. Throws unless every file could be
 * fetched, so that the pages never mix two versions.
 *
 * @param {string} ref
 * @returns {Promise<CoreDocsSource>}
 */
export async function fetchCoreDocs(ref) {
  const texts = await Promise.all(
    coreDocSources.map(async (path) => {
      const res = await fetch(`https://raw.githubusercontent.com/${CORE_REPO}/${ref}/${path}`, {
        headers: { "User-Agent": githubHeaders()["User-Agent"] },
        signal: AbortSignal.timeout(TIMEOUT),
      });
      if (!res.ok) throw new Error(`${path} at ${ref}: GitHub answered ${res.status}`);
      return res.text();
    }),
  );
  return { ref, files: Object.fromEntries(coreDocSources.map((path, i) => [path, texts[i]])) };
}

/**
 * The committed copy, with the hashes its manifest recorded for each file.
 *
 * @returns {Promise<CoreDocsSource & { hashes: Record<string, string> }>}
 */
export async function readSnapshot() {
  /** @type {{ ref: string, files: Record<string, string> }} */
  const manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
  /** @type {Record<string, string>} */
  const files = {};
  for (const path of coreDocSources) files[path] = await readFile(snapshotPath(path), "utf8");
  return { ref: manifest.ref, files, hashes: manifest.files };
}

/**
 * Replace the committed copy.
 *
 * @param {CoreDocsSource} docs
 */
export async function writeSnapshot(docs) {
  await mkdir(SNAPSHOT_DIR, { recursive: true });
  for (const path of coreDocSources) await writeFile(snapshotPath(path), docs.files[path]);
  const manifest = {
    repository: CORE_REPO,
    ref: docs.ref,
    files: Object.fromEntries(coreDocSources.map((path) => [path, sha256(docs.files[path])])),
  };
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
}

/**
 * Files of the committed copy that differ from `docs`, or that were changed by
 * hand since they were copied.
 *
 * @param {CoreDocsSource & { hashes: Record<string, string> }} snapshot
 * @param {CoreDocsSource} docs
 * @returns {string[]}
 */
export function staleFiles(snapshot, docs) {
  return coreDocSources.filter(
    (path) => sha256(docs.files[path]) !== snapshot.hashes[path] || sha256(snapshot.files[path]) !== snapshot.hashes[path],
  );
}

// ---------- From the repository to this site ----------

/** The page on this site that publishes a source file, by its path in the repository */
const pages = new Map(
  coreDocs.flatMap((doc) =>
    /** @type {[Lang, string][]} */ (Object.entries(doc.files)).map(([lang, path]) => [
      path,
      `${lang === "zh-CN" ? "/zh-CN" : ""}/docs/core/${doc.slug}`,
    ]),
  ),
);

/**
 * A document's first lines link to its translation ("[中文](config.zh-CN.md)").
 * This site switches languages in its header, and a link to the other
 * language would be undone by its language redirect, so the line is dropped.
 *
 * @param {string} markdown
 */
export function dropLanguageLink(markdown) {
  return markdown.replace(/^(# [^\n]*\n)[ \t]*\n\[(?:中文|English)\]\([^)\s]+\)[ \t]*\n/, "$1");
}

/**
 * Point the links of a rendered document at this site: a link to another
 * published document goes to its page here, any other file of the repository
 * to GitHub at the same ref. Links elsewhere and links within the page are
 * left alone. Works on the HTML, where only real links have an href, so that
 * code blocks are never touched.
 *
 * @param {string} html
 * @param {{ ref: string, source: string }} from The ref and the document's path in the repository
 */
export function rewriteLinks(html, { ref, source }) {
  const base = new URL(`https://repository.invalid/${posix.dirname(source)}/`);
  return html.replace(/(\s(href|src)=")([^"]*)(")/g, (all, before, attr, value, after) => {
    if (!value || value.startsWith("#") || value.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(value)) return all;
    const url = new URL(value.replaceAll("&amp;", "&"), base);
    const path = url.pathname.slice(1);
    const page = pages.get(decodeURIComponent(path));
    let to;
    if (page) to = `${page}${url.hash}`;
    else if (attr === "src") to = `https://raw.githubusercontent.com/${CORE_REPO}/${ref}/${path}`;
    else to = `https://github.com/${CORE_REPO}/${path.endsWith("/") ? "tree" : "blob"}/${ref}/${path}${url.hash}`;
    return `${before}${to}${after}`;
  });
}
