# Use Claude Desktop with third-party models

ThinkWatch Lite connects Claude Desktop through its official third-party inference mode, with the gateway on the same computer as the inference provider. Claude Desktop accepts only model names that look like Claude's, so a routing rule rewrites those names to the model that serves the request, from GLM, DeepSeek, Kimi or any other upstream. A Claude Desktop managed by an organization is left unchanged.

## Before you start

- ThinkWatch Lite, [installed](/docs/lite/install/), and Claude Desktop on macOS or Windows, opened at least once. The third-party inference mode needs no Anthropic account.
- An upstream for the model, added on the Upstreams page. [Use Claude Code with GLM, DeepSeek or Kimi](/docs/lite/claude-code-other-models/) shows how for those three.

## Steps

1. On the Clients page, choose **Connect…** on the Claude Desktop row. The dialog lists four files, under `~/Library/Application Support` on macOS; on Windows, `Claude-3p` is under `%LOCALAPPDATA%` and `Claude` under `%APPDATA%`.

   | File | Change |
   |---|---|
   | `Claude-3p/configLibrary/7477a7c4-1ce0-4d3a-9b1e-7477a7c40001.json` | A configuration named ThinkWatch: `inferenceProvider` set to `gateway`, the gateway address, the key with the `x-api-key` scheme, `chatTabEnabled` and the model list `inferenceModels` |
   | `Claude-3p/configLibrary/_meta.json` | Adds the ThinkWatch entry and points `appliedId` at it; other configurations stay |
   | `Claude-3p/claude_desktop_config.json` | `deploymentMode` set to `3p`, nothing else |
   | `Claude/claude_desktop_config.json` | `deploymentMode` set to `3p`; the MCP servers in it stay |

   `inferenceModels` receives the gateway's models whose names look like Claude's: `claude-` followed by `sonnet`, `opus`, `haiku` or `fable` and a version. When there are none, the notes say that `claude-sonnet-5` is written and give an example rule. Choose **Connect**.
2. On the Routing page, open the `default` route and choose **Add rule**. With **Add condition**, add **Model** `claude-*` and **Key** `claude-desktop`, the key named in the connect dialog. Set **On match** to **Forward** and **Forward to** to the upstream, and under **Parameter rewrites** enter the model ID in **Change model to**. Choose **Add**, then **Save**.
3. Quit Claude Desktop completely and open it again. If the sign-in page appears, choose to continue with the gateway there; this happens once.

## Notes

- **Managed by an organization.** A managed configuration overrides everything set on the computer: on macOS a `com.anthropic.claudefordesktop.plist` under `/Library/Managed Preferences`, on Windows the registry key `SOFTWARE\Policies\Claude` under `HKLM` or `HKCU`. The Clients page then offers no **Connect…**, and the details say "Claude Desktop on this computer is managed by an organization".
- **Model list.** `inferenceModels` is written when connecting and is not offered for update afterwards. After the gateway's models change, **Restore…** and connect again to refresh it.
- **Cloud providers.** When Claude Desktop uses Amazon Bedrock, Google Cloud Agent Platform or Microsoft Foundry through another configuration, the dialog says so: the ThinkWatch configuration is used while connected, and restoring switches back. For Bedrock it also offers **New Bedrock upstream…** with the previous settings.
- **History and web search.** Conversations in this mode are kept apart from the existing ones. Web search does not work through the gateway and needs its own setup.
- **Restore…** sets `deploymentMode` back in both files, removes the ThinkWatch entry from `_meta.json`, points `appliedId` back at the configuration used before if it still exists, and deletes the ThinkWatch configuration.
- **Checks.** The details report "Another configuration is in use in Claude Desktop" when another configuration has been applied in the app, and "Claude Desktop may still open in its usual mode" when `deploymentMode` is not `3p`.
- **By hand.** The same setup can be made in Claude Desktop: turn on Help → Troubleshooting → Enable Developer Mode, then open Developer → Configure Third-Party Inference. Choose the gateway provider, enter the gateway address and the key, set the authentication scheme to `x-api-key`, and click Apply Changes.
- **Cost.** A rewritten request is priced as the model actually sent.

Related: [Features](/docs/lite/features/), [Use Claude Code with GLM, DeepSeek or Kimi](/docs/lite/claude-code-other-models/), [Install and update](/docs/lite/install/).
