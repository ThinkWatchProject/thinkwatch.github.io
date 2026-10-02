# 插件

插件让请求和回答适应具体的使用场景：给系统提示词附上当天日期、统一回答里的用词、删掉中转站不接受的参数、遮住内部主机名、在 WSL 与 Windows 之间改写工具调用里的路径。插件是一段简短的 JavaScript，在 core 内部的沙箱中运行，看到的是占位符而不是请求里的密钥；它做的每一处改动都记录在请求上，并和客户端发来的内容一样经过各项防护的检查。

本页说明插件能改什么、如何添加、编写插件的接口、权限、限额与安全模型，末尾列出五个示例插件。

## 插件能改什么

| 方向 | 可以改动的内容 |
|---|---|
| 请求，发往上游之前 | 系统提示词；对话消息，含工具结果和此前工具调用的参数；工具定义；模型、`max_tokens`、`temperature`、`top_p` 与 `stop`。插件也可以拒绝这次请求。 |
| 回答，交给客户端之前 | 回答的文字，可以整段处理，也可以随流式输出逐段处理；回答里的工具调用，可以修改、删除或新增。 |

无论客户端使用哪种接口格式（Anthropic Messages、OpenAI Chat Completions、OpenAI Responses 或 Gemini），插件看到的都是同一种结构。core 按客户端自己的格式写回改动，只动改过的条目，缓存标记、签名、图片和不认识的字段都保持原样。没有被任何插件改动的请求逐字节原样转发，不影响上游的提示词缓存。

请求头、上游地址与凭据不对插件开放。图片只提供媒体类型，不提供内容；思考内容只读，不能修改。

## 添加插件

1. 在「插件」页选择「添加插件」，选择一个 `.js` 文件或粘贴代码。
2. 「审核插件」窗口显示完整代码、申请的每项权限及其允许的操作、适用范围、设置项、插件 ID，以及出错时的处理方式。
3. 选择「安装」后弹出系统对话框，写明插件名称、以文字说明的权限和文件 SHA-256 哈希的开头部分。在系统对话框中确认之后，插件才会安装。

系统对话框由应用自身弹出，不属于页面；安装插件、更换代码、确认文件变更这三个接口也不对页面开放。注入页面的脚本无法自行安装插件。

插件只能从本地文件或粘贴的代码安装，不支持通过链接安装，没有插件市场，也不会自动更新。

core 为每个插件保留确认时的副本及其 SHA-256 哈希。磁盘上的文件发生变化时，插件停止运行，状态显示为「文件已更改」；它的审核窗口列出与已确认版本的差异，在系统对话框中确认新版本后插件恢复运行。「更换代码」同样经过审核窗口和系统对话框。

「插件」页还提供：

- **顺序**：插件按列表顺序依次运行，后一个看到的是前一个改过的结果，各自按自己的权限核对。
- **设置**：插件声明的设置项的取值、适用范围，以及出错时的处理方式。
- **试运行**：用请求历史中最近的一条请求运行插件，显示改动前后的请求或回答以及插件日志，不发往上游。
- **日志**：插件通过 `console` 写下的最近 500 行。
- **统计**：core 启动以来的调用次数、改动次数、拒绝次数、出错次数和每次调用的平均 CPU 时间。

「流量」页中，被插件改动过的请求带有标记。请求详情列出运行过的每个插件、各自的结果（未改动、已改写、已拒绝、出错或已跳过）与 CPU 时间，并可以对照客户端发来的原始请求和经过插件之后的请求。插件出错时发送提醒。

应用连接[远程 core](/zh-CN/docs/lite/remote-core) 时，插件安装在服务器上，也在服务器上运行。

## 编写插件

插件是一个 UTF-8 编码的 ES 模块文件，不超过 1 MiB，导出 `manifest` 和一个或多个钩子函数。

```js
export const manifest = {
  name: "附加当前日期",
  api: 1,
  description: "在系统提示词末尾附上今天的日期。",
  permissions: ["system"],
  match: { clients: ["claude-code"], models: ["claude-*"] },
  settings: {
    utc_offset: { type: "number", label: "时区（相对 UTC 的小时数）", default: 8 },
  },
};

export function onRequest(req, ctx) {
  const offset = Number(ctx.settings.utc_offset ?? 8);
  const today = new Date(Date.now() + offset * 3600 * 1000).toISOString().slice(0, 10);
  req.system = req.system ? `${req.system}\n\n今天的日期：${today}` : `今天的日期：${today}`;
  return req;
}
```

### manifest

| 字段 | 必填 | 取值 |
|---|---|---|
| `name` | 是 | 1 至 64 个字符。 |
| `api` | 是 | `1`，目前唯一支持的版本。 |
| `description` | 否 | 不超过 500 个字符。 |
| `permissions` | 是 | `system`、`messages`、`tools`、`params`、`reply.text`、`reply.tool_calls` 中的一项或多项，见[权限](#权限)。 |
| `match` | 否 | 初始的适用范围：`clients`、`models`、`upstreams` 三个列表，`*` 匹配任意一串字符；列表缺省或为空表示全部。`upstreams` 只对回答钩子生效，因为路由之前尚不知道请求会发往哪个上游。适用范围可以在「插件」页修改。 |
| `reply` | 否 | `"block"`（默认）或 `"stream"`，决定 `onReplyText` 以何种方式接收文字。 |
| `settings` | 否 | 最多 20 项，每项包含 `type`（`string`、`number` 或 `boolean`）、`label` 与 `default`。取值在「插件」页填写，通过 `ctx.settings` 传给插件。 |

文件在添加时和每次被 core 加载时都会检查：必须导出有效的 manifest 和至少一个钩子；导出的每个钩子都要有对应的权限，申请的每项权限也都要有用到它的钩子，插件不会申请用不到的权限。未通过检查的文件不会安装，错误信息尽可能给出行号和列号。

### 钩子

| 钩子 | 权限 | 调用时机 |
|---|---|---|
| `onRequest(req, ctx)` | `system`、`messages`、`tools` 或 `params` | 每个请求发往上游之前调用一次。 |
| `onReplyText(text, ctx)` | `reply.text` | 处理回答中的文字。 |
| `onReplyTextEnd(ctx)` | `reply.text` | 逐段模式下，每段文字结束时调用。可选。 |
| `onToolCall(call, ctx)` | `reply.tool_calls` | 回答中的每个工具调用完整之后调用。 |

**`onRequest`** 接收[请求视图](#请求视图)，返回改过的视图；不返回则请求保持原样。调用 `reject("原因")` 拒绝这次请求，客户端收到注明插件名称的错误；`reject` 通过抛出异常结束钩子，即使插件自己接住这个异常，拒绝依然成立。每个请求只调用一次：上游出错、请求转到下一个上游时沿用第一次的结果，不再重新调用。只有生成回答的请求才调用它；计算 token 数的请求（`/v1/messages/count_tokens` 与 Gemini 的 `countTokens`）不经过它，原样转发。

**`onReplyText`** 在整段模式（默认）下，每段文字到齐后调用一次，参数是整段文字，调用结束后文字才交给客户端。逐段模式下随流式输出逐段调用，返回值是此刻要发出的文字；返回 `""` 表示先扣住，这段文字结束时 `onReplyTextEnd` 的返回值把扣住的内容放出。非流式的回答一次传入全部文字，逐段模式下随后再调用 `onReplyTextEnd`。不返回表示文字不变。

**`onToolCall`** 接收 `{ id, name, input }`。流式输出的参数先收集完整，处理后按客户端的格式发出。不返回表示保持原样；返回一个对象替换这个调用；返回 `null` 删除它；返回一个数组则替换为多个调用。缺少 `id` 的由 core 生成。

思考内容不交给插件，原样交给客户端。

钩子可以是 `async` 函数，也可以返回 Promise：Promise 在同一次调用内、同样的限额之下落定；始终不落定的 Promise 按出错处理。

### 请求视图

```ts
type RequestView = {
  format: "anthropic" | "openai_chat" | "openai_responses" | "gemini"; // 只读
  model: string;        // 只读；修改模型要通过 params.model
  system?: string;      // 授予 "system" 时提供；没有系统提示词时为 ""
  messages?: Message[]; // 授予 "messages" 时提供
  tools?: Tool[];       // 授予 "tools" 时提供
  params?: Params;      // 授予 "params" 时提供
};
type Message = { key?: string; role: "user" | "assistant" | "tool" | "system"; parts: Part[] };
type Part =
  | { key?: string; type: "text"; text: string }
  | { key?: string; type: "thinking"; text: string }                              // 只读
  | { key?: string; type: "tool_call"; id: string; name: string; input: unknown }   // input 可改
  | { key?: string; type: "tool_result"; call_id: string; text: string; is_error: boolean } // text 可改
  | { key?: string; type: "image"; media_type: string | null }                     // 只读，不含图片数据
  | { key?: string; type: "other"; label: string };                                // 只读
type Tool = { key?: string; name: string; description: string; input_schema: unknown };
type Params = { model: string; max_tokens?: number; temperature?: number; top_p?: number; stop?: string[] };
```

`system` 是对话开头的系统指令：Anthropic Messages 的 `system` 字段、Chat Completions 开头的 system 或 developer 消息、Responses 的 `instructions`、Gemini 的 `systemInstruction`。设为 `""` 即删除。只含工具结果的消息角色为 `tool`，对话中途出现的 system 或 developer 消息角色为 `system`。

core 为每条消息、每个片段和每个工具分配一个 `key`。改动规则如下：

- 要修改的消息、片段或工具保留原来的 `key`，新增的不带 `key`。出现未知或重复的 `key` 按出错处理。
- 消息可以删除、修改或新增。新增的消息角色只能是 `user`、`assistant` 或 `system`，且只含文字片段。保留下来的消息保持原有的先后顺序和角色。
- 保留下来的消息里，片段可以删除，可编辑的字段可以修改，也可以新增文字片段。`type`、`id`、`name` 与 `call_id` 不可修改，思考、图片和其他片段整体不可修改。
- 工具可以删除或新增，`description` 与 `input_schema` 可以修改，工具名称不能重复。
- `params` 中的值可以修改；修改后的 `params.model` 就是路由所用的模型。

违反规则的结果，或者带有未授权部分的结果，都按出错处理。

### ctx

```ts
type Ctx = {
  client: string | null;   // 请求记录上的客户端，例如 "claude-code"
  model: string;           // 客户端请求的模型
  format: "anthropic" | "openai_chat" | "openai_responses" | "gemini"; // 客户端的格式
  upstream: string | null; // 仅回答钩子：服务这次回答的上游
  settings: Record<string, string | number | boolean>;
};
```

`ctx` 已冻结，不能修改。

### 可用的 JavaScript

插件可以使用 JavaScript 标准内置对象，例如 `JSON`、`RegExp`、`Map`、`Date` 与 `Math`；`console.log`、`console.info`、`console.warn` 与 `console.error` 写入插件日志；`reject` 只在 `onRequest` 中有效。没有 `fetch`、`require` 和定时器，`import` 与 `import()` 加载不了任何模块，也无法访问文件、网络、环境变量和进程。插件存进变量的内容，不会留到它所处理的这次请求或这个回答之后。

## 权限

权限同时决定插件看得到什么和能改什么。未授权的部分不会交给插件；返回的结果改动了未授权的部分，按出错处理。

| 权限 | 可以看到并修改 | 安装时的提示 |
|---|---|---|
| `system` | 系统提示词 | |
| `messages` | 对话消息：文字、工具结果和此前工具调用的参数；思考内容只读，图片只提供类型 | 可以往对话中加入指令 |
| `tools` | 工具定义 | 会改变模型能使用的工具 |
| `params` | 模型、`max_tokens`、`temperature`、`top_p`、`stop` | 可能改变请求发往哪个上游以及产生的费用 |
| `reply.text` | 回答中的文字 | |
| `reply.tool_calls` | 回答中的工具调用：修改、删除、新增 | 高风险，以红字提示：插件可以改动客户端要执行的操作。改动后的工具调用仍经过工具调用审查。 |

## 插件出错时

插件抛出错误、超出[限额](#限额)、返回无效的结果，或者改动了未授权的部分，都算出错。出错时的处理方式按插件分别设置：

- **拒绝这次请求**（默认）：请求被拒绝，或回答在此处结束，并附上注明插件名称的错误。
- **跳过此插件**：这次请求不经过该插件，按未安装它的情况继续。

插件无法运行时，适用范围内的请求按同一设置处理：文件已变更而尚未确认，或者插件加载失败。每次出错都记录在请求上。

## 限额

| 钩子 | CPU 时间 | 内存 | 输出 |
|---|---|---|---|
| 请求钩子 | 每次 200 毫秒，含模块顶层代码 | 128 MiB | 不超过请求视图大小的两倍加 1 MiB |
| 回答钩子 | 每次 20 毫秒，整个回答累计 2 秒 | 64 MiB | 不超过传入的文字或工具调用大小的两倍加 1 MiB；`onReplyTextEnd` 放出的文字不超过 1 MiB |

每次调用最多写 100 行日志，超过 4 KiB 的行截短。插件文件不超过 1 MiB。超出限额的调用（包括写第 101 行日志）立即中止，按出错处理。

## 安全模型

- **沙箱里什么都没有。** 插件在 QuickJS 中运行，QuickJS 编译成 WebAssembly，由 core 内部的 Wasmtime 执行。插件代码从不在应用窗口中运行，也从不以原生代码运行。沙箱里没有网络、文件、环境变量和进程；即使 JavaScript 引擎本身有漏洞，也只能破坏沙箱自己的内存，碰不到 core 进程中的密钥与令牌。
- **不留任何数据。** 每次调用请求钩子都使用新实例。每个回答使用一个实例，由这个回答的各个钩子共用，回答结束即丢弃。插件之间不共享任何东西。
- **只看到占位符。** 出站脱敏规则能识别的密钥，在交给插件之前替换为占位符，插件处理之后再换回；请求与回答两个方向都是如此，与这项防护处于哪一档无关。回答一侧同样重要：回答会进入对话历史，随下一次请求再次发往上游；插件如果看得到真实的密钥，就能把它编码后藏进回答里带出去。
- **防护照常生效。** 请求钩子在内容过滤、隐藏字符检测、出站脱敏和路由之前运行；回答钩子在工具调用审查和输出长度限制之前运行。插件写入的内容和其他内容一样受检。
- **只运行确认过的代码。** 插件文件与安装时确认的 SHA-256 哈希一致才会运行。安装插件、更换代码、确认文件变更都要在系统对话框中确认。
- **改动都有记录。** 每次运行都记录在请求上；被改动的请求另存一份经过插件之后的版本，和所有存下的请求一样替换掉了密钥；「流量」页为被插件改动的请求加上标记。
- **用量有上限。** 每次调用都有 CPU 时间、内存、输出和日志量的上限。插件在单独的线程池中运行，运行缓慢的插件不会拖住网关本身的工作。
- **只显示纯文本。** 插件的名称、说明、设置项标签、日志与错误信息，在应用中一律按纯文本显示。

## 沙箱无法防范的情况

插件本来就有权改动内容，沙箱无法判断一处改动是否正当。拥有 `system` 或 `messages` 权限的插件可以往提示词里写入指令；拥有 `reply.text` 的插件可以把回答改得误导人；拥有 `params` 的插件可以换用更贵的模型；拥有 `reply.tool_calls` 的插件可以改动客户端要执行的操作，而工具调用审查只能拦下其规则覆盖的写法。出站脱敏规则识别不了的密钥，插件看得到；这类密钥本来也会原样发往上游，可以在安全页添加自定义规则覆盖它的格式。

降低这些风险的办法：只授予插件所需的权限，安装前通读代码，并在请求详情中对照经过插件前后的请求。

## 示例

ThinkWatch Core 仓库的 [`examples/plugins`](https://github.com/ThinkWatchProject/ThinkWatch-Core/tree/main/examples/plugins) 目录中有五个示例插件。

| 文件 | 权限 | 作用 |
|---|---|---|
| `add-date.js` | `system` | 在系统提示词末尾附上当天日期，时区可设置。 |
| `unify-terms.js` | `reply.text` | 按设置中的替换表统一回答里的用词。使用逐段模式：回答照常随流输出，只有可能是某个词开头的几个字会扣住，等下一段到达后再放出。 |
| `strip-params.js` | `params` | 请求发出之前删除 `temperature`、`top_p` 或 `stop`，用于不接受这些参数的中转站和模型。 |
| `mask-pattern.js` | `reply.text` | 把回答中符合设置里正则表达式的内容替换为固定文字，例如内部主机名。 |
| `wsl-paths.js` | `reply.tool_calls` | 在 WSL（`/mnt/c/…`）与 Windows（`C:\…`）之间改写工具调用参数中的路径。 |

`unify-terms.js` 中逐段替换的骨架：

```js
export const manifest = {
  name: "统一用词",
  api: 1,
  permissions: ["reply.text"],
  reply: "stream",
  settings: { terms: { type: "string", label: "替换表（原词=新词，用逗号分隔）", default: "登陆=登录" } },
};

let held = ""; // 同一个回答的各个钩子共用一个实例，这个变量在整个回答期间有效

export function onReplyText(text, ctx) {
  return convert(held + text, ctx, false); // 发出已确定的部分，可能是某个词开头的部分留在 held 里
}

export function onReplyTextEnd(ctx) {
  return convert(held, ctx, true); // 这段文字结束，剩下的全部发出
}
```

## 延伸阅读

- [功能详解](/zh-CN/docs/lite/features)：应用的其他页面，包括安全页及其各项防护。
- [连接远程 core](/zh-CN/docs/lite/remote-core)：在服务器上的 core 中使用插件。
