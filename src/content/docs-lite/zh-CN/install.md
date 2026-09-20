# 安装与更新

ThinkWatch Lite 支持 macOS 12 及以上版本的 Apple Silicon 机型。网关 ThinkWatch Core 在应用包内，没有第二样东西要装。

## Homebrew

```bash
brew install --cask thinkwatchproject/tap/thinkwatch-lite
```

cask 位于 [thinkwatchproject/tap](https://github.com/ThinkWatchProject/homebrew-tap)。除了把应用从磁盘映像复制到「应用程序」，它只多做一件事：移除隔离属性。

## 磁盘映像

从 [release 页面](https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases)下载 `ThinkWatch-Lite-<版本>-arm64.dmg`，与同页发布的 sha256 校验值核对后打开，把 ThinkWatch Lite 拖入「应用程序」。

应用**未经 Apple 注册开发者签名**，macOS 会为下载的副本添加隔离属性并拒绝打开，需先移除该属性：

```bash
xattr -dr com.apple.quarantine "/Applications/ThinkWatch Lite.app"
```

不使用终端时：首次打开被拒绝之后，在「系统设置 › 隐私与安全性」中点击「仍要打开」。

## 更新

应用启动后不久检查一次新版本，此后每天检查一次，只读取一份很小的版本清单。可以在「设置」中关闭。

有新版本时会弹出一个小窗口，之后的处理方式取决于安装方式。

**从 release 页面下载安装的**：点击一次安装按钮，其余步骤自动完成——下载更新包，用编译进应用的公钥验签，等待网关正在处理的请求结束（最多三分钟），然后替换并重新启动。正在输出的任务不会因更新而中断。

**用 Homebrew 安装的**：窗口给出更新命令和复制按钮，应用不会替换自身。Homebrew 记录着它放入 `/Applications` 的版本，应用自行替换后，下一次 `brew upgrade` 会把旧版本写回。这个窗口只在 tap 已包含新版本时才会出现，因此给出的命令一定有可安装的内容：

```bash
brew update && brew upgrade --cask thinkwatch-lite
```

命令先执行 `brew update`，是因为 `brew upgrade` 自身最多每天刷新一次 tap。

## 下一步

- [概览](/zh-CN/docs/lite)：应用展示什么。
- [从源码构建](/zh-CN/docs/lite/run-from-source)：在本机运行开发版本。
- [架构](/zh-CN/docs/lite/architecture)：应用的结构，以及它与 Core 的通信方式。
