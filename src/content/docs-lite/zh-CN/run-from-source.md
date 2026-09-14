# 从源码运行

ThinkWatch Lite 仍在开发中。它先做 macOS，没有可下载的构建产物：没有签名的 `.app`，没有安装包，没有 release 页面。你需要从源码运行它。

## 运行

在 [ThinkWatch Lite 仓库](https://github.com/ThinkWatchProject/ThinkWatch-Lite)的检出目录里执行：

```bash
pnpm install
pnpm tauri dev
```

## 平台

Lite 先做 macOS。Windows 和 Linux 等 macOS 版做完再适配，所以现在添加它们的 PR 暂时不会合并。

对 macOS 的专注贯穿整个应用：菜单栏渲染成 macOS 位图，检测客户端用的是 macOS 路径，托管器和 launchd 打交道。

## 为什么没有安装包

不分发构建产物是一个明确的范围决定，不是一个待填的坑。没有签名的 `.app`，没有安装包，没有发布流程，也没有自动更新。

## 接下来

- [架构](/zh-CN/docs/lite/architecture)：应用是怎么组成的，以及它如何与 Core 通信。
- [贡献指南](/zh-CN/docs/lite/contributing)：提 PR 之前要跑的检查。
