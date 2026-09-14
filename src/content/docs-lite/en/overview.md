# ThinkWatch Lite

ThinkWatch Lite is the desktop app for a local AI API gateway. It is a menu-bar app that supervises [ThinkWatch Core](/docs/core) and puts its config, its traffic, and what it costs you in front of you.

> ThinkWatch Lite is macOS first and is not distributed as a build. There is no signed `.app`, no installer, and no release page: you [run it from source](/docs/lite/run-from-source).

Point Claude Code, Codex, or anything else that speaks the Anthropic or OpenAI API at a local port, and Lite is the window onto what happens next.

## What a session cost, and how much to trust that number

Measured, estimated, and unpriced are three separate figures, and they are never added together. The snapshot date of the price list is stamped next to the total, because a number computed from a two-month-old price list doesn't mean what yesterday's number means.

## Where each request went, and why

For every request you see the rule it matched, by name, the policy group, and the full failover chain, with a reason and a duration on every hop.

## What went out with it

Lite shows secrets caught heading for an untrusted upstream, the redactions that were applied, and tool calls that looked dangerous. Request and response bodies are masked before they ever reach the screen.

## Edit the config two ways

Use a form to change a value, or a CodeMirror editor for anything structural. Both write through the same span-patching layer, so editing one field changes exactly one line and leaves your comments alone.

## 50 pixels in the menu bar

The menu bar shows spend today, or the remaining subscription quota for an account that has one. It is rendered as a bitmap, because the menu bar can't fit two lines of text.

## Where the gateway lives

The gateway itself lives in ThinkWatch Core. Lite holds no routing, forwarding, or accounting logic; it talks to Core over a unix socket. See [Architecture](/docs/lite/architecture).

## License

ThinkWatch Lite is MIT licensed.
