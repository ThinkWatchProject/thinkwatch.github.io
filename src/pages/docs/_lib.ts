// Shared helpers for the docs routes. Files prefixed with "_" are not routes.

import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "~/i18n";
import type { ProductId } from "~/content/docs/_meta";

export type DocsEntry =
  | CollectionEntry<"docs">
  | CollectionEntry<"docs_lite">
  | CollectionEntry<"docs_core">
  | CollectionEntry<"docs_core_synced">;

const collectionFor = { thinkwatch: "docs", lite: "docs_lite", core: "docs_core" } as const;

/** Markdown file rendered as the docs home of Lite and Core. */
export const HOME_ENTRY = "overview";

/**
 * Path segments under /docs owned by product routes. ThinkWatch guides are
 * served by docs/[...slug].astro, so these must never be generated there.
 */
export const RESERVED_SLUGS = ["lite", "core"];

export async function getProductEntries(product: ProductId, lang: Lang) {
  const all: DocsEntry[] = [
    ...((await getCollection(collectionFor[product])) as DocsEntry[]),
    // Core also publishes documents whose text lives in the Core repository.
    ...(product === "core" ? await getCollection("docs_core_synced") : []),
  ];
  // The glob loader lowercases ids, e.g. "zh-cn/architecture".
  const prefix = lang === "zh-CN" ? "zh-cn/" : "en/";
  const entries = all
    .filter((entry) => entry.id.toLowerCase().startsWith(prefix))
    .map((entry) => ({ entry, slug: entry.id.slice(prefix.length).replace(/\.md$/, "") }));
  const taken = new Set<string>();
  for (const { slug } of entries) {
    if (taken.has(slug)) throw new Error(`[docs] two ${product} ${lang} documents have the slug "${slug}"`);
    taken.add(slug);
  }
  return entries;
}

/** getStaticPaths() result for a product's articles (the docs home excluded). */
export async function getArticlePaths(product: ProductId, lang: Lang) {
  const entries = await getProductEntries(product, lang);
  return entries
    .filter(({ slug }) => (product === "thinkwatch" ? !RESERVED_SLUGS.includes(slug) : slug !== HOME_ENTRY))
    .map(({ entry, slug }) => ({ params: { slug }, props: { entry, slug } }));
}

/** The markdown entry rendered as a product's docs home (Lite and Core only). */
export async function getHomeEntry(product: Exclude<ProductId, "thinkwatch">, lang: Lang): Promise<DocsEntry> {
  const entries = await getProductEntries(product, lang);
  const home = entries.find(({ slug }) => slug === HOME_ENTRY);
  if (!home) throw new Error(`[docs] missing ${product} ${lang}/${HOME_ENTRY}.md`);
  return home.entry;
}
