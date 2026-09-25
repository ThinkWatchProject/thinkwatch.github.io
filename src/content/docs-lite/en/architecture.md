# Architecture

ThinkWatch Lite is an interface to the gateway, not the gateway itself.

## Repository layout

```
src/              React 19 + Tailwind 4 frontend
src-tauri/        Tauri 2 shell: supervises core, renders the menu bar and the tray
src-tauri/crates/ client setup (tw-adopt) and the configuration scan (tw-scan)
```

- **`src-tauri/`** is the Tauri 2 shell. It starts ThinkWatch Core and supervises it: a core that exits is restarted, and after repeated failed starts it runs in a safe mode in which only its control plane is up, so that configuration, history and rollback stay available. The shell renders the menu bar on macOS, the notification-area icon and menu on Windows, and the tray icon and menu on Linux, and it delivers system notifications. Launch at login starts the app, which then starts core; core is not registered on its own.
- **`src-tauri/crates/`** holds `tw-adopt`, which points clients at the gateway and restores them, and `tw-scan`, which scans client configuration for the MCP page. Both act on the computer the app runs on, also while the app is connected to a core on a server.
- **`src/`** is the frontend, written in React 19 and Tailwind 4.

## Lite and Core

The gateway is implemented in [ThinkWatch Core](/docs/core). This repository contains no routing, forwarding, or accounting logic.

Routing, forwarding, cost accounting, and redaction are the responsibility of Core. Changes to behaviour on the data path belong in the [ThinkWatch Core repository](https://github.com/ThinkWatchProject/ThinkWatch-Core).

## Control channel

Lite reads and changes everything through Core's control API. How it reaches Core depends on where Core runs:

| Where Core runs | Channel |
|---|---|
| The same computer, on macOS or Linux | A unix socket in the data directory |
| The same computer, on Windows | A loopback TCP port |
| A server | The server's remote control port, over TCP |

Every channel carries the same HTTP API inside a Noise handshake, `Noise_NNpsk0_25519_ChaChaPoly_BLAKE2s`, whose pre-shared key is `listen.control.key` in Core's `config.yaml`. The handshake encrypts and authenticates the connection in both directions; a program that can reach the socket or the port but does not hold the key cannot control Core. There is no TLS and no certificate. Versions are exchanged in the handshake, and a connection between an app and a core whose versions do not match is refused.

For the core it starts, the app reads the key from the local `config.yaml`. For a core on a server, the key is entered once when the connection is added and kept in a file in the app's data directory that only the current user can read. See [Connecting to a remote core](/docs/lite/remote-core).

## What the UI must not do

The following rules are mandatory. A change that violates any of them will be returned for revision:

- **Never display a real secret** in the UI, a diff, a log, an event, or a diagnostic bundle. Masking is applied before data leaves the process.
- **Never present an estimate as exact.** Measured, estimated, and unpriced costs remain three separate figures. A fabricated precise figure is more harmful than an explicit "unknown".
- **Never delete a user's file or configuration without first showing the diff.** Every destructive action uses the app's own confirmation UI, never a browser `confirm`.
