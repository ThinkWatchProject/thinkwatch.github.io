# Development and tests

## Running tests

```bash
cargo test --workspace     # unit and integration tests
scripts/smoke.sh           # from a clean state, exercise every path on the real binary
```

`scripts/smoke.sh` runs the real binary against a real socket and a real data plane, and reaches the control plane through `twcore call`: every control connection starts with a Noise handshake, so `curl` cannot talk to it. The script detects issues that unit tests structurally cannot: file permissions, socket path length limits, unregistered endpoints, and configuration fields that are silently ignored. The project's first four real bugs were all in these areas.

The smoke script does not modify any user files. `HOME` and `THINKWATCH_HOME` both point to a temporary directory that is deleted on completion.

Tests that access the live network are marked `#[ignore]` and do not run in CI.

## Pull request checks

```bash
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
./scripts/smoke.sh
```

Warnings are treated as errors; relaxing this rule in CI would be equivalent to removing it. The toolchain tracks `stable`, so a stable release newer than the local one may report lints that cannot be reproduced locally. Run `rustup update stable` before investigating a CI failure.

Pull requests target `main`, the only long-lived branch; a release is a tagged commit on it:

```bash
gh pr create --base main --head your-branch
```

Commit messages follow Conventional Commits (`fix(scope): subject`) and are written in English. The body explains *why*, not only *what*.

## Mandatory rules

ThinkWatch Lite and ThinkWatch Enterprise both depend on these crates, so working for a single use case is not sufficient. A pull request that violates any of these rules will be returned for revision, regardless of the quality of the diff:

- **Never echo a real secret** in the UI, a diff, a log, an event, a diagnostic bundle, or a test fixture. Masking is applied before data leaves the process.
- **Never present an estimate as exact.** Cost has three states: measured, estimated, and no price. Treating the third as 0 makes a total incorrect without any indication.
- **Observation must never block forwarding.** Storage, pricing, and scanning run on bounded channels; when a channel is full, the observation is dropped rather than delaying the request.
- **Any path that bypasses the main pipeline must re-apply its protections.** Replay nearly became a legitimate way to bypass redaction.
- **One door into the control plane.** Every transport (the unix socket, the Windows loopback port and the remote control port) hands its connections to the same handshake before HTTP. The control key never leaves through the control plane and cannot be changed through it.

## The configuration reference

The [Configuration reference](/docs/core/configuration) is `docs/config.md` (and `docs/config.zh-CN.md`) in the repository; this site publishes it from the latest release. The text is written by hand, except the field tables and the lists of built-in rules, which are generated from `crates/tw-config/tests/manual/schema.rs`. That file declares every section of `config.yaml` against its Rust type, and a test checks the declaration against the code: field names come from serde itself, declared defaults are parsed and compared with leaving the field out, and the examples in the manual are parsed as configuration.

After changing a configuration type, add or change its row in both languages and regenerate the tables:

```bash
UPDATE_CONFIG_DOCS=1 cargo test -p tw-config --test manual
```

## The price list

Prices come in two layers. The default price table is LiteLLM's public dataset: a pinned snapshot is embedded in `crates/tw-pricing`, the update procedure is documented in `crates/tw-pricing/data/PROVENANCE.md`, and a CI test compares the snapshot row by row against the manually verified `data/verified.yaml`. At runtime the control plane refreshes the table once a day, unless `pricing.auto_update: false`, and saves it as `model_prices.json` beside `config.yaml`; whichever copy is newer prices requests.

Price sheets live in `config.yaml` under `pricing.sheets`: a multiplier over the default table, plus per-model overrides with every field written out. An upstream selects a sheet with `pricing:`; without one, the default table applies.

## Releases

A release is a tag `vX.Y.Z` on `main`, after the version in the workspace `Cargo.toml` has been bumped. The release workflow builds `twcore` for macOS on Apple silicon, Windows on x64 and ARM64, and Linux on x86_64 and aarch64, checks each binary, and publishes them together with a `.sha256` file for each; if one target fails, nothing is published. The Linux archives carry the systemd unit and are what the server install script installs; the bare binaries are what ThinkWatch Lite bundles and what `twcore upgrade` downloads.
