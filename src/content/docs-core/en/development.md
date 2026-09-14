# Development and tests

## Run the tests

```bash
cargo test --workspace     # unit and integration tests
scripts/smoke.sh           # from a clean slate, exercise every path on the real binary
```

`scripts/smoke.sh` runs the real binary against a real socket and a real data plane. It catches what unit tests structurally cannot: file permissions, socket path limits, an endpoint that simply isn't registered, a config field silently swallowed. This project's first four real bugs were all in those seams.

The smoke script touches nothing of yours. `HOME` and `THINKWATCH_HOME` both point at a temporary directory that is deleted when it finishes.

Tests that hit the live network are marked `#[ignore]` and don't run in CI.

## Before you open a pull request

```bash
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
./scripts/smoke.sh
```

Warnings are errors, and relaxing that on CI is the same as removing it. The toolchain is `stable`, so a newer stable than your local one can surface lints you cannot reproduce; run `rustup update stable` before blaming CI.

Open pull requests against `dev`, not `main`:

```bash
gh pr create --base dev --head your-branch
```

`main` is the release line; `dev` is where routine work lands. Commit messages follow Conventional Commits (`fix(scope): subject`) and are written in English. Say *why* in the body, not just *what*.

## Rules that are load-bearing

Both editions depend on these crates, so "it works for my case" is not the bar. A pull request that breaks one of these rules will be asked to change, regardless of how clean the diff is:

- **Never echo a real secret**: not in the UI, a diff, a log, an event, a diagnostic bundle, or a test fixture. Masking happens before it leaves the process.
- **Never present an estimate as exact.** Cost has three states: measured, estimated, and no price at all. Treating the third as 0 makes a total quietly wrong with nothing to signal it.
- **Observation must never block forwarding.** Storage, pricing, and scanning run off bounded channels; a full channel drops the observation rather than delaying the request.
- **Report, never auto-delete.** The scanner has no write path, and there is a test that reads the product code to prove it.
- **Anything that bypasses the main pipeline re-applies its protections.** Replay came close to being a legitimate way around redaction.

## The price list

`crates/tw-pricing` embeds a pinned snapshot that is not auto-updated. Update steps are in `crates/tw-pricing/data/PROVENANCE.md`, and a CI test compares the snapshot against the hand-checked `data/verified.yaml` row by row.
