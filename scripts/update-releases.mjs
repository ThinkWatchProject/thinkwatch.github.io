// Refresh src/data/releases.json, the copy of the GitHub releases that the
// build uses when GitHub cannot be reached (rate limit, no network). The build
// itself always asks GitHub first, so this file only needs refreshing now and
// then. Run with: pnpm releases (GITHUB_TOKEN is used when set).
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { fetchReleases, productRepos } from "../src/lib/releases.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(here, "..", "src", "data", "releases.json");

/** @type {import("../src/lib/releases.mjs").Release[]} */
const releases = [];
for (const product of /** @type {(keyof typeof productRepos)[]} */ (Object.keys(productRepos))) {
  releases.push(...(await fetchReleases(product)));
}
releases.sort((a, b) => b.date.localeCompare(a.date) || a.product.localeCompare(b.product));

await writeFile(outPath, `${JSON.stringify(releases, null, 2)}\n`);
console.log(`✓ Wrote ${outPath} (${releases.length} releases)`);
