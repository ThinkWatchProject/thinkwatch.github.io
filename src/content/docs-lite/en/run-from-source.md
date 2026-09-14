# Build from source

ThinkWatch Lite is in development. macOS is supported first, and no build is available for download: there is no signed `.app`, no installer, and no release page. Lite is run from source.

## Build and run

Run the following commands in a checkout of the [ThinkWatch Lite repository](https://github.com/ThinkWatchProject/ThinkWatch-Lite):

```bash
pnpm install
pnpm tauri dev
```

## Platforms

macOS is supported first. Windows and Linux will follow once the macOS version is complete; pull requests adding them will not be merged until then.

The macOS focus applies throughout the app: the menu bar is rendered as a macOS bitmap, client detection uses macOS paths, and the supervisor integrates with launchd.

## No installer

Not distributing a build is a deliberate scope decision. There is no signed `.app`, no installer, no release workflow, and no auto-update.

## Next steps

- [Architecture](/docs/lite/architecture): the structure of the app and how it communicates with Core.
- [Contributing](/docs/lite/contributing): the checks required before opening a pull request.
