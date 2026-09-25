// The changelog: every published release of the three products, read from
// GitHub at build time, with the release notes written for this site (the
// Enterprise releases up to v0.4.0, in src/content/changelog) attached to
// their version. Releases without notes here link to their page on GitHub.
import { getCollection, type CollectionEntry } from "astro:content";
import { getProduct, productName } from "~/content/docs/_meta";
import type { Lang } from "~/i18n";
import { getReleases, type Product } from "~/lib/github";

export interface ChangelogEntry {
  /** Anchor on the changelog page, e.g. "core-v0.47.0" */
  id: string;
  /**
   * The anchor an Enterprise release had while the page listed Enterprise
   * alone, e.g. "v0.4.0". The page keeps it, so that links made back then and
   * the feed items published back then still lead to the release.
   */
  legacyId?: string;
  product: Product;
  /** The git tag, e.g. "v0.47.0" */
  tag: string;
  date: Date;
  /** The release on GitHub, when there is one */
  url?: string;
  /** Release notes written for this site */
  notes?: CollectionEntry<"changelog"> | CollectionEntry<"changelog_zh">;
}

/** "ThinkWatch Enterprise" / "ThinkWatch 企业版", "ThinkWatch Lite", "ThinkWatch Core" */
export function releaseProductName(product: Product, lang: Lang): string {
  return productName(getProduct(product === "enterprise" ? "thinkwatch" : product), lang);
}

/** Newest first. Chinese notes where they exist, English otherwise. */
export async function getChangelog(lang: Lang): Promise<ChangelogEntry[]> {
  const notes = new Map<string, ChangelogEntry["notes"]>();
  for (const entry of await getCollection("changelog")) notes.set(entry.data.version, entry);
  if (lang === "zh-CN") {
    for (const entry of await getCollection("changelog_zh")) notes.set(entry.data.version, entry);
  }

  const releases = await getReleases();
  const entries: ChangelogEntry[] = releases.map((r) => {
    const enterprise = r.product === "enterprise";
    const version = r.tag.replace(/^v/, "");
    return {
      id: `${r.product}-${r.tag}`,
      legacyId: enterprise ? `v${version}` : undefined,
      product: r.product,
      tag: r.tag,
      date: new Date(r.date),
      url: r.url,
      notes: enterprise ? notes.get(version) : undefined,
    };
  });

  // Notes for Enterprise versions that were never published as GitHub releases.
  const onGitHub = new Set(releases.filter((r) => r.product === "enterprise").map((r) => r.tag.replace(/^v/, "")));
  for (const [version, entry] of notes) {
    if (entry && !onGitHub.has(version)) {
      entries.push({
        id: `enterprise-v${version}`,
        legacyId: `v${version}`,
        product: "enterprise",
        tag: `v${version}`,
        date: entry.data.date,
        notes: entry,
      });
    }
  }

  return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
}
