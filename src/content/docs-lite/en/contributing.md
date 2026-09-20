# Contributing

## Pull request target branch

```bash
gh pr create --base dev --head your-branch
```

`main` is the release branch; `dev` receives routine work. GitHub sets the base of a new pull request to the default branch, `main`, which is not the intended target. If a pull request was opened against `main`, select *Edit* next to its title and change the base; the commits and the discussion are preserved.

## Settled scope

The following two decisions are settled and are not open to change through a pull request:

- **macOS first.** Windows and Linux will follow once the macOS version is complete; pull requests adding them will not be merged until then. The menu bar is rendered as a macOS bitmap, client detection uses macOS paths, and the supervisor integrates with launchd.
- **Apple Silicon only, and not signed by Apple.** Each release is one artifact: an arm64 `.app` in a disk image, with the gateway inside it, signed with the project's own self-signed certificate. That certificate does not satisfy Gatekeeper; it exists so that every release has the same signer, which is what lets Homebrew upgrade the app without warning that the signer changed. A universal binary for Intel and a Developer ID signature are both ongoing costs nobody has taken on, so a pull request that adds the notarization step without the account behind it cannot be merged, and neither can one that makes the build fall back to whatever architecture the machine happens to be — that ships a file some users can download and cannot open.

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
