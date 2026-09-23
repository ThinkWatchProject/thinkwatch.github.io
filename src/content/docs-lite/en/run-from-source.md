# Build from source

A development build runs against a checkout of the [ThinkWatch Lite repository](https://github.com/ThinkWatchProject/ThinkWatch-Lite). To install the released app instead, see [Install and update](/docs/lite/install).

## Run

```bash
pnpm install
pnpm tauri dev
```

`pnpm tauri dev` needs no network and downloads nothing: it looks for a `twcore` binary in a sibling `thinkwatch-core` checkout. A development build never updates itself.

## Build a bundle

```bash
pnpm tauri build
```

On macOS this produces a self-contained `.app`; on Windows, an NSIS installer. The `twcore` inside it is downloaded from a ThinkWatch Core release and checksum-verified rather than copied out of a sibling checkout, so which build was distributed is determined by that release and not by the state of a local working copy. Which release is decided by the tag that `Cargo.lock` resolved for `tw-api`, so the protocol mirror compiled into the app and the binary shipped beside it always come from one Core commit.

The macOS bundle is neither signed by a registered Apple developer nor notarized, and it is built for Apple Silicon only. The Windows installer is not code-signed.

## Platforms

Releases are built for macOS on Apple Silicon and for Windows on x64 and ARM64. There is no Linux build.

## Next steps

- [Architecture](/docs/lite/architecture): the structure of the app and how it communicates with Core.
- [Contributing](/docs/lite/contributing): the checks required before opening a pull request.
