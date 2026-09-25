// Refresh src/data/core-docs, the committed copy of the ThinkWatch Core
// documents this site publishes (the configuration reference and the server
// deployment guide), from the latest Core release. The build always fetches
// the documents itself and uses this copy only when GitHub cannot be reached;
// it warns when the copy no longer matches. See src/lib/core-docs.mjs.
//
// Run with: pnpm core-docs (GITHUB_TOKEN is used when set; CORE_DOCS_REF
// takes another tag).
import { fileURLToPath } from "node:url";

// Paths in core-docs.mjs are relative to the project root.
process.chdir(fileURLToPath(new URL("..", import.meta.url)));
const { coreDocsRef, fetchCoreDocs, SNAPSHOT_DIR, writeSnapshot } = await import("../src/lib/core-docs.mjs");

const ref = await coreDocsRef();
const docs = await fetchCoreDocs(ref);
await writeSnapshot(docs);
console.log(`✓ Wrote ${SNAPSHOT_DIR} from ThinkWatch Core ${ref} (${Object.keys(docs.files).join(", ")})`);
