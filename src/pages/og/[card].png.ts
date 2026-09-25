// The Open Graph images, one PNG per card, rendered when the site is built.
// What goes on a card, and how it is drawn, is in src/lib/og.ts.
import type { APIRoute, GetStaticPaths } from "astro";
import { ogCards, renderOgImage, type OgCard } from "~/lib/og";

export const getStaticPaths = (() => ogCards.map((card) => ({ params: { card } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const png = await renderOgImage(params.card as OgCard);
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
