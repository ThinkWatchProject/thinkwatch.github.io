# Keep the API keys in requests away from relays, and block dangerous tool calls

A relay receives every request in full, including keys that end up in the conversation, such as a pasted `.env` file or a configuration file a tool has read. ThinkWatch Lite's outbound redaction finds such credentials before a request leaves the machine and, in **Replace** mode, sends placeholders such as `<<TW_SECRET_1>>` in their place, restoring the real values where the answer repeats them. Tool-call inspection checks the tool calls that come back and, in **Cut off** mode, stops those that download and run code or send credentials out before the client can run them.

## Before you start

- ThinkWatch Lite, [installed](/lite/#install), with clients connected to the gateway. This guide follows version 2026.10.4.
- Both protections start in **Observe**: they record what they find and change nothing. **Off** checks nothing.

## Steps

1. Open the Security page. The **Log** tab lists every finding with its request; since both modes use the same rules, a few days in **Observe** show what **Replace** would change.
2. Open **Redaction**. Built-in rules turn on or off one at a time, and **Test…** shows **What is sent** for a pasted text.
3. For a key format the built-in rules do not cover, choose **New rule**, enter a **Name**, a pattern under **Match (regular expression)** and a **Placeholder name** such as `INTERNAL` (giving `<<TW_INTERNAL_1>>`), then choose **Create**.
4. Set the mode at the top of the tab to **Replace**.
5. Open **Tool calls**. Each built-in rule is marked **Cut off** or **Record only**, which **View rule** can change. Set the mode to **Cut off**.
6. The log's **Action** column then shows **Replaced** or **Cut off**, and a cut-off call also raises a system notification.

## Notes

| Mode | Outbound redaction | Tool-call inspection |
|---|---|---|
| **Observe** (default) | Findings are recorded; the request is sent unchanged. | Matching calls are recorded and returned as usual. |
| **Replace** / **Cut off** | Findings are replaced with placeholders before sending and restored in the response. | Calls matching a **Cut off** rule never fully reach the client; **Record only** rules still only record. |

- **What redaction covers.** The whole request, system prompt, earlier turns and tool calls included, except base64 data such as images. Built-in rules find API keys and tokens for Anthropic, OpenAI, GitHub, Slack, AWS (access key IDs), Google, GitLab, Stripe, npm, DigitalOcean and SendGrid, private keys, JWTs, passwords in connection strings, and Chinese resident ID and bank card numbers whose structure and check digit are valid. The rules for email addresses, Chinese mainland mobile numbers, internal IP addresses and internal domains start off.
- **How values come back.** A value keeps one placeholder throughout a request, on every upstream. Placeholders the model writes back, in text or tool-call arguments, are restored before the client receives them: a command using the key runs locally with the real value, while the relay sees only the placeholder.
- **What is cut off.** Calls that download or decode code and run it, send out environment variables or credential files, read private keys or cloud credentials, send a credential to an unknown host, or install startup items or scheduled jobs. Built-in rules for deleting home or root, world-writable permissions and uploading a local file only record.
- **What the relay still sees.** The key configured for its upstream in the app, and the rest of the request as written: code, file contents, the conversation. The key a client uses for the gateway is not forwarded, and neither is the client's identity unless **Forward client identity** is on for that upstream.
- **Rules, not judgement.** Only values that match a rule are replaced; a credential without a recognizable prefix, such as an AWS secret access key, needs a custom rule. A dangerous command written in a form no rule matches passes tool-call inspection.
- **Nothing beyond the gateway.** What a relay does on its own servers, such as keeping requests or answering with another model, is out of sight; the **Check-up** tab on the Upstreams page can show signs of the latter, not prove it.
- **The cost of acting.** Changed request content may miss the upstream's prompt cache, and a false match in **Cut off** stops the answer at that call.

Related: [Features](/docs/lite/features/#security), including the third protection, the content filter; [Install and update](/docs/lite/install/).
