# Architecture

ThinkWatch Lite is a window onto a gateway, not the gateway itself.

## Layout

```
src/              React 19 + Tailwind 4 frontend
src-tauri/        Tauri 2 shell: supervises core, renders the menu bar
```

- **`src-tauri/`** is the Tauri 2 shell. It supervises ThinkWatch Core and renders the menu bar. On macOS the supervisor talks to launchd.
- **`src/`** is the frontend, written with React 19 and Tailwind 4.

## Lite and Core

The gateway lives in [ThinkWatch Core](/docs/core). This repository holds no routing, forwarding, or accounting logic. Lite talks to Core over a unix socket.

Routing, forwarding, cost accounting, and redaction are all Core's job. If the behaviour you want to change is on the data path, the [ThinkWatch Core repository](https://github.com/ThinkWatchProject/ThinkWatch-Core) is the place for it.

## What the UI must not do

These rules are load-bearing, and a change that breaks one will be asked to change:

- **Never display a real secret**, in the UI, a diff, a log, an event, or a diagnostic bundle. Masking happens before it leaves the process.
- **Never present an estimate as exact.** Measured, estimated, and unpriced stay three separate figures. An invented precise number is more harmful than an honest "don't know".
- **Never delete a user's file or config without showing the diff first.** Every destructive action goes through the app's own confirmation UI, never a browser `confirm`.
