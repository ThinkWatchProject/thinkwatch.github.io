# Run from source

ThinkWatch Lite is in development. It is macOS first, and there is no build to download: no signed `.app`, no installer, and no release page. You run it from source.

## Run it

From a checkout of the [ThinkWatch Lite repository](https://github.com/ThinkWatchProject/ThinkWatch-Lite):

```bash
pnpm install
pnpm tauri dev
```

## Platforms

Lite is built for macOS first. Windows and Linux come after the macOS version is done, so pull requests adding them won't be merged yet.

The macOS focus runs through the app: the menu bar is rendered as a macOS bitmap, the client-detection paths are macOS paths, and the supervisor talks to launchd.

## Why there is no installer

Not distributing a build is a deliberate scope decision, not a gap waiting to be filled. There is no signed `.app`, no installer, no release workflow, and no auto-update.

## Next

- [Architecture](/docs/lite/architecture): how the app is put together and how it talks to Core.
- [Contributing](/docs/lite/contributing): the checks to run before a pull request.
