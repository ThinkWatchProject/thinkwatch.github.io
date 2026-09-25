# 安装与更新

ThinkWatch Lite 支持 macOS 12 及以上版本的 Apple silicon 机型，Windows 10 21H2 及以上版本的 x64 与 ARM64 机型，以及 x86_64 与 aarch64 机型的 Linux。网关 ThinkWatch Core 随应用一同安装，无需另行安装其他组件。

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

## Linux

```bash
curl -fsSL https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest/download/install.sh | sh
```

脚本下载与本机架构对应的 AppImage，与同页发布的 sha256 校验值核对后安装为 `~/Applications/ThinkWatch-Lite.AppImage` 并启动。再次运行即用最新版本覆盖旧版本。

手动安装时，从 [最新版本的 release 页面](https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest)下载 `ThinkWatch-Lite-<版本>-x86_64.AppImage` 或 `ThinkWatch-Lite-<版本>-aarch64.AppImage`，用 `sha256sum -c` 核对后允许其执行（`chmod +x`，或在文件管理器的「属性」中勾选「允许作为程序执行文件」），然后打开。AppImage 应放在当前用户可写的目录中（如 `~/Applications`），以便自动更新替换。首次启动时会把 ThinkWatch Lite 添加到应用菜单，同时注册图标和 `thinkwatch://` 链接。Linux 版只发布 AppImage，不提供 deb、rpm、Flatpak 或 Snap 包。

需要 Ubuntu 22.04、Debian 12、Fedora 36 或同代及更新的发行版。AppImage 通过 FUSE 挂载自身，需要 fuse3 软件包中的 `fusermount3`（不需要 libfuse2）。多数桌面系统已自带；如缺少：

| 发行版 | 命令 |
|---|---|
| Ubuntu、Debian | `sudo apt install fuse3` |
| Fedora | `sudo dnf install fuse3` |
| Arch Linux | `sudo pacman -S fuse3` |
| openSUSE | `sudo zypper install fuse3` |

托盘图标依赖 AppIndicator。Ubuntu 已自带对应的 GNOME 扩展；Fedora 原生 GNOME 没有，需要另行安装 AppIndicator 扩展。没有托盘时，关闭窗口后网关继续运行，从应用菜单再次启动 ThinkWatch Lite 即可重新打开窗口。数据保存在 `~/.thinkwatch`。

- **NVIDIA 显卡在 Wayland 下窗口空白**：以 `WEBKIT_DISABLE_DMABUF_RENDERER=1` 启动应用。
- **局域网内其他机器无法连接网关**：Fedora 默认启用的 firewalld 会拦截网关端口，需放行该端口；网关监听局域网时，设置页会给出相应提示。
- **卸载**：先在「设置 › 完全卸载」中卸载，恢复应用接管过的客户端配置，并删除开机启动项和应用菜单项；再删除 AppImage 文件。

## 更新

应用启动后不久检查一次新版本，此后每天检查一次，只读取一份很小的版本清单。可以在「设置」中关闭。

有新版本时会弹出一个小窗口，之后的处理方式取决于安装方式。

**在 macOS 上从 release 页面下载安装的**：点击一次安装按钮，其余步骤自动完成——下载更新包，用编译进应用的公钥验签，等待网关正在处理的请求结束（最多三分钟），然后替换并重新启动。正在输出的任务不会因更新而中断。

**Windows 上**：同样点击一次即可。应用下载新版本的安装程序，用编译进应用的公钥验签，同样等待进行中的请求结束，然后运行安装程序，安装完成后新版本自动启动。应用为所有用户安装，因此每次更新 Windows 都会请求管理员权限；拒绝则继续运行当前版本。

**Linux 上**：同样点击一次即可，不需要输入密码。应用下载新版本的 AppImage，用编译进应用的公钥验签，等待进行中的请求结束，然后替换自身文件并重新启动。AppImage 须位于当前用户可写的目录中。

**用 Homebrew 安装的**：窗口给出更新命令和复制按钮，应用不会替换自身。Homebrew 记录着它放入 `/Applications` 的版本，应用自行替换后，下一次 `brew upgrade` 会把旧版本写回。这个窗口只在 tap 已包含新版本时才会出现，因此给出的命令一定有可安装的内容：

```bash
brew update && brew upgrade --cask thinkwatch-lite
```

命令先执行 `brew update`，是因为 `brew upgrade` 自身最多每天刷新一次 tap。

## 下一步

- [概览](/zh-CN/docs/lite)：应用展示什么。
- [从源码构建](/zh-CN/docs/lite/run-from-source)：在本机运行开发版本。
- [连接远程 core](/zh-CN/docs/lite/remote-core)：使用部署在服务器上的网关。
- [架构](/zh-CN/docs/lite/architecture)：应用的结构，以及它与 Core 的通信方式。
