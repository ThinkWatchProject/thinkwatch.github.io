# Fail over and balance load across relays and API keys

ThinkWatch Lite turns each relay key into an upstream and puts several upstreams behind a group. A routing rule sends requests to the group, whose strategy sets the order of its members; when one fails before the answer starts, the gateway passes the request to the next without the client seeing the error. A conversation stays with the upstream that answered it while its prompt cache is worth keeping.

## Before you start

- ThinkWatch Lite, [installed](/lite/#install), with a client connected on the Clients page. This guide follows version 2026.10.4.
- The base URL and API keys of each relay.

## Steps

1. On the Upstreams page, choose **New upstream**. Under **Connection**, enter a **Name**, the **Base URL** and one **API key**, choose **Check connection**, then **Next** until **Create**. Repeat for each key: an upstream holds one key, and failover and pauses work per upstream.
2. On the Routing page, choose **New group** under **Groups**. Enter a **Name**, choose a **Strategy**, tick the upstreams under **Members**, drag them into order and choose **Create**.
3. Under **Routes**, open the route, choose **Edit…** on the rule that should use the group (usually **All requests (catch-all)**), select the group in **Forward to** and choose **Save** in both dialogs.
4. **Dry run** checks the result without sending anything. On the Traffic page, a request's **Routing** tab lists the upstreams it tried under **Attempts**.

## Notes

| Strategy | Order of the members |
|---|---|
| **In order** | As listed. |
| **Round robin** | Requests are distributed across the members in turn. |
| **Lowest latency** | Median time to first byte over each upstream's last 32 requests; an upstream with fewer than 3 samples ranks after. |
| **Lowest cost** | Input price of the requested model in each upstream's price sheet; free upstreams first, unpriced ones last. |
| **Manual** | The preferred upstream first, then the rest as listed. |

A strategy only sets the order; every member remains available for failover.

- **When the next upstream is tried.** Before anything has reached the client, the gateway moves on when the upstream cannot be reached or its credential cannot be read; answers 5xx, 429, 401, 403, 402 or 404; answers 400 or 422 with an error about an insufficient balance, a used-up quota or an unavailable model; or, in a streamed answer, reports an error before the first content, such as an overload. The gateway waits for that first content for up to **Wait for the answer to start** in Settings › Failover, 15 seconds by default. Other 4xx responses, and the last member's 4xx other than 429, go back to the client unchanged.
- **Pauses.** A failing upstream is paused for as long as Settings › Failover sets: by default 60 seconds after 3 **Consecutive failures**, doubling up to 600; 30 minutes for **Insufficient balance**; until the reset time, or 60 minutes, for **Quota used up**; the wait a rate-limited upstream asks for, up to 60 minutes. A rule with a single upstream is never held back, and when every member is paused they are tried anyway.
- **Sessions and prompt cache.** Within a turn, while the client sends tool results back, requests keep the rule chosen at the start of the turn and the upstream that answered. Across turns, a conversation stays with the upstream that answered last if that answer read or wrote at least 1,024 cached tokens within the last five minutes; moving would rebuild the cache at full price. Otherwise, or when that upstream is paused, the strategy orders the members again, which is when **Round robin** moves on. The **Conversation** line on a request's **Routing** tab shows when a request stayed.
- **Same model name.** Every member is asked for the model the client sent, or the name a rule rewrote it to. A member whose model list lacks it is skipped; one without a list is tried, and its 404 moves the request on.
- **Falling back to another model.** Add a rule with the condition **Selected upstream** set to the backup upstream, **On match** set to **Continue matching**, and its model in **Change model to** under **Parameter rewrites**. Such a rule is evaluated for each upstream as it is tried, failover included. The changed model no longer hits the cached prompt, and the request is priced by the name sent.

Related: [Switch relays, upstreams or models without restarting Claude Code or Codex](/docs/lite/switch-upstreams-without-restart/), [Features](/docs/lite/features/#routing-and-failover), [Install and update](/docs/lite/install/).
