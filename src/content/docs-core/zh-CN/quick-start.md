# twcore 快速入门

ThinkWatch Core 是一组 crate，而非可安装的应用。`bin/twcore` 是一个完整且可独立运行的网关二进制，可用于观察 Core 的实际行为。

## 生成、校验并启动配置

在 [ThinkWatch Core 仓库](https://github.com/ThinkWatchProject/ThinkWatch-Core)的检出目录中执行以下命令：

```bash
cargo run -p twcore -- init     # 生成带注释的 config.yaml
cargo run -p twcore -- check    # 仅校验，不启动
cargo run -p twcore -- serve    # 启动网关与控制面
```

- **`init`** 生成带注释的 `config.yaml`。
- **`check`** 仅校验配置，不启动任何服务。
- **`serve`** 启动网关与控制面。

## 接入客户端

将 Claude Code、Codex 等客户端指向本地端口。此后 Core 将按配置的规则路由每个请求、在上游之间执行故障转移、按价目表快照计价、对出站请求中的密钥进行脱敏，并审查返回的工具调用。各项功能说明见[概览](/zh-CN/docs/core)。

各客户端的分步配置说明尚未编写。
