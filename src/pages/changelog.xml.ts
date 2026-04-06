import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const entries = (await getCollection("changelog")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return rss({
    title: "ThinkWatch Changelog",
    description: "Release notes and updates for ThinkWatch.",
    site: context.site!,
    items: entries.map((entry) => ({
      title: `v${entry.data.version} — ${entry.data.title}`,
      pubDate: entry.data.date,
      description: entry.data.highlights?.join(" · ") ?? entry.data.title,
      link: `/changelog#v${entry.data.version}`,
    })),
  });
}
