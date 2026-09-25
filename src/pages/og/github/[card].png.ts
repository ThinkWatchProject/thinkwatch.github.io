// The social previews of the GitHub repositories, one PNG per card, rendered
// when the site is built. What goes on them, and which repository each one is
// for, is in src/lib/og.ts.
import type { APIRoute, GetStaticPaths } from "astro";
import { ogCards, renderGithubPreview, type OgCard } from "~/lib/og";

export const getStaticPaths = (() => ogCards.map((card) => ({ params: { card } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const png = await renderGithubPreview(params.card as OgCard);
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
