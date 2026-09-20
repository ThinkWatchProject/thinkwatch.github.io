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

This produces a self-contained `.app`. The `twcore` inside it is downloaded from a ThinkWatch Core release and checksum-verified rather than copied out of a sibling checkout, so which build was distributed is determined by that release and not by the state of a local working copy. Which release is decided by the tag that `Cargo.lock` resolved for `tw-api`, so the protocol mirror compiled into the app and the binary shipped beside it always come from one Core commit.

The bundle is neither signed by a registered Apple developer nor notarized, and it is built for Apple Silicon only.

## Platforms

macOS comes first. Windows and Linux follow once the macOS version is complete: the menu bar is rendered as a macOS bitmap, client detection uses macOS paths, and the supervisor integrates with launchd.

## Next steps

- [Architecture](/docs/lite/architecture): the structure of the app and how it communicates with Core.
- [Contributing](/docs/lite/contributing): the checks required before opening a pull request.
