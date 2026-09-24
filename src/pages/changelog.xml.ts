// RSS feed of the changelog: every release of ThinkWatch Enterprise, ThinkWatch
// Lite and ThinkWatch Core, newest first. A release links to where its notes
// are: this site for the Enterprise releases written up here, GitHub otherwise.
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { changelogCopy } from "~/i18n/pages/changelog";
import { getChangelog, releaseProductName } from "~/lib/changelog";

export async function GET(context: APIContext) {
  const entries = await getChangelog("en");
  const page = new URL("/changelog/", context.site).href;

  return rss({
    title: "ThinkWatch release notes",
    description: changelogCopy.en.meta.description,
    // The channel links to the changelog page.
    site: page,
    customData: "<language>en</language>",
    items: entries.map((entry) => {
      const name = releaseProductName(entry.product, "en");
      const notes = entry.notes?.data;
      return {
        title: notes ? `${name} ${entry.tag} — ${notes.title}` : `${name} ${entry.tag}`,
        pubDate: entry.date,
        link: notes ? `${page}#${entry.id}` : entry.url!,
        ...(notes ? { description: notes.highlights?.join(" · ") ?? notes.title } : {}),
        categories: [name],
      };
    }),
  });
}
