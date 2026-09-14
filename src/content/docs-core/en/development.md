# Development and tests

## Running tests

```bash
cargo test --workspace     # unit and integration tests
scripts/smoke.sh           # from a clean state, exercise every path on the real binary
```

`scripts/smoke.sh` runs the real binary against a real socket and a real data plane. It detects issues that unit tests cannot structurally detect: file permissions, socket path length limits, unregistered endpoints, and config fields that are silently ignored. The project's first four real bugs were all in these areas.

The smoke script does not modify any user files. `HOME` and `THINKWATCH_HOME` both point to a temporary directory that is deleted on completion.

Tests that access the live network are marked `#[ignore]` and do not run in CI.

## Pull request checks

```bash
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
./scripts/smoke.sh
```

Warnings are treated as errors; relaxing this rule in CI would be equivalent to removing it. The toolchain tracks `stable`, so a stable release newer than your local one may report lints that cannot be reproduced locally. Run `rustup update stable` before investigating a CI failure.

Open pull requests against `dev`, not `main`:

```bash
gh pr create --base dev --head your-branch
```

`main` is the release branch; `dev` receives routine work. Commit messages follow Conventional Commits (`fix(scope): subject`) and are written in English. Explain *why* in the body, not only *what*.

## Mandatory rules

Both editions depend on these crates, so working for a single use case is not sufficient. A pull request that violates any of these rules will be returned for revision, regardless of the quality of the diff:

- **Never echo a real secret** in the UI, a diff, a log, an event, a diagnostic bundle, or a test fixture. Masking is applied before data leaves the process.
- **Never present an estimate as exact.** Cost has three states: measured, estimated, and no price. Treating the third as 0 makes a total incorrect without any indication.
- **Observation must never block forwarding.** Storage, pricing, and scanning run on bounded channels; when a channel is full, the observation is dropped rather than delaying the request.
- **Report, never auto-delete.** The scanner has no write path, and a test inspects the product code to verify this.
- **Any path that bypasses the main pipeline must re-apply its protections.** Replay nearly became a legitimate way to bypass redaction.

## The price list

`crates/tw-pricing` embeds a pinned snapshot that is not updated automatically. The update procedure is documented in `crates/tw-pricing/data/PROVENANCE.md`, and a CI test compares the snapshot row by row against the manually verified `data/verified.yaml`.
