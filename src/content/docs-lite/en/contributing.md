# Contributing

## Pull request target branch

```bash
gh pr create --base dev --head your-branch
```

`main` is the release branch; `dev` receives routine work. GitHub sets the base of a new pull request to the default branch, `main`, which is not the intended target. If a pull request was opened against `main`, select *Edit* next to its title and change the base; the commits and the discussion are preserved.

## Settled scope

The following decisions are settled and are not open to change through a pull request:

- **macOS, Windows and Linux, from one tag.** Every release tag produces five files for people to install, each with the gateway inside it and a sha256 beside it: an arm64 disk image for macOS, an x64 and an arm64 installer for Windows, and an x86_64 and an aarch64 AppImage for Linux.
- **macOS: Apple Silicon only, and not signed by Apple.** The macOS artifact is an arm64 `.app` in a disk image, signed with the project's own self-signed certificate. That certificate does not satisfy Gatekeeper; it exists so that every release has the same signer, which is what lets Homebrew upgrade the app without warning that the signer changed. A universal binary for Intel and a Developer ID signature are both ongoing costs nobody has taken on, so a pull request that adds the notarization step without the account behind it cannot be merged, and neither can one that makes the build fall back to whatever architecture the machine happens to be — that ships a file some users can download and cannot open.
- **Windows: not code-signed.** The installers carry no Authenticode signature, and no certificate will be bought, so SmartScreen warns when a downloaded installer is first run. Updates are verified against the key compiled into the app, the same as on macOS.
- **Linux: the AppImage only.** No deb, rpm, Flatpak or Snap. The sandboxed formats cannot start the bundled `twcore` or edit client configuration such as `~/.claude`, and the AppImage updates itself without a password. Builds target glibc 2.35 (Ubuntu 22.04) and WebKitGTK 4.1.

The gateway itself (routing, forwarding, cost accounting, redaction) is implemented in [ThinkWatch Core](https://github.com/ThinkWatchProject/ThinkWatch-Core). Changes to behaviour on the data path belong in that repository.

## Commit messages

Use Conventional Commits (`fix(scope): subject`), written in English. This is a public repository, and the commit history serves as documentation.

Explain *why* in the body, not only *what*; the diff already shows what changed.

## Checks before opening a pull request

```bash
pnpm typecheck
pnpm test
cargo fmt --manifest-path src-tauri/Cargo.toml --all --check
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
cargo test --manifest-path src-tauri/Cargo.toml
```

Warnings are treated as errors. The toolchain tracks `stable`, so a stable release newer than your local one may report lints that do not appear locally. Run `rustup update stable` before investigating a CI failure.

See also [What the UI must not do](/docs/lite/architecture#what-the-ui-must-not-do).
