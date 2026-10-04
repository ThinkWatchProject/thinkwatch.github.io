// /llms-full.txt: the English documentation of ThinkWatch Lite and ThinkWatch
// Core in one plain-text file, in sidebar order, each document headed by its
// title and address. /llms.txt is the short map of the site.
import type { APIContext } from "astro";
import { docHref, getProduct, type ProductId } from "~/content/docs/_meta";
import { getProductEntries, HOME_ENTRY } from "~/pages/docs/_lib";

async function productText(id: ProductId, site: URL): Promise<string> {
  const product = getProduct(id);
  const entries = await getProductEntries(id, "en");
  const parts: string[] = [];
  for (const doc of product.docs.filter((d) => d.locales.includes("en"))) {
    const found = entries.find(({ slug }) => slug === (doc.slug || HOME_ENTRY));
    const text = found?.entry.body?.trim();
    if (!text) continue;
    const url = new URL(docHref("en", id, doc), site).href.replace(/\/?$/, "/");
    parts.push(`# ${product.name}: ${doc.label.en}\n\nSource: ${url}\n\n${text}`);
  }
  return parts.join("\n\n---\n\n");
}

export async function GET(context: APIContext) {
  const site = context.site!;
  const body = [await productText("lite", site), await productText("core", site)].join("\n\n---\n\n") + "\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
