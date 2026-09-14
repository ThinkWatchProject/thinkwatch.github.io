# 用 twcore 快速上手

ThinkWatch Core 是一组 crate，不是一个装上就能用的应用。想要跑得起来的东西，`bin/twcore` 是一个完整的、可独立运行的网关二进制，想看实际行为时就跑它。

## 生成、校验、启动一份配置

在 [ThinkWatch Core 仓库](https://github.com/ThinkWatchProject/ThinkWatch-Core)的检出目录里执行：

```bash
cargo run -p twcore -- init     # 生成一份带注释的 config.yaml
cargo run -p twcore -- check    # 只校验，不启动
cargo run -p twcore -- serve    # 起网关和控制面
```

- **`init`** 生成一份带注释的 `config.yaml`。
- **`check`** 只校验配置，不启动任何东西。
- **`serve`** 启动网关和控制面。

## 把客户端指向它

把 Claude Code、Codex 之类的客户端指向本地的端口。之后 Core 会按你的规则路由每个请求、在上游之间故障转移、按价目表快照计价、在出站时脱敏密钥，并在返回时审查工具调用。各项说明见[概览](/zh-CN/docs/core)。

各个客户端的逐步配置说明暂时还没有写。
