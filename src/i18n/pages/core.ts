// Copy for the /core page. Facts come from the ThinkWatch Core README, plus the
// ThinkWatch README for which crates the server edition depends on.

export const coreCopy = {
  en: {
    meta: {
      title: "ThinkWatch Core — Shared core of the ThinkWatch gateways",
      description:
        "Routing, forwarding, observability, cost accounting, and data-plane guards, provided as MIT-licensed Rust crates. Used by ThinkWatch Lite and by the server edition.",
    },
    hero: {
      eyebrow: "ThinkWatch Core · Shared engine",
      titleA: "Shared core of ",
      titleHighlight: "the ThinkWatch gateways",
      sub: "Routing, forwarding, observability, cost accounting, and data-plane guards, provided as MIT-licensed Rust crates. Used by ThinkWatch Lite and by the server edition.",
      ctaPrimary: "Core documentation",
      ctaSecondary: "View on GitHub",
      cardTitle: "twcore · a complete, self-contained gateway binary",
      commands: [
        { cmd: "cargo run -p twcore -- init", note: "# write a commented config.yaml" },
        { cmd: "cargo run -p twcore -- check", note: "# validate without starting" },
        { cmd: "cargo run -p twcore -- serve", note: "# start the gateway and control plane" },
      ],
    },
    does: {
      eyebrow: "Capabilities",
      items: [
        {
          title: "Rule-based routing",
          body: "Rules match on model, client, context length, or the presence of tools, and can switch upstream, rewrite parameters, or reject the request.",
        },
        {
          title: "Mid-stream failover",
          body: "Before the first byte is sent, upstreams can be switched transparently. After streaming has started, the failure is reported.",
        },
        {
          title: "Cost visibility",
          body: "Token usage and cache hits are priced against a snapshot table. Usage that cannot be priced is labelled unknown.",
        },
        {
          title: "Outbound redaction",
          body: "Secrets are replaced with placeholders before they reach a relay, and restored when the model echoes them.",
        },
        {
          title: "Inbound inspection",
          body: "Tool calls from an upstream are checked against rules; a dangerous call can be terminated mid-frame.",
        },
      ],
    },
    layers: {
      eyebrow: "Crate layers",
      sharedTag: "Also used by the server edition",
      localNote: "Single-machine: SQLite, unix socket",
      rows: [
        { name: "Defined by external constraints", crates: "tw-types · tw-protocol · tw-provider · tw-resil · tw-crypto" },
        { name: "Domain logic", crates: "tw-engine · tw-pricing · tw-redact · tw-yaml · tw-secret" },
        { name: "Assembly", crates: "tw-config · tw-store · tw-scan · tw-adopt · tw-observe" },
        { name: "Data plane and control plane", crates: "tw-gateway · tw-control" },
      ],
      footnote:
        "The bottom two layers form the single-machine implementation and are intentionally not shared. Single-machine SQLite and multi-tenant Postgres differ too much for one abstraction to serve both.",
    },
    dev: {
      eyebrow: "Development",
      title: "Testing",
      body: "The smoke script exercises every path on the real binary from a clean state. HOME and THINKWATCH_HOME point to a temporary directory that is deleted on completion.",
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
      title: "ThinkWatch Core — ThinkWatch 网关的共享核心",
      description:
        "路由、转发、可观测性、成本核算与数据面防护，以 MIT 许可证的 Rust crate 形式提供，供 ThinkWatch Lite 与服务端版本使用。",
    },
    hero: {
      eyebrow: "ThinkWatch Core · 共享引擎",
      titleA: "ThinkWatch 网关的",
      titleHighlight: "共享核心",
      sub: "路由、转发、可观测性、成本核算与数据面防护，以 MIT 许可证的 Rust crate 形式提供，供 ThinkWatch Lite 与服务端版本使用。",
      ctaPrimary: "Core 文档",
      ctaSecondary: "在 GitHub 上查看",
      cardTitle: "twcore · 完整且可独立运行的网关二进制",
      commands: [
        { cmd: "cargo run -p twcore -- init", note: "# 生成带注释的 config.yaml" },
        { cmd: "cargo run -p twcore -- check", note: "# 仅校验，不启动" },
        { cmd: "cargo run -p twcore -- serve", note: "# 启动网关与控制面" },
      ],
    },
    does: {
      eyebrow: "功能",
      items: [
        {
          title: "按规则路由",
          body: "匹配条件包括模型名、客户端、上下文长度及是否携带工具；动作包括切换上游、改写参数或拒绝请求。",
        },
        {
          title: "流式故障转移",
          body: "首字节发出之前，可透明切换上游；流式传输开始之后，报告故障情况。",
        },
        {
          title: "成本可见",
          body: "token 用量与缓存命中按价目表快照计价，无法计价的部分标记为未知。",
        },
        {
          title: "出站脱敏",
          body: "请求发往中转站之前，其中的密钥替换为占位符；模型回显时再恢复原值。",
        },
        {
          title: "入站审查",
          body: "上游返回的工具调用按规则审查，高危调用可在当前帧中止。",
        },
      ],
    },
    layers: {
      eyebrow: "crate 分层",
      sharedTag: "服务端版本同样使用",
      localNote: "单机实现：SQLite、unix socket",
      rows: [
        { name: "由外部约束决定", crates: "tw-types · tw-protocol · tw-provider · tw-resil · tw-crypto" },
        { name: "领域逻辑", crates: "tw-engine · tw-pricing · tw-redact · tw-yaml · tw-secret" },
        { name: "装配", crates: "tw-config · tw-store · tw-scan · tw-adopt · tw-observe" },
        { name: "数据面与控制面", crates: "tw-gateway · tw-control" },
      ],
      footnote:
        "下面两层为单机实现，有意不共享：单机 SQLite 与多租户 Postgres 差异过大，统一的抽象难以同时满足两者。",
    },
    dev: {
      eyebrow: "开发",
      title: "测试",
      body: "smoke 脚本从初始状态出发，在真实二进制上覆盖每条路径。HOME 与 THINKWATCH_HOME 均指向临时目录，执行结束后自动删除。",
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
