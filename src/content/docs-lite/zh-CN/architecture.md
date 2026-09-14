# 架构

ThinkWatch Lite 是看网关的窗口，而不是网关本身。

## 目录

```
src/              React 19 + Tailwind 4 前端
src-tauri/        Tauri 2 外壳：托管 core、渲染菜单栏
```

- **`src-tauri/`** 是 Tauri 2 外壳。它托管 ThinkWatch Core，并渲染菜单栏。在 macOS 上，托管器和 launchd 打交道。
- **`src/`** 是前端，用 React 19 和 Tailwind 4 编写。

## Lite 与 Core

网关本体在 [ThinkWatch Core](/zh-CN/docs/core) 里。这个仓库不含任何路由、转发或计费逻辑，Lite 通过一个 unix socket 和 Core 通信。

路由、转发、计费和脱敏都是 Core 的事。如果你想改的行为在数据通路上，应该去 [ThinkWatch Core 仓库](https://github.com/ThinkWatchProject/ThinkWatch-Core)。

## 界面绝不能做的事

这些规则是承重墙，破坏其中任何一条的改动都会被要求修改：

- **绝不显示真实的密钥**，无论是在界面、diff、日志、事件还是诊断包里。打码在数据离开进程之前完成。
- **绝不把估算当成精确值。** 实测、估算、算不出价钱始终是三个分开的数字。编出来的精确数字，比诚实的「不知道」危害更大。
- **绝不在没先展示 diff 的情况下删除用户的文件或配置。** 每个破坏性操作都走应用自己的确认界面，从不用浏览器的 `confirm`。
