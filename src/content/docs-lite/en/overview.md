# ThinkWatch Lite

ThinkWatch Lite is the desktop application for a local AI API gateway. It is a menu-bar app that supervises [ThinkWatch Core](/docs/core) and displays its configuration, traffic, and cost.

> ThinkWatch Lite is in development. macOS is supported first, and other platforms will follow once the macOS version is complete. Lite is not distributed as a build: there is no signed `.app`, no installer, and no release page. It is [built from source](/docs/lite/run-from-source).

Point Claude Code, Codex, or any other client of the Anthropic or OpenAI API at a local port, and Lite displays how each request is handled.

## Session cost and its reliability

Measured, estimated, and unpriced costs are reported as three separate figures and are never summed. The snapshot date of the price list is shown next to the total, because figures computed from price lists of different dates are not directly comparable.

## Request routing

For every request, Lite shows the matched rule by name, the policy group, and the full failover chain, with the reason and duration of every hop.

## Outbound content

Lite flags secrets bound for an untrusted upstream, the redactions that were applied, and tool calls that appear dangerous. Request and response bodies are masked before they are displayed.

## Configuration editing

A form is provided for changing individual values, and a CodeMirror editor for structural changes. Both write through the same span-patching layer, so editing a field modifies exactly one line and preserves existing comments.

## Menu bar

Lite occupies 50 pixels of the menu bar, where it shows today's spend, or the remaining subscription quota for accounts that have one. The item is rendered as a bitmap because the menu bar cannot display two lines of text.

## Relationship to ThinkWatch Core

The gateway is implemented in ThinkWatch Core. Lite contains no routing, forwarding, or accounting logic and communicates with Core over a unix socket. See [Architecture](/docs/lite/architecture).

## License

ThinkWatch Lite is licensed under the MIT License.
