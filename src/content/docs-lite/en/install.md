# Install and update

ThinkWatch Lite runs on macOS 12 or later on Apple silicon, on Windows 10 21H2 or later on x64 or ARM64, and on Linux on x86_64 or aarch64. The gateway, ThinkWatch Core, ships inside the app; nothing else needs to be installed.

## macOS: Homebrew

```bash
brew install --cask thinkwatchproject/tap/thinkwatch-lite
```

The cask lives in [thinkwatchproject/tap](https://github.com/ThinkWatchProject/homebrew-tap). Beyond copying the app out of the disk image, it does one more thing: it removes the quarantine attribute.

## macOS: disk image

Download `ThinkWatch-Lite-<version>-darwin-arm64.dmg` from the [latest release](https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest), check it against the sha256 published beside it, open it, and drag ThinkWatch Lite into Applications.

The app is **not signed by a registered Apple developer**, so macOS quarantines a downloaded copy and refuses to open it until the attribute is removed:

```bash
xattr -dr com.apple.quarantine "/Applications/ThinkWatch Lite.app"
```

Without a terminal, the same takes one click after the first refused launch: System Settings › Privacy & Security › Open Anyway.

## Windows: installer

Download the installer for the machine's architecture from the [latest release](https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest): `ThinkWatch-Lite-<version>-windows-x64-setup.exe` for most PCs, or `ThinkWatch-Lite-<version>-windows-arm64-setup.exe` for a PC with an ARM processor. The [Lite page](/lite#install) links to both installers of the latest release. Check the download against the sha256 published beside it:

```powershell
Get-FileHash .\ThinkWatch-Lite-<version>-windows-x64-setup.exe
```

The installer sets the app up for all users in Program Files, so Windows asks for administrator permission. It requires Windows 10 21H2 or later; WebView2, which Windows 11 already includes, is downloaded during installation if it is missing.

The installer is **not code-signed**, and no certificate will be bought. Running a downloaded copy brings up SmartScreen's full-screen warning, "Windows protected your PC". Choose **More info**, then **Run anyway**.

Once installed, the app's icon sits in the notification area: a left click opens the main window, a right click opens the menu. Data is kept in `%APPDATA%\ThinkWatch`.

Uninstalling through the system first closes ThinkWatch Lite, restores the connected clients and removes the `thinkwatch://` link, launch-at-login entry and notification registration that point to it. With "Also delete data (configuration, API keys, request history)" ticked it deletes `%APPDATA%\ThinkWatch` as well, except when a client could not be restored, in which case the data directory, with that client's backup, is kept. The uninstaller runs as an administrator: when a standard account uninstalls with an administrator's password, it restores the administrator's clients and deletes the administrator's data instead, so use Settings › Full uninstall first in that case.

## Windows: portable

The portable copy runs from the folder it is extracted to, with no installation and no administrator rights. Download `ThinkWatch-Lite-<version>-windows-x64-portable.zip` (or `ThinkWatch-Lite-<version>-windows-arm64-portable.zip` for a PC with an ARM processor) from the [latest release](https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest), check it against the sha256 published beside it, extract it to any folder the user can write to and run `ThinkWatch Lite.exe`. The zip holds two files: `ThinkWatch Lite.exe` and the gateway, `twcore.exe`.

Configuration, keys and request history stay in the `data\` folder next to the program, apart from the installed copy's `%APPDATA%\ThinkWatch`, so the two keep separate settings. In a folder that cannot be written to, the app says so and quits.

The portable copy is not code-signed either, and SmartScreen is handled the same way as for the installer. It does not bring WebView2, which Windows 11 already includes; when it is missing, the app says so and can open Microsoft's download page.

Only one of the installed and portable copies runs at a time. Opening one while the other is running offers to stop the running one: it exits once the requests in flight have finished, and the one just opened starts. `thinkwatch://` links and launch at login always point to the copy that is running, and the launch-at-login switch is shared by both.

To remove it, use Settings › Full uninstall first, which restores the connected clients and removes launch at login and the other registry entries, then delete the whole folder.

## Linux

```bash
curl -fsSL https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest/download/install.sh | sh
```

The script downloads the AppImage for the machine's architecture, checks it against the sha256 published beside it, installs it as `~/Applications/ThinkWatch-Lite.AppImage` and starts it. Running it again installs the latest version over the old one.

To install by hand, download `ThinkWatch-Lite-<version>-linux-x86_64.AppImage` or `ThinkWatch-Lite-<version>-linux-aarch64.AppImage` from the [latest release](https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest), check it with `sha256sum -c`, allow it to run (`chmod +x`, or Properties › "Allow executing file as program" in the file manager) and open it. Keep it in a folder the user can write to, such as `~/Applications`, so that it can update itself. The first launch adds ThinkWatch Lite to the application menu, together with its icon and the `thinkwatch://` link handler. Only the AppImage is published; there are no deb, rpm, Flatpak or Snap packages.

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

The app looks for a new version two minutes after it starts and once a day after that, reading a small manifest and nothing else. The automatic check can be turned off in Settings › About.

When the automatic check finds a new version, the app posts a system notification, unless **Notices** in Settings › General is set to **In app only** or **Off**. The notification, the **Install Version** item in the menu bar or tray menu, and **Update to** in Settings › About open the update window; **Check for updates**, in the same menu or in Settings › About, opens it at once when there is a new version. What happens next depends on how the app was installed.

**Downloaded from the releases page on macOS:** one press on the install button does the rest. The app downloads the update, verifies it against a key compiled into itself, waits for the requests the gateway is serving to finish — up to three minutes — then replaces itself and restarts. A task in the middle of a response is not cut off to make room for the update.

**With the Windows installer:** the same single press. The app downloads the new installer, verifies it against the key compiled into itself, waits for the requests in flight to finish in the same way, then runs the installer, and the new version starts once it is done. The app is installed for all users, so Windows asks for administrator permission at every update; declining leaves the current version running.

**The Windows portable copy:** the same single press, and no administrator permission is needed. The app downloads the new zip, verifies it against the key compiled into itself, waits for the requests in flight to finish, then replaces the two program files in its folder and restarts. If replacing them fails, the old files are put back and the current version keeps running.

**On Linux:** the same single press, and no password is asked for. The app downloads the new AppImage, verifies it against the key compiled into itself, waits for the requests in flight to finish, then replaces its own file and restarts. The AppImage has to be in a folder the user can write to.

**Installed with Homebrew:** the window gives the command to copy, and the app never replaces itself. Homebrew records which version it put in `/Applications`; an app that overwrote it would be written back over by the next `brew upgrade`. A Homebrew installation is offered a new version only once the tap carries it, so the command always has something to install:

```bash
brew update && brew upgrade --cask thinkwatch-lite
```

`brew update` comes first because `brew upgrade` refreshes taps at most once a day on its own.

## Next steps

- [Overview](/docs/lite): what the app shows.
- [Build from source](/docs/lite/run-from-source): run a development build.
- [Connecting to a remote core](/docs/lite/remote-core): use a gateway that runs on a server.
- [Architecture](/docs/lite/architecture): the structure of the app and how it communicates with Core.
