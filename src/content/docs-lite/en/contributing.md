# Contributing

## Open pull requests against `dev`

```bash
gh pr create --base dev --head your-branch
```

`main` is the release line; `dev` is where routine work lands. GitHub pre-fills a new pull request's base with the default branch, `main`, so the default is not the one you want. If you already opened against `main`, click *Edit* next to the pull request title and change the base; the commits and the discussion carry over.

## Settled scope

Two decisions are settled and not up for a pull request:

- **macOS first.** Windows and Linux come after the macOS version is done, so pull requests adding them won't be merged yet.
- **Not distributed as a build.** No signed `.app`, no installer, no release workflow, no auto-update. Run it from source.

The gateway itself (routing, forwarding, cost accounting, redaction) lives in [ThinkWatch Core](https://github.com/ThinkWatchProject/ThinkWatch-Core). If the behaviour you want to change is on the data path, that is the repository for it.

## Commit messages

Use Conventional Commits (`fix(scope): subject`), in English: this is a public repository and the history is documentation.

Say *why* in the body, not just *what*; the diff already shows what changed.

## Before you open the pull request

```bash
pnpm typecheck
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
cargo test --manifest-path src-tauri/Cargo.toml
```

Warnings are errors. The toolchain is `stable`, so a newer stable than your local one can surface lints you cannot see; run `rustup update stable` before blaming CI.

Also read [what the UI must not do](/docs/lite/architecture#what-the-ui-must-not-do).
