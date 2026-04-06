// Sidebar order and display labels for the docs navigation.
// The slug is the basename without .md, e.g. "architecture".

import type { Lang } from "~/i18n";

export type DocMeta = {
  slug: string;
  /** Localized labels shown in the sidebar */
  label: Record<Lang, string>;
  /** Available locales for this doc */
  locales: Lang[];
  /** Optional one-liner shown on the docs index page */
  summary?: Record<Lang, string>;
};

export const docsOrder: DocMeta[] = [
  {
    slug: "architecture",
    label: { en: "Architecture", "zh-CN": "架构设计" },
    locales: ["en", "zh-CN"],
    summary: {
      en: "System design, dual-port model, request lifecycle, data flow.",
      "zh-CN": "系统设计、双端口模型、请求生命周期、数据流图。",
    },
  },
  {
    slug: "deployment-guide",
    label: { en: "Deployment Guide", "zh-CN": "部署指南" },
    locales: ["en", "zh-CN"],
    summary: {
      en: "Docker Compose, Kubernetes Helm chart, SSL, production hardening.",
      "zh-CN": "Docker Compose、Kubernetes Helm Chart、SSL、生产环境加固。",
    },
  },
  {
    slug: "configuration",
    label: { en: "Configuration", "zh-CN": "配置说明" },
    locales: ["en", "zh-CN"],
    summary: {
      en: "All environment variables, system settings, and their effects.",
      "zh-CN": "所有环境变量、系统设置项及其影响。",
    },
  },
  {
    slug: "api-reference",
    label: { en: "API Reference", "zh-CN": "API 参考" },
    locales: ["en", "zh-CN"],
    summary: {
      en: "Complete endpoint documentation for the Gateway and the Console.",
      "zh-CN": "网关和控制台的完整 API 端点文档。",
    },
  },
  {
    slug: "security",
    label: { en: "Security", "zh-CN": "安全模型" },
    locales: ["en", "zh-CN"],
    summary: {
      en: "Auth model, encryption, RBAC, threat model, hardening checklist.",
      "zh-CN": "认证模型、加密、RBAC、威胁模型、加固清单。",
    },
  },
  {
    slug: "secret-rotation",
    label: { en: "Secret Rotation", "zh-CN": "密钥轮换" },
    locales: ["en"],
    summary: {
      en: "Rotating provider keys, JWT secrets, and admin credentials in production.",
      "zh-CN": "在生产环境中轮换 Provider 密钥、JWT secret 和管理员凭据。",
    },
  },
];

export function getDocsForLocale(lang: Lang): DocMeta[] {
  return docsOrder.filter((d) => d.locales.includes(lang));
}

export function findDoc(slug: string): DocMeta | undefined {
  return docsOrder.find((d) => d.slug === slug);
}
