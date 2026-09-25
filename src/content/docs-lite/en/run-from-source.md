# Build from source

A development build runs against a checkout of the [ThinkWatch Lite repository](https://github.com/ThinkWatchProject/ThinkWatch-Lite). To install the released app instead, see [Install and update](/docs/lite/install).

## Run

On Linux, install the WebKitGTK, AppIndicator and D-Bus development packages first. On Ubuntu or Debian:

```bash
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev \
  libssl-dev libayatana-appindicator3-dev librsvg2-dev dbus
```

```bash
pnpm install
bash src-tauri/scripts/fetch-core.sh
pnpm tauri dev
```

`fetch-core.sh` downloads the `twcore` release that `Cargo.lock` pins, checks its sha256 and places it in `src-tauri/resources/`. Every build needs that file, `pnpm tauri dev` included, because Tauri checks at compile time that the resources the app declares exist; the development build then runs that copy of `twcore`. A development build never updates itself.

## Build a bundle

```bash
pnpm tauri build
```

On macOS this produces a self-contained `.app`; on Windows, an NSIS installer; on Linux, an AppImage. The build runs `fetch-core.sh` itself, so the `twcore` inside the bundle is always a checksum-verified ThinkWatch Core release rather than a local build, and which build was distributed is determined by that release and not by the state of a working copy. The release is the tag that `Cargo.lock` resolved for `tw-api`, so the protocol mirror compiled into the app and the binary shipped beside it always come from one Core commit.

The macOS bundle is neither signed by a registered Apple developer nor notarized, and it is built for Apple silicon only. The Windows installer is not code-signed.

## Platforms

Releases are built for macOS on Apple silicon, for Windows on x64 and ARM64, and for Linux on x86_64 and aarch64.

## Next steps

- [Architecture](/docs/lite/architecture): the structure of the app and how it communicates with Core.
- [Contributing](/docs/lite/contributing): the checks required before opening a pull request.
