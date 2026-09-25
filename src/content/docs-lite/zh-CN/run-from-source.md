# 从源码构建

开发版本在 [ThinkWatch Lite 仓库](https://github.com/ThinkWatchProject/ThinkWatch-Lite)的检出目录中运行。安装已发布的应用请参见[安装与更新](/zh-CN/docs/lite/install)。

## 运行

在 Linux 上需要先安装 WebKitGTK、AppIndicator 与 D-Bus 的开发包。Ubuntu 或 Debian 上：

```bash
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev \
  libssl-dev libayatana-appindicator3-dev librsvg2-dev dbus
```

```bash
pnpm install
bash src-tauri/scripts/fetch-core.sh
pnpm tauri dev
```

`fetch-core.sh` 下载 `Cargo.lock` 锁定的 `twcore` 发布版本，校验 sha256 后放入 `src-tauri/resources/`。包括 `pnpm tauri dev` 在内，每一次构建都需要这个文件，因为 Tauri 在编译时会检查应用声明的资源文件是否存在；开发版本运行的也是这一份 `twcore`。开发版本不执行自动更新。

## 打包

```bash
pnpm tauri build
```

在 macOS 上这会产出一个自包含的 `.app`，在 Windows 上产出 NSIS 安装程序，在 Linux 上产出 AppImage。打包时会自动运行 `fetch-core.sh`，因此包内的 `twcore` 始终是经过哈希校验的 ThinkWatch Core 发布版本，而不是本地构建的二进制；分发出去的是哪一个构建由该 release 决定，与工作副本的状态无关。所用的 release 是 `Cargo.lock` 中 `tw-api` 解析到的 tag，因此编译进应用的协议镜像与随包分发的二进制始终来自同一个 Core 提交。

macOS 产物未经 Apple 注册开发者签名，也未公证，且只面向 Apple silicon 构建。Windows 安装程序未经代码签名。

## 平台

发布版本面向 Apple silicon 的 macOS、x64 与 ARM64 的 Windows，以及 x86_64 与 aarch64 的 Linux。

## 下一步

- [架构](/zh-CN/docs/lite/architecture)：应用的结构，以及它与 Core 的通信方式。
- [贡献指南](/zh-CN/docs/lite/contributing)：提交 PR 前需要通过的检查。
