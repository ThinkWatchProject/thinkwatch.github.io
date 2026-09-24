# Install and update

ThinkWatch Lite runs on macOS 12 or later on Apple Silicon, and on Windows 10 21H2 or later on x64 or ARM64. The gateway, ThinkWatch Core, ships inside the app; nothing else needs to be installed.

## macOS: Homebrew

```bash
brew install --cask thinkwatchproject/tap/thinkwatch-lite
```

The cask lives in [thinkwatchproject/tap](https://github.com/ThinkWatchProject/homebrew-tap). Beyond copying the app out of the disk image, it does one more thing: it removes the quarantine attribute.

## macOS: disk image

Download `ThinkWatch-Lite-<version>-arm64.dmg` from the [latest release](https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest), check it against the sha256 published beside it, open it, and drag ThinkWatch Lite into Applications.

The app is **not signed by a registered Apple developer**, so macOS quarantines a downloaded copy and refuses to open it until the attribute is removed:

```bash
xattr -dr com.apple.quarantine "/Applications/ThinkWatch Lite.app"
```

Without a terminal, the same takes one click after the first refused launch: System Settings › Privacy & Security › Open Anyway.

## Windows

Download the installer for the machine's architecture from the [latest release](https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest): `ThinkWatch-Lite-<version>-x64-setup.exe` for most PCs, or `ThinkWatch-Lite-<version>-arm64-setup.exe` for a PC with an ARM processor. The [Lite page](/lite#install) links to both installers of the latest release. Check the download against the sha256 published beside it:

```powershell
Get-FileHash .\ThinkWatch-Lite-<version>-x64-setup.exe
```

The installer sets the app up for all users in Program Files, so Windows asks for administrator permission. It requires Windows 10 21H2 or later; WebView2, which Windows 11 already includes, is downloaded during installation if it is missing.

The installer is **not code-signed**, and no certificate will be bought. Running a downloaded copy brings up SmartScreen's full-screen warning, "Windows protected your PC". Choose **More info**, then **Run anyway**.

Once installed, the app's icon sits in the notification area: a left click opens the main window, a right click opens the menu. Data is kept in `%APPDATA%\ThinkWatch`.

## Updates

The app looks for a new version shortly after it starts and once a day after that, reading a small manifest and nothing else. It can be turned off in Settings.

When there is one, a small window says so, and what happens next depends on how the app was installed.

**Downloaded from the releases page on macOS:** one press on the install button does the rest. The app downloads the update, verifies it against a key compiled into itself, waits for the requests the gateway is serving to finish — up to three minutes — then replaces itself and restarts. A task in the middle of a response is not cut off to make room for the update.

**On Windows:** the same single press. The app downloads the new installer, verifies it against the key compiled into itself, waits for the requests in flight to finish in the same way, then runs the installer, and the new version starts once it is done. The app is installed for all users, so Windows asks for administrator permission at every update; declining leaves the current version running.

**Installed with Homebrew:** the window gives the command to copy, and the app never replaces itself. Homebrew records which version it put in `/Applications`; an app that overwrote it would be written back over by the next `brew upgrade`. The window only appears once the tap carries the new version, so the command always has something to install:

```bash
brew update && brew upgrade --cask thinkwatch-lite
```

`brew update` comes first because `brew upgrade` refreshes taps at most once a day on its own.

## Next steps

- [Overview](/docs/lite): what the app shows.
- [Build from source](/docs/lite/run-from-source): run a development build.
- [Architecture](/docs/lite/architecture): the structure of the app and how it communicates with Core.
