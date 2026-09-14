// Copy for the /lite product page. Facts come from the ThinkWatch Lite README:
// in development, macOS first, no installer, run from source.

export const liteCopy = {
  en: {
    meta: {
      title: "ThinkWatch Lite — A local AI gateway in the macOS menu bar",
      description:
        "A menu-bar application for individual developers that reports the cost of Claude Code and Codex sessions, the route of each request, and the data sent with it. In development, macOS first, run from source. MIT License.",
    },
    hero: {
      eyebrow: "ThinkWatch Lite · For individual developers",
      titleA: "A local AI gateway ",
      titleHighlight: "in the macOS menu bar",
      sub: "Point Claude Code, Codex, or any other client of the Anthropic or OpenAI API at a local port, and Lite displays how each request is handled.",
      ctaPrimary: "Build from source",
      ctaSecondary: "Lite documentation",
    },
    status: {
      badge: "In development",
      body: "macOS is supported first; other platforms will follow once the macOS version is complete. No installer is available, and Lite is run from source.",
    },
    shows: {
      eyebrow: "Capabilities",
      cards: [
        {
          title: "Session cost and its reliability",
          body: "Measured, estimated, and unpriced costs are reported as three separate figures and are never summed. The snapshot date of the price list is shown next to the total.",
        },
        {
          title: "Request routing and its rationale",
          body: "The matched rule by name, the policy group, and the full failover chain, with the reason and duration of every hop.",
        },
        {
          title: "Outbound content",
          body: "Secrets bound for an untrusted upstream, applied redactions, and potentially dangerous tool calls are flagged. Bodies are masked before they are displayed.",
        },
        {
          title: "Configuration editing",
          body: "A form for changing individual values and a code editor for structural changes. Editing a field modifies exactly one line and preserves existing comments.",
        },
      ],
      menubarChip: "[spend today]",
      menubarLead: "Menu bar.",
      menubarBody: "Displays today's spend, or the remaining subscription quota for accounts that have one.",
    },
    built: {
      eyebrow: "Architecture",
      lite: {
        title: "ThinkWatch Lite",
        body: "A Tauri 2 shell with a React 19 window. Supervises Core and renders the menu bar.",
      },
      link: "unix socket",
      core: {
        title: "ThinkWatch Core",
        body: "The gateway: routing, forwarding, and accounting. Lite contains none of this logic.",
      },
      upstreams: {
        title: "Upstreams",
        body: "The Anthropic and OpenAI APIs, and any configured providers and relays.",
      },
    },
    source: {
      eyebrow: "Getting started",
      title: "Build from source",
      link: "Lite getting-started guide",
    },
    license: {
      title: "MIT License",
      body: "Use, modification, and redistribution are permitted.",
      link: "View on GitHub",
    },
  },
  "zh-CN": {
    meta: {
      title: "ThinkWatch Lite — 位于 macOS 菜单栏的本地 AI 网关",
      description:
        "面向个人开发者的菜单栏应用，展示 Claude Code 与 Codex 会话的成本、每个请求的路由，以及随请求发出的内容。开发中，优先支持 macOS，从源码运行。采用 MIT 许可证。",
    },
    hero: {
      eyebrow: "ThinkWatch Lite · 面向个人开发者",
      titleA: "位于 macOS 菜单栏的",
      titleHighlight: "本地 AI 网关",
      sub: "将 Claude Code、Codex 或任何使用 Anthropic / OpenAI API 的客户端指向本地端口，即可通过 Lite 查看每个请求的处理过程。",
      ctaPrimary: "从源码构建",
      ctaSecondary: "Lite 文档",
    },
    status: {
      badge: "开发中",
      body: "优先支持 macOS，其他平台将在 macOS 版本完成后适配。目前不提供安装包，需从源码运行 Lite。",
    },
    shows: {
      eyebrow: "功能",
      cards: [
        {
          title: "会话成本及其可信度",
          body: "实测、估算与无法计价的成本分别列为三个数字，不会相加。合计旁标注价目表的快照日期。",
        },
        {
          title: "请求路由及其依据",
          body: "列出命中的规则名称、策略组以及完整的故障转移链，每一跳均附原因与耗时。",
        },
        {
          title: "出站内容",
          body: "标记发往不受信任上游的密钥、已执行的脱敏以及潜在危险的工具调用。请求体与响应体在显示前即已遮蔽。",
        },
        {
          title: "配置编辑",
          body: "修改单个值使用表单，结构性修改使用代码编辑器。修改一个字段仅变更对应的一行，并保留原有注释。",
        },
      ],
      menubarChip: "[今日花费]",
      menubarLead: "菜单栏。",
      menubarBody: "显示当日花费，或订阅账号的剩余额度。",
    },
    built: {
      eyebrow: "架构",
      lite: {
        title: "ThinkWatch Lite",
        body: "Tauri 2 外壳与 React 19 窗口。负责托管 Core 并渲染菜单栏。",
      },
      link: "unix socket",
      core: {
        title: "ThinkWatch Core",
        body: "网关本体，负责路由、转发与成本核算。Lite 不包含这些逻辑。",
      },
      upstreams: {
        title: "上游服务",
        body: "Anthropic 与 OpenAI API，以及已配置的服务商和中转站。",
      },
    },
    source: {
      eyebrow: "入门",
      title: "从源码构建",
      link: "Lite 入门指南",
    },
    license: {
      title: "MIT 许可证",
      body: "允许使用、修改和再分发。",
      link: "在 GitHub 上查看",
    },
  },
} as const;
