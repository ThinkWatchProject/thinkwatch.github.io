// Copy for the /thinkwatch product page (the self-hosted enterprise edition).
// Facts come from the ThinkWatch README; the sections below the hero still
// read their copy from src/i18n/index.ts.

export const thinkwatchCopy = {
  en: {
    meta: {
      title: "ThinkWatch Enterprise — An AI bastion host for organizations",
      description:
        "Security, auditing, and governance for every AI API call and MCP tool invocation across an organization, from a single self-hosted control plane.",
    },
    hero: {
      eyebrow: "ThinkWatch Enterprise · For organizations",
      titleA: "An AI bastion host ",
      titleHighlight: "for organizations",
      sub: "ThinkWatch secures, audits, and governs every AI API call and MCP tool invocation across an organization from a single control plane.",
      ctaPrimary: "Deploy ThinkWatch",
      ctaSecondary: "Read the docs",
      pills: ["Self-hosted", "Docker Compose or Kubernetes"],
      license: "BSL 1.1",
      versionLabel: "Latest release",
      mockTitle: "Log explorer",
      mockSample: "Sample data",
      mockNote: "Users, keys, and models in this panel are illustrative.",
    },
    licenseTeaser: {
      title: "Free production tier",
      body: "BSL 1.1. Free for non-production use, and free in production up to 10,000,000 billable tokens and 10,000 MCP tool calls per month.",
      link: "See licensing and tiers",
    },
  },
  "zh-CN": {
    meta: {
      title: "ThinkWatch 企业版 — 面向组织的 AI 堡垒机",
      description:
        "在一个自托管的统一控制面上，对组织内每一次 AI API 调用和 MCP 工具调用进行安全管控、审计和治理。",
    },
    hero: {
      eyebrow: "ThinkWatch 企业版 · 面向组织",
      titleA: "面向组织的 ",
      titleHighlight: "AI 堡垒机",
      sub: "在统一控制面上，对组织内的每一次 AI API 调用与 MCP 工具调用进行安全管控、审计与治理。",
      ctaPrimary: "部署 ThinkWatch",
      ctaSecondary: "阅读文档",
      pills: ["自托管", "Docker Compose 或 Kubernetes"],
      license: "BSL 1.1",
      versionLabel: "最新版本",
      mockTitle: "日志查询",
      mockSample: "示例数据",
      mockNote: "面板中的用户、密钥和模型仅作示意。",
    },
    licenseTeaser: {
      title: "生产环境免费额度",
      body: "BSL 1.1 许可证。非生产环境免费；生产环境每月不超过 10,000,000 计费 token 且不超过 10,000 次 MCP 工具调用时同样免费。",
      link: "查看许可证与分级",
    },
  },
} as const;
