// Copy for the /lite product page.
//
// Product claims are checked against the code, not against other copy: the
// five protections and their initial modes against ThinkWatch Core
// (crates/tw-config/src/security.rs), which notices become system
// notifications against the app (src-tauri/src/notices/rules.rs), and what
// changes while the app is connected to a remote core against src/connection.
//
// Screenshots come from the ThinkWatch Lite repository (`pnpm shots`, output in
// docs/screenshots/web), copied into public/lite under the same names. Each
// alt text describes the image it belongs to; when an image is replaced, its
// alt text changes with it.

const overviewAlt = {
  en: "The Overview page for the last 7 days: 83.1M tokens, $68.11 in cost including $0.441 estimated and 13 unpriced requests, and 1,339 requests of which 11 failed, each compared with the prior 7 days; a token trend stacked by model with the periods that had failures marked; and the models ranked by tokens",
  "zh-CN":
    "概览页（最近 7 天）：token 83.1M、费用 $68.11（含估算 $0.441，13 条无法计价）、请求 1,339 次（失败 11 次），均与上一个 7 天对比；按模型分层的 token 趋势，并标出存在失败的时段；以及按 token 排序的模型列表",
} as const;

export const liteCopy = {
  en: {
    meta: {
      title: "ThinkWatch Lite — Local gateway for Claude Code, Codex and other AI clients",
      description:
        "A local gateway for Claude Code, Codex and other AI clients on macOS, Windows and Linux. Connect each client once and switch upstreams freely, replace API keys before a request leaves, stop dangerous tool calls, and see the cost and route of every request. MIT License.",
    },
    hero: {
      eyebrow: "ThinkWatch Lite · For individual developers",
      titleA: "A local gateway for ",
      titleHighlight: "Claude Code, Codex and other AI clients",
      sub: "Each client is connected once; after that, upstreams and models change without touching its configuration. Every request is recorded with its cost and route, and the API keys in it can be replaced before it leaves the machine. For macOS, Windows and Linux, under the MIT License.",
      ctaSecondary: "Other platforms and installation methods",
      shotAlt: overviewAlt.en,
    },
    status: {
      badge: "Available",
      items: ["macOS 12+ · Apple silicon", "Windows 10 21H2+ · x64 · ARM64", "Linux · x86_64 · aarch64", "English · 简体中文", "Updates itself", "MIT"],
    },
    features: {
      eyebrow: "Features",
      items: [
        {
          id: "clients",
          title: "Connect once, switch freely",
          body: "Claude Code, Codex, opencode and four other clients are pointed at the gateway in one step, with the change previewed, the original file backed up and a restore always available; on Windows, Claude Code and Codex inside WSL as well. From then on, switching upstreams happens in the gateway, with no client to reconfigure or restart.",
          alt: "The Clients page: Claude Code and Codex connected, each with its own key and its requests over the last 24 hours; opencode not connected; Cursor set up by hand and in use; Continue and Antigravity CLI not yet set up; Zed and Aider not detected",
        },
        {
          id: "security",
          title: "Keys replaced before sending, dangerous commands stopped",
          body: "Outbound redaction swaps API keys, private keys, JWTs and connection-string passwords for placeholders before a request leaves and restores them in the response, so a relay never sees the real values. Tool-call inspection cuts off download-and-run commands and similar calls before the client can run them, and hidden characters and prompt injection can be refused. The five protections start in Observe, recording without changing anything, and each switches to Enforce on its own.",
          alt: "The Security page log: credentials replaced before a request left, one of them matched by a custom rule; a download-and-run tool call cut off; and hidden characters, a delete command and an injected instruction recorded, each with the key, client, model and upstream of its request",
        },
        {
          id: "mcp",
          title: "MCP servers, skills and hooks, scanned",
          body: "The MCP servers of eight clients appear side by side, with third-party remote servers and inconsistent configurations marked, and can be copied or removed between clients. Client configuration, skills, hooks and project instructions are scanned for hidden characters, prompt injection, dangerous commands and overly broad permissions, and a new finding raises a notification.",
          alt: "The MCP page: the MCP servers configured in Claude Code, Claude Desktop, Cursor, Codex, opencode, Antigravity CLI and Zed side by side, with remote third-party servers and a server configured differently in two clients marked; one high, one medium and one low finding in 11 scanned files",
        },
        {
          id: "traffic",
          title: "Every request, traceable",
          body: "A request shows the rule it matched, each upstream it tried, any conversion between API formats and how its cost was calculated. A finished request can be replayed against another upstream and the two answers compared side by side.",
          alt: "The Traffic page: each request with its key, model, upstream, time to first token, total time, tokens and cost, with marks for converted formats, redacted keys and a blocked request, and one request answered locally by the gateway",
        },
        {
          id: "routing",
          title: "Routing by rule, with failover",
          body: "Rules send requests to different upstreams by model, tools, images, extended thinking and more. When an upstream fails before the answer begins, the next one takes over, and each session stays on one upstream so its prompt cache keeps hitting. Auxiliary requests such as title generation and warm-ups can be answered locally without using any quota.",
          alt: "The Routing page: a map from keys through routes and groups to upstreams, and the routes with the rules each applies in order",
        },
        {
          id: "upstreams",
          title: "Any upstream, any API format",
          body: "API keys, Amazon Bedrock, ChatGPT and Z.ai accounts, relays such as OpenRouter and local Ollama models all serve as upstreams, with subscription quotas and reset times shown. Requests are converted between the Anthropic, OpenAI and Gemini APIs, so Codex can also use models that only speak Chat Completions.",
          alt: "The Upstreams page: API-key upstreams for Anthropic, DeepSeek and Gemini, a relay priced with its own price sheet, a ChatGPT Plus account with 58% of its 5-hour limit used, OpenRouter through a proxy and a local Ollama set to free, each with its requests, cost and latency over 24 hours",
        },
        {
          id: "overview",
          title: "Costs stated as they are",
          body: "Tokens, cost, cache savings, time to first token and generation speed, by model and by upstream. Estimated amounts are marked, and requests without a price are counted separately instead of as zero; prices follow LiteLLM's public list, refreshed daily, or a custom price sheet.",
          alt: overviewAlt.en,
        },
        {
          id: "dry-run",
          title: "Dry run before changing rules",
          body: "A dry run shows which rule a request would match, why the rules before it did not, and which upstreams would be tried in turn. Nothing is sent and nothing is charged.",
          alt: "A routing dry run: a request from the cursor key for claude-sonnet-5 in the OpenAI Chat Completions format does not match the gemini rule, which says why, matches the catch-all rule and goes to the lowest-cost group, which tries relay and then anthropic, converting the request to Anthropic Messages",
        },
        {
          id: "keys",
          title: "A key for each client",
          body: "Connecting a client gives it a key of its own, so traffic and cost are counted per client. Each key has its own route, visible models and concurrency limit, and a rotated key is written into its client's configuration.",
          alt: "The Keys page: the default key and one key each for Claude Code, Codex and Cursor, with the route each key uses, the models it may use, and its requests and cost over the last 24 hours",
        },
      ],
    },
    remote: {
      eyebrow: "Remote core",
      title: "ThinkWatch Core on a server",
      body: [
        "The gateway also runs on a Linux server as a systemd service, serving clients across the network. The app connects to it and shows the server's traffic, cost and configuration in the same pages, and the clients on the computer can be pointed at the server's gateway in one step.",
        "The control connection is encrypted and authenticated by a Noise handshake, with no certificates involved. The app connects to one core at a time, and the local data stays as it was while it is connected elsewhere.",
      ],
      serverDocs: "Server deployment guide",
      docs: "Connecting to a remote core",
      addAlt:
        "Adding a remote connection: the name homelab, the address 192.168.1.40, the control port and the key, with a successful test that reports the core version and the gateway at 192.168.1.40:8788",
      figures: [
        {
          id: "remote-switcher",
          caption: "Connections are switched from the foot of the sidebar.",
          alt: "The connection menu at the foot of the sidebar while connected to homelab: this Mac with its local core stopped, homelab selected, build-server, and entries to add or manage connections",
        },
        {
          id: "remote-clients",
          caption: "The Clients page changes the clients on this computer.",
          alt: "The Clients page while connected to homelab, with a note that it changes the client configuration on this Mac to point at homelab's gateway at 192.168.1.40:8788 and does not affect clients on the server",
        },
      ],
    },
    menubar: {
      eyebrow: "Outside the main window",
      title: "Menu bar, tray and notifications",
      body: "The macOS menu bar shows today's tokens and cost, in orange when a subscription quota is nearly used up and red once it has run out. Its menu gives the gateway's state, each quota with its reset time and the requests in progress, and copies the gateway address or default key without opening the window. Windows and Linux have the same menu in the tray.",
      notices:
        "A system notification reports a gateway that stopped forwarding, a lost remote connection, a quota that ran out, a credential that stopped working, an unreachable proxy, configuration that did not take effect, a dangerous tool call that was cut off, and suspicious content in client configuration.",
      chipAlt: "The menu bar item: the ThinkWatch mark with today's 13.3M tokens above today's cost, $9.34",
      menuAlt:
        "The menu bar menu: the gateway's address, output speed and state; the ChatGPT account's 5-hour and weekly quotas with their reset times; today's requests, tokens and cost; the request in progress; and items to open the app, copy the gateway address or the default key, switch connection, open settings and check for updates",
    },
    built: {
      eyebrow: "Architecture",
      lite: {
        title: "ThinkWatch Lite",
        body: "A Tauri 2 shell with a React 19 window. It starts and supervises the local core or connects to a core on a server, and renders the menu bar on macOS and the tray menu on Windows and Linux.",
      },
      link: {
        title: "Control channel",
        lines: ["Unix socket · macOS, Linux", "Loopback port · Windows", "TCP port · remote core", "Encrypted handshake on each"],
      },
      core: {
        title: "ThinkWatch Core",
        body: "The gateway, twcore: routing, forwarding, format conversion, cost accounting and the security protections. It runs beside the app or as a systemd service on a Linux server; Lite contains none of this logic.",
      },
      upstreams: {
        title: "Upstreams",
        body: "The Anthropic, OpenAI and Gemini APIs, accounts signed in from the app, relays and local models.",
      },
    },
    install: {
      eyebrow: "Install",
      title: "Installation on macOS, Windows and Linux",
      brewNote: "The gateway ships inside the app; nothing else needs to be installed.",
      macLabel: "macOS 12 or later · Apple silicon",
      winLabel: "Windows 10 21H2 or later · x64 or ARM64",
      dmgTitle: "Disk image",
      dmgBody:
        "Check it against its sha256 after downloading. The app is not signed by a registered Apple developer, so macOS quarantines a downloaded copy until the attribute is removed, or until Open Anyway is chosen in System Settings › Privacy & Security.",
      dmgDownload: "Download the disk image (Apple silicon)",
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
      linuxLabel: "Ubuntu 22.04, Debian 12, Fedora 36 or later · x86_64 or aarch64",
      linuxScript:
        "The script downloads the AppImage for the machine's architecture, checks its sha256, installs it as ~/Applications/ThinkWatch-Lite.AppImage and starts it.",
      linuxTitle: "AppImage",
      linuxBody:
        "Check it against its sha256, allow it to run (chmod +x, or “Allow executing file as program” in the file manager's Properties) and open it. Keep it in a folder the user can write to, such as ~/Applications, so that it can update itself. The first launch adds ThinkWatch Lite to the application menu.",
      linuxDownload: { x86_64: "Download the AppImage (x86_64)", aarch64: "Download the AppImage (aarch64)" },
      linuxOther: "Other architecture: ",
      linuxOtherLink: { x86_64: "x86_64 AppImage", aarch64: "aarch64 AppImage" },
      linuxNotes:
        "The AppImage needs fusermount3 from the fuse3 package, which most desktops include. The tray icon on GNOME needs the AppIndicator extension, which Ubuntu ships and Fedora does not; without it, launching the app again from the application menu brings the window back.",
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
      title: "ThinkWatch Lite — Claude Code、Codex 等 AI 客户端的本地网关",
      description:
        "Claude Code、Codex 等 AI 客户端的本地网关，支持 macOS、Windows 与 Linux。客户端接入一次即可随时切换上游，请求发出前可替换其中的 API 密钥、切断危险的工具调用，每个请求的费用与去向都有记录。MIT 开源。",
    },
    hero: {
      eyebrow: "ThinkWatch Lite · 面向个人开发者",
      titleA: "Claude Code、Codex 等 AI 客户端的",
      titleHighlight: "本地网关",
      sub: "客户端只需接入一次，此后更换上游或模型无需改动客户端配置。每个请求的费用与去向都有记录，发出前可替换其中的 API 密钥。支持 macOS、Windows 与 Linux，MIT 开源。",
      ctaSecondary: "其他平台与安装方式",
      shotAlt: overviewAlt["zh-CN"],
    },
    status: {
      badge: "已发布",
      items: ["macOS 12+ · Apple silicon", "Windows 10 21H2+ · x64 · ARM64", "Linux · x86_64 · aarch64", "English · 简体中文", "自动更新", "MIT"],
    },
    features: {
      eyebrow: "功能",
      items: [
        {
          id: "clients",
          title: "一次接入，随时切换",
          body: "一键接入 Claude Code、Codex、opencode 等七款客户端，写入前预览改动、备份原文件，随时可以还原；Windows 上 WSL 中的 Claude Code 与 Codex 同样支持。此后切换上游只在网关中完成，客户端无需改配置或重启。",
          alt: "客户端页：Claude Code 与 Codex 已接管，各用一把密钥，并列出最近 24 小时的请求；opencode 尚未接管；Cursor 已手动配置并在使用；Continue 与 Antigravity CLI 尚未配置；Zed 与 Aider 未检测到",
        },
        {
          id: "security",
          title: "发出前替换密钥，拦下危险命令",
          body: "出站脱敏在请求发出前把 API 密钥、私钥、JWT 与连接串口令换成占位符，并在响应中还原，中转服务看不到原值。工具调用审查在客户端执行之前切断下载即执行等危险命令，隐藏字符与提示注入也可以直接拒绝。五项防护出厂只记录、不改动请求，逐项切换到拦截即可生效。",
          alt: "安全页日志：请求发出前替换的凭据（其中一条由自定义规则命中）、被切断的下载即执行工具调用，以及记录在案的隐藏字符、删除命令与注入指令，每条都注明所属请求的密钥、客户端、模型与上游",
        },
        {
          id: "mcp",
          title: "扫描 MCP、技能与钩子",
          body: "八款客户端的 MCP 服务器集中显示，标出第三方远程服务器与各客户端之间不一致的配置，可以在客户端之间复制或移除。客户端配置、技能、钩子与项目指令中的隐藏字符、提示注入、危险命令与过宽权限会被找出，出现新发现时发送通知。",
          alt: "MCP 页：Claude Code、Claude Desktop、Cursor、Codex、opencode、Antigravity CLI 与 Zed 中配置的 MCP 服务器并列显示，标出第三方远程服务器与两个客户端间配置不一致的服务器；共扫描 11 个文件，发现高、中、低风险各一项",
        },
        {
          id: "traffic",
          title: "每个请求都可追溯",
          body: "请求详情给出命中的规则、尝试过的每个上游、API 格式转换，以及费用的计算依据。已结束的请求可以重放到另一个上游，并排对比两次回答。",
          alt: "流量页：逐条列出请求的密钥、模型、上游、首 token 时间、总耗时、token 与费用，标出格式转换、密钥脱敏与被拦截的请求，其中一条由网关在本地应答",
        },
        {
          id: "routing",
          title: "按规则分流，失败自动换",
          body: "按模型、工具、图片、扩展思考等条件把请求分给不同上游。回答开始前上游出错时自动换用下一个，同一会话固定使用同一上游，提示缓存保持有效。标题生成、预热等辅助请求可在本地应答，不占用额度。",
          alt: "路由页：从密钥经路由与策略组到上游的链路图，下方逐条列出每条路由的规则",
        },
        {
          id: "upstreams",
          title: "多种上游，接口互转",
          body: "API 密钥、Amazon Bedrock、ChatGPT 与 Z.ai 账号、OpenRouter 等中转服务以及本机 Ollama 均可作为上游，订阅额度与重置时间一并显示。Anthropic、OpenAI、Gemini 接口之间自动转换，Codex 也能使用只支持 Chat Completions 的模型。",
          alt: "上游页：Anthropic、DeepSeek、Gemini 等 API 密钥上游，按自有价目表计价的中转，5 小时额度已用 58% 的 ChatGPT Plus 账号，经代理访问的 OpenRouter，以及设为免费的本机 Ollama，并列出各自 24 小时的请求数、费用与延迟",
        },
        {
          id: "overview",
          title: "费用如实计算",
          body: "按模型与上游统计 token、费用、缓存节省、首 token 时间与生成速度。估算的金额单独标注，无法计价的请求单独计数，不按零计入；价格每日按 LiteLLM 公开价更新，也可以使用自定义价目表。",
          alt: overviewAlt["zh-CN"],
        },
        {
          id: "dry-run",
          title: "改规则前先试算",
          body: "试算给出请求会命中哪条规则、前面的规则为何未命中，以及将依次尝试哪些上游。不发出请求，也不产生费用。",
          alt: "路由试算：cursor 密钥以 OpenAI Chat Completions 格式请求 claude-sonnet-5；gemini 规则未命中并说明原因，catch-all 规则命中，请求交给费用最低优先的策略组，依次尝试 relay 与 anthropic，并转换为 Anthropic Messages",
        },
        {
          id: "keys",
          title: "每个客户端一把密钥",
          body: "接入客户端时为它生成专用密钥，流量与费用按客户端分开统计。每把密钥可单独设置路由、可见模型与并发上限，更换后的新密钥自动写入客户端配置。",
          alt: "密钥页：默认密钥与 Claude Code、Codex、Cursor 各自的密钥，列出各自使用的路由、可用模型，以及最近 24 小时的请求数与费用",
        },
      ],
    },
    remote: {
      eyebrow: "连接远程 core",
      title: "服务器上的 ThinkWatch Core",
      body: [
        "网关也可以作为 systemd 服务部署在 Linux 服务器上，为网络中的客户端提供服务。应用连接后，在同样的页面中查看与管理服务器的流量、费用和配置，本机的客户端也可以一步改为指向服务器的网关。",
        "控制连接经 Noise 握手加密与认证，不涉及证书。应用同一时间只连接一个 core，连接服务器期间本机数据原样保留。",
      ],
      serverDocs: "服务器部署指南",
      docs: "连接远程 core",
      addAlt:
        "添加远程连接：名称 homelab、地址 192.168.1.40、控制端口与密钥，测试连接成功，显示 core 版本与网关地址 192.168.1.40:8788",
      figures: [
        {
          id: "remote-switcher",
          caption: "在侧栏底部切换连接。",
          alt: "连接到 homelab 时侧栏底部的连接菜单：本机（本地 core 已停止）、已选中的 homelab、build-server，以及添加和管理连接的入口",
        },
        {
          id: "remote-clients",
          caption: "客户端页修改的是这台电脑上的客户端。",
          alt: "连接到 homelab 时的客户端页，顶部说明此处修改的是这台 Mac 上的客户端配置，使其指向 homelab 的网关 192.168.1.40:8788，服务器上的客户端不受影响",
        },
      ],
    },
    menubar: {
      eyebrow: "主窗口之外",
      title: "菜单栏、托盘与系统通知",
      body: "macOS 菜单栏显示今日 token 与费用，订阅额度将尽时变为橙色，用完后变为红色。点开的菜单给出网关状态、各项额度及重置时间与进行中的请求，不打开主窗口即可复制网关地址或默认密钥。Windows 与 Linux 的托盘提供相同的菜单。",
      notices:
        "网关停止转发、远程连接断开、额度用完、凭据失效、代理无法连接、配置未能生效、危险工具调用被切断，以及客户端配置中出现可疑内容时，应用发送系统通知。",
      chipAlt: "菜单栏：ThinkWatch 标识，右侧上行为今日 token 13.3M，下行为今日费用 $9.34",
      menuAlt:
        "菜单栏菜单：网关地址、输出速率与状态；ChatGPT 账号的 5 小时与每周额度及重置时间；今日请求数、token 与费用；进行中的请求；以及打开主界面、复制网关地址、复制默认密钥、切换连接、设置与检查更新等菜单项",
    },
    built: {
      eyebrow: "架构",
      lite: {
        title: "ThinkWatch Lite",
        body: "Tauri 2 外壳与 React 19 窗口。负责启动并托管本机的 core，或连接服务器上的 core；在 macOS 上渲染菜单栏，在 Windows 与 Linux 上渲染托盘菜单。",
      },
      link: {
        title: "控制通道",
        lines: ["unix socket · macOS、Linux", "回环端口 · Windows", "TCP 端口 · 远程 core", "均经加密握手"],
      },
      core: {
        title: "ThinkWatch Core",
        body: "网关本体 twcore，负责路由、转发、格式转换、成本核算与安全防护。它随应用在本机运行，也可以作为 systemd 服务运行在 Linux 服务器上；Lite 不包含这些逻辑。",
      },
      upstreams: {
        title: "上游服务",
        body: "Anthropic、OpenAI 与 Gemini API，在应用内登录的账号，以及中转服务与本机模型。",
      },
    },
    install: {
      eyebrow: "安装",
      title: "在 macOS、Windows 与 Linux 上安装",
      brewNote: "网关随应用一同安装，无需另行安装其他组件。",
      macLabel: "macOS 12 及以上 · Apple silicon",
      winLabel: "Windows 10 21H2 及以上 · x64 或 ARM64",
      dmgTitle: "磁盘映像",
      dmgBody:
        "下载后与 sha256 校验值核对。应用未经 Apple 注册开发者签名，macOS 会为下载的副本添加隔离属性，移除该属性后即可打开；也可以在首次打开被拒绝后，在「系统设置 › 隐私与安全性」中点击「仍要打开」。",
      dmgDownload: "下载磁盘映像（Apple silicon）",
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
      linuxLabel: "Ubuntu 22.04、Debian 12、Fedora 36 及以上 · x86_64 或 aarch64",
      linuxScript:
        "脚本下载与本机架构对应的 AppImage，核对 sha256 后安装为 ~/Applications/ThinkWatch-Lite.AppImage 并启动。",
      linuxTitle: "AppImage",
      linuxBody:
        "下载后与 sha256 校验值核对，允许其执行（chmod +x，或在文件管理器的「属性」中勾选「允许作为程序执行文件」），然后打开。AppImage 应放在当前用户可写的目录中（如 ~/Applications），以便自动更新。首次启动时会把 ThinkWatch Lite 添加到应用菜单。",
      linuxDownload: { x86_64: "下载 AppImage（x86_64）", aarch64: "下载 AppImage（aarch64）" },
      linuxOther: "其他架构：",
      linuxOtherLink: { x86_64: "x86_64 AppImage", aarch64: "aarch64 AppImage" },
      linuxNotes:
        "AppImage 需要 fuse3 软件包中的 fusermount3，多数桌面系统已自带。GNOME 上的托盘图标需要 AppIndicator 扩展，Ubuntu 已自带，Fedora 没有；没有托盘时，从应用菜单再次启动即可重新打开窗口。",
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
