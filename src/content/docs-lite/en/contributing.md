# Contributing

## Pull request target branch

```bash
gh pr create --base dev --head your-branch
```

`main` is the release branch; `dev` receives routine work. GitHub sets the base of a new pull request to the default branch, `main`, which is not the intended target. If a pull request was opened against `main`, select *Edit* next to its title and change the base; the commits and the discussion are preserved.

## Settled scope

The following two decisions are settled and are not open to change through a pull request:

- **macOS first.** Windows and Linux will follow once the macOS version is complete; pull requests adding them will not be merged until then.
- **Not distributed as a build.** There is no signed `.app`, no installer, no release workflow, and no auto-update. Lite is run from source.

The gateway itself (routing, forwarding, cost accounting, redaction) is implemented in [ThinkWatch Core](https://github.com/ThinkWatchProject/ThinkWatch-Core). Changes to behaviour on the data path belong in that repository.

## Commit messages

Use Conventional Commits (`fix(scope): subject`), written in English. This is a public repository, and the commit history serves as documentation.

Explain *why* in the body, not only *what*; the diff already shows what changed.

## Checks before opening a pull request

```bash
pnpm typecheck
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
cargo test --manifest-path src-tauri/Cargo.toml
```

Warnings are treated as errors. The toolchain tracks `stable`, so a stable release newer than your local one may report lints that do not appear locally. Run `rustup update stable` before investigating a CI failure.

See also [What the UI must not do](/docs/lite/architecture#what-the-ui-must-not-do).
