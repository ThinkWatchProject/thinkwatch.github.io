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

export const collections = { changelog };
