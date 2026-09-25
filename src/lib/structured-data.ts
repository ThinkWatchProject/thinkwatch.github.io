// Schema.org descriptions (JSON-LD) of the organization and the three products.
// The product pages and the home page build theirs from here, so a product is
// described the same way wherever it appears. Descriptions and feature lists
// come from the page copy; versions and download links from the latest GitHub
// release, read at build time (left out when GitHub cannot be reached).
//
// Every entity has an @id, the same on the English and the Chinese page, so
// that entities can refer to each other (author → the organization, source
// code → the application built from it).
import { localePath, type Lang } from "~/i18n";
import { coreCopy } from "~/i18n/pages/core";
import { liteCopy } from "~/i18n/pages/lite";
import { thinkwatchCopy } from "~/i18n/pages/thinkwatch";
import { getLatestCoreRelease, getLatestLiteRelease, getLatestRelease } from "~/lib/github";
import { ogImagePath } from "~/lib/og";

export type JsonLd = Record<string, unknown>;

const SITE = "https://thinkwat.ch";
const GITHUB = "https://github.com/ThinkWatchProject";
const MIT = "https://opensource.org/licenses/MIT";
const CONTEXT = "https://schema.org";

const abs = (path: string) => new URL(path, SITE).toString();
/** A page's canonical URL, with the trailing slash the site is served with */
const pageUrl = (lang: Lang, path: string) => abs(localePath(lang, path).replace(/\/?$/, "/"));

const ids = {
  organization: `${SITE}/#organization`,
  website: `${SITE}/#website`,
  enterprise: `${SITE}/thinkwatch/#software`,
  lite: `${SITE}/lite/#software`,
  liteSource: `${SITE}/lite/#source-code`,
  twcore: `${SITE}/core/#twcore`,
  coreSource: `${SITE}/core/#source-code`,
};
/** The organization as an author or publisher: a reference, named for readers that do not follow @id. */
export const organizationRef: JsonLd = { "@type": "Organization", "@id": ids.organization, name: "ThinkWatch", url: SITE };
const byOrganization = { author: organizationRef, publisher: organizationRef };
const free = { "@type": "Offer", price: 0, priceCurrency: "USD" };

/** Platforms of the Lite downloads and the prebuilt twcore binaries, which match. */
const processors: Record<Lang, string> = {
  en: "Apple silicon (arm64) on macOS; x64 or ARM64 on Windows; x86_64 or aarch64 on Linux",
  "zh-CN": "macOS：Apple silicon（arm64）；Windows：x64 或 ARM64；Linux：x86_64 或 aarch64",
};

/** A description the page copy must provide: a missing one fails the build rather than leaving the field out. */
function required(value: string | undefined, what: string): string {
  if (!value?.trim()) throw new Error(`[structured-data] ${what} is missing`);
  return value;
}

/** On every page. */
export const organization: JsonLd = {
  "@context": CONTEXT,
  "@type": "Organization",
  "@id": ids.organization,
  name: "ThinkWatch",
  url: SITE,
  logo: `${SITE}/icon.svg`,
  sameAs: [
    GITHUB,
    `${GITHUB}/ThinkWatch`,
    `${GITHUB}/ThinkWatch-Lite`,
    `${GITHUB}/ThinkWatch-Core`,
    `${GITHUB}/homebrew-tap`,
  ],
  description:
    "ThinkWatch builds AI gateways: ThinkWatch Enterprise for organizations, ThinkWatch Lite for individual developers, and the shared MIT-licensed ThinkWatch Core.",
};

/** On the home page. */
export const website: JsonLd = {
  "@context": CONTEXT,
  "@type": "WebSite",
  "@id": ids.website,
  name: "ThinkWatch",
  url: SITE,
  inLanguage: ["en", "zh-CN"],
  publisher: organizationRef,
};

/** A page that is not about one product: its title, description and place in the site. */
export function webPage(lang: Lang, path: string, name: string, description: string): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "WebPage",
    name,
    description,
    url: pageUrl(lang, path),
    inLanguage: lang,
    isPartOf: { "@id": ids.website, "@type": "WebSite", name: "ThinkWatch", url: SITE },
  };
}

/** ThinkWatch Enterprise, the self-hosted server. */
export async function enterpriseLd(lang: Lang): Promise<JsonLd[]> {
  const tag = await getLatestRelease();
  const url = pageUrl(lang, "/thinkwatch");
  return [
    {
      "@context": CONTEXT,
      "@type": "SoftwareApplication",
      "@id": ids.enterprise,
      name: "ThinkWatch Enterprise",
      alternateName: "ThinkWatch",
      description: thinkwatchCopy[lang].meta.description,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Linux, macOS, Windows (via Docker / Kubernetes)",
      url,
      installUrl: `${url}#quickstart`,
      downloadUrl: `${GITHUB}/ThinkWatch/releases/latest`,
      ...(tag ? { softwareVersion: tag.replace(/^v/, "") } : {}),
      image: abs(ogImagePath("enterprise")),
      license: `${GITHUB}/ThinkWatch/blob/main/LICENSE`,
      offers: free,
      ...byOrganization,
    },
  ];
}

/** ThinkWatch Lite: the desktop application, and its source code. */
export async function liteLd(lang: Lang): Promise<JsonLd[]> {
  const c = liteCopy[lang];
  const release = await getLatestLiteRelease();
  const url = pageUrl(lang, "/lite");
  const repo = `${GITHUB}/ThinkWatch-Lite`;
  // The installers of the latest release: disk image, Windows setup, AppImage.
  const installers = Object.entries(release?.assets ?? {})
    .filter(([name]) => /(\.dmg|-setup\.exe|\.AppImage)$/.test(name))
    .map(([, href]) => href);
  // Screenshots in the page's language; the English ones carry "-en", as on LitePage.astro.
  const screenshot = c.features.items.map((item) => ({
    "@type": "ImageObject",
    url: abs(`/lite/${item.id}${lang === "zh-CN" ? "" : "-en"}.webp`),
    caption: item.alt,
  }));
  return [
    {
      "@context": CONTEXT,
      "@type": "SoftwareApplication",
      "@id": ids.lite,
      name: "ThinkWatch Lite",
      description: c.meta.description,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "macOS, Windows, Linux",
      processorRequirements: processors[lang],
      ...(release ? { softwareVersion: release.tag.replace(/^v/, "") } : {}),
      url,
      installUrl: `${url}#install`,
      downloadUrl: installers.length ? installers : `${repo}/releases/latest`,
      image: abs(ogImagePath("lite")),
      screenshot,
      // The languages of the interface.
      inLanguage: ["en", "zh-CN"],
      featureList: c.features.items.map((item) => item.title),
      license: MIT,
      offers: free,
      ...byOrganization,
    },
    {
      "@context": CONTEXT,
      "@type": "SoftwareSourceCode",
      "@id": ids.liteSource,
      name: "ThinkWatch Lite",
      description: c.meta.description,
      codeRepository: repo,
      programmingLanguage: ["TypeScript", "Rust"],
      license: MIT,
      url,
      targetProduct: { "@id": ids.lite },
      author: organizationRef,
    },
  ];
}

/** ThinkWatch Core: the crates, and the twcore binary built from them. */
export async function coreLd(lang: Lang): Promise<JsonLd[]> {
  const c = coreCopy[lang];
  const release = await getLatestCoreRelease();
  const url = pageUrl(lang, "/core");
  const repo = `${GITHUB}/ThinkWatch-Core`;
  // The prebuilt binaries of the latest release, without checksums and tarballs.
  const binaries = Object.entries(release?.assets ?? {})
    .filter(([name]) => name.startsWith("twcore-") && !/\.(sha256|tar\.gz)$/.test(name))
    .map(([, href]) => href);
  return [
    {
      "@context": CONTEXT,
      "@type": "SoftwareSourceCode",
      "@id": ids.coreSource,
      name: "ThinkWatch Core",
      description: c.meta.description,
      codeRepository: repo,
      programmingLanguage: "Rust",
      license: MIT,
      url,
      targetProduct: { "@id": ids.twcore },
      author: organizationRef,
    },
    {
      "@context": CONTEXT,
      "@type": "SoftwareApplication",
      "@id": ids.twcore,
      name: "twcore",
      description: required(c.meta.twcoreDescription, `coreCopy["${lang}"].meta.twcoreDescription`),
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Linux, macOS, Windows",
      processorRequirements: processors[lang],
      ...(release ? { softwareVersion: release.tag.replace(/^v/, "") } : {}),
      url,
      installUrl: `${url}#install`,
      downloadUrl: binaries.length ? binaries : `${repo}/releases/latest`,
      image: abs(ogImagePath("core")),
      license: MIT,
      offers: free,
      ...byOrganization,
    },
  ];
}

/** Home › page, for pages one level below the home page */
export function breadcrumbs(lang: Lang, path: string, home: string, name: string): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: home, item: pageUrl(lang, "/") },
      { "@type": "ListItem", position: 2, name, item: pageUrl(lang, path) },
    ],
  };
}
