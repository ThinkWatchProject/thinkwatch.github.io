# 安装与更新

ThinkWatch Lite 支持 macOS 12 及以上版本的 Apple Silicon 机型，以及 Windows 10 21H2 及以上版本的 x64 与 ARM64 机型。网关 ThinkWatch Core 在应用包内，没有第二样东西要装。

## macOS：Homebrew

```bash
brew install --cask thinkwatchproject/tap/thinkwatch-lite
```

cask 位于 [thinkwatchproject/tap](https://github.com/ThinkWatchProject/homebrew-tap)。除了把应用从磁盘映像复制到「应用程序」，它只多做一件事：移除隔离属性。

## macOS：磁盘映像

从 [最新版本的 release 页面](https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest)下载 `ThinkWatch-Lite-<版本>-arm64.dmg`，与同页发布的 sha256 校验值核对后打开，把 ThinkWatch Lite 拖入「应用程序」。

应用**未经 Apple 注册开发者签名**，macOS 会为下载的副本添加隔离属性并拒绝打开，需先移除该属性：

```bash
xattr -dr com.apple.quarantine "/Applications/ThinkWatch Lite.app"
```

不使用终端时：首次打开被拒绝之后，在「系统设置 › 隐私与安全性」中点击「仍要打开」。

## Windows

从 [最新版本的 release 页面](https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest)下载与本机架构对应的安装程序：大多数电脑用 `ThinkWatch-Lite-<版本>-x64-setup.exe`，ARM 处理器的电脑用 `ThinkWatch-Lite-<版本>-arm64-setup.exe`。[Lite 页面](/zh-CN/lite#install)提供最新版本两个安装程序的下载链接。下载后与同页发布的 sha256 校验值核对：

```powershell
Get-FileHash .\ThinkWatch-Lite-<版本>-x64-setup.exe
```

安装程序为所有用户安装，装入 Program Files，因此 Windows 会请求管理员权限。需要 Windows 10 21H2 及以上版本；缺少 WebView2 时安装程序会自动下载（Windows 11 已自带）。

安装程序**未经代码签名**，项目也不会购买证书。运行下载的安装程序时，SmartScreen 会显示全屏的蓝色警告「Windows 已保护你的电脑」，依次点击「更多信息」→「仍要运行」即可继续安装。

安装后应用图标位于通知区域：左键打开主界面，右键打开菜单。数据保存在 `%APPDATA%\ThinkWatch`。

## 更新

应用启动后不久检查一次新版本，此后每天检查一次，只读取一份很小的版本清单。可以在「设置」中关闭。

有新版本时会弹出一个小窗口，之后的处理方式取决于安装方式。

**在 macOS 上从 release 页面下载安装的**：点击一次安装按钮，其余步骤自动完成——下载更新包，用编译进应用的公钥验签，等待网关正在处理的请求结束（最多三分钟），然后替换并重新启动。正在输出的任务不会因更新而中断。

**Windows 上**：同样点击一次即可。应用下载新版本的安装程序，用编译进应用的公钥验签，同样等待进行中的请求结束，然后运行安装程序，安装完成后新版本自动启动。应用为所有用户安装，因此每次更新 Windows 都会请求管理员权限；拒绝则继续运行当前版本。

**用 Homebrew 安装的**：窗口给出更新命令和复制按钮，应用不会替换自身。Homebrew 记录着它放入 `/Applications` 的版本，应用自行替换后，下一次 `brew upgrade` 会把旧版本写回。这个窗口只在 tap 已包含新版本时才会出现，因此给出的命令一定有可安装的内容：

```bash
brew update && brew upgrade --cask thinkwatch-lite
```

命令先执行 `brew update`，是因为 `brew upgrade` 自身最多每天刷新一次 tap。

## 下一步

- [概览](/zh-CN/docs/lite)：应用展示什么。
- [从源码构建](/zh-CN/docs/lite/run-from-source)：在本机运行开发版本。
- [架构](/zh-CN/docs/lite/architecture)：应用的结构，以及它与 Core 的通信方式。
