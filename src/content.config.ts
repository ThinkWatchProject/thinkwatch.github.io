import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const changelog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/changelog" }),
  schema: z.object({
    version: z.string(),
    date: z.coerce.date(),
    type: z.enum(["release", "feature", "fix", "security"]).default("release"),
    title: z.string(),
    highlights: z.array(z.string()).optional(),
  }),
});

// Docs imported from /Users/faz/Dev/ThinkWatch/docs.
// They have no frontmatter; the schema allows an empty object.
const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs" }),
  schema: z.object({}).passthrough(),
});

export const collections = { changelog, docs };
