// Copy for the /lite product page. Facts come from the ThinkWatch Lite README:
// released for macOS on Apple Silicon (Homebrew or a disk image) and for
// Windows on x64 and ARM64 (an unsigned installer), updated by the app itself.

export const liteCopy = {
  en: {
    meta: {
      title: "ThinkWatch Lite — A local AI gateway for macOS and Windows",
      description:
        "A desktop app for individual developers that reports what Claude Code and Codex sessions cost, where each request was routed, and what was sent with it. macOS 12 or later on Apple Silicon, installed with Homebrew or a disk image; Windows 10 21H2 or later on x64 or ARM64, installed with an installer. MIT License.",
    },
    hero: {
      eyebrow: "ThinkWatch Lite · For individual developers",
      titleA: "A local AI gateway ",
      titleHighlight: "for macOS and Windows",
      sub: "Claude Code, Codex CLI and other clients of the Anthropic, OpenAI and Gemini APIs send their requests to a gateway on your own machine, and Lite shows what each request cost, which upstream served it and why, and what was sent along with it.",
      ctaSecondary: "Other platforms and ways to install",
      shotAlt:
        "The usage overview: tokens, cost and requests, a 24-hour trend stacked by model, the leaderboard by model and the cache hit rate",
    },
    status: {
      badge: "Available",
      body: "macOS 12 or later on Apple Silicon, installed with Homebrew or a disk image. Windows 10 21H2 or later on x64 or ARM64, installed with an installer. On both, the app updates itself.",
    },
    features: {
      eyebrow: "What it shows",
      items: [
        {
          id: "overview",
          title: "Usage and cost",
          body: "Tokens, cost and requests over any period, broken down by model, with the cache hit rate, the net savings from caching and latency percentiles. Measured costs, estimated costs and unpriced requests stay separate and are never added together, and usage served by a subscription is counted apart from billed usage.",
        },
        {
          id: "requests",
          title: "Routing and failover",
          body: "Every request records the rule it matched, the group it went through and each attempt with its status and duration. When a client and an upstream speak different API formats, the request is converted between Anthropic Messages, OpenAI Chat Completions, OpenAI Responses and Gemini, and the fields that could not be carried over are listed.",
        },
        {
          id: "dry-run",
          title: "A dry run before the traffic",
          body: "The dry run evaluates the rules for a given request and shows where it would go and why — which rules did not match and for what reason — without sending anything and without cost.",
        },
        {
          id: "upstreams",
          title: "Upstreams of every kind",
          body: "API keys, a ChatGPT account signed in from the app with its usage limits, relays such as OpenRouter, and local models. Upstreams can be reached through an outbound proxy and priced with a custom price sheet.",
        },
        {
          id: "findings",
          title: "What leaves the machine",
          body: "Secrets are replaced before a request reaches an untrusted upstream and restored in the response; tool calls that would grant code execution are cut off mid-stream; client configuration files are scanned for hidden characters and dangerous commands. Each defense runs in off, observe or enforce mode.",
        },
        {
          id: "clients",
          title: "Clients in one click",
          body: "Claude Code, Codex CLI, opencode, Zed and Aider are pointed at the gateway from the app. The change is shown as a diff before anything is written, the original file is backed up, and it can be restored at any time.",
        },
      ],
    },
    menubar: {
      eyebrow: "Always visible",
      title: "Fifty pixels in the menu bar",
      body: "Today's cost and the output rate stay in the menu bar; for a subscription account, the quota used and the time until it resets take their place. On Windows the icon sits in the notification area: hovering over it shows today's tokens and cost, a left click opens the main window and a right click opens the menu. System notifications report a gateway that stopped forwarding, an upstream that became unreachable, a quota that ran out or a credential that stopped working.",
      costAlt: "Menu bar item: today's cost $24.72, output at 47 tokens per second",
      quotaAlt: "Menu bar item: 34% of the subscription quota used, resets in 2 hours",
    },
    built: {
      eyebrow: "Architecture",
      lite: {
        title: "ThinkWatch Lite",
        body: "A Tauri 2 shell with a React 19 window. Supervises Core and renders the menu bar or the notification-area menu.",
      },
      link: "local socket",
      core: {
        title: "ThinkWatch Core",
        body: "The gateway: routing, forwarding, and accounting. Lite contains none of this logic.",
      },
      upstreams: {
        title: "Upstreams",
        body: "The Anthropic, OpenAI and Gemini APIs, and any configured providers and relays.",
      },
    },
    install: {
      eyebrow: "Install",
      title: "One download, gateway included",
      brewNote: "The gateway ships inside the app; nothing else needs to be installed.",
      macLabel: "macOS 12 or later · Apple Silicon",
      winLabel: "Windows 10 21H2 or later · x64 or ARM64",
      dmgTitle: "Or a disk image",
      dmgBody:
        "Check it against its sha256 after downloading. The app is not signed by a registered Apple developer, so macOS quarantines a downloaded copy until the attribute is removed — or until Open Anyway is chosen in System Settings › Privacy & Security.",
      dmgDownload: "Download the disk image (Apple Silicon)",
      releases: "All releases",
      winTitle: "Windows installer",
      winBody:
        "The installer sets the app up for all users in Program Files, so Windows asks for administrator permission. WebView2 is downloaded during installation if it is missing; Windows 11 already includes it.",
      winDownload: { x64: "Download for Windows (x64)", arm64: "Download for Windows (ARM64)" },
      winOther: "Other architecture: ",
      winOtherLink: { x64: "x64 installer", arm64: "ARM64 installer" },
      version: "Version",
      winUnsigned:
        "The installer is not code-signed. Running it brings up SmartScreen's full-screen warning, “Windows protected your PC”; choose More info, then Run anyway.",
      docs: "Installation guide",
      source: "Build from source",
    },
    license: {
      title: "MIT License",
      body: "Use, modification, and redistribution are permitted.",
      link: "View on GitHub",
    },
  },
  "zh-CN": {
    meta: {
      title: "ThinkWatch Lite — 适用于 macOS 与 Windows 的本地 AI 网关",
      description:
        "面向个人开发者的桌面应用，展示 Claude Code 与 Codex 会话的费用、每个请求的路由，以及随请求发出的内容。支持 macOS 12 及以上版本的 Apple Silicon 机型，可通过 Homebrew 或磁盘映像安装；支持 Windows 10 21H2 及以上版本的 x64 与 ARM64 机型，通过安装程序安装。采用 MIT 许可证。",
    },
    hero: {
      eyebrow: "ThinkWatch Lite · 面向个人开发者",
      titleA: "适用于 macOS 与 Windows 的",
      titleHighlight: "本地 AI 网关",
      sub: "Claude Code、Codex CLI 等使用 Anthropic、OpenAI、Gemini API 的客户端把请求发给本机上的网关，Lite 展示每个请求的费用、由哪个上游处理及其原因，以及随请求发出的内容。",
      ctaSecondary: "其他平台与安装方式",
      shotAlt:
        "ThinkWatch Lite 的用量概览：token、费用与请求数，按模型分层的 24 小时趋势，模型排行与缓存命中率",
    },
    status: {
      badge: "已发布",
      body: "支持 macOS 12 及以上版本的 Apple Silicon 机型，可通过 Homebrew 或磁盘映像安装；支持 Windows 10 21H2 及以上版本的 x64 与 ARM64 机型，通过安装程序安装。两个平台均由应用自动更新。",
    },
    features: {
      eyebrow: "界面",
      items: [
        {
          id: "overview",
          title: "用量与费用",
          body: "按任意时间范围统计 token、费用与请求数，按模型分层，并给出缓存命中率、缓存带来的净节省与延迟分位。实测费用、估算费用与无法计价的请求分别列出，从不相加；订阅制上游的用量单独统计。",
        },
        {
          id: "requests",
          title: "路由与故障转移",
          body: "每个请求都记录命中的规则、经过的策略组，以及每一次尝试的状态与耗时。客户端与上游的 API 格式不同时，请求在 Anthropic Messages、OpenAI Chat Completions、OpenAI Responses 与 Gemini 之间自动转换，无法转换的字段会逐一列出。",
        },
        {
          id: "dry-run",
          title: "改规则之前先试算",
          body: "试算按给定的请求条件逐条匹配规则，说明请求会交给哪个上游、哪些规则未命中及其原因。不发出请求，也不产生费用。",
        },
        {
          id: "upstreams",
          title: "各种形态的上游",
          body: "支持 API 密钥、在应用内登录并显示订阅额度的 ChatGPT 账号、OpenRouter 等中转服务，以及本机模型。上游可以经出站代理访问，也可以按自定义价目表计价。",
        },
        {
          id: "findings",
          title: "出去的是什么",
          body: "请求发往不受信任的上游之前替换其中的密钥，并在响应中还原；上游返回的危险工具调用在流中被切断；客户端配置文件中的隐藏字符与危险命令会被扫描出来。三项防护各有关闭、观察、拦截三档。",
        },
        {
          id: "clients",
          title: "客户端一键接管",
          body: "Claude Code、Codex CLI、opencode、Zed 与 Aider 可以在应用内一键指向网关。写入前先显示改动差异并完整备份原文件，随时可以还原。",
        },
      ],
    },
    menubar: {
      eyebrow: "常驻可见",
      title: "菜单栏上的五十像素",
      body: "菜单栏常驻显示今日费用与输出速率；使用订阅账号时，改为显示额度用量与重置倒计时。Windows 上图标位于通知区域：悬停显示今日 token 与费用，左键打开主界面，右键打开菜单。网关停止转发、上游无法连接、订阅额度用完、凭据失效等情况会发送系统通知。",
      costAlt: "菜单栏：今日费用 $24.72，输出速率 47 token/秒",
      quotaAlt: "菜单栏：订阅额度已用 34%，2 小时后重置",
    },
    built: {
      eyebrow: "架构",
      lite: {
        title: "ThinkWatch Lite",
        body: "Tauri 2 外壳与 React 19 窗口。负责托管 Core 并渲染菜单栏或通知区域菜单。",
      },
      link: "本地 socket",
      core: {
        title: "ThinkWatch Core",
        body: "网关本体，负责路由、转发与成本核算。Lite 不包含这些逻辑。",
      },
      upstreams: {
        title: "上游服务",
        body: "Anthropic、OpenAI 与 Gemini API，以及已配置的服务商和中转站。",
      },
    },
    install: {
      eyebrow: "安装",
      title: "一次安装，网关随应用一起装好",
      brewNote: "网关在应用包内，没有第二样东西要装。",
      macLabel: "macOS 12 及以上 · Apple Silicon",
      winLabel: "Windows 10 21H2 及以上 · x64 或 ARM64",
      dmgTitle: "也可以用磁盘映像",
      dmgBody:
        "下载后与 sha256 校验值核对。应用未经 Apple 注册开发者签名，macOS 会为下载的副本添加隔离属性，移除该属性后即可打开；也可以在首次打开被拒绝后，在「系统设置 › 隐私与安全性」中点击「仍要打开」。",
      dmgDownload: "下载磁盘映像（Apple Silicon）",
      releases: "全部版本",
      winTitle: "Windows 安装程序",
      winBody:
        "安装程序为所有用户安装，装入 Program Files，因此 Windows 会请求管理员权限。缺少 WebView2 时安装程序会自动下载，Windows 11 已自带。",
      winDownload: { x64: "下载 Windows 版（x64）", arm64: "下载 Windows 版（ARM64）" },
      winOther: "其他架构：",
      winOtherLink: { x64: "x64 安装程序", arm64: "ARM64 安装程序" },
      version: "版本",
      winUnsigned:
        "安装程序未经代码签名。运行时 SmartScreen 会显示全屏警告「Windows 已保护你的电脑」，依次点击「更多信息」→「仍要运行」即可继续安装。",
      docs: "安装指南",
      source: "从源码构建",
    },
    license: {
      title: "MIT 许可证",
      body: "允许使用、修改和再分发。",
      link: "在 GitHub 上查看",
    },
  },
} as const;
