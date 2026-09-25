# Quick start with twcore

`twcore` is the gateway binary built from ThinkWatch Core. ThinkWatch Lite includes it, so a desktop with the app installed already runs one; this page covers running `twcore` on its own. To run it as a service on a Linux server and manage it from ThinkWatch Lite, follow [Server deployment](/docs/core/server-deployment) instead.

## Get the binary

Every [release](https://github.com/ThinkWatchProject/ThinkWatch-Core/releases/latest) carries prebuilt binaries, each with a `.sha256` file:

| Platform | File |
| --- | --- |
| macOS, Apple silicon | `twcore-aarch64-apple-darwin` |
| Windows, x64 | `twcore-x86_64-pc-windows-msvc.exe` |
| Windows, ARM64 | `twcore-aarch64-pc-windows-msvc.exe` |
| Linux, x86_64 | `twcore-x86_64-unknown-linux-gnu`, and a `.tar.gz` that adds the systemd unit |
| Linux, aarch64 | `twcore-aarch64-unknown-linux-gnu`, and a `.tar.gz` that adds the systemd unit |

Download the file for the platform, check it against its `.sha256` file, and install it on the `PATH` as `twcore`. The Linux builds need glibc 2.35 or newer (Ubuntu 22.04, Debian 12 or later).

On a Linux server, the install script does this in one step, and also creates a service user and the systemd unit:

```sh
curl -fsSL https://raw.githubusercontent.com/ThinkWatchProject/ThinkWatch-Core/main/scripts/install.sh | sudo sh
```

To build from source instead, with a stable Rust toolchain (1.85 or newer):

```sh
git clone https://github.com/ThinkWatchProject/ThinkWatch-Core.git
cd ThinkWatch-Core
cargo build --release -p twcore     # writes target/release/twcore
```

In a checkout, `cargo run -p twcore -- <command>` runs any of the commands below without installing anything.

## Write, check, and serve a configuration

```sh
twcore init     # write an initial config.yaml with a gateway key and the control key
twcore check    # validate the configuration without starting anything
twcore serve    # start the gateway and the control plane
```

The configuration is `~/.thinkwatch/config.yaml`, or `%APPDATA%\ThinkWatch\config.yaml` on Windows; `THINKWATCH_HOME` moves the directory, and `--config <path>` names the file for a single command. `twcore init` prints the gateway key it generated; `twcore serve` writes a starting configuration of its own when there is none.

The starting configuration has no upstream: the control plane runs, and requests are answered with an error saying that no upstream is configured. Adding one makes the gateway forward:

```yaml
providers:
  - name: anthropic
    base_url: https://api.anthropic.com
    key: ${ANTHROPIC_API_KEY}
```

`${NAME}` reads an environment variable of the `twcore` process. A running core reloads the file within a second of a save; a version that does not validate is refused, and the previous configuration keeps serving. Every field is described in the [Configuration reference](/docs/core/configuration).

## Connect a client

The gateway listens on `127.0.0.1:8788` by default (`listen.gateway` in the configuration). A client needs two settings: the gateway's address as its base URL, and a gateway key from `clients` as its API key.

- **Anthropic-format clients** use `http://127.0.0.1:8788`. For Claude Code, set `ANTHROPIC_BASE_URL=http://127.0.0.1:8788` and `ANTHROPIC_AUTH_TOKEN` to the gateway key.
- **OpenAI-format clients** use `http://127.0.0.1:8788/v1`, with the gateway key as the API key.

ThinkWatch Lite points Claude Code, Codex and other supported clients at the gateway from its Clients page; see the [ThinkWatch Lite documentation](/docs/lite). The fields of a gateway key, such as the models it may use and the route it takes, are described under [`clients`](/docs/core/configuration#clients) in the configuration reference.

Core then routes each request by the configured rules, fails over between upstreams, prices usage, redacts credentials in outbound requests and inspects the tool calls in responses. Each capability is described in the [Overview](/docs/core#what-it-does).
