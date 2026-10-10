# ThinkWatch Lite FAQ

Short answers to common questions about ThinkWatch Lite, as of version 2026.10.4. The details are in [Features](/docs/lite/features/) and [Install and update](/docs/lite/install/).

## What is ThinkWatch Lite?

ThinkWatch Lite is a desktop app that runs a local gateway for Claude Code, Codex and other AI clients on macOS, Windows and Linux. Each client is connected to the gateway once; upstreams and models then change in the gateway without touching the client's configuration. Every request is recorded with its route and cost, credentials can be replaced with placeholders before a request leaves the computer, and dangerous tool calls in an answer can be cut off before the client runs them.

## Is ThinkWatch Lite free?

Yes. ThinkWatch Lite and its gateway, ThinkWatch Core, are open source under the MIT license: free to use, modify and redistribute, commercially or not. The app needs no account. Requests are paid for at the upstreams they go to, such as an API provider or a relay.

## Which clients does ThinkWatch Lite support?

ThinkWatch Lite connects twelve clients in one step on its Clients page: Claude Code, Claude Desktop, Codex (including the Codex in the ChatGPT desktop app), opencode, Pi, oh-my-pi, Grok Build, Qwen Code, Hermes Agent, Zed, Aider and DeepSeek Harness. Cursor, Continue and Antigravity CLI come with step-by-step instructions and a key created for them.

Other clients that use the Anthropic, OpenAI or Gemini API can use the gateway address, `http://127.0.0.1:8788` by default, with a key from the Keys page.

## Which platforms does ThinkWatch Lite run on?

ThinkWatch Lite runs on macOS 12 or later on Apple silicon, with no build for Intel Macs; on Windows 10 21H2 or later on x64 or ARM64, as an installer or a portable zip; and on Linux on x86_64 or aarch64 as an AppImage, from Ubuntu 22.04, Debian 12 or Fedora 36 onwards.

On Windows, Claude Code and Codex installed inside WSL can be connected under WSL 1, or under WSL 2 with mirrored networking, which needs Windows 11 22H2 and WSL 2.0.5 or later.

## Can ThinkWatch Lite use a Claude Pro or Max subscription?

No. ThinkWatch Lite does not support Claude subscription sign-in, and its gateway rejects Claude subscription credentials. A connected Claude Code sends its requests with a gateway key instead; restoring Claude Code on the Clients page returns it to its own sign-in.

Through the gateway, Claude Code can use an Anthropic API key, Amazon Bedrock, a relay, a ChatGPT account, or other providers' models through API format conversion.

## Can ThinkWatch Lite use relays and Chinese models such as GLM, Kimi, Qwen or DeepSeek?

Yes. Any service with an Anthropic, OpenAI or Gemini API can be an upstream: on the Upstreams page, choose **New upstream**, set **Service** to **Custom**, and enter the **Base URL** and **API key**. DeepSeek, OpenRouter, Sub2API and New API / One API are in the Service list, and a Z.ai or BigModel account can be signed in directly, with its GLM Coding Plan quota shown in the app.

Upstreams that accept only particular clients, such as Kimi For Coding or Bailian Coding Plan, need **Forward client identity** turned on in the upstream's connection settings; otherwise requests identify themselves as ThinkWatch. A custom price sheet covers a relay whose prices differ from the official ones, and a routing rule can rewrite the model name, in which case the request is priced by the name it was sent with.

## How is ThinkWatch Lite different from CC Switch?

CC Switch switches providers by writing each client's configuration file, and manages MCP servers, prompts and skills across clients. ThinkWatch Lite connects each client to a local gateway once, then routes, records and prices every request in the gateway, where credentials can be redacted and dangerous tool calls cut off. A detailed comparison is in [ThinkWatch Lite vs CC Switch](/docs/lite/compare-cc-switch/).

## Does ThinkWatch Lite change client configuration files, and how are they restored?

ThinkWatch Lite changes a client's configuration when the client is connected on the Clients page, and only the settings that point it at the gateway. Before anything is written, the page shows the full diff and backs up the original file. **Restore…** on a client, or **Restore all…**, puts the original values back.

**Settings › Full uninstall** restores every connected client and should run before the app is removed: moving the app to the Trash, or deleting the AppImage or the portable folder, restores nothing.

## Where does ThinkWatch Lite store data, and what does it connect to?

Configuration, keys and request history stay on the computer: in `~/.thinkwatch` on macOS and Linux, in `%APPDATA%\ThinkWatch` for the Windows installer, and in the `data\` folder next to the program for the Windows portable copy. The gateway listens on `127.0.0.1` port 8788 by default.

Besides the upstreams it forwards requests to, ThinkWatch Lite connects to GitHub to check for updates and to refresh LiteLLM's public price list once a day. Signing in to a ChatGPT or Z.ai account goes through their sign-in pages, and a remote core is contacted only when one is configured.

## Does ThinkWatch Lite collect usage data?

No. ThinkWatch Lite contains no analytics or telemetry and sends nothing about its use to the project. The update check downloads a small manifest from the project's GitHub releases, which GitHub counts like any other download; the automatic check can be turned off with **Check for updates automatically** in Settings › About. A diagnostics bundle from Settings › About is saved on the computer with keys and addresses redacted, and leaves it only if it is shared.

## Why is ThinkWatch Lite not signed, and how can a download be verified?

ThinkWatch Lite is not signed by a registered Apple developer, and its Windows builds are not code-signed, so the first launch needs one extra step. The Homebrew cask removes macOS's quarantine attribute itself; after installing from the disk image, run `xattr -dr com.apple.quarantine "/Applications/ThinkWatch Lite.app"`, or choose **Open Anyway** in System Settings › Privacy & Security after the first refused launch. On Windows, choose **More info**, then **Run anyway** in the SmartScreen warning.

Each file on the [releases page](https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest) has a `.sha256` file beside it, checked with `shasum -a 256 -c` on macOS, `sha256sum -c` on Linux, or against the output of `Get-FileHash` on Windows. Updates installed by the app are verified against a key compiled into it, and the source code can be built locally.

## Does switching upstreams lose Codex sessions?

No. ThinkWatch Lite writes Codex's configuration once, with a model provider named `thinkwatch` that points at the gateway; upstreams then change in the gateway, so every session keeps the same provider and stays in Codex's list. Sessions from before Codex was connected are listed separately, and `codex resume <session ID> -c model_provider=thinkwatch` continues one through the gateway.

When a conversation moves to another upstream partway, reasoning sealed by the previous account cannot be read by the new one. When the new upstream rejects it, the gateway removes that sealed reasoning and sends the request once more, so the conversation continues with its messages and tool calls intact.

## Can ThinkWatch Lite run on a server?

Its gateway can. ThinkWatch Core runs as a systemd service on Linux on x86_64 or aarch64 with glibc 2.35 or later, such as Ubuntu 22.04 or Debian 12. The desktop app connects to it from **Settings › Connection** with **Add remote connection**, over a control channel encrypted and authenticated by a Noise handshake, and shows that server's traffic, cost and configuration. Clients on other machines are set up by hand with the server's gateway address and a gateway key. See [Server deployment](/docs/core/server-deployment/) and [Connecting to a remote core](/docs/lite/remote-core/).

## How is ThinkWatch Lite updated and uninstalled?

ThinkWatch Lite checks for a new version two minutes after it starts and once a day. Installed from the releases page, it updates itself with one press: it verifies the download and waits for the requests in progress to finish before restarting. A Homebrew installation updates through Homebrew instead, with `brew update && brew upgrade --cask thinkwatch-lite`.

To uninstall, run **Settings › Full uninstall** first, which restores connected clients, turns off launch at login and can delete the data directory; then move the app to the Trash on macOS, or delete the AppImage on Linux or the portable folder on Windows. The Windows installer can also be removed through the system, which does the same restoring first.

Related: [Features](/docs/lite/features/), [Install and update](/docs/lite/install/), [ThinkWatch Lite vs CC Switch](/docs/lite/compare-cc-switch/), [Connecting to a remote core](/docs/lite/remote-core/).
