# 架构

ThinkWatch Lite 是网关的操作界面，并非网关本身。

## 目录结构

```
src/              React 19 + Tailwind 4 前端
src-tauri/        Tauri 2 外壳：托管 core，渲染菜单栏与托盘
src-tauri/crates/ 客户端接管（tw-adopt）与配置扫描（tw-scan）
```

- **`src-tauri/`** 为 Tauri 2 外壳，负责启动并托管 ThinkWatch Core：core 退出后自动重启；连续多次启动失败后进入安全模式，只运行控制面，配置、历史与回滚仍然可用。外壳在 macOS 上渲染菜单栏，在 Windows 上渲染通知区域的图标与菜单，在 Linux 上渲染系统托盘的图标与菜单，并负责发送系统通知。开机启动时启动的是应用本身，再由应用启动 core；core 不单独注册开机启动。
- **`src-tauri/crates/`** 包含 `tw-adopt` 与 `tw-scan`：前者把客户端指向网关并负责还原，后者为 MCP 页扫描客户端配置。两者都作用于运行应用的这台电脑，应用连接服务器上的 core 时也是如此。
- **`src/`** 为前端，使用 React 19 与 Tailwind 4 编写。

## Lite 与 Core

网关由 [ThinkWatch Core](/zh-CN/docs/core) 实现。本仓库不包含路由、转发或计量逻辑。

路由、转发、成本核算与脱敏均由 Core 负责。涉及数据通路的行为变更，应提交至 [ThinkWatch Core 仓库](https://github.com/ThinkWatchProject/ThinkWatch-Core)。

## 控制通道

Lite 读取和修改的一切都经由 Core 的控制接口。连接方式取决于 Core 运行在哪里：

| Core 运行在 | 通道 |
|---|---|
| 同一台电脑，macOS 或 Linux | 数据目录中的 unix socket |
| 同一台电脑，Windows | 回环 TCP 端口 |
| 服务器 | 服务器的远程控制端口（TCP） |

三种通道承载同一套 HTTP 接口，外面包着一次 Noise 握手（`Noise_NNpsk0_25519_ChaChaPoly_BLAKE2s`），预共享密钥是 Core 的 `config.yaml` 中的 `listen.control.key`。握手对连接双向加密与认证：能访问 socket 或端口、但不持有密钥的程序无法控制 Core。整个过程不使用 TLS，也不涉及证书。握手中交换双方版本，应用与 core 版本不一致时连接被拒绝。

对于应用自己启动的 core，应用从本机的 `config.yaml` 读取密钥；对于服务器上的 core，密钥在添加连接时填写一次，保存在应用数据目录中仅当前用户可读的文件里。参见[连接远程 core](/zh-CN/docs/lite/remote-core)。

## 界面约束

以下规则为强制要求，违反其中任何一条的改动都将被要求修改：

- **禁止显示真实密钥**，包括界面、diff、日志、事件与诊断包。遮蔽在数据离开进程之前完成。
- **禁止将估算值作为精确值呈现。** 实测、估算与无法计价的成本始终分列为三个数字。虚构的精确数字比明确标注「未知」危害更大。
- **禁止在未展示 diff 的情况下删除用户的文件或配置。** 所有破坏性操作均通过应用自身的确认界面完成，不使用浏览器的 `confirm`。
