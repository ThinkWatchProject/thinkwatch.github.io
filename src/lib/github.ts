// Cached at module level so all imports during one build share the same fetch.
// Falls back to null on failure (rate limit, network, repo missing) so callers
// can render a graceful "—" instead of breaking the build.

const REPO = "ThinkWatchProject/ThinkWatch";

let cached: number | null | undefined;

export async function getStarCount(): Promise<number | null> {
  if (cached !== undefined) return cached;
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: {
        "User-Agent": "thinkwatch-site-build",
        Accept: "application/vnd.github+json",
      },
    });
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
  const headers: Record<string, string> = {
    "User-Agent": "thinkwatch-site-build",
    Accept: "application/vnd.github+json",
  };
  const token = typeof process !== "undefined" ? process.env.GITHUB_TOKEN : undefined;
  if (token) headers.Authorization = `Bearer ${token}`;
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
