// The content collection of the notes published with each release on GitHub,
// shown on the changelog under their release. Read at build time, rendered with
// the site's markdown settings.
//
// English: the release's own notes, without what GitHub and the release
// workflows add around them (the download table, the generated list of pull
// requests, Enterprise's image and Helm preamble). Chinese: ThinkWatch Lite's
// annotated tags carry the notes in Chinese (the text its update window shows),
// read through the GraphQL API, which needs GITHUB_TOKEN. Core and Enterprise
// have English notes only.
//
// Entry ids are "<lang>/<product>-<tag>", lang "en" or "zh-cn". When GitHub
// cannot be reached the collection is left without those notes and the
// changelog links to GitHub as before.
import type { Loader, LoaderContext } from "astro/loaders";
import { githubHeaders, productRepos, type Product } from "./releases.mjs";

/** Products whose annotated tags hold the notes in Chinese */
const CHINESE_TAGS: Product[] = ["lite"];

/** A warning in the build log, and on the pull request when the build runs in GitHub Actions */
function warn(logger: LoaderContext["logger"], text: string) {
  logger.warn(text);
  if (process.env.GITHUB_ACTIONS === "true") console.log(`::warning title=Release notes::${text}`);
}

const message = (err: unknown) => (err instanceof Error ? err.message : String(err));

/** The notes of every published release of one product, by tag */
async function fetchReleaseBodies(product: Product): Promise<Map<string, string>> {
  const repo = productRepos[product];
  const bodies = new Map<string, string>();
  for (let page = 1; ; page++) {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`, {
      headers: githubHeaders(),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`GitHub answered ${res.status} for the releases of ${repo}`);
    const list: { tag_name: string; body: string | null; draft: boolean; prerelease: boolean }[] = await res.json();
    for (const r of list) if (!r.draft && !r.prerelease && r.body) bodies.set(r.tag_name, r.body);
    if (list.length < 100) break;
  }
  return bodies;
}

/** The messages of a repository's annotated tags, by tag. Needs a token: GraphQL takes no anonymous calls. */
async function fetchTagMessages(product: Product): Promise<Map<string, string>> {
  const [owner, name] = productRepos[product].split("/");
  const query = `query($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      refs(refPrefix: "refs/tags/", first: 100, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes { name target { ... on Tag { message } } }
      }
    }
  }`;
  type Page = {
    data?: { repository: { refs: { pageInfo: { hasNextPage: boolean; endCursor: string }; nodes: { name: string; target: { message?: string } }[] } } };
    errors?: { message: string }[];
  };
  const messages = new Map<string, string>();
  let after: string | null = null;
  for (;;) {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { ...githubHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { owner, name, after } }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`GitHub answered ${res.status} for the tags of ${owner}/${name}`);
    const json: Page = await res.json();
    if (!json.data) throw new Error(json.errors?.[0]?.message ?? `no tags for ${owner}/${name}`);
    const refs = json.data.repository.refs;
    for (const n of refs.nodes) if (n.target.message) messages.set(n.name, n.target.message);
    if (!refs.pageInfo.hasNextPage) break;
    after = refs.pageInfo.endCursor;
  }
  return messages;
}

/**
 * The part of a release's notes written for readers. Enterprise releases open
 * with the images and the Helm command, closed by a rule; Lite and Core
 * releases end with the download table, and GitHub may append the list of
 * merged pull requests and a comparison link.
 */
export function cleanReleaseBody(body: string): string {
  let text = body.replace(/\r\n/g, "\n");
  if (/^## Images\b/.test(text.trimStart())) {
    const rule = /^---\s*$/m.exec(text);
    if (rule) text = text.slice(rule.index + rule[0].length);
  }
  const end = text.search(/^(## Downloads\b|## What's Changed\b|\*\*Full Changelog\*\*)/m);
  if (end >= 0) text = text.slice(0, end);
  return text.trim();
}

/**
 * A Lite tag message as markdown. The message is plain text: the release's
 * name on the first line, paragraphs, and sections that are a short line
 * followed directly by "- " items. The name is dropped, such a line becomes a
 * heading, and the upgrade notes are set off as they are in the English notes.
 */
export function tagMessageToMarkdown(text: string): string {
  const lines = text.replace(/\r\n/g, "\n").trim().split("\n");
  if (/^ThinkWatch\b/.test(lines[0] ?? "")) lines.shift();
  // Plain text: nothing in it is meant as markup
  const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/\*/g, "\\*").replace(/</g, "&lt;").replace(/^([#>+])/, "\\$1");
  const out = lines.map((line, i) => {
    if (line.startsWith("- ")) return `- ${escape(line.slice(2))}`;
    const isHeading =
      line.trim() !== "" && line.length <= 30 && !/[。，、；：！？.,;:!?]/.test(line) && (lines[i + 1] ?? "").startsWith("- ");
    if (isHeading) return `\n### ${escape(line.trim())}`;
    // HTML rather than **…**: emphasis that ends in a full-width colon right before a character does not close
    return escape(line).replace(/^升级须知：/, "<strong>升级须知：</strong>");
  });
  return out.join("\n").trim();
}

/**
 * Every release's headings get ids and anchor links from the site's markdown
 * settings; on one page those would repeat ("upgrade-notes" in every release),
 * so each release's ids carry its own prefix.
 */
function prefixIds(html: string, prefix: string): string {
  return html
    .replace(/ id="([^"]+)"/g, (_, id: string) => ` id="${prefix}-${id}"`)
    .replace(/ href="#([^"]+)"/g, (_, id: string) => ` href="#${prefix}-${id}"`);
}

export function releaseNotesLoader(): Loader {
  return {
    name: "release-notes",
    async load({ store, logger, parseData, renderMarkdown, generateDigest }) {
      const products = Object.keys(productRepos) as Product[];
      const canReadTags = Boolean(process.env.GITHUB_TOKEN);
      const fetched = await Promise.all(
        products.map(async (product) => {
          const [en, zh] = await Promise.all([
            fetchReleaseBodies(product).catch((err: unknown) => {
              warn(logger, `The release notes of ${productRepos[product]} could not be fetched (${message(err)}); its releases link to GitHub instead.`);
              return new Map<string, string>();
            }),
            CHINESE_TAGS.includes(product) && canReadTags
              ? fetchTagMessages(product).catch((err: unknown) => {
                  warn(logger, `The tag messages of ${productRepos[product]} could not be fetched (${message(err)}); the Chinese page shows the English notes.`);
                  return new Map<string, string>();
                })
              : Promise.resolve(new Map<string, string>()),
          ]);
          return { product, en, zh };
        }),
      );
      if (!canReadTags) logger.info("No GITHUB_TOKEN: the Chinese changelog shows ThinkWatch Lite's English notes");

      store.clear();
      for (const { product, en, zh } of fetched) {
        const notes: { lang: "en" | "zh-cn"; tag: string; body: string }[] = [];
        for (const [tag, raw] of en) notes.push({ lang: "en", tag, body: cleanReleaseBody(raw) });
        for (const [tag, raw] of zh) {
          const body = tagMessageToMarkdown(raw);
          if (/\p{Script=Han}/u.test(body)) notes.push({ lang: "zh-cn", tag, body });
          // The first Lite tags were annotated in English; with no notes on the release, that is its English note
          else if (!cleanReleaseBody(en.get(tag) ?? "")) notes.push({ lang: "en", tag, body });
        }
        for (const { lang, tag, body } of notes) {
          if (!body) continue;
          const id = `${lang}/${product}-${tag}`;
          const rendered = await renderMarkdown(body);
          rendered.html = prefixIds(rendered.html, `${product}-${tag}`.replace(/[^\w.-]/g, "-"));
          const data = await parseData({ id, data: { product, tag, lang: lang === "en" ? "en" : "zh-CN" } });
          store.set({ id, data, body, rendered, digest: generateDigest(body) });
        }
      }
    },
  };
}
