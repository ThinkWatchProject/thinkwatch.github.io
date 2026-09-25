// The content collection of the Core documents published from the Core
// repository (see ./core-docs.mjs): one entry per page and language, rendered
// with the site's markdown settings, with links pointed at this site.
//
// Entry ids follow the docs collections ("en/configuration",
// "zh-cn/configuration"), and each entry's filePath is its committed copy, so
// the page is dated like any other doc: by the git history of that file.
import type { Loader, LoaderContext } from "astro/loaders";
import {
  CORE_REPO,
  coreDocs,
  coreDocsRef,
  dropLanguageLink,
  fetchCoreDocs,
  readSnapshot,
  rewriteLinks,
  SNAPSHOT_DIR,
  snapshotPath,
  staleFiles,
} from "./core-docs.mjs";

/** A warning in the build log, and on the pull request when the build runs in GitHub Actions */
function warn(logger: LoaderContext["logger"], text: string) {
  logger.warn(text);
  if (process.env.GITHUB_ACTIONS === "true") console.log(`::warning title=Core docs::${text}`);
}

const message = (err: unknown) => (err instanceof Error ? err.message : String(err));

export function coreDocsLoader(): Loader {
  return {
    name: "core-docs",
    async load({ store, logger, parseData, renderMarkdown, generateDigest }) {
      const snapshot = await readSnapshot();
      let docs: { ref: string; files: Record<string, string> } = snapshot;
      try {
        docs = await fetchCoreDocs(await coreDocsRef());
      } catch (err) {
        warn(logger, `The Core documents could not be fetched (${message(err)}); the copy in ${SNAPSHOT_DIR} from ${snapshot.ref} is published instead.`);
      }
      if (docs !== snapshot) {
        const stale = staleFiles(snapshot, docs);
        if (stale.length) {
          warn(
            logger,
            `The copy of the Core documents in ${SNAPSHOT_DIR} (${snapshot.ref}) differs from ${CORE_REPO} at ${docs.ref} in ${stale.join(", ")}. Run \`pnpm core-docs\` and commit the result.`,
          );
        }
        logger.info(`Core documents from ${docs.ref}`);
      }

      store.clear();
      for (const doc of coreDocs) {
        for (const [lang, source] of Object.entries(doc.files)) {
          const body = dropLanguageLink(docs.files[source]);
          const rendered = await renderMarkdown(body);
          rendered.html = rewriteLinks(rendered.html, { ref: docs.ref, source });
          // The glob loader lowercases ids; src/pages/docs/_lib.ts expects "zh-cn/…".
          const id = `${lang === "zh-CN" ? "zh-cn" : "en"}/${doc.slug}`;
          const data = await parseData({ id, data: { source, ref: docs.ref } });
          store.set({
            id,
            data,
            body,
            rendered,
            filePath: snapshotPath(source),
            digest: generateDigest(`${docs.ref}\n${body}`),
          });
        }
      }
    },
  };
}
