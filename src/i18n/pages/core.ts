// Copy for the /core page. Facts come from the ThinkWatch Core repository: the
// README and CONTRIBUTING (what the crates do, how releases are built), the
// workspace Cargo.toml and each crate's dependencies (the groups under "Crate
// layers"), docs/server.md and scripts/install.sh (server deployment), and from
// ThinkWatch Enterprise's Cargo.toml for the three crates it depends on.
//
// meta.twcoreDescription describes the twcore binary in the structured data
// (src/lib/structured-data.ts); the build fails without it.

export const coreCopy = {
  en: {
    meta: {
      title: "ThinkWatch Core — AI API gateway engine in Rust",
      description:
        "Rust crates and the twcore binary for an AI API gateway: rule-based routing, failover before the first byte, cost accounting, outbound secret redaction and tool-call inspection. Runs inside ThinkWatch Lite or as a standalone gateway on a Linux server. MIT License.",
      twcoreDescription:
        "Self-contained AI API gateway binary: the local engine of ThinkWatch Lite, or a standalone gateway run by systemd on a Linux server.",
    },
    hero: {
      eyebrow: "ThinkWatch Core · Gateway engine",
      titleA: "An AI API gateway engine ",
      titleHighlight: "for desktops and servers",
      sub: "MIT-licensed Rust crates and the twcore binary. twcore is the gateway inside ThinkWatch Lite, and runs on its own as a systemd service on a Linux server, managed from ThinkWatch Lite over an encrypted control channel. ThinkWatch Enterprise uses its format-conversion, guard and circuit-breaker crates.",
      ctaInstall: "Install twcore",
      ctaDocs: "Core documentation",
      ctaGithub: "View on GitHub",
      cardTitle: "twcore · the gateway binary",
      commands: [
        { cmd: "twcore init", note: "# write an initial config.yaml and its keys" },
        { cmd: "twcore check", note: "# validate the configuration without starting" },
        { cmd: "twcore serve", note: "# start the gateway and the control plane" },
      ],
    },
    does: {
      eyebrow: "Capabilities",
      items: [
        {
          title: "Rule-based routing",
          body: "Rules match on the model, the gateway key, the input size, tools, images and other properties of a request, and send it to an upstream or a group, rewrite its parameters or refuse it. When the client and the upstream use different API formats, the request is converted between Anthropic Messages, OpenAI Chat Completions, OpenAI Responses and Gemini.",
        },
        {
          title: "Failover before the first byte",
          body: "Until the first byte reaches the client, a failing upstream is replaced by the next one without the client noticing; after that point, the failure is reported. A circuit breaker keeps requests away from an upstream that keeps failing.",
        },
        {
          title: "Cost accounting",
          body: "Each request is priced from a public price table, which twcore refreshes daily, or from a price sheet in the configuration, and records where its price came from. Estimated amounts are marked as such, and usage that cannot be priced is labelled unknown.",
        },
        {
          title: "Outbound redaction",
          body: "Credentials in a request are replaced with placeholders before the request leaves, and restored when the model echoes them back.",
        },
        {
          title: "Tool-call inspection",
          body: "Tool calls returned by a model are checked against rules, and a dangerous call can be cut off mid-stream. Together with checks for hidden characters, content rules and an output limit, these form five guards, each set to off, observe or enforce.",
        },
        {
          title: "Encrypted control plane",
          body: "The desktop app and twcore commands reach core over a local socket, a loopback port on Windows, and an optional remote port. Every control connection starts with a Noise handshake keyed by the control key; no certificates are involved.",
        },
      ],
    },
    install: {
      eyebrow: "Install and deploy",
      title: "Server deployment",
      body: [
        "On Linux on x86_64 or aarch64, with glibc 2.35 or newer and systemd, one command installs twcore, a service user and the systemd unit. ThinkWatch Lite on macOS, Windows or Linux then connects to it through the remote control port, and clients anywhere on the network send their requests to its gateway.",
        "On a desktop, twcore comes with ThinkWatch Lite and is not installed separately.",
      ],
      guide: "Server deployment guide",
      reference: "Configuration reference",
      scriptLabel: "Install on a Linux server",
      pinNote: "The server has to run the core version that ThinkWatch Lite requires; the app shows that version when the two differ. To install it:",
      /** Placeholder for the version number in the command that installs a particular version */
      versionPlaceholder: "<version>",
      nextLabel: "Then",
      next: [
        { cmd: "twcore remote enable --allow 192.168.1.0/24", note: "# open the remote control port to a network" },
        { cmd: "sudo systemctl enable --now twcore", note: "# start the service" },
        { cmd: "twcore control-key", note: "# print the key ThinkWatch Lite connects with" },
        { cmd: "sudo twcore upgrade --version <version> --restart", note: "# later: move to the version ThinkWatch Lite requires, newer or older" },
      ],
      serviceUser: "Commands that read the configuration run as the service user; the guide describes each step.",
      binariesTitle: "Prebuilt binaries",
      binariesBody:
        "Every release carries twcore for five targets, each with a SHA-256 file; the Linux archives add the systemd unit. twcore upgrade replaces a standalone installation, while the copy inside ThinkWatch Lite is updated with the app.",
      platforms: {
        mac: "macOS · Apple silicon",
        winX64: "Windows · x64",
        winArm: "Windows · ARM64",
        linuxX64: "Linux · x86_64",
        linuxArm: "Linux · aarch64",
      },
      releases: "All releases",
      version: "Version",
      sourceTitle: "Build from source",
      sourceBody: "With a stable Rust toolchain, 1.85 or newer. The binary is written to target/release/twcore.",
    },
    layers: {
      eyebrow: "Crate layers",
      /** mark "shared": the group ThinkWatch Enterprise depends on; "local": the single-machine implementation */
      sharedTag: "Also used by ThinkWatch Enterprise",
      localNote: "Single-machine implementation",
      rows: [
        { name: "Conversion, guards and circuit breaker", crates: "tw-dialect · tw-guard · tw-breaker", mark: "shared" },
        { name: "Domain logic", crates: "tw-types · tw-engine · tw-pricing · tw-yaml · tw-secret · tw-watch", mark: null },
        { name: "Control-plane contract", crates: "tw-api · tw-link", mark: null },
        { name: "Assembly", crates: "tw-config · tw-store · tw-observe", mark: "local" },
        { name: "Data plane and control plane", crates: "tw-gateway · tw-control", mark: "local" },
      ],
      footnote:
        "ThinkWatch Enterprise depends on the first group and nothing else. Those three crates depend only on each other, which a test enforces, and CI builds ThinkWatch Enterprise against every change to them. No crate depends on a group below its own. The last two groups are the single-machine implementation (SQLite, the local control channel and the optional remote port) and are intentionally not shared: single-machine SQLite and multi-tenant Postgres differ too much for one abstraction to serve both.",
      docs: "Crate layers in detail",
    },
    dev: {
      eyebrow: "Development",
      title: "Testing",
      body: "The smoke script exercises every path on the real binary from a clean state and reaches the control plane through twcore call. HOME and THINKWATCH_HOME point to a temporary directory that is deleted on completion.",
      commands: [
        { cmd: "cargo test --workspace", note: "# unit and integration tests" },
        { cmd: "scripts/smoke.sh", note: "# every path on the real binary" },
      ],
    },
    license: {
      title: "MIT License",
      body: "Building on, embedding, and redistributing the crates are permitted.",
      link: "View on GitHub",
    },
  },
  "zh-CN": {
    meta: {
      title: "ThinkWatch Core — 以 Rust 编写的 AI API 网关引擎",
      description:
        "一组 Rust crate 与 twcore 二进制，提供 AI API 网关的规则路由、首字节前的故障转移、费用核算、出站密钥脱敏与工具调用审查；随 ThinkWatch Lite 运行，也可作为独立网关部署在 Linux 服务器上。采用 MIT 许可证。",
      twcoreDescription: "独立运行的 AI API 网关二进制：ThinkWatch Lite 的本地引擎，也可由 systemd 在 Linux 服务器上作为独立网关运行。",
    },
    hero: {
      eyebrow: "ThinkWatch Core · 网关引擎",
      titleA: "适用于桌面与服务器的 ",
      titleHighlight: "AI API 网关引擎",
      sub: "采用 MIT 许可证的 Rust crate 与 twcore 二进制。twcore 是 ThinkWatch Lite 内置的网关，也可以作为 systemd 服务独立运行在 Linux 服务器上，由 ThinkWatch Lite 通过加密的控制通道远程管理。ThinkWatch 企业版使用其中的格式转换、防护与熔断 crate。",
      ctaInstall: "安装 twcore",
      ctaDocs: "Core 文档",
      ctaGithub: "在 GitHub 上查看",
      cardTitle: "twcore · 网关二进制",
      commands: [
        { cmd: "twcore init", note: "# 生成初始的 config.yaml 及其密钥" },
        { cmd: "twcore check", note: "# 仅校验配置，不启动" },
        { cmd: "twcore serve", note: "# 启动网关与控制面" },
      ],
    },
    does: {
      eyebrow: "功能",
      items: [
        {
          title: "按规则路由",
          body: "规则按模型、网关密钥、输入规模、是否携带工具或图片等请求属性匹配，将请求发往某个上游或策略组、改写其参数，或拒绝请求。客户端与上游的接口格式不同时，请求在 Anthropic Messages、OpenAI Chat Completions、OpenAI Responses 与 Gemini 之间转换。",
        },
        {
          title: "首字节前的故障转移",
          body: "首字节到达客户端之前，出错的上游由下一个上游替换，客户端无从察觉；此后发生的故障如实报告。熔断器使持续出错的上游暂不接收请求。",
        },
        {
          title: "费用核算",
          body: "每个请求按公开价目表（twcore 每天刷新一次）或配置中的价目表计价，并记录价格来源。估算的金额另行标注，无法计价的用量标记为未知。",
        },
        {
          title: "出站脱敏",
          body: "请求发出之前，其中的凭据替换为占位符；模型回显时再恢复原值。",
        },
        {
          title: "工具调用审查",
          body: "模型返回的工具调用按规则审查，高危调用可在流式传输中途截断。它与隐藏字符检查、内容规则和输出长度限制合为五项防护，每项可设为关闭、观察或拦截。",
        },
        {
          title: "加密的控制面",
          body: "桌面应用与 twcore 命令通过本地 socket（Windows 上为回环端口）连接 core，也可以开启远程端口。每条控制连接都先以控制密钥完成 Noise 握手，不使用证书。",
        },
      ],
    },
    install: {
      eyebrow: "安装与部署",
      title: "服务器部署",
      body: [
        "在 x86_64 或 aarch64 的 Linux 上（glibc 2.35 或更新，使用 systemd），一条命令即可安装 twcore、专用的服务用户与 systemd 服务单元。此后 macOS、Windows 或 Linux 上的 ThinkWatch Lite 通过远程控制端口连接它，网络中各处的客户端把请求发往它的网关。",
        "在桌面上，twcore 随 ThinkWatch Lite 提供，无需单独安装。",
      ],
      guide: "服务器部署指南",
      reference: "配置手册",
      scriptLabel: "在 Linux 服务器上安装",
      pinNote: "服务器上运行的 core 须为 ThinkWatch Lite 要求的版本；两者不一致时，应用会显示所需的版本。安装该版本：",
      versionPlaceholder: "<版本号>",
      nextLabel: "随后",
      next: [
        { cmd: "twcore remote enable --allow 192.168.1.0/24", note: "# 向指定网段开放远程控制端口" },
        { cmd: "sudo systemctl enable --now twcore", note: "# 启动服务" },
        { cmd: "twcore control-key", note: "# 输出 ThinkWatch Lite 连接所用的密钥" },
        { cmd: "sudo twcore upgrade --version <版本号> --restart", note: "# 日后切换到 ThinkWatch Lite 要求的版本，升级或降级均可" },
      ],
      serviceUser: "读取配置的命令须以服务用户身份运行，各步骤详见部署指南。",
      binariesTitle: "预编译二进制",
      binariesBody:
        "每个发布版本都提供以下五个平台的 twcore，各附 SHA-256 校验文件；Linux 压缩包另含 systemd 服务单元。twcore upgrade 用于升级单独安装的 twcore，ThinkWatch Lite 内置的那一份随应用更新。",
      platforms: {
        mac: "macOS · Apple silicon",
        winX64: "Windows · x64",
        winArm: "Windows · ARM64",
        linuxX64: "Linux · x86_64",
        linuxArm: "Linux · aarch64",
      },
      releases: "全部发布版本",
      version: "版本",
      sourceTitle: "从源码构建",
      sourceBody: "需要 Rust 稳定版工具链（1.85 或更新）。生成的二进制位于 target/release/twcore。",
    },
    layers: {
      eyebrow: "crate 分层",
      sharedTag: "ThinkWatch 企业版同样使用",
      localNote: "单机实现",
      rows: [
        { name: "格式转换、防护与熔断", crates: "tw-dialect · tw-guard · tw-breaker", mark: "shared" },
        { name: "领域逻辑", crates: "tw-types · tw-engine · tw-pricing · tw-yaml · tw-secret · tw-watch", mark: null },
        { name: "控制面契约", crates: "tw-api · tw-link", mark: null },
        { name: "装配", crates: "tw-config · tw-store · tw-observe", mark: "local" },
        { name: "数据面与控制面", crates: "tw-gateway · tw-control", mark: "local" },
      ],
      footnote:
        "ThinkWatch 企业版只依赖第一组。这三个 crate 只依赖彼此，由一项测试保证；每次改动它们，CI 都会用 ThinkWatch 企业版编译一遍。任何 crate 都不依赖排在其所在组下方的组。最后两组是单机实现（SQLite、本地控制通道与可选的远程端口），有意不共享：单机 SQLite 与多租户 Postgres 差异过大，统一的抽象难以同时满足两者。",
      docs: "crate 分层详解",
    },
    dev: {
      eyebrow: "开发",
      title: "测试",
      body: "smoke 脚本从初始状态出发，在真实二进制上覆盖每条路径，并通过 twcore call 访问控制面。HOME 与 THINKWATCH_HOME 均指向临时目录，执行结束后自动删除。",
      commands: [
        { cmd: "cargo test --workspace", note: "# 单元与集成测试" },
        { cmd: "scripts/smoke.sh", note: "# 在真实二进制上覆盖每条路径" },
      ],
    },
    license: {
      title: "MIT 许可证",
      body: "允许在其基础上构建、嵌入并再分发。",
      link: "在 GitHub 上查看",
    },
  },
} as const;
