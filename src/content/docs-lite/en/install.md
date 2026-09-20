# Install and update

ThinkWatch Lite runs on macOS 12 or later on Apple Silicon. The gateway, ThinkWatch Core, ships inside the app; nothing else needs to be installed.

## Homebrew

```bash
brew install --cask thinkwatchproject/tap/thinkwatch-lite
```

The cask lives in [thinkwatchproject/tap](https://github.com/ThinkWatchProject/homebrew-tap). Beyond copying the app out of the disk image, it does one more thing: it removes the quarantine attribute.

## Disk image

Download `ThinkWatch-Lite-<version>-arm64.dmg` from the [releases page](https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases), check it against the sha256 published beside it, open it, and drag ThinkWatch Lite into Applications.

The app is **not signed by a registered Apple developer**, so macOS quarantines a downloaded copy and refuses to open it until the attribute is removed:

```bash
xattr -dr com.apple.quarantine "/Applications/ThinkWatch Lite.app"
```

Without a terminal, the same takes one click after the first refused launch: System Settings › Privacy & Security › Open Anyway.

## Updates

The app looks for a new version shortly after it starts and once a day after that, reading a small manifest and nothing else. It can be turned off in Settings.

When there is one, a small window says so, and what happens next depends on how the app was installed.

**Downloaded from the releases page:** one press on the install button does the rest. The app downloads the update, verifies it against a key compiled into itself, waits for the requests the gateway is serving to finish — up to three minutes — then replaces itself and restarts. A task in the middle of a response is not cut off to make room for the update.

**Installed with Homebrew:** the window gives the command to copy, and the app never replaces itself. Homebrew records which version it put in `/Applications`; an app that overwrote it would be written back over by the next `brew upgrade`. The window only appears once the tap carries the new version, so the command always has something to install:

```bash
brew update && brew upgrade --cask thinkwatch-lite
```

`brew update` comes first because `brew upgrade` refreshes taps at most once a day on its own.

## Next steps

- [Overview](/docs/lite): what the app shows.
- [Build from source](/docs/lite/run-from-source): run a development build.
- [Architecture](/docs/lite/architecture): the structure of the app and how it communicates with Core.
