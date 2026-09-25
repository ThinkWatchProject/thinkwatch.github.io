# twcore 快速入门

`twcore` 是由 ThinkWatch Core 构建的网关二进制。ThinkWatch Lite 已内置它，安装了应用的桌面无需另装；本文介绍如何单独运行 `twcore`。如需在 Linux 服务器上将其作为服务运行、由 ThinkWatch Lite 远程管理，请参阅[服务器部署](/zh-CN/docs/core/server-deployment)。

## 获取二进制

每个[发布版本](https://github.com/ThinkWatchProject/ThinkWatch-Core/releases/latest)都提供预编译二进制，各附一个 `.sha256` 文件：

| 平台 | 文件 |
| --- | --- |
| macOS，Apple silicon | `twcore-aarch64-apple-darwin` |
| Windows，x64 | `twcore-x86_64-pc-windows-msvc.exe` |
| Windows，ARM64 | `twcore-aarch64-pc-windows-msvc.exe` |
| Linux，x86_64 | `twcore-x86_64-unknown-linux-gnu`，以及另含 systemd 服务单元的 `.tar.gz` |
| Linux，aarch64 | `twcore-aarch64-unknown-linux-gnu`，以及另含 systemd 服务单元的 `.tar.gz` |

下载对应平台的文件，用其 `.sha256` 文件校验，再以 `twcore` 为名放入 `PATH`。Linux 版本需要 glibc 2.35 或更新（Ubuntu 22.04、Debian 12 及以后）。

在 Linux 服务器上，安装脚本一步完成上述操作，并创建服务用户与 systemd 服务单元：

```sh
curl -fsSL https://raw.githubusercontent.com/ThinkWatchProject/ThinkWatch-Core/main/scripts/install.sh | sudo sh
```

如需从源码构建，需要 Rust 稳定版工具链（1.85 或更新）：

```sh
git clone https://github.com/ThinkWatchProject/ThinkWatch-Core.git
cd ThinkWatch-Core
cargo build --release -p twcore     # 生成 target/release/twcore
```

在仓库的检出目录中，`cargo run -p twcore -- <命令>` 无需安装即可运行下文的各条命令。

## 生成、校验并启动配置

```sh
twcore init     # 生成初始的 config.yaml，其中含一把网关密钥与控制密钥
twcore check    # 仅校验配置，不启动任何服务
twcore serve    # 启动网关与控制面
```

配置文件为 `~/.thinkwatch/config.yaml`，Windows 上为 `%APPDATA%\ThinkWatch\config.yaml`；`THINKWATCH_HOME` 可更换整个目录，`--config <路径>` 为单条命令指定文件。`twcore init` 会输出它生成的网关密钥；没有配置文件时，`twcore serve` 也会自行写入一份初始配置。

初始配置中没有上游：控制面照常运行，请求会得到「尚未配置上游」的错误。添加一个上游即可转发：

```yaml
providers:
  - name: anthropic
    base_url: https://api.anthropic.com
    key: ${ANTHROPIC_API_KEY}
```

`${NAME}` 读取 `twcore` 进程的环境变量。运行中的 core 在文件保存后一秒内重新加载；未通过校验的版本会被拒绝，原有配置继续服务。每个字段的说明见[配置手册](/zh-CN/docs/core/configuration)。

## 接入客户端

网关默认监听 `127.0.0.1:8788`（配置中的 `listen.gateway`）。客户端需要两项设置：以网关地址作为 base URL，以 `clients` 中的一把网关密钥作为 API 密钥。

- **Anthropic 格式的客户端**使用 `http://127.0.0.1:8788`。以 Claude Code 为例：设置 `ANTHROPIC_BASE_URL=http://127.0.0.1:8788`，并将 `ANTHROPIC_AUTH_TOKEN` 设为网关密钥。
- **OpenAI 格式的客户端**使用 `http://127.0.0.1:8788/v1`，API 密钥填网关密钥。

ThinkWatch Lite 可在客户端页将 Claude Code、Codex 等受支持的客户端指向网关，见 [ThinkWatch Lite 文档](/zh-CN/docs/lite)。网关密钥的各个字段（如允许使用的模型、所走的路由）见配置手册中的 [`clients`](/zh-CN/docs/core/configuration#clients) 一节。

此后 Core 将按配置的规则路由每个请求、在上游之间执行故障转移、计算费用、对出站请求中的凭据进行脱敏，并审查响应中的工具调用。各项功能说明见[概览](/zh-CN/docs/core#功能)。
