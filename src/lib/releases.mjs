// GitHub releases of the three products, read at build time for the changelog
// and its RSS feed. Plain JavaScript so that scripts/update-releases.mjs can
// use it outside the site build to refresh src/data/releases.json, the copy the
// build falls back to when GitHub cannot be reached (see getReleases() in
// ./github.ts).

/** @typedef {"enterprise" | "lite" | "core"} Product */

/**
 * @typedef {object} Release
 * @property {Product} product
 * @property {string} tag The git tag, e.g. "v0.47.0"
 * @property {string} date When the release was published, as an ISO timestamp
 * @property {string} url The release page on GitHub
 */

/** @type {Record<Product, string>} */
export const productRepos = {
  enterprise: "ThinkWatchProject/ThinkWatch",
  lite: "ThinkWatchProject/ThinkWatch-Lite",
  core: "ThinkWatchProject/ThinkWatch-Core",
};

/** Request headers for the GitHub API; GITHUB_TOKEN (set in CI) lifts the anonymous rate limit. */
export function githubHeaders() {
  /** @type {Record<string, string>} */
  const headers = {
    "User-Agent": "thinkwatch-site-build",
    Accept: "application/vnd.github+json",
  };
  const token = typeof process !== "undefined" ? process.env.GITHUB_TOKEN : undefined;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * Every published release of one product, newest first. Drafts and
 * pre-releases are left out. Throws when GitHub cannot be reached or answers
 * with an error, so that the caller can fall back to the committed copy.
 *
 * @param {Product} product
 * @returns {Promise<Release[]>}
 */
export async function fetchReleases(product) {
  const repo = productRepos[product];
  /** @type {Release[]} */
  const releases = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`, {
      headers: githubHeaders(),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`GitHub answered ${res.status} for the releases of ${repo}`);
    /** @type {{ tag_name: string, html_url: string, published_at: string | null, draft: boolean, prerelease: boolean }[]} */
    const list = await res.json();
    for (const r of list) {
      if (r.draft || r.prerelease || !r.published_at) continue;
      releases.push({ product, tag: r.tag_name, date: r.published_at, url: r.html_url });
    }
    if (list.length < 100) break;
  }
  return releases.sort((a, b) => b.date.localeCompare(a.date));
}
