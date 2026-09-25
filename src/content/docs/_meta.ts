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
    name: "ThinkWatch Enterprise",
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
      en: "The desktop app for a local AI API gateway on macOS, Windows and Linux: what it shows, how to install it, and how it is built.",
      "zh-CN": "运行本地 AI API 网关的 macOS、Windows 与 Linux 桌面应用：它展示什么、怎么安装、怎么构建。",
    },
    docs: [
      overview(),
      {
        slug: "install",
        label: { en: "Install and update", "zh-CN": "安装与更新" },
        locales: both,
        group: "getStarted",
        summary: {
          en: "Homebrew, a disk image, the Windows installer or the Linux AppImage, the quarantine attribute and SmartScreen, and how updates reach each kind of install.",
          "zh-CN": "通过 Homebrew、磁盘映像、Windows 安装程序或 Linux AppImage 安装，隔离属性与 SmartScreen 的处理，以及各种安装方式如何更新。",
        },
      },
      {
        slug: "run-from-source",
        label: { en: "Build from source", "zh-CN": "从源码构建" },
        locales: both,
        group: "getStarted",
        summary: {
          en: "Run a development build with pnpm tauri dev, or build a macOS bundle, a Windows installer or a Linux AppImage.",
          "zh-CN": "用 pnpm tauri dev 运行开发版本，或打包 macOS 应用、Windows 安装程序与 Linux AppImage。",
        },
      },
      {
        slug: "architecture",
        label: { en: "Architecture", "zh-CN": "架构" },
        locales: both,
        group: "concepts",
        summary: {
          en: "A Tauri 2 shell and a React 19 frontend that supervise Core and communicate with it over a unix socket on macOS and Linux and a loopback port on Windows.",
          "zh-CN": "Tauri 2 外壳与 React 19 前端，负责托管 Core，在 macOS 与 Linux 上通过 unix socket、在 Windows 上通过回环端口与其通信。",
        },
      },
      {
        slug: "contributing",
        label: { en: "Contributing", "zh-CN": "贡献指南" },
        locales: both,
        group: "contributing",
        summary: {
          en: "Branches, settled scope, and the checks required before opening a pull request.",
          "zh-CN": "分支约定、已确定的范围，以及提交 PR 前须通过的检查。",
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
      en: "The gateway engine shared by ThinkWatch Lite and ThinkWatch Enterprise: MIT-licensed Rust crates and the twcore binary, which also runs on its own on a Linux server.",
      "zh-CN": "ThinkWatch Lite 与 ThinkWatch 企业版共用的网关引擎：采用 MIT 许可证的 Rust crate 与 twcore 二进制，后者也可独立运行在 Linux 服务器上。",
    },
    docs: [
      overview(),
      {
        slug: "quick-start",
        label: { en: "Quick start with twcore", "zh-CN": "twcore 快速入门" },
        locales: both,
        group: "getStarted",
        summary: {
          en: "Get twcore from a release or build it from source, write and check a configuration, and point a client at the gateway.",
          "zh-CN": "从发布版本获取 twcore 或从源码构建，生成并校验配置，并将客户端指向网关。",
        },
      },
      // Published from the Core repository (src/lib/core-docs.mjs).
      {
        slug: "server-deployment",
        label: { en: "Server deployment", "zh-CN": "服务器部署" },
        locales: both,
        group: "getStarted",
        summary: {
          en: "Run twcore as a systemd service on Linux, open the remote control port, connect ThinkWatch Lite, and upgrade with twcore upgrade.",
          "zh-CN": "在 Linux 上以 systemd 服务运行 twcore，开启远程控制端口，连接 ThinkWatch Lite，并用 twcore upgrade 升级。",
        },
      },
      {
        slug: "crate-layers",
        label: { en: "Crate layers", "zh-CN": "crate 分层" },
        locales: both,
        group: "concepts",
        summary: {
          en: "The sixteen crates grouped by role, the three that ThinkWatch Enterprise depends on, and what ThinkWatch Lite compiles.",
          "zh-CN": "十六个 crate 按职责的分组、ThinkWatch 企业版依赖的三个 crate，以及 ThinkWatch Lite 编译的部分。",
        },
      },
      // Published from the Core repository (src/lib/core-docs.mjs).
      {
        slug: "configuration",
        label: { en: "Configuration reference", "zh-CN": "配置手册" },
        locales: both,
        group: "reference",
        summary: {
          en: "Every field of config.yaml: what it does, its default, the values it takes, and how a change reaches the running core.",
          "zh-CN": "config.yaml 中每个字段的作用、默认值与可选值，以及改动如何进入正在运行的 core。",
        },
      },
      {
        slug: "development",
        label: { en: "Development and tests", "zh-CN": "开发与测试" },
        locales: both,
        group: "contributing",
        summary: {
          en: "cargo test, scripts/smoke.sh, the checks before a pull request, releases, and the rules every change follows.",
          "zh-CN": "cargo test、scripts/smoke.sh、提交 PR 前的检查、发布流程，以及每个改动都须遵守的规则。",
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

/** Display name of a product in the given language. The server edition is
 *  called "ThinkWatch Enterprise" / "ThinkWatch 企业版" wherever it is listed
 *  next to Lite and Core. */
export function productName(p: Pick<Product, "id" | "name">, lang: Lang): string {
  if (p.id === "thinkwatch") return lang === "zh-CN" ? "ThinkWatch 企业版" : "ThinkWatch Enterprise";
  return p.name;
}
