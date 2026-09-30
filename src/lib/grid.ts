// Column spans for a card grid that should not leave a lonely last row: three
// cards a row on wide screens and two on medium ones, with the last row's cards
// widened to fill it. The grid itself is `grid-cols-2 lg:grid-cols-6` (the
// medium breakpoint is passed in, since pages differ on it).
//
// The class names are written out in full so that Tailwind sees them.

const MEDIUM = {
  sm: { one: "sm:col-span-1", two: "sm:col-span-2" },
  md: { one: "md:col-span-1", two: "md:col-span-2" },
} as const;

export function spanClass(i: number, n: number, medium: keyof typeof MEDIUM = "md"): string {
  const m = MEDIUM[medium];
  // Medium: two a row; an odd count widens the last card to the full row.
  const mid = n % 2 === 1 && i === n - 1 ? m.two : m.one;
  // Wide: three a row (two of six columns each); a remainder of one fills the
  // row, a remainder of two takes half each.
  const rest = n % 3;
  const inLast = i >= n - rest;
  const wide = !inLast || rest === 0 ? "lg:col-span-2" : rest === 1 ? "lg:col-span-6" : "lg:col-span-3";
  return `${mid} ${wide}`;
}
