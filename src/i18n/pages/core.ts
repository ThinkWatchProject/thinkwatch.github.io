// Copy for the /core page. Facts come from the ThinkWatch Core README, plus the
// ThinkWatch README for which crates the server edition depends on.

export const coreCopy = {
  en: {
    meta: {
      title: "ThinkWatch Core — The shared core of a local AI gateway",
      description:
        "Routing, forwarding, observability, cost accounting, and data-plane guards, as MIT-licensed Rust crates. Used by ThinkWatch Lite and by the server edition.",
    },
    hero: {
      eyebrow: "ThinkWatch Core · The shared engine",
      titleA: "The shared core of ",
      titleHighlight: "a local AI gateway.",
      sub: "Routing, forwarding, observability, cost accounting, and data-plane guards, as MIT-licensed Rust crates. Used by ThinkWatch Lite and by the server edition.",
      ctaPrimary: "Read the Core docs",
      ctaSecondary: "View on GitHub",
      cardTitle: "twcore · a complete, self-contained gateway binary",
      commands: [
        { cmd: "cargo run -p twcore -- init", note: "# write a commented config.yaml" },
        { cmd: "cargo run -p twcore -- check", note: "# validate only, don't start" },
        { cmd: "cargo run -p twcore -- serve", note: "# start the gateway and control plane" },
      ],
    },
    does: {
      eyebrow: "What it does",
      items: [
        {
          title: "Route by rule",
          body: "Match on model, client, context length, or tools present. Switch upstream, rewrite parameters, or refuse.",
        },
        {
          title: "Fail over mid-flight",
          body: "Before the first byte, swap upstreams transparently. After it, report honestly what happened.",
        },
        {
          title: "Make cost visible",
          body: "Token usage and cache hits priced against a snapshot table. What can't be priced is labelled unknown.",
        },
        {
          title: "Redact outbound",
          body: "Secrets become placeholders before they reach a relay, and are restored when the model echoes them.",
        },
        {
          title: "Inspect inbound",
          body: "Tool calls from an upstream are checked against rules; a dangerous one can be cut off mid-frame.",
        },
      ],
    },
    layers: {
      eyebrow: "Crate layers",
      sharedTag: "Also used by the server edition",
      localNote: "Single-machine: SQLite, unix socket",
      rows: [
        { name: "Shaped by the outside world", crates: "tw-types · tw-protocol · tw-provider · tw-resil · tw-crypto" },
        { name: "Domain logic", crates: "tw-engine · tw-pricing · tw-redact · tw-yaml · tw-secret" },
        { name: "Assembly", crates: "tw-config · tw-store · tw-scan · tw-adopt · tw-observe" },
        { name: "Data plane and control plane", crates: "tw-gateway · tw-control" },
      ],
      footnote:
        "The bottom two layers are the single-machine implementation and are deliberately not shared: single-machine SQLite and multi-tenant Postgres are different enough that one abstraction over both would serve neither.",
    },
    dev: {
      eyebrow: "Development",
      title: "Tested against the real binary.",
      body: "The smoke script exercises every path from a clean slate, with HOME and THINKWATCH_HOME pointed at a temporary directory that is deleted when it finishes.",
      commands: [
        { cmd: "cargo test --workspace", note: "# unit and integration tests" },
        { cmd: "scripts/smoke.sh", note: "# every path on the real binary" },
      ],
    },
    license: {
      title: "MIT License",
      body: "Build on it, embed it, and ship it anywhere.",
      link: "View on GitHub",
    },
  },
  "zh-CN": {
    meta: {
      title: "ThinkWatch Core — 本地 AI 网关的共用核心层",
      description:
        "路由、转发、观测、计价，以及数据面安全守卫，以 MIT 许可证的 Rust crate 提供。ThinkWatch Lite 和服务端版都在用。",
    },
    hero: {
      eyebrow: "ThinkWatch Core · 共用引擎",
      titleA: "本地 AI 网关的",
      titleHighlight: "共用核心层。",
      sub: "路由、转发、观测、计价，以及一组数据面安全守卫，以 MIT 许可证的 Rust crate 提供。ThinkWatch Lite 和服务端版都在用。",
      ctaPrimary: "阅读 Core 文档",
      ctaSecondary: "在 GitHub 上查看",
      cardTitle: "twcore · 一个完整、可独立运行的网关二进制",
      commands: [
        { cmd: "cargo run -p twcore -- init", note: "# 生成一份带注释的 config.yaml" },
        { cmd: "cargo run -p twcore -- check", note: "# 只校验，不启动" },
        { cmd: "cargo run -p twcore -- serve", note: "# 启动网关和控制面" },
      ],
    },
    does: {
      eyebrow: "它做什么",
      items: [
        {
          title: "按规则路由",
          body: "条件可以是模型名、客户端、上下文长度或是否带工具；动作是换上游、改参数或直接拒绝。",
        },
        {
          title: "流式故障转移",
          body: "首字节之前可以透明地换一家上游；首字节之后，如实报告发生了什么。",
        },
        {
          title: "看得见成本",
          body: "token 用量和缓存命中按价目表快照计价。算不出价钱的明确标为未知。",
        },
        {
          title: "出站脱敏",
          body: "请求发往中转站之前，其中的密钥被换成占位符；模型回显时再换回来。",
        },
        {
          title: "入站审查",
          body: "上游返回的工具调用会过一遍规则，高危的可以在那一帧上切断。",
        },
      ],
    },
    layers: {
      eyebrow: "crate 分层",
      sharedTag: "服务端版也在用",
      localNote: "单机实现：SQLite、unix socket",
      rows: [
        { name: "形状由外部现实决定", crates: "tw-types · tw-protocol · tw-provider · tw-resil · tw-crypto" },
        { name: "领域逻辑", crates: "tw-engine · tw-pricing · tw-redact · tw-yaml · tw-secret" },
        { name: "装配", crates: "tw-config · tw-store · tw-scan · tw-adopt · tw-observe" },
        { name: "数据面与控制面", crates: "tw-gateway · tw-control" },
      ],
      footnote:
        "下面两层是单机实现，有意不共用：单机 SQLite 和多租户 Postgres 差得太远，强行统一只会造出一个两边都别扭的抽象。",
    },
    dev: {
      eyebrow: "开发",
      title: "在真实二进制上测试。",
      body: "smoke 脚本从零开始，在真实二进制上把每条路径走一遍。HOME 和 THINKWATCH_HOME 都指向一个临时目录，跑完就删。",
      commands: [
        { cmd: "cargo test --workspace", note: "# 单元与集成测试" },
        { cmd: "scripts/smoke.sh", note: "# 在真实二进制上把每条路径走一遍" },
      ],
    },
    license: {
      title: "MIT 许可证",
      body: "在它之上构建、嵌入它，并在任何地方发布。",
      link: "在 GitHub 上查看",
    },
  },
} as const;
