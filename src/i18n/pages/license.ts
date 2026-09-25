// Copy for the /license page.
// Every rule, tier, price and definition here mirrors LICENSING.md in the
// ThinkWatch repository. If that file changes, update this one to match,
// and keep the numbers identical across both languages.

const links = {
  thinkwatchLicense: "https://github.com/ThinkWatchProject/ThinkWatch/blob/main/LICENSE",
  licensingMd: "https://github.com/ThinkWatchProject/ThinkWatch/blob/main/LICENSING.md",
  liteLicense: "https://github.com/ThinkWatchProject/ThinkWatch-Lite/blob/main/LICENSE",
  coreLicense: "https://github.com/ThinkWatchProject/ThinkWatch-Core/blob/main/LICENSE",
  sales: "mailto:fylorn@outlook.com",
  salesLabel: "fylorn@outlook.com",
} as const;

const tierNumbers = [
  { name: "Starter", tokens: "0 – 10,000,000", calls: "0 – 10,000", free: true },
  { name: "Growth", tokens: "10,000,001 – 100,000,000", calls: "10,001 – 100,000", free: false },
  { name: "Scale", tokens: "100,000,001 – 1,000,000,000", calls: "100,001 – 1,000,000", free: false },
  { name: "Enterprise", tokens: "1,000,000,001 – 10,000,000,000", calls: "1,000,001 – 10,000,000", free: false },
] as const;

export const licenseCopy = {
  en: {
    meta: {
      title: "License · ThinkWatch",
      description:
        "ThinkWatch Lite and ThinkWatch Core are MIT. ThinkWatch is source-available under the Business Source License 1.1: free for non-production use, and free in production up to 10,000,000 billable tokens and 10,000 MCP tool calls per month.",
      breadcrumbHome: "Home",
      breadcrumbPage: "License",
    },
    hero: {
      eyebrow: "License terms",
      title: "Licensing",
      sub: "ThinkWatch Lite and ThinkWatch Core are licensed under MIT. ThinkWatch is source-available under the Business Source License 1.1, with free production use up to monthly thresholds.",
    },
    products: [
      {
        name: "ThinkWatch Lite",
        badge: "MIT",
        tone: "teal",
        body: "Use, modify, and redistribute it, commercially or not. Keep the copyright and license notice.",
      },
      {
        name: "ThinkWatch Core",
        badge: "MIT",
        tone: "teal",
        body: "Use, modify, and redistribute it, commercially or not. Keep the copyright and license notice.",
      },
      {
        name: "ThinkWatch Enterprise",
        badge: "BSL 1.1",
        tone: "amber",
        body: "Free for non-production use. Free in production up to both monthly thresholds below. A commercial license is required above either threshold.",
      },
    ],
    rules: {
      eyebrow: "ThinkWatch Enterprise · Business Source License 1.1",
      title: "Terms summary",
      rows: [
        { term: "Non-production use", rule: "Permitted at no charge." },
        {
          term: "Free production use",
          rule: "Permitted up to both 10,000,000 billable tokens and 10,000 MCP tool calls per UTC calendar month.",
        },
        {
          term: "Commercial trigger",
          rule: "A separate commercial license is required if either threshold is exceeded.",
        },
        {
          term: "Open-source conversion",
          rule: "Each released version converts to GPL-2.0-or-later on the earlier of its Change Date or the fourth anniversary of its first public release.",
        },
      ],
    },
    tiers: {
      title: "Commercial tiers",
      sub: "Priced by monthly usage, not by seat.",
      tableLabel: "ThinkWatch commercial tiers",
      scrollHint: "Scroll sideways to see every column.",
      headers: ["Tier", "Billable tokens / month", "MCP tool calls / month", "List price"],
      rows: [
        { ...tierNumbers[0], price: "Free, under the Additional Use Grant" },
        { ...tierNumbers[1], price: "USD 499 / month" },
        { ...tierNumbers[2], price: "USD 1,999 / month" },
        { ...tierNumbers[3], price: "USD 6,999 / month" },
        {
          name: "Custom",
          tokens: "Above 10,000,000,000",
          calls: "Above 10,000,000",
          free: false,
          price: "Custom commercial agreement",
        },
      ],
      notes: [
        "The applicable tier is the higher tier reached by either metric. 8,000,000 billable tokens and 25,000 MCP tool calls is Growth; 220,000,000 billable tokens and 80,000 MCP tool calls is Scale.",
        "Embedded, OEM, and managed-service offerings may require a custom commercial agreement even when usage is otherwise metered monthly.",
      ],
    },
    counts: {
      eyebrow: "Usage measurement",
      volume:
        "Tiers are measured on Production Usage Volume: the total billable tokens and total MCP tool calls processed during a UTC calendar month.",
      counted: "Counted",
      notCounted: "Not counted",
      cards: [
        {
          title: "Billable tokens",
          counted:
            "All input tokens processed and all output tokens generated for production traffic, aggregated across every workspace, team, environment, and customer operated by the same legal entity.",
          notCounted:
            "Local development, CI, test, staging, or demo traffic, and internal evaluation traffic that does not serve end-user production requests.",
        },
        {
          title: "MCP tool calls",
          counted:
            "Each production invocation of an MCP tool routed through ThinkWatch, whether a human user, an agent, an automation, or a background workflow started it, aggregated across every workspace, team, environment, and customer operated by the same legal entity.",
          notCounted:
            "Internal health checks, tool discovery and catalog refresh operations such as tools/list, and local development, CI, test, staging, or demo traffic.",
        },
      ],
    },
    fullText: {
      title: "Full license text",
      body: "This page summarizes the terms. The license files are authoritative.",
      links: [
        { label: "ThinkWatch LICENSE", href: links.thinkwatchLicense },
        { label: "LICENSING.md", href: links.licensingMd },
        { label: "ThinkWatch Lite LICENSE", href: links.liteLicense },
        { label: "ThinkWatch Core LICENSE", href: links.coreLicense },
      ],
    },
    contact: {
      title: "Commercial licensing",
      body: "If either free threshold is exceeded, a commercial license must be obtained before continuing production use of ThinkWatch.",
      label: links.salesLabel,
      href: links.sales,
    },
  },

  "zh-CN": {
    meta: {
      title: "许可证 · ThinkWatch",
      description:
        "ThinkWatch Lite 与 ThinkWatch Core 采用 MIT 许可证。ThinkWatch 在 Business Source License 1.1 下源码开放：非生产环境免费；生产环境每月 10,000,000 计费 token 与 10,000 次 MCP 工具调用以内免费。",
      breadcrumbHome: "首页",
      breadcrumbPage: "许可证",
    },
    hero: {
      eyebrow: "许可条款",
      title: "许可证",
      sub: "ThinkWatch Lite 与 ThinkWatch Core 采用 MIT 许可证。ThinkWatch 在 Business Source License 1.1 下源码开放，生产环境用量在月度阈值以内可免费使用。",
    },
    products: [
      {
        name: "ThinkWatch Lite",
        badge: "MIT",
        tone: "teal",
        body: "可自由使用、修改和再分发，商业或非商业用途均可。需保留版权声明与许可声明。",
      },
      {
        name: "ThinkWatch Core",
        badge: "MIT",
        tone: "teal",
        body: "可自由使用、修改和再分发，商业或非商业用途均可。需保留版权声明与许可声明。",
      },
      {
        name: "ThinkWatch 企业版",
        badge: "BSL 1.1",
        tone: "amber",
        body: "非生产环境免费。生产环境在下方两项月度阈值内免费。超出任一阈值须获取商业授权。",
      },
    ],
    rules: {
      eyebrow: "ThinkWatch 企业版 · Business Source License 1.1",
      title: "条款概要",
      rows: [
        { term: "非生产环境", rule: "免费使用。" },
        {
          term: "生产环境免费使用",
          rule: "每个 UTC 自然月内，计费 token 不超过 10,000,000 且 MCP 工具调用不超过 10,000 次，即可免费用于生产环境。",
        },
        {
          term: "商业授权触发条件",
          rule: "超出任一阈值，即需要单独的商业授权。",
        },
        {
          term: "转为开源",
          rule: "每个已发布版本在其 Change Date 或首次公开发布满四周年时（以较早者为准），转为 GPL-2.0-or-later。",
        },
      ],
    },
    tiers: {
      title: "商业授权档位",
      sub: "按月度用量计价，不按席位。",
      tableLabel: "ThinkWatch 商业授权档位",
      scrollHint: "左右滑动查看全部列。",
      headers: ["档位", "计费 token / 月", "MCP 工具调用 / 月", "标价"],
      rows: [
        { ...tierNumbers[0], price: "免费，属于附加使用授权（Additional Use Grant）" },
        { ...tierNumbers[1], price: "USD 499 / 月" },
        { ...tierNumbers[2], price: "USD 1,999 / 月" },
        { ...tierNumbers[3], price: "USD 6,999 / 月" },
        {
          name: "Custom",
          tokens: "超过 10,000,000,000",
          calls: "超过 10,000,000",
          free: false,
          price: "定制商业协议",
        },
      ],
      notes: [
        "档位取两项指标中达到的较高档位。8,000,000 计费 token 加 25,000 次 MCP 工具调用属于 Growth；220,000,000 计费 token 加 80,000 次 MCP 工具调用属于 Scale。",
        "嵌入式、OEM 与托管服务类产品，即使用量按月计量，也可能需要定制商业协议。",
      ],
    },
    counts: {
      eyebrow: "计量范围",
      volume: "档位依据生产用量（Production Usage Volume）确定，即一个 UTC 自然月内处理的计费 token 总量与 MCP 工具调用总次数。",
      counted: "计入",
      notCounted: "不计入",
      cards: [
        {
          title: "计费 token",
          counted:
            "生产流量处理的全部输入 token 与生成的全部输出 token，同一法律实体运营的所有工作区、团队、环境和客户合并计算。",
          notCounted: "本地开发、CI、测试、预发或演示流量，以及不服务于终端用户生产请求的内部评估流量。",
        },
        {
          title: "MCP 工具调用",
          counted:
            "经 ThinkWatch 路由的每一次生产环境 MCP 工具调用，无论由真人用户、智能体、自动化还是后台工作流发起，同一法律实体运营的所有工作区、团队、环境和客户合并计算。",
          notCounted: "内部健康检查，tools/list 等工具发现与目录刷新操作，以及本地开发、CI、测试、预发或演示流量。",
        },
      ],
    },
    fullText: {
      title: "完整条款",
      body: "本页为条款摘要，具体以许可证文件为准。",
      links: [
        { label: "ThinkWatch LICENSE", href: links.thinkwatchLicense },
        { label: "LICENSING.md", href: links.licensingMd },
        { label: "ThinkWatch Lite LICENSE", href: links.liteLicense },
        { label: "ThinkWatch Core LICENSE", href: links.coreLicense },
      ],
    },
    contact: {
      title: "商业授权",
      body: "超出任一免费阈值后，继续在生产环境使用 ThinkWatch 之前须获取商业授权。",
      label: links.salesLabel,
      href: links.sales,
    },
  },
} as const;

export default licenseCopy;
