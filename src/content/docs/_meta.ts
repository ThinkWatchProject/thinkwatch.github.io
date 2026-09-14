// Product-aware sidebar order and display labels for the docs.
//
// Each product owns an ordered list of docs. The entry with slug "" is the
// product's docs home (/docs, /docs/lite, /docs/core); every other slug is
// the basename of a markdown file without .md, e.g. "architecture".
// Order matters: it drives the sidebar, the grouping (consecutive docs with
// the same group share a heading) and prev/next navigation.

import { localePath, type Lang } from "~/i18n";

export type ProductId = "thinkwatch" | "lite" | "core";

export type GroupId = "getStarted" | "concepts" | "reference" | "operations" | "contributing";

export const groupLabels: Record<GroupId, Record<Lang, string>> = {
  getStarted: { en: "Get started", "zh-CN": "入门" },
  concepts: { en: "Concepts", "zh-CN": "概念" },
  reference: { en: "Reference", "zh-CN": "参考" },
  operations: { en: "Operations", "zh-CN": "运维" },
  contributing: { en: "Contributing", "zh-CN": "参与开发" },
};

export type DocMeta = {
  /** Basename of the markdown file, or "" for the product's docs home */
  slug: string;
  /** Localized labels shown in the sidebar */
  label: Record<Lang, string>;
  /** Available locales for this doc */
  locales: Lang[];
  /** Sidebar group heading */
  group: GroupId;
  /** Optional one-liner shown on docs home pages */
  summary?: Record<Lang, string>;
};

export type Product = {
  id: ProductId;
  /** Brand name, not translated */
  name: string;
  /** Docs home path without locale prefix, e.g. "/docs/lite" */
  base: string;
  /** Where the markdown sources live ("Edit on GitHub") */
  editUrl: string;
  /** One-liner shown on the documentation home */
  tagline: Record<Lang, string>;
  docs: DocMeta[];
};

const both: Lang[] = ["en", "zh-CN"];

const overview = (group: GroupId = "getStarted"): DocMeta => ({
  slug: "",
  label: { en: "Overview", "zh-CN": "概览" },
  locales: both,
  group,
});

export const products: Product[] = [
  {
    id: "thinkwatch",
    name: "ThinkWatch",
    base: "/docs",
    editUrl: "https://github.com/ThinkWatchProject/ThinkWatch/tree/main/docs",
    tagline: {
      en: "The gateway for teams and enterprises. Deploy, configure, and operate it in production.",
      "zh-CN": "面向团队与企业的网关。在生产环境中部署、配置与运维。",
    },
    docs: [
      overview(),
      {
        slug: "architecture",
        label: { en: "Architecture", "zh-CN": "架构设计" },
        locales: both,
        group: "getStarted",
        summary: {
          en: "System design, dual-port model, request lifecycle, data flow.",
          "zh-CN": "系统设计、双端口模型、请求生命周期、数据流图。",
        },
      },
      {
        slug: "deployment-guide",
        label: { en: "Deployment Guide", "zh-CN": "部署指南" },
        locales: both,
        group: "getStarted",
        summary: {
          en: "Docker Compose, Kubernetes Helm chart, SSL, production hardening.",
          "zh-CN": "Docker Compose、Kubernetes Helm Chart、SSL、生产环境加固。",
        },
      },
      {
        slug: "configuration",
        label: { en: "Configuration", "zh-CN": "配置说明" },
        locales: both,
        group: "reference",
        summary: {
          en: "All environment variables, system settings, and their effects.",
          "zh-CN": "所有环境变量、系统设置项及其影响。",
        },
      },
      {
        slug: "api-reference",
        label: { en: "API Reference", "zh-CN": "API 参考" },
        locales: both,
        group: "reference",
        summary: {
          en: "Complete endpoint documentation for the Gateway and the Console.",
          "zh-CN": "网关和控制台的完整 API 端点文档。",
        },
      },
      {
        slug: "security",
        label: { en: "Security", "zh-CN": "安全模型" },
        locales: both,
        group: "operations",
        summary: {
          en: "Auth model, encryption, RBAC, threat model, hardening checklist.",
          "zh-CN": "认证模型、加密、RBAC、威胁模型、加固清单。",
        },
      },
      {
        slug: "secret-rotation",
        label: { en: "Secret Rotation", "zh-CN": "密钥轮换" },
        locales: both,
        group: "operations",
        summary: {
          en: "Rotating provider keys, JWT secrets, and admin credentials in production.",
          "zh-CN": "在生产环境中轮换 Provider 密钥、JWT secret 和管理员凭据。",
        },
      },
    ],
  },
  {
    id: "lite",
    name: "ThinkWatch Lite",
    base: "/docs/lite",
    editUrl: "https://github.com/ThinkWatchProject/thinkwatch.github.io/tree/main/src/content/docs-lite",
    tagline: {
      en: "The desktop app for a local AI API gateway. A menu-bar app that supervises ThinkWatch Core.",
      "zh-CN": "本地 AI API 网关的桌面端。一个托管 ThinkWatch Core 的菜单栏应用。",
    },
    docs: [
      overview(),
      {
        slug: "run-from-source",
        label: { en: "Run from source", "zh-CN": "从源码运行" },
        locales: both,
        group: "getStarted",
        summary: {
          en: "macOS first, no installer: pnpm install, then pnpm tauri dev.",
          "zh-CN": "先做 macOS，没有安装包：pnpm install，然后 pnpm tauri dev。",
        },
      },
      {
        slug: "architecture",
        label: { en: "Architecture", "zh-CN": "架构" },
        locales: both,
        group: "concepts",
        summary: {
          en: "A Tauri 2 shell and a React 19 frontend that supervise Core and talk to it over a unix socket.",
          "zh-CN": "Tauri 2 外壳加 React 19 前端，托管 Core，并通过 unix socket 与它通信。",
        },
      },
      {
        slug: "contributing",
        label: { en: "Contributing", "zh-CN": "贡献指南" },
        locales: both,
        group: "contributing",
        summary: {
          en: "Branches, settled scope, checks to run before a pull request.",
          "zh-CN": "分支、已定的范围、提 PR 之前要跑的检查。",
        },
      },
    ],
  },
  {
    id: "core",
    name: "ThinkWatch Core",
    base: "/docs/core",
    editUrl: "https://github.com/ThinkWatchProject/thinkwatch.github.io/tree/main/src/content/docs-core",
    tagline: {
      en: "The shared core of a local AI API gateway. A set of MIT-licensed Rust crates, plus the twcore binary.",
      "zh-CN": "本地 AI API 网关的共用核心层。一组 MIT 许可的 Rust crate，外加 twcore 二进制。",
    },
    docs: [
      overview(),
      {
        slug: "quick-start",
        label: { en: "Quick start with twcore", "zh-CN": "用 twcore 快速上手" },
        locales: both,
        group: "getStarted",
        summary: {
          en: "Write, check, and serve a config with the twcore binary.",
          "zh-CN": "用 twcore 二进制生成、校验并启动一份配置。",
        },
      },
      {
        slug: "crate-layers",
        label: { en: "Crate layers", "zh-CN": "crate 分层" },
        locales: both,
        group: "concepts",
        summary: {
          en: "The four layers, and why the lower two are not shared with the server edition.",
          "zh-CN": "四层结构，以及下面两层为什么不与服务端版本共用。",
        },
      },
      {
        slug: "development",
        label: { en: "Development and tests", "zh-CN": "开发与测试" },
        locales: both,
        group: "contributing",
        summary: {
          en: "cargo test, scripts/smoke.sh, pull request checks, and the rules that are load-bearing.",
          "zh-CN": "cargo test、scripts/smoke.sh、PR 前的检查，以及不能破坏的规则。",
        },
      },
    ],
  },
];

export const productIds: ProductId[] = products.map((p) => p.id);

export function getProduct(id: ProductId): Product {
  const product = products.find((p) => p.id === id);
  if (!product) throw new Error(`[docs] unknown product "${id}"`);
  return product;
}

/** Docs home URL of a product, localized. */
export function productHomeHref(lang: Lang, id: ProductId): string {
  return localePath(lang, getProduct(id).base);
}

/**
 * URL of a doc. Untranslated docs fall back to the English URL, which is
 * how the sidebar has always handled missing translations.
 */
export function docHref(lang: Lang, id: ProductId, doc: DocMeta): string {
  const base = getProduct(id).base;
  const path = doc.slug ? `${base}/${doc.slug}` : base;
  return doc.locales.includes(lang) ? localePath(lang, path) : path;
}

export type SidebarItem = DocMeta & { availableHere: boolean; href: string };
export type SidebarGroup = { id: GroupId; label: string; items: SidebarItem[] };

/** Sidebar for one product: every doc, grouped, flagged when untranslated. */
export function getSidebar(id: ProductId, lang: Lang): SidebarGroup[] {
  const groups: SidebarGroup[] = [];
  for (const doc of getProduct(id).docs) {
    const item: SidebarItem = { ...doc, availableHere: doc.locales.includes(lang), href: docHref(lang, id, doc) };
    const last = groups[groups.length - 1];
    if (last && last.id === doc.group) last.items.push(item);
    else groups.push({ id: doc.group, label: groupLabels[doc.group][lang], items: [item] });
  }
  return groups;
}

/** Previous and next doc in reading order, within one product and skipping untranslated docs. */
export function getNeighbours(id: ProductId, slug: string, lang: Lang): { prev?: DocMeta; next?: DocMeta } {
  const order = getProduct(id).docs.filter((d) => d.locales.includes(lang));
  const idx = order.findIndex((d) => d.slug === slug);
  if (idx < 0) return {};
  return { prev: order[idx - 1], next: order[idx + 1] };
}

/** Find a doc (never the docs home) by slug. Defaults to ThinkWatch for backwards compatibility. */
export function findDoc(slug: string, id: ProductId = "thinkwatch"): DocMeta | undefined {
  if (!slug) return undefined;
  return getProduct(id).docs.find((d) => d.slug === slug);
}

/** Articles (docs home excluded) of a product in a given locale. */
export function getDocsForLocale(lang: Lang, id: ProductId = "thinkwatch"): DocMeta[] {
  return getProduct(id).docs.filter((d) => d.slug && d.locales.includes(lang));
}

/** ThinkWatch guides in reading order (docs home excluded). Kept for existing imports. */
export const docsOrder: DocMeta[] = getProduct("thinkwatch").docs.filter((d) => d.slug);
