# Switch relays, upstreams or models without restarting Claude Code or Codex

ThinkWatch Lite points Claude Code and Codex at a gateway on the local machine once; from then on, the gateway decides which upstream and model each request goes to. Switching a relay, an upstream or a model is a change to a routing rule or to a manually selected group in the app. The gateway applies it to the requests that follow without restarting, and neither client is restarted or has its configuration file edited again.

## Before you start

- ThinkWatch Lite, [installed](/lite/#install). This guide follows version 2026.10.4.
- Claude Code or Codex connected with **Connect…** on the Clients page. Claude Code uses the new configuration from its next request; Codex needs its terminal reopened once. This is the last change on the client side.
- At least two upstreams on the Upstreams page, such as two relays, or one upstream that offers several models.

## Steps

With a routing rule:

1. On the Routing page, open the route that the client's key follows under **Routes**. When there are no other routes, it is the one marked **Default**.
2. In its rule list, choose **Edit…** on the rule to change, usually the one shown as **All requests (catch-all)**.
3. Under **On match**, keep **Forward** and choose the new upstream or group in **Forward to**.
4. To change the model as well, open **Parameter rewrites** and enter a model name in **Change model to**.
5. Choose **Save** in the rule dialog, then **Save** in the route dialog.

With a manually selected group:

1. On the Routing page, choose **New group** under **Groups**, enter a **Name**, set **Strategy** to **Manual**, tick the upstreams under **Members**, choose **Set as preferred** on one of them, then choose **Create**.
2. Select the group in a rule's **Forward to**, as in the steps above.
3. To switch later, open the group's menu on the Routing page and choose a member under **Preferred upstream**. The same switch is in the menu bar menu on macOS and in the tray menu on Windows and Linux: each manually selected group is listed with its current upstream, and its submenu lists the members.

## Notes

- **Why no restart is needed.** A connected client holds only the gateway's address and a key of its own: `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN` in `~/.claude/settings.json` for Claude Code, a provider named `thinkwatch` in `~/.codex/config.toml` for Codex. Upstream addresses, keys and models live in the gateway's configuration, which the gateway reloads in place. A request already in progress finishes on the configuration it started with.
- **Codex sessions stay in one list.** Codex lists only the sessions of its current provider. While connected, it always uses the `thinkwatch` provider, so every session started through the gateway stays in the same list, whichever upstream answers it. Sessions from before connecting remain under their original provider and are listed separately; `codex resume <session ID> -c model_provider=thinkwatch` continues one of them through the gateway.
- **Conversations in progress.** Inside a group, a conversation stays with the upstream that answered it until the current turn ends, and across turns while that upstream's prompt cache is warm: an answer within the last five minutes that read or wrote at least 1,024 cached tokens. After the preferred upstream of a manual group changes, new conversations move at once, while one in progress may stay until its cache cools or that upstream fails. A rule pointed at another upstream or group applies to every conversation from the next request.
- **Model names.** An upstream whose model list lacks the requested model is skipped. When the new upstream uses other model names, such as GLM in place of Claude, set **Change model to** on the rule. A changed model no longer hits the cached prompt, and the request is priced by the name sent.
- **One client only.** Each connected client has its own key. To switch one client and leave the others as they are, create a route with **New route** and add that client's key under **Keys using this route**.

Related: [Features](/docs/lite/features/#routing-and-failover), [Fail over and balance load across relays and API keys](/docs/lite/failover-and-load-balancing/), [Install and update](/docs/lite/install/).
