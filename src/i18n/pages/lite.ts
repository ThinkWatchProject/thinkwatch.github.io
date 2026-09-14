// Copy for the /lite product page. Facts come from the ThinkWatch Lite README:
// in development, macOS first, no installer, run from source.

export const liteCopy = {
  en: {
    meta: {
      title: "ThinkWatch Lite — Your local AI gateway, in the menu bar",
      description:
        "A menu-bar app for individual developers. See what a Claude Code or Codex session cost, where each request went, and what went out with it. In development, macOS first, run from source. MIT.",
    },
    hero: {
      eyebrow: "ThinkWatch Lite · For individual developers",
      titleA: "Your local AI gateway, ",
      titleHighlight: "in the menu bar.",
      sub: "Point Claude Code, Codex, or anything else that speaks the Anthropic or OpenAI API at a local port, and see what happens next.",
      ctaPrimary: "Run it from source",
      ctaSecondary: "Read the Lite docs",
    },
    status: {
      badge: "In development",
      body: "macOS comes first, and other platforms follow once the macOS version is done. There is no installer yet: you run Lite from source.",
    },
    shows: {
      eyebrow: "What it shows you",
      cards: [
        {
          title: "What a session cost, and how much to trust that number",
          body: "Measured, estimated, and unpriced are three separate figures, never added together. The price list's snapshot date sits next to the total.",
        },
        {
          title: "Where each request went, and why",
          body: "The rule it matched by name, the policy group, and the full failover chain, with a reason and a duration on every hop.",
        },
        {
          title: "What went out with it",
          body: "Secrets caught heading for an untrusted upstream, redactions applied, and tool calls that looked dangerous. Bodies are masked before they reach the screen.",
        },
        {
          title: "Your config, edited two ways",
          body: "A form for changing a value, a code editor for everything structural. Changing one field changes exactly one line and leaves your comments alone.",
        },
      ],
      menubarChip: "[spend today]",
      menubarLead: "In the menu bar.",
      menubarBody: "Today's spend, or the remaining subscription quota for an account that has one.",
    },
    built: {
      eyebrow: "How it is built",
      lite: {
        title: "ThinkWatch Lite",
        body: "Tauri 2 shell and a React 19 window. Supervises Core and renders the menu bar.",
      },
      link: "unix socket",
      core: {
        title: "ThinkWatch Core",
        body: "The gateway itself: routing, forwarding, and accounting. Lite holds none of that logic.",
      },
      upstreams: {
        title: "Your upstreams",
        body: "The Anthropic and OpenAI APIs, and the providers and relays you configure.",
      },
    },
    source: {
      eyebrow: "Run it from source",
      title: "Two commands on a Mac.",
      link: "Getting started with Lite",
    },
    license: {
      title: "MIT License",
      body: "Use it, change it, and ship it anywhere.",
      link: "View on GitHub",
    },
  },
  "zh-CN": {
    meta: {
      title: "ThinkWatch Lite — 你的本地 AI 网关，就在菜单栏里",
      description:
        "面向个人开发者的菜单栏应用。看清 Claude Code、Codex 的一次会话花了多少、每个请求去了哪里、随请求发出了什么。开发中，先支持 macOS，从源码运行。MIT 许可证。",
    },
    hero: {
      eyebrow: "ThinkWatch Lite · 面向个人开发者",
      titleA: "你的本地 AI 网关，",
      titleHighlight: "就在菜单栏里。",
      sub: "把 Claude Code、Codex，或任何使用 Anthropic / OpenAI API 的工具指向一个本地端口，看清接下来发生了什么。",
      ctaPrimary: "从源码运行",
      ctaSecondary: "阅读 Lite 文档",
    },
    status: {
      badge: "开发中",
      body: "先支持 macOS，其他系统等 macOS 版完成后再适配。目前没有安装包：从源码运行 Lite。",
    },
    shows: {
      eyebrow: "它让你看到什么",
      cards: [
        {
          title: "一次会话花了多少，以及这个数字有多可信",
          body: "实测、估算和无法计价是三个分开的数字，从不相加。价目表的快照日期就标在合计旁边。",
        },
        {
          title: "每个请求去了哪里，为什么",
          body: "按名字列出命中的规则、经过的策略组，以及完整的故障转移链，每一跳都带着原因和耗时。",
        },
        {
          title: "随请求一起发出了什么",
          body: "正发往不受信任上游的密钥、已做的脱敏、看起来危险的工具调用都会标出来。请求体和响应体在上屏之前就已打码。",
        },
        {
          title: "配置有两种改法",
          body: "改一个值用表单，结构性的改动用代码编辑器。改一个字段只会改动那一行，你的注释原样保留。",
        },
      ],
      menubarChip: "[今日花费]",
      menubarLead: "在菜单栏里。",
      menubarBody: "今日花费，或订阅账号的剩余额度。",
    },
    built: {
      eyebrow: "它是怎么构建的",
      lite: {
        title: "ThinkWatch Lite",
        body: "Tauri 2 外壳加 React 19 窗口。托管 Core，渲染菜单栏。",
      },
      link: "unix socket",
      core: {
        title: "ThinkWatch Core",
        body: "网关本体：路由、转发和计费。Lite 不含这些逻辑。",
      },
      upstreams: {
        title: "你的上游",
        body: "Anthropic 与 OpenAI API，以及你配置的服务商和中转站。",
      },
    },
    source: {
      eyebrow: "从源码运行",
      title: "在 Mac 上只需两条命令。",
      link: "Lite 入门",
    },
    license: {
      title: "MIT 许可证",
      body: "随意使用、修改，并在任何地方发布。",
      link: "在 GitHub 上查看",
    },
  },
} as const;
