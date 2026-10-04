# Use Claude Code and Codex in WSL

ThinkWatch Lite on Windows lists the Claude Code and Codex installed in each WSL distribution on its Clients page and connects them to the gateway on Windows, the same way as the clients on Windows itself. They are given the address `127.0.0.1`, which WSL reaches in WSL 1 and in WSL 2 with mirrored networking. For WSL 2 on its default NAT networking, the app offers to switch to mirrored networking and to restart WSL.

## Before you start

- ThinkWatch Lite on Windows 10 21H2 or later, [installed](/lite/#install) or portable. The app runs on Windows, not inside WSL. This guide follows version 2026.10.4.
- WSL 1, or WSL 2 with mirrored networking, which needs Windows 11 22H2 or later and WSL 2.0.5 or later. `wsl --version` shows the version and `wsl --update` updates it.
- Claude Code or Codex installed in the distribution and run once, so that `~/.claude` or `~/.codex` exists.
- At least one upstream on the Upstreams page.

## Steps

1. Open the Clients page. Below **This computer**, each distribution has a group named **WSL · <distribution>**, with a line under the name stating its networking.
2. If the line reads **NAT networking; clients cannot be connected.**, choose **Switch to mirrored…**. The dialog shows the change to `%USERPROFILE%\.wslconfig`; choose **Switch**.
3. Choose **Restart WSL…**, then **Restart WSL**. This runs `wsl --shutdown`: every running distribution stops, together with the programs running in it.
4. In the distribution's group, choose **Connect…** on Claude Code or Codex, review the fields and the full change, and choose **Connect**.
5. Claude Code goes through the gateway from its next request. For Codex, reopen the terminal in WSL.
6. After the first request, the client's status changes to **In use**, and its requests appear on the Traffic page under a key of its own.

## Notes

| Setup | Result |
|---|---|
| WSL 1 | Connects; WSL 1 shares the network with Windows. |
| WSL 2 with mirrored networking | Connects. |
| WSL 2 with NAT networking (the default) | Not connected: inside WSL, `127.0.0.1` is WSL itself, and the gateway does not listen on the WSL virtual adapter. **Switch to mirrored…** is offered. |
| Windows 10 or Windows 11 21H2 | No mirrored networking, so clients in WSL 2 cannot be connected. |
| WSL older than 2.0.5 | `wsl --update` is needed first. |

- **The `.wslconfig` change.** Only `networkingMode` is added or changed, under `[wsl2]`, or in place where it is written under the older `[experimental]`. The rest of the file is left as it is, and the whole file is backed up first. The setting applies to every WSL 2 distribution on the computer. A full uninstall does not change it back, and the backup is kept.
- **When NAT remains.** If WSL still uses NAT networking after the restart, the group says so and offers **Restart WSL…** again.
- **Only Claude Code and Codex.** These two are the clients listed inside WSL. Desktop clients such as Claude Desktop and Zed run on Windows and are connected under **This computer**.
- **Separate keys.** Each copy in WSL gets a key of its own, separate from the copy on Windows, and its files are edited through `\\wsl.localhost`. Restoring a client, **Restore all…** and a full uninstall cover the copies in WSL as well.
- **Reading starts a distribution.** Opening the Clients page reads each distribution through `\\wsl.localhost`, which starts a distribution that is not running.
- **Remote core.** When the app is connected to a gateway on a server, clients in WSL are pointed at the server like those on Windows, whatever the networking.
- **Paths.** A model may hand a client a path written for the other side. The built-in plugin **Convert WSL and Windows paths** on the Plugins page, off by default, rewrites drive paths in tool-call arguments to the form the client can open. Its scope can be limited to the clients in WSL, whose names look like `claude-code-wsl-ubuntu`.

Related: [Features](/docs/lite/features/#client-setup), [Install and update](/docs/lite/install/), [Plugins](/docs/lite/plugins/).
