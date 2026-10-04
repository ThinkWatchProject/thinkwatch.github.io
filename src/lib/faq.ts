// FAQPage structured data from a markdown FAQ: each `## ` heading is a question
// and the text up to the next heading is its answer, with the markdown reduced
// to plain text. The page shows the same questions and answers, as the
// structured data requires.

function plain(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|\s)[*_](\S[^*_]*?)[*_](?=\s|[.,;:!?)]|$)/g, "$1$2")
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
    .replace(/^\|.*\|\s*$/gm, (row) => row.replace(/\|/g, " ").replace(/\s-{3,}\s/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

export function faqPage(body: string, lang: string): Record<string, unknown> | null {
  const items: { q: string; a: string }[] = [];
  let current: { q: string; lines: string[] } | null = null;
  for (const line of body.split("\n")) {
    const heading = /^##\s+(.+?)\s*$/.exec(line);
    if (heading) {
      if (current) items.push({ q: current.q, a: plain(current.lines.join("\n")) });
      current = { q: plain(heading[1]), lines: [] };
    } else if (/^#\s/.test(line)) {
      continue;
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) items.push({ q: current.q, a: plain(current.lines.join("\n")) });
  const answered = items.filter((i) => i.q && i.a);
  if (answered.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: answered.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
