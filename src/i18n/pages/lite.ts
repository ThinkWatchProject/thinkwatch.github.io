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
      title: "ThinkWatch Lite — Local AI API gateway for macOS, Windows and Linux",
      description:
        "Desktop app for a local AI API gateway on macOS, Windows and Linux. Shows what Claude Code, Codex and other OpenAI and Anthropic clients cost, where each request was routed and what was redacted, and can connect to ThinkWatch Core on a server. MIT License.",
    },
    hero: {
      eyebrow: "ThinkWatch Lite · For individual developers",
      titleA: "A local AI API gateway ",
      titleHighlight: "for macOS, Windows and Linux",
      sub: "Claude Code, Codex and other clients of the Anthropic, OpenAI and Gemini APIs send their requests through a local gateway, and the app records what each request cost, which upstream served it and why, and which credentials were redacted before it was sent. The gateway can also run on a server; the app then connects to it over an encrypted control channel.",
      ctaSecondary: "Other platforms and installation methods",
      shotAlt: overviewAlt.en,
    },
    status: {
      badge: "Available",
      body: "macOS 12 or later on Apple silicon, installed with Homebrew or a disk image. Windows 10 21H2 or later on x64 or ARM64, installed with an installer. Ubuntu 22.04, Debian 12, Fedora 36 or later on x86_64 or aarch64, as an AppImage. The interface is in English and Simplified Chinese, and the app updates itself; a Homebrew installation is updated through Homebrew.",
    },
    features: {
      eyebrow: "Features by page",
      items: [
        {
          id: "overview",
          title: "Usage and cost",
          body: "Tokens, cost and requests live or for the last 24 hours, 7 days, 30 days or a custom range, each compared with the period before, with a trend by model and the models ranked by usage. The page also reports the cache hit rate and the net savings from caching, time-to-first-byte percentiles by model and by upstream, and what each security protection found. Measured and estimated costs are marked as such, and requests without a price are counted separately rather than as zero.",
          alt: overviewAlt.en,
        },
        {
          id: "traffic",
          title: "Requests and sessions",
          body: "Every request with its key, model, upstream, time to first byte, total time, tokens and cost, listed as it arrives and filtered by key, upstream, failures, unpriced requests or text; requests can also be grouped into sessions. A request's details show the rule it matched, every attempt and any failover, the conversion between API formats with the fields that could not be carried over, the request and response bodies with credentials masked, and the usage its cost was calculated from. A finished request can be replayed against another upstream and the results compared side by side.",
          alt: "The Traffic page: the latest requests with their key, model, upstream, latency, tokens and cost, among them one in progress, requests converted between API formats, one with two credentials redacted, one blocked, one answered locally, and failed and canceled requests",
        },
        {
          id: "clients",
          title: "Client setup",
          body: "Claude Code, Codex, opencode, Zed, Aider, Claude Desktop and DeepSeek Harness are pointed at the gateway from the app. Each change is shown as a diff before it is written, the original file is backed up, only the settings that point the client at the gateway are changed, and any client can be restored. On Windows, Claude Code and Codex inside WSL are pointed at the gateway as well, under WSL 1 or under WSL 2 with mirrored networking. Cursor, Continue and Antigravity CLI come with step-by-step instructions. Each client's requests over the last 24 hours are listed beside it.",
          alt: "The Clients page: Claude Code and Codex in use, each with its own key and its requests over the last 24 hours; opencode not connected; Cursor set up by hand and in use; Continue and Gemini CLI not set up; Zed and Aider not detected",
        },
        {
          id: "keys",
          title: "A key for each client",
          body: "Clients connect with gateway keys, and connecting a client creates a key for it, so that traffic and cost are attributed to that client. Each key has its own route, the set of models its client sees, an optional concurrency limit, and its requests and cost over the last 24 hours. A key can be disabled or rotated; a rotated key is written into the configuration of the client that uses it.",
          alt: "The Keys page: four keys, default, claude-code, codex and cursor, with the client each belongs to, its route, the models its client sees, and its requests and cost over the last 24 hours",
        },
        {
          id: "upstreams",
          title: "Upstreams and prices",
          body: "API-key upstreams such as Anthropic, OpenAI, Gemini, DeepSeek or any compatible endpoint; ChatGPT and Z.ai accounts signed in from the app; relays such as OpenRouter; and local models served by Ollama. The usage limits of ChatGPT accounts and of GLM Coding Plan keys on Z.ai and BigModel are shown with their reset times. When a client and an upstream use different API formats, requests are converted between Anthropic Messages, OpenAI Chat Completions, OpenAI Responses and Gemini. Upstreams can connect through an outbound proxy. Costs follow LiteLLM's public prices, refreshed daily, or a custom price sheet with a multiplier and prices for individual models.",
          alt: "The Upstreams page: seven upstreams, including Anthropic, a relay priced with a discounted price sheet, a ChatGPT Plus account with 58% of its 5-hour limit used, OpenRouter through a proxy, DeepSeek, Gemini and a local Ollama, each with its billing, its requests and cost over 24 hours and its median time to first byte; tabs for proxies and price sheets",
        },
        {
          id: "routing",
          title: "Routing and failover",
          body: "Each key uses a route, whose rules are checked in order against the model, the client's API format, input tokens, max_tokens, tools, images, extended thinking and other properties of a request. A rule forwards the request to an upstream or a group, or refuses it. A group picks its upstreams in order, by manual choice, in rotation, by lowest latency or by lowest cost, and moves on to the next when one is unavailable; in rotation, sticky sessions, on by default, keep each session on one upstream so that its prompt cache stays valid. Auxiliary requests that clients send on their own, such as title generation or warm-up, can be answered locally.",
          alt: "The Routing page: a map of how four keys lead through three routes and the groups main and budget to seven upstreams, with one rule refusing requests; below it, each route with its keys and its rules in order",
        },
        {
          id: "dry-run",
          title: "Dry run",
          body: "A dry run takes a key, a model, a client format and the properties of a request, and shows where the request would go: the rule that matched and why the rules before it did not, each upstream that would be tried, and any format conversion on the way. Nothing is sent and no cost is incurred.",
          alt: "A routing dry run for the cursor key requesting claude-sonnet-5 in the OpenAI Chat Completions format: the gemini rule did not match because the model must be gemini-*, the catch-all rule matched, and the request goes to the budget group, ordered by lowest cost, which tries relay and then anthropic, each with a conversion from OpenAI Chat Completions to Anthropic Messages",
        },
        {
          id: "security",
          title: "Five security protections",
          body: "Five protections apply to every request through the gateway, the same for every upstream and key. Outbound redaction finds API keys, private keys, JWTs and connection-string passwords in a request; tool-call inspection checks the tool calls an upstream returns for dangerous commands; hidden characters and the content filter check what a client sends, tool results included, for invisible Unicode and prompt-injection phrases; the output limit measures the length of an answer. Each protection is set to Off, Observe or Enforce. Observe records matches without changing anything and is the initial setting for all but the output limit, which starts off. Enforce acts on a match: redaction replaces the credentials before the request is sent and restores them in the response, a dangerous tool call or an answer over the limit is cut off, and a request carrying hidden characters or a phrase set to be refused is refused. Built-in rules can be turned off one by one, custom rules can be added, and every match appears in the security log.",
          alt: "The Security page log: redaction and tool-call inspection enforcing, hidden characters and the content filter observing, the output limit off, and eight matches in the last 24 hours, including an AWS access key ID replaced, a download-and-run command cut off, a custom customer-id rule, Unicode tag characters hidden in a tool result, and a prompt-injection phrase recorded",
        },
        {
          id: "mcp",
          title: "MCP servers, skills and hooks",
          body: "The MCP servers configured in Claude Code, Claude Desktop, Cursor, Codex, opencode, Zed, Antigravity CLI and DeepSeek Harness appear side by side, with remote and third-party servers marked and differences between clients highlighted; a server can be copied to another client or removed, with the change shown before it is written. Hooks and skills are listed as well. Client configuration, skills, hooks, slash commands, subagents and project instructions are scanned for hidden characters, prompt injection, dangerous commands and overly broad permissions. Findings are reported without changing any file, and a new finding raises a system notification.",
          alt: "The MCP page: five MCP servers across Claude Code, Claude Desktop, Cursor, Codex, opencode and Zed, with context7 and linear marked as third-party remote servers and github marked as configured differently between clients; one high, one medium and one low finding from 11 scanned files",
        },
        {
          id: "settings",
          title: "Settings and languages",
          body: "The interface is available in English and Simplified Chinese and follows the system language unless another is chosen. Settings also cover the connection to a local or remote core, the appearance, what the menu bar item shows, launch at login, notifications, the gateway's listening address and the networks allowed to reach it, how long request records and bodies are kept, updates, and a full uninstall that restores every connected client and turns off launch at login.",
          alt: "The Settings page: connections to this Mac, which is current, and to two remote cores, homelab and build-server; the connection used at startup; the interface language set to follow the system; the appearance; and what the menu bar item shows",
        },
      ],
    },
    remote: {
      eyebrow: "Remote core",
      title: "ThinkWatch Core on a server",
      body: [
        "The gateway can also run on a Linux server, where twcore runs as a systemd service and serves clients across the network. The app connects to it through the server's remote control port and shows that server's traffic, cost and configuration in the same pages.",
        "A connection is added in Settings › Connection with the server's address, its control port and the key that twcore control-key prints. Before switching to a connection, the app tests it: it completes the handshake and compares versions, since the server has to run the core version the app requires; when they differ, sudo twcore upgrade --version <version> --restart on the server installs that version, newer or older. The app connects to one core at a time; while it is connected to a server, the core on the local computer stops and its data is kept. The Clients and MCP pages still act on the computer the app runs on, and the Clients page can point that computer's clients at the server's gateway.",
        "Every control connection, local or remote, is encrypted and authenticated by a Noise handshake keyed by listen.control.key in config.yaml; no certificates are involved. The app keeps connection keys in a file in its data directory that only the current user can read.",
      ],
      serverDocs: "Server deployment guide",
      docs: "Connecting to a remote core",
      addAlt:
        "Adding a remote connection: the name homelab, the address 192.168.1.40, control port 24817 and the key, with a successful test that reports core 0.49.0 and the gateway at 192.168.1.40:8788",
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
      body: "On macOS, the menu bar item shows today's tokens and cost, which turn orange when a subscription quota is nearly used up and red once it has run out; it can also show only the icon or only the numbers. Its menu lists the gateway's state and output rate, each subscription quota with its reset time, today's requests, tokens and cost, and the requests in progress, with actions to copy the gateway address or the default key, undo the last configuration change and switch connection. On Windows the icon sits in the notification area and on Linux in the system tray, with the same menu in text form.",
      notices:
        "System notifications report a gateway that stopped forwarding, a lost connection to a remote core, a subscription quota that ran out, a credential that expired, was rejected or could not be saved, an unreachable proxy, configuration that did not take effect, a tool call that matched a rule set to cut off, and suspicious content newly found in client configuration. An unreachable upstream is listed in the app without a system notification. One setting sends these notices as system notifications, keeps them in the app, or turns them off.",
      chipAlt: "The menu bar item: the ThinkWatch mark with today's 13.3M tokens above today's cost, $9.34",
      menuAlt:
        "The menu bar menu: the gateway running at 127.0.0.1:8788 at 64 tokens per second; the chatgpt quota at 58% of its 5-hour window, resetting in 2 hours, and 31% of its weekly window, resetting in 3 days; today's 204 requests with 4 failed, 13.3M tokens and $9.34 in cost; one Claude Code request in progress; and items to copy the gateway address or the default key, undo the last configuration change, open the app, switch connection, open settings and check for updates",
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
      title: "ThinkWatch Lite — 适用于 macOS、Windows 与 Linux 的本地 AI API 网关",
      description:
        "在本机运行 AI API 网关的桌面应用，支持 macOS、Windows 与 Linux。记录 Claude Code、Codex 以及其他使用 OpenAI、Anthropic 接口的客户端每个请求的费用、所用的上游与发出前被脱敏的密钥，也可以连接部署在服务器上的 ThinkWatch Core。采用 MIT 许可证。",
    },
    hero: {
      eyebrow: "ThinkWatch Lite · 面向个人开发者",
      titleA: "适用于 macOS、Windows 与 Linux 的",
      titleHighlight: "本地 AI API 网关",
      sub: "Claude Code、Codex 以及其他使用 Anthropic、OpenAI、Gemini 接口的客户端经由本机的网关发出请求，应用记录每个请求的费用、由哪个上游处理及其原因，以及发出前被脱敏的密钥。网关也可以部署在服务器上，此时应用通过加密的控制通道连接服务器上的 ThinkWatch Core。",
      ctaSecondary: "其他平台与安装方式",
      shotAlt: overviewAlt["zh-CN"],
    },
    status: {
      badge: "已发布",
      body: "支持 macOS 12 及以上版本的 Apple silicon 机型，可通过 Homebrew 或磁盘映像安装；支持 Windows 10 21H2 及以上版本的 x64 与 ARM64 机型，通过安装程序安装；支持 Ubuntu 22.04、Debian 12、Fedora 36 及以上版本的 x86_64 与 aarch64 机型，以 AppImage 发布。界面提供英文与简体中文；应用自动更新，通过 Homebrew 安装的由 Homebrew 更新。",
    },
    features: {
      eyebrow: "各页功能",
      items: [
        {
          id: "overview",
          title: "用量与费用",
          body: "按实时、24 小时、7 天、30 天或自定义区间统计 token、费用与请求数，并与上一个同等区间对比；按模型分层显示趋势，并按用量列出模型排行。页面还给出缓存命中率与缓存带来的净节省、按模型和按上游统计的首字节延迟分位，以及各项安全防护的检查结果。实测与估算的费用分别标明，无法计价的请求单独计数，不按零计入。",
          alt: overviewAlt["zh-CN"],
        },
        {
          id: "traffic",
          title: "请求与会话",
          body: "逐条列出请求的密钥、模型、上游、首字节延迟、总耗时、token 与费用，新请求实时加入，可按密钥、上游、失败、无法计价或关键词筛选，也可以按会话归组。请求详情给出命中的规则、每一次尝试与故障转移、API 格式转换及无法转换的字段、遮蔽凭据后的请求体与响应体，以及计算费用所依据的用量。已结束的请求可以原样重放到另一个上游，并排对比结果。",
          alt: "流量页：最近的请求及其密钥、模型、上游、延迟、token 与费用，其中有一条进行中的请求、经格式转换的请求、脱敏 2 处凭据的请求、被拦截的请求、本地应答的请求，以及失败和已取消的请求",
        },
        {
          id: "clients",
          title: "客户端接管",
          body: "Claude Code、Codex、opencode、Zed、Aider、Claude Desktop 与 DeepSeek Harness 可以在应用内一键指向网关。写入前先显示改动差异，原文件完整备份，只修改指向网关所需的设置，随时可以还原。在 Windows 上，WSL 中的 Claude Code 与 Codex 同样可以指向网关，适用于 WSL 1 和使用 mirrored 网络模式的 WSL 2。Cursor、Continue 与 Antigravity CLI 提供逐步的手动配置说明。每个客户端旁列出其最近 24 小时的请求。",
          alt: "客户端页：Claude Code 与 Codex 已接管，各用一把密钥，并列出最近 24 小时的请求；opencode 尚未接管；Cursor 已手动配置并在使用；Continue 与 Gemini CLI 尚未配置；Zed 与 Aider 未检测到",
        },
        {
          id: "keys",
          title: "每个客户端一把密钥",
          body: "客户端凭网关密钥连接网关。接管客户端时为它单独生成一把密钥，流量与费用因此按客户端区分。每把密钥有各自的路由、客户端可见的模型范围、可选的并发上限，以及最近 24 小时的请求数与费用。密钥可以停用或更换，更换后的新密钥会写入使用它的客户端的配置。",
          alt: "密钥页：default、claude-code、codex、cursor 四把密钥，列出各自所属的客户端、路由、可见模型，以及最近 24 小时的请求数与费用",
        },
        {
          id: "upstreams",
          title: "上游与价目表",
          body: "支持 Anthropic、OpenAI、Gemini、DeepSeek 等 API 密钥上游与任意兼容端点，在应用内登录的 ChatGPT 与 Z.ai 账号，OpenRouter 等中转服务，以及 Ollama 提供的本机模型。ChatGPT 账号与 Z.ai、BigModel 的 GLM Coding Plan 显示额度及重置时间。客户端与上游的 API 格式不同时，请求在 Anthropic Messages、OpenAI Chat Completions、OpenAI Responses 与 Gemini 之间自动转换。上游可以经出站代理连接。费用按每日更新的 LiteLLM 公开价格计算，也可以使用设有倍率与单个模型价格的自定义价目表。",
          alt: "上游页：七个上游，包括 Anthropic、按折扣价目表计价的中转、5 小时额度已用 58% 的 ChatGPT Plus 账号、经代理访问的 OpenRouter、DeepSeek、Gemini 与本机 Ollama，以及各自的计费方式、24 小时请求数与费用和首字节延迟中位数；另有代理与价目表两个标签",
        },
        {
          id: "routing",
          title: "路由与故障转移",
          body: "每把密钥对应一条路由，路由中的规则按顺序与请求的模型、客户端 API 格式、输入 token、max_tokens、工具、图片、扩展思考等条件匹配。规则把请求交给某个上游或策略组，或者直接拒绝。策略组按顺序、手动选择、轮询、延迟最低或费用最低选用成员，某个上游不可用时换用下一个；轮询时默认开启会话粘滞，同一会话固定使用同一上游，提示缓存因此持续有效。客户端自行发出的辅助请求（如生成标题、预热）可以由网关在本地应答。",
          alt: "路由页：从四把密钥经三条路由与 main、budget 两个策略组到七个上游的链路图，其中一条规则直接拒绝请求；下方逐条列出每条路由的密钥与规则",
        },
        {
          id: "dry-run",
          title: "路由试算",
          body: "试算按给定的密钥、模型、客户端格式与请求条件，说明请求会被转发到哪里：命中的规则、前面各条规则未命中的原因、将依次尝试的上游，以及途中的格式转换。不发出请求，也不产生费用。",
          alt: "路由试算：cursor 密钥以 OpenAI Chat Completions 格式请求 claude-sonnet-5；gemini 规则因模型须为 gemini-* 而未命中，catch-all 规则命中，请求交给按费用最低排序的 budget 策略组，依次尝试 relay 与 anthropic，两者都将 OpenAI Chat Completions 转换为 Anthropic Messages",
        },
        {
          id: "security",
          title: "五项安全防护",
          body: "五项防护作用于经过网关的每个请求，对所有上游与密钥一致：出站脱敏查找请求中的 API 密钥、私钥、JWT 与连接串口令；工具调用审查检查上游返回的工具调用中的危险命令；隐藏字符与内容过滤检查客户端发来的内容（含工具结果）中的不可见 Unicode 字符与提示注入语句；输出长度衡量单次回答的长度。每项防护可设为关闭、观察或拦截。观察只记录命中，不改变请求；除输出长度出厂为关闭外，其余各项出厂均为观察。拦截时，出站脱敏在请求发出前替换凭据并在响应中还原，危险的工具调用与超出上限的回答被切断，含隐藏字符或命中「拒绝」规则的请求被拒绝。内置规则可以逐条停用，也可以添加自定义规则，所有命中都记录在安全日志中。",
          alt: "安全页日志：出站脱敏与工具调用审查处于拦截，隐藏字符与内容过滤处于观察，输出长度关闭；最近 24 小时 8 次命中，包括已替换的 AWS 访问密钥 ID、已切断的下载即执行命令、自定义规则 customer-id 的命中、工具结果中隐藏的 Unicode 标签字符，以及记录在案的提示注入语句",
        },
        {
          id: "mcp",
          title: "MCP 服务器、技能与钩子",
          body: "Claude Code、Claude Desktop、Cursor、Codex、opencode、Zed、Antigravity CLI 与 DeepSeek Harness 中配置的 MCP 服务器并列显示，标出远程与第三方服务器以及各客户端之间不一致的配置；服务器可以复制到其他客户端或移除，写入前显示改动。钩子与技能同样逐一列出。客户端配置、技能、钩子、斜杠命令、subagent 与项目指令会被扫描，检查隐藏字符、提示注入、危险命令与过宽权限四类问题。扫描只报告、不修改任何文件，出现新发现时发送系统通知。",
          alt: "MCP 页：五个 MCP 服务器在 Claude Code、Claude Desktop、Cursor、Codex、opencode 与 Zed 中的配置情况，context7 与 linear 标为第三方远程服务器，github 标为各客户端配置不一致；共扫描 11 个文件，发现高、中、低风险各一项",
        },
        {
          id: "settings",
          title: "设置与界面语言",
          body: "界面提供英文与简体中文，默认跟随系统语言，也可以另选。设置页还包括连接本机或远程 core、外观、菜单栏显示内容、开机启动、提醒方式、网关的监听地址与允许访问的网段、请求记录与正文的保留时长、自动更新，以及完全卸载（还原所有已接管的客户端并关闭开机启动）。",
          alt: "设置页：连接列表中的本机（当前）与 homelab、build-server 两个远程 core，启动时使用的连接，跟随系统的界面语言，外观，以及菜单栏的显示内容",
        },
      ],
    },
    remote: {
      eyebrow: "连接远程 core",
      title: "服务器上的 ThinkWatch Core",
      body: [
        "网关也可以部署在 Linux 服务器上：twcore 作为 systemd 服务运行，为网络中的客户端提供网关。应用通过服务器的远程控制端口连接它，在同样的页面中显示该服务器的流量、费用与配置。",
        "在「设置 › 连接」中添加连接，填写服务器地址、控制端口，以及在服务器上执行 twcore control-key 得到的密钥。切换到某个连接之前，应用先测试该连接：完成握手并核对版本，服务器上的 core 须为应用要求的版本；版本不一致时，在服务器上执行 sudo twcore upgrade --version <版本号> --restart 即可换成该版本，升级或降级均可。应用同一时间只连接一个 core；连接服务器期间，本机的 core 停止运行，本机数据保留。客户端页与 MCP 页始终作用于运行应用的这台电脑，客户端页可以把这台电脑上的客户端改为指向服务器的网关。",
        "无论本机还是远程，每条控制连接都经过以 config.yaml 中 listen.control.key 为密钥的 Noise 握手加密与认证，不涉及证书。连接密钥保存在应用数据目录中仅当前用户可读的文件里。",
      ],
      serverDocs: "服务器部署指南",
      docs: "连接远程 core",
      addAlt:
        "添加远程连接：名称 homelab、地址 192.168.1.40、控制端口 24817 与密钥，测试连接成功，显示 core 0.49.0 与网关地址 192.168.1.40:8788",
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
      body: "在 macOS 上，菜单栏显示今日 token 与费用；订阅额度即将用完时数字变为橙色，用完后变为红色；也可以只显示标识或只显示数字。点开的菜单列出网关状态与输出速率、各订阅额度及其重置时间、今日请求数、token 与费用、进行中的请求，并提供复制网关地址、复制默认密钥、撤销上一次配置修改、切换连接等操作。Windows 上图标位于通知区域，Linux 上位于系统托盘，菜单内容相同，以文字呈现。",
      notices:
        "网关停止转发、与远程 core 的连接断开、订阅额度用完、凭据过期、被拒绝或未能保存、代理无法连接、配置未能生效、工具调用命中「切断」规则，以及客户端配置中出现新的可疑内容时，应用会发送系统通知。上游无法连接只在应用内列出，不发送系统通知。提醒方式由一项设置统一决定：系统通知、仅在应用内显示或关闭。",
      chipAlt: "菜单栏：ThinkWatch 标识，右侧上行为今日 token 13.3M，下行为今日费用 $9.34",
      menuAlt:
        "菜单栏菜单：网关运行中，地址 127.0.0.1:8788，输出 64 token/秒；chatgpt 的 5 小时额度已用 58%、2 小时后重置，每周额度已用 31%、3 天后重置；今日请求 204 次（失败 4 次）、token 13.3M、费用 $9.34；一条 Claude Code 请求进行中；以及复制网关地址、复制默认密钥、撤销上一次配置修改、打开主界面、连接、设置、检查更新等菜单项",
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
