# Architecture

ThinkWatch Lite is an interface to the gateway, not the gateway itself.

## Repository layout

```
src/              React 19 + Tailwind 4 frontend
src-tauri/        Tauri 2 shell: supervises core, renders the menu bar
```

- **`src-tauri/`** is the Tauri 2 shell. It supervises ThinkWatch Core and renders the menu bar on macOS, the notification-area icon and menu on Windows, and the tray icon and menu on Linux. On macOS, the supervisor integrates with launchd.
- **`src/`** is the frontend, written in React 19 and Tailwind 4.

## Lite and Core

The gateway is implemented in [ThinkWatch Core](/docs/core). This repository contains no routing, forwarding, or accounting logic. Lite communicates with Core over a unix socket on macOS and Linux, and over a loopback port on Windows; both carry a per-launch credential.

Routing, forwarding, cost accounting, and redaction are the responsibility of Core. Changes to behaviour on the data path belong in the [ThinkWatch Core repository](https://github.com/ThinkWatchProject/ThinkWatch-Core).

## What the UI must not do

The following rules are mandatory. A change that violates any of them will be returned for revision:

- **Never display a real secret** in the UI, a diff, a log, an event, or a diagnostic bundle. Masking is applied before data leaves the process.
- **Never present an estimate as exact.** Measured, estimated, and unpriced costs remain three separate figures. A fabricated precise figure is more harmful than an explicit "unknown".
- **Never delete a user's file or configuration without first showing the diff.** Every destructive action uses the app's own confirmation UI, never a browser `confirm`.
