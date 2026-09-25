import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { coreDocsLoader } from "./lib/core-docs-loader";

const changelogSchema = z.object({
  version: z.string(),
  date: z.coerce.date(),
  type: z.enum(["release", "feature", "fix", "security"]).default("release"),
  title: z.string(),
  highlights: z.array(z.string()).optional(),
});

const changelog = defineCollection({
  loader: glob({ pattern: "en/**/*.md", base: "./src/content/changelog" }),
  schema: changelogSchema,
});

const changelog_zh = defineCollection({
  loader: glob({ pattern: "zh-CN/**/*.md", base: "./src/content/changelog" }),
  schema: changelogSchema,
});

// Docs imported from /Users/faz/Dev/ThinkWatch/docs.
// They have no frontmatter; the schema allows an empty object.
const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs" }),
  schema: z.object({}).passthrough(),
});

// Product docs for ThinkWatch Lite and ThinkWatch Core, written for this site.
// Layout mirrors `docs`: en/<slug>.md and zh-CN/<slug>.md, no frontmatter.
// en/overview.md is rendered as the product's docs home (/docs/lite, /docs/core).
const docs_lite = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs-lite" }),
  schema: z.object({}).passthrough(),
});

const docs_core = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs-core" }),
  schema: z.object({}).passthrough(),
});

// Core documents whose text lives in the ThinkWatch Core repository (the
// configuration reference, the server deployment guide): fetched from the latest
// Core release at build time, see src/lib/core-docs.mjs. Same ids as docs_core.
const docs_core_synced = defineCollection({
  loader: coreDocsLoader(),
  schema: z.object({
    /** Path of the document in the Core repository */
    source: z.string(),
    /** The tag it was taken from */
    ref: z.string(),
  }),
});

export const collections = { changelog, changelog_zh, docs, docs_lite, docs_core, docs_core_synced };
