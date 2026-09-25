# Install and update

ThinkWatch Lite runs on macOS 12 or later on Apple silicon, on Windows 10 21H2 or later on x64 or ARM64, and on Linux on x86_64 or aarch64. The gateway, ThinkWatch Core, ships inside the app; nothing else needs to be installed.

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

## Linux

```bash
curl -fsSL https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest/download/install.sh | sh
```

The script downloads the AppImage for the machine's architecture, checks it against the sha256 published beside it, installs it as `~/Applications/ThinkWatch-Lite.AppImage` and starts it. Running it again installs the latest version over the old one.

To install by hand, download `ThinkWatch-Lite-<version>-x86_64.AppImage` or `ThinkWatch-Lite-<version>-aarch64.AppImage` from the [latest release](https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest), check it with `sha256sum -c`, allow it to run (`chmod +x`, or Properties › "Allow executing file as program" in the file manager) and open it. Keep it in a folder the user can write to, such as `~/Applications`, so that it can update itself. The first launch adds ThinkWatch Lite to the application menu, together with its icon and the `thinkwatch://` link handler. Only the AppImage is published; there are no deb, rpm, Flatpak or Snap packages.

It requires Ubuntu 22.04, Debian 12, Fedora 36 or a later distribution of the same generation. An AppImage mounts itself with FUSE and needs `fusermount3` from the fuse3 package (libfuse2 is not needed). Most desktops already include it; otherwise:

| Distribution | Command |
|---|---|
| Ubuntu, Debian | `sudo apt install fuse3` |
| Fedora | `sudo dnf install fuse3` |
| Arch Linux | `sudo pacman -S fuse3` |
| openSUSE | `sudo zypper install fuse3` |

The tray icon relies on AppIndicator. Ubuntu ships the GNOME extension for it; Fedora's stock GNOME does not, and the AppIndicator extension has to be added. Without a tray, closing the window leaves the gateway running, and launching ThinkWatch Lite again from the application menu brings the window back. Data is kept in `~/.thinkwatch`.

- **Blank window on NVIDIA under Wayland:** start the app with `WEBKIT_DISABLE_DMABUF_RENDERER=1`.
- **Other machines cannot reach the gateway:** firewalld, which Fedora enables by default, blocks the gateway port until it is opened; Settings shows a note about this when the gateway listens on the local network.
- **Uninstalling:** use Settings › Full uninstall first, which restores the clients the app configured and removes the autostart and application menu entries, then delete the AppImage.

## Updates

The app looks for a new version shortly after it starts and once a day after that, reading a small manifest and nothing else. It can be turned off in Settings.

When there is one, a small window says so, and what happens next depends on how the app was installed.

**Downloaded from the releases page on macOS:** one press on the install button does the rest. The app downloads the update, verifies it against a key compiled into itself, waits for the requests the gateway is serving to finish — up to three minutes — then replaces itself and restarts. A task in the middle of a response is not cut off to make room for the update.

**On Windows:** the same single press. The app downloads the new installer, verifies it against the key compiled into itself, waits for the requests in flight to finish in the same way, then runs the installer, and the new version starts once it is done. The app is installed for all users, so Windows asks for administrator permission at every update; declining leaves the current version running.

**On Linux:** the same single press, and no password is asked for. The app downloads the new AppImage, verifies it against the key compiled into itself, waits for the requests in flight to finish, then replaces its own file and restarts. The AppImage has to be in a folder the user can write to.

**Installed with Homebrew:** the window gives the command to copy, and the app never replaces itself. Homebrew records which version it put in `/Applications`; an app that overwrote it would be written back over by the next `brew upgrade`. The window only appears once the tap carries the new version, so the command always has something to install:

```bash
brew update && brew upgrade --cask thinkwatch-lite
```

`brew update` comes first because `brew upgrade` refreshes taps at most once a day on its own.

## Next steps

- [Overview](/docs/lite): what the app shows.
- [Build from source](/docs/lite/run-from-source): run a development build.
- [Connecting to a remote core](/docs/lite/remote-core): use a gateway that runs on a server.
- [Architecture](/docs/lite/architecture): the structure of the app and how it communicates with Core.
