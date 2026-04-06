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
