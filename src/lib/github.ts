import fallbackReleases from "../data/releases.json";
import { fetchReleases, githubHeaders, productRepos, type Product, type Release } from "./releases.mjs";

export type { Product, Release };

// Cached at module level so all imports during one build share the same fetch.
// Falls back to null on failure (rate limit, network, repo missing) so callers
// can render a graceful "—" instead of breaking the build.

const REPO = productRepos.enterprise;

let cached: number | null | undefined;

export async function getStarCount(): Promise<number | null> {
  if (cached !== undefined) return cached;
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, { headers: githubHeaders() });
    if (!res.ok) {
      cached = null;
      return null;
    }
    const data: { stargazers_count?: number } = await res.json();
    cached = typeof data.stargazers_count === "number" ? data.stargazers_count : null;
    return cached;
  } catch {
    cached = null;
    return null;
  }
}

export function formatStars(n: number | null): string {
  if (n === null) return "★";
  if (n < 1000) return String(n);
  if (n < 10_000) return `${(n / 1000).toFixed(1)}k`;
  return `${Math.round(n / 1000)}k`;
}

// Latest ThinkWatch release tag (e.g. "v1.0.2"), fetched once per build so the
// site never shows a stale hard-coded version. Uses GITHUB_TOKEN when present
// (CI) to avoid the anonymous rate limit. Returns null on any failure.
let releaseCached: string | null | undefined;

export async function getLatestRelease(): Promise<string | null> {
  if (releaseCached !== undefined) return releaseCached;
  const headers = githubHeaders();
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers });
    if (res.ok) {
      const data: { tag_name?: string } = await res.json();
      if (typeof data.tag_name === "string" && data.tag_name) {
        releaseCached = data.tag_name;
        return releaseCached;
      }
    }
    const tags = await fetch(`https://api.github.com/repos/${REPO}/tags?per_page=100`, { headers });
    if (tags.ok) {
      const list: { name?: string }[] = await tags.json();
      const versions = list
        .map((t) => t.name ?? "")
        .filter((n) => /^v\d+\.\d+\.\d+$/.test(n))
        .sort((a, b) => {
          const pa = a.slice(1).split(".").map(Number);
          const pb = b.slice(1).split(".").map(Number);
          return pb[0] - pa[0] || pb[1] - pa[1] || pb[2] - pa[2];
        });
      releaseCached = versions[0] ?? null;
      return releaseCached;
    }
    releaseCached = null;
    return null;
  } catch {
    releaseCached = null;
    return null;
  }
}

// The latest release of ThinkWatch Lite or ThinkWatch Core, fetched once per
// build. Asset names carry the version, so download links are taken from the
// release's own asset list rather than built from a pattern. Returns null on
// any failure; the pages then link to the releases page instead and leave the
// version out.
export interface ProductRelease {
  tag: string;
  /** Asset file name → its download URL */
  assets: Record<string, string>;
}

const latestCache = new Map<string, Promise<ProductRelease | null>>();

function getLatestProductRelease(repo: string): Promise<ProductRelease | null> {
  let cached = latestCache.get(repo);
  if (!cached) {
    cached = (async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers: githubHeaders() });
        if (!res.ok) return null;
        const data: { tag_name?: string; assets?: { name?: string; browser_download_url?: string }[] } =
          await res.json();
        const assets: Record<string, string> = {};
        for (const a of data.assets ?? []) {
          if (a.name && a.browser_download_url) assets[a.name] = a.browser_download_url;
        }
        return data.tag_name ? { tag: data.tag_name, assets } : null;
      } catch {
        return null;
      }
    })();
    latestCache.set(repo, cached);
  }
  return cached;
}

export const getLatestLiteRelease = () => getLatestProductRelease(productRepos.lite);
export const getLatestCoreRelease = () => getLatestProductRelease(productRepos.core);

// Every published release of the three products, newest first, for the
// changelog and its feed. A product whose releases cannot be fetched falls back
// to src/data/releases.json (refreshed with `pnpm releases`), so a rate limit or
// an offline build still lists what was known when that file was written.
let releasesCached: Promise<Release[]> | undefined;

export function getReleases(): Promise<Release[]> {
  releasesCached ??= Promise.all(
    (Object.keys(productRepos) as Product[]).map((product) =>
      fetchReleases(product).catch((err: unknown) => {
        console.warn(
          `[releases] ${err instanceof Error ? err.message : err}; using src/data/releases.json for ${product}`,
        );
        return (fallbackReleases as Release[]).filter((r) => r.product === product);
      }),
    ),
  ).then((lists) => lists.flat().sort((a, b) => b.date.localeCompare(a.date)));
  return releasesCached;
}
