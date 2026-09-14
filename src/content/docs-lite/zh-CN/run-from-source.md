# 从源码构建

ThinkWatch Lite 正在开发中，优先支持 macOS，不提供可下载的构建产物：没有签名的 `.app`、安装包或 release 页面，需从源码运行。

## 构建与运行

在 [ThinkWatch Lite 仓库](https://github.com/ThinkWatchProject/ThinkWatch-Lite)的检出目录中执行以下命令：

```bash
pnpm install
pnpm tauri dev
```

## 平台支持

优先支持 macOS。Windows 与 Linux 将在 macOS 版本完成后适配，在此之前添加这些平台的 PR 不会合并。

应用的实现以 macOS 为准：菜单栏以 macOS 位图渲染，客户端检测使用 macOS 路径，托管器与 launchd 集成。

## 不提供安装包

不分发构建产物是有意做出的范围决定。项目不提供签名的 `.app`、安装包、发布流程或自动更新。

## 后续阅读

- [架构](/zh-CN/docs/lite/architecture)：应用的组成，以及与 Core 的通信方式。
- [贡献指南](/zh-CN/docs/lite/contributing)：提交 PR 前须通过的检查。
