// When a page last changed, taken from git history: the last commit that
// touched any of the files the page is built from. Used for <lastmod> in the
// sitemap and for the dates on documentation articles. Pages that show a
// product's latest release also change when it is released; the sitemap adds
// those dates (see pageReleases() and astro.config.mjs).
//
// A build time would claim that every page changed on every build, so without
// history (a shallow clone, no git) the dates are left out instead. The deploy
// workflow checks out the full history for this.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import type { Product } from "./releases.mjs";

interface FileDates {
  /** First commit that touched the file, as an ISO timestamp */
  first: string;
  /** Last commit that touched the file, as an ISO timestamp */
  last: string;
}

let history: Map<string, FileDates> | undefined;

function readHistory(): Map<string, FileDates> {
  const files = new Map<string, FileDates>();
  try {
    const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    if (git("rev-parse", "--is-shallow-repository").trim() === "true") {
      console.warn("[lastmod] shallow clone: page dates are left out");
      return files;
    }
    // Newest commit first: the first date seen for a file is its last change,
    // and each older one moves its first change back.
    for (const commit of git("log", "--format=%x00%cI", "--name-only").split("\0").slice(1)) {
      const [date, ...paths] = commit.trim().split("\n");
      const iso = new Date(date).toISOString();
      for (const path of paths) {
        if (!path) continue;
        const known = files.get(path);
        if (known) known.first = iso;
        else files.set(path, { first: iso, last: iso });
      }
    }
  } catch (err) {
    console.warn(`[lastmod] no git history: ${err instanceof Error ? err.message : err}`);
  }
  return files;
}

/** Dates of every committed file under the given files or folders, relative to the project root. */
function datesOf(paths: string[]): FileDates[] {
  history ??= readHistory();
  const found: FileDates[] = [];
  for (const [file, dates] of history) {
    if (paths.some((p) => file === p || file.startsWith(`${p}/`))) found.push(dates);
  }
  return found;
}

/** When any of the given files or folders last changed, or undefined without history. */
export function lastModified(paths: string[]): string | undefined {
  return datesOf(paths).reduce<string | undefined>((max, d) => (!max || d.last > max ? d.last : max), undefined);
}

/** When the first of the given files or folders was added, or undefined without history. */
export function firstPublished(paths: string[]): string | undefined {
  return datesOf(paths).reduce<string | undefined>((min, d) => (!min || d.first < min ? d.first : min), undefined);
}

/** A page's language and its path without the language prefix, e.g. "/zh-CN/lite" → "/lite" */
function splitPath(pathname: string): { lang: "en" | "zh-CN"; path: string } {
  const zh = pathname === "/zh-CN" || pathname.startsWith("/zh-CN/");
  return { lang: zh ? "zh-CN" : "en", path: zh ? pathname.slice("/zh-CN".length) || "/" : pathname };
}

/**
 * The files a page is built from, by its path (without a trailing slash). Only
 * the content counts: the page's copy and its own components, not the shared
 * layout, header or footer.
 */
export function pageSources(pathname: string): string[] {
  const { lang, path } = splitPath(pathname);
  // A doc without a translation is shown in English.
  const doc = (dir: string, slug: string) => {
    const own = `src/content/${dir}/${lang}/${slug}.md`;
    return [existsSync(own) ? own : `src/content/${dir}/en/${slug}.md`];
  };

  switch (path) {
    case "/":
      return [
        "src/components/pages/HomePage.astro",
        "src/components/home",
        "src/i18n/pages/home.ts",
        // Components the home sections are built from.
        "src/components/hero",
        "src/components/ui/Terminal.tsx",
        "src/components/mocks",
        "src/components/LiteDownload.astro",
      ];
    case "/lite":
      return ["src/components/pages/LitePage.astro", "src/i18n/pages/lite.ts", "src/components/LiteDownload.astro", "public/lite"];
    case "/core":
      return ["src/components/pages/CorePage.astro", "src/i18n/pages/core.ts"];
    case "/thinkwatch":
      return [
        "src/components/pages/ThinkWatchPage.astro",
        "src/i18n/pages/thinkwatch.ts",
        "src/components/sections",
        "src/components/mocks",
        // The sections below the hero still read their copy from the shared dictionary.
        "src/i18n/index.ts",
      ];
    case "/license":
      return ["src/components/pages/LicensePage.astro", "src/i18n/pages/license.ts"];
    case "/changelog":
      return ["src/components/pages/ChangelogPage.astro", "src/i18n/pages/changelog.ts", "src/content/changelog"];
    case "/docs":
      return ["src/pages/docs/_DocsHome.astro", "src/content/docs/_meta.ts"];
  }
  const product = path.match(/^\/docs\/(lite|core)(?:\/([^/]+))?$/);
  if (product) return doc(`docs-${product[1]}`, product[2] ?? "overview");
  const guide = path.match(/^\/docs\/([^/]+)$/);
  if (guide) return doc("docs", guide[1]);
  return [];
}

/**
 * The products whose releases a page is built from, by its path (without a
 * trailing slash): the version and downloads of the latest release, in the
 * page itself or in its structured data, or the list of releases on the
 * changelog. A release changes such a page as much as a commit does.
 */
export function pageReleases(pathname: string): Product[] {
  switch (splitPath(pathname).path) {
    case "/":
      // The Lite download button, and the structured data of all three products.
      return ["enterprise", "lite", "core"];
    case "/lite":
      return ["lite"];
    case "/core":
      return ["core"];
    case "/thinkwatch":
      return ["enterprise"];
    case "/changelog":
      return ["enterprise", "lite", "core"];
  }
  return [];
}
