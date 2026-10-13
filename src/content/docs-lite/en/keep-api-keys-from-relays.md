# Keep the API keys in requests away from relays, and block dangerous tool calls

A relay receives every request in full, including keys that end up in the conversation, such as a pasted `.env` file or a configuration file a tool has read. ThinkWatch Lite's **Secrets & privacy** protection finds such credentials before a request leaves the machine and sends placeholders such as `<<TW_SECRET_1>>` in their place, restoring the real values where the answer repeats them. **Dangerous commands** checks the tool calls that come back and cuts off those that download and run code or send credentials out before the client can run them.

## Before you start

- ThinkWatch Lite, [installed](/lite/#install), with clients connected to the gateway. This guide follows version 2026.10.19.
- Both protections start in **Monitor**: they record what they find, raise a notification and change nothing. **On** handles each match by its rule's action, and **Off** checks nothing.

## Steps

1. Open the Security page. The **Log** tab lists every match with its request; since both states use the same rules, a few days in **Monitor** show what **On** would change.
2. Open **Secrets & privacy**. Each rule has its own switch and action in the list: **Replace with placeholder** or **Record only**. Built-in rules are grouped by category, and the search box finds a rule by name or pattern. **Test…** shows a pasted text **After processing**.
3. For a key format the built-in rules do not cover, choose **New rule** and enter a **Name**. Under **Match by**, **Contains** looks for the text exactly as written, so `.` and `*` have no special meaning, and **Regex** takes a regular expression; **Match case**, off by default, tells capital letters from small ones. Enter the text or the pattern and a **Placeholder name** such as `INTERNAL` (giving `<<TW_INTERNAL_1>>`), keep the action **Replace with placeholder**, then choose **Create**.
4. Set the state at the top of the tab to **On**.
5. Open **Dangerous commands**. Each built-in rule is set to **Cut off** or **Record only**, which can be changed in the list. Set the state to **On**.
6. The log's **Action** column then shows **Replaced** or **Cut off**, and a cut-off call also raises a system notification. An entry opens in place to show where the value was found and the placeholder it was replaced with, or the tool call that was cut off and the notice the client received.

## Notes

| State | Secrets & privacy | Dangerous commands |
|---|---|---|
| **Monitor** (default) | Matches are recorded and notified; the request is sent unchanged. | Matching calls are recorded, notified and returned as usual. |
| **On** | Matches of a **Replace with placeholder** rule are replaced before sending and restored in the answer; **Record only** rules record, notify and send the value unchanged. | Calls matching a **Cut off** rule never fully reach the client; **Record only** rules record, notify and return the call. |

- **What Secrets & privacy covers.** The whole request, system prompt, earlier turns and tool calls included, except field names and base64 data such as images. Custom rules also leave alone the identifiers a protocol needs as they are: item and call ids, types, roles, tool names and model names; built-in rules still search them. Built-in rules find API keys and tokens for Anthropic, OpenAI, GitHub, Slack, AWS (access key IDs), Google, GitLab, Stripe, npm, DigitalOcean and SendGrid, private keys, JWTs, passwords in connection strings, and Chinese resident ID and bank card numbers whose structure and check digit are valid. The rules for email addresses, Chinese mainland mobile numbers, internal IP addresses and internal domains start off.
- **Rules from before 2026.10.17.** A custom rule saved by an earlier version was a case-sensitive regular expression; it now looks for its text as written and ignores case. A rule that relies on a regular expression still loads but stops matching, with nothing reported, so open each one and choose **Regex**, and **Match case** where capital letters matter.
- **How values come back.** A value keeps one placeholder throughout a request, on every upstream. Placeholders the model writes back, in text, tool-call arguments or Codex's freeform tool input such as `apply_patch`, are restored before the client receives them, exactly as the value was written: a private key keeps its line breaks, and tool-call arguments still parse. A command using the key runs locally with the real value, while the relay sees only the placeholder.
- **What is cut off.** Calls that download or decode code and run it, send out environment variables or credential files, read private keys or cloud credentials, send a credential to an unknown host, or install startup items or scheduled jobs. Built-in rules for deleting home or root, world-writable permissions and uploading a local file only record.
- **What the relay still sees.** The key configured for its upstream in the app, and the rest of the request as written: code, file contents, the conversation. The key a client uses for the gateway is not forwarded, and neither is the client's identity unless **Forward client identity** is on for that upstream.
- **Rules, not judgement.** Only values that match a rule are replaced; a credential without a recognizable prefix, such as an AWS secret access key, needs a custom rule. A dangerous command written in a form no rule matches is not caught.
- **Nothing beyond the gateway.** What a relay does on its own servers, such as keeping requests or answering with another model, is out of sight; a mark such as **Model name differs** next to an upstream on the Upstreams page can show signs of the latter, not prove it.
- **Notifications.** A notification for a recorded match names the rule and the upstream, never the matched text. The same rule notifies at most once every 5 minutes, and matches that arrive together are merged into one notification.
- **The cost of acting.** Changed request content may miss the upstream's prompt cache, and a false match by a **Cut off** rule stops the answer at that call.

Related: [Features](/docs/lite/features/#security), including the third protection, the content filter, which can also delete or replace chosen words in answers; [Install and update](/docs/lite/install/).
