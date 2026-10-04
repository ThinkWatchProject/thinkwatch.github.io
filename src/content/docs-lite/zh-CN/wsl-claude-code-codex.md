# 在 WSL 中使用 Claude Code 和 Codex

Windows 上的 ThinkWatch Lite 在客户端页列出每个 WSL 发行版中安装的 Claude Code 与 Codex，并像这台电脑上的客户端一样，把它们指向 Windows 上的网关。写入的地址是 `127.0.0.1`，WSL 1 和使用 mirrored 网络模式的 WSL 2 都能访问；WSL 2 默认使用 NAT 网络，此时应用提供改为 mirrored 模式和重启 WSL 的操作。

## 准备

- 在 Windows 10 21H2 及以上运行 ThinkWatch Lite，[安装版](/zh-CN/lite/#install)或绿色版均可。应用运行在 Windows 上，不在 WSL 内。本文按 2026.10.4 版编写。
- WSL 1，或使用 mirrored 网络模式的 WSL 2；后者需要 Windows 11 22H2 及以上、WSL 2.0.5 及以上。`wsl --version` 查看版本，`wsl --update` 更新。
- 发行版中已安装 Claude Code 或 Codex 并运行过一次，即 `~/.claude` 或 `~/.codex` 已存在。
- 上游页中至少有一个上游。

## 步骤

1. 打开客户端页。在「这台电脑」之后，每个发行版是一个名为「WSL · <发行版>」的分组，组名下方说明它使用的网络。
2. 组名下方显示「NAT 网络，无法接管。」时，选择「改为 mirrored 模式…」。对话框列出对 `%USERPROFILE%\.wslconfig` 的改动，选择「改为 mirrored」。
3. 选择「重启 WSL…」，再选择「重启 WSL」。这会执行 `wsl --shutdown`：所有正在运行的发行版都会停止，其中运行的程序随之退出。
4. 在该发行版的分组中，对 Claude Code 或 Codex 选择「接管…」，核对字段和完整改动后选择「接管」。
5. Claude Code 从下一个请求起经过网关；Codex 需要在 WSL 中重新打开终端。
6. 第一个请求之后，客户端的状态变为「使用中」，它的请求以它自己的密钥出现在流量页中。

## 说明

| 情况 | 结果 |
|---|---|
| WSL 1 | 可以接管，WSL 1 与 Windows 共用网络。 |
| 使用 mirrored 网络的 WSL 2 | 可以接管。 |
| 使用 NAT 网络的 WSL 2（默认） | 不能接管：WSL 内的 `127.0.0.1` 是 WSL 自身，网关也不监听 WSL 的虚拟网卡。页面提供「改为 mirrored 模式…」。 |
| Windows 10、Windows 11 21H2 | 没有 mirrored 网络模式，WSL 2 中的客户端无法接管。 |
| WSL 低于 2.0.5 | 需要先运行 `wsl --update`。 |

- **对 `.wslconfig` 的改动。**只新增或修改 `networkingMode` 一项：写在 `[wsl2]` 下，原先写在旧的 `[experimental]` 下的就地修改。文件的其他内容保持不变，写入前完整备份。该设置对这台电脑上所有 WSL 2 发行版生效。完全卸载时不会改回，备份保留。
- **重启后仍是 NAT。**WSL 重启后仍在使用 NAT 网络时，分组会说明未能启用 mirrored 网络模式，并再次提供「重启 WSL…」。
- **只接管 Claude Code 和 Codex。**WSL 中只列出这两个客户端。Claude Desktop、Zed 等桌面客户端运行在 Windows 上，在「这台电脑」中接管。
- **密钥分开。**WSL 中的每一份都有自己的密钥，与 Windows 上的那一份分开；配置文件经由 `\\wsl.localhost` 修改。单独还原、「全部还原…」和完全卸载都包括 WSL 中的客户端。
- **读取会启动发行版。**打开客户端页时，应用经由 `\\wsl.localhost` 读取各个发行版，未运行的发行版会因此启动。
- **远程 core。**连接部署在服务器上的网关时，WSL 中的客户端与 Windows 上的一样指向服务器，不受网络模式限制。
- **路径。**模型可能给出另一侧写法的路径，客户端无法打开。插件页自带的「WSL 路径转换」插件（出厂关闭）把工具调用参数中的盘符路径改写为客户端能打开的写法；其适用范围可以限定为 WSL 中的客户端，这些客户端的名字形如 `claude-code-wsl-ubuntu`。

相关文档：[功能详解](/zh-CN/docs/lite/features/#客户端接管)、[安装与更新](/zh-CN/docs/lite/install/)、[插件](/zh-CN/docs/lite/plugins/)。
