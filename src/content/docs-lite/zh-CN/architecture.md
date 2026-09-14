# 架构

ThinkWatch Lite 是网关的操作界面，并非网关本身。

## 目录结构

```
src/              React 19 + Tailwind 4 前端
src-tauri/        Tauri 2 外壳：托管 core、渲染菜单栏
```

- **`src-tauri/`** 为 Tauri 2 外壳，负责托管 ThinkWatch Core 并渲染菜单栏。在 macOS 上，托管器与 launchd 集成。
- **`src/`** 为前端，使用 React 19 与 Tailwind 4 编写。

## Lite 与 Core

网关由 [ThinkWatch Core](/zh-CN/docs/core) 实现。本仓库不包含路由、转发或计量逻辑，Lite 通过 unix socket 与 Core 通信。

路由、转发、成本核算与脱敏均由 Core 负责。涉及数据通路的行为变更，应提交至 [ThinkWatch Core 仓库](https://github.com/ThinkWatchProject/ThinkWatch-Core)。

## 界面约束

以下规则为强制要求，违反其中任何一条的改动都将被要求修改：

- **禁止显示真实密钥**，包括界面、diff、日志、事件与诊断包。遮蔽在数据离开进程之前完成。
- **禁止将估算值作为精确值呈现。** 实测、估算与无法计价的成本始终分列为三个数字。虚构的精确数字比明确标注「未知」危害更大。
- **禁止在未展示 diff 的情况下删除用户的文件或配置。** 所有破坏性操作均通过应用自身的确认界面完成，不使用浏览器的 `confirm`。
