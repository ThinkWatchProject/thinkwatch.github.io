# 从源码构建

开发版本在 [ThinkWatch Lite 仓库](https://github.com/ThinkWatchProject/ThinkWatch-Lite)的检出目录中运行。安装已发布的应用请参见[安装与更新](/zh-CN/docs/lite/install)。

## 运行

```bash
pnpm install
pnpm tauri dev
```

`pnpm tauri dev` 不联网、不下载任何内容：它会在同级的 `thinkwatch-core` 检出目录中寻找 `twcore` 二进制。开发版本不执行自动更新。

## 打包

```bash
pnpm tauri build
```

这会产出一个自包含的 `.app`。包内的 `twcore` 从 ThinkWatch Core 的 release 下载并校验哈希，而不是从同级检出目录复制，因此分发出去的是哪一个构建由该 release 决定，与本地工作副本的状态无关。用哪个 release 由 `Cargo.lock` 中 `tw-api` 解析到的 tag 决定，因此编译进应用的协议镜像与随包分发的二进制始终来自同一个 Core 提交。

产物未经 Apple 注册开发者签名，也未公证，且只面向 Apple Silicon 构建。

## 平台

优先支持 macOS。Windows 与 Linux 将在 macOS 版本完成后适配：菜单栏是按 macOS 渲染的位图，客户端检测使用 macOS 路径，守护进程接的是 launchd。

## 下一步

- [架构](/zh-CN/docs/lite/architecture)：应用的结构，以及它与 Core 的通信方式。
- [贡献指南](/zh-CN/docs/lite/contributing)：提交 PR 前需要通过的检查。
