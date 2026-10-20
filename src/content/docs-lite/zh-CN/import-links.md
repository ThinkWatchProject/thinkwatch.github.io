# 导入链接

ThinkWatch Lite 支持通过链接打开预填好设置的「新建上游」对话框。中转站、模型服务商或 ThinkWatch 企业版控制台可以把这样的链接放在控制台或开通通知中；用户打开链接后，在手动添加上游时所用的同一个对话框中核对设置，点几下即可创建上游。

本页面向中转站与服务商的运营人员，说明链接的两种形式、按对话框分组的参数、各服务类型接受哪些参数、编码方式，以及链接刻意不能设置的内容。页面末尾附有链接生成器。ThinkWatch Lite 自身也能为已有的上游生成这样的链接，见[由 Lite 生成](#由-lite-生成)。

`name`、`url`、`protocol`、`key`、`models` 以外的参数需要 ThinkWatch Lite 2026.10.16 或更高版本，`limits` 需要 2026.10.26 或更高版本。只用这五个参数的链接在更早的版本中同样可以打开，为更早版本编写的链接全部继续有效。

## 链接形式

两种形式携带相同的参数。

| 形式 | 说明 |
|---|---|
| `thinkwatch://import?…` | 直接打开应用。浏览器在把链接交给应用之前会先请求许可。也接受 `thinkwatch://import/?…`。 |
| `https://thinkwat.ch/import#…` | 一个网页：显示接收请求的主机与将要导入的设置，通过按钮打开应用，未安装应用时提供下载。参数位于 `#` 之后的片段中，浏览器不会把片段发送给任何服务器。该页面不加载统计或第三方脚本，读取参数后会从地址栏中移除片段。 |

网页形式适合用于邮件和控制台，因为收件人可能尚未安装应用。网页按与应用相同的规则校验参数，校验不通过的链接不显示任何内容。

## 参数

只有在「新建上游」对话框针对所选服务类型与认证方式显示相应栏位时，链接才能设置该参数。对话框自行填写的值，例如官方服务的地址或服务唯一使用的协议，链接可以重复写出，但不能改为其他值。各服务类型接受哪些参数见[按服务类型](#按服务类型)。

### 服务类型

| 参数 | 取值 |
|---|---|
| `service` | `anthropic`、`openai`、`gemini`、`deepseek`、`zai`、`bedrock`、`openrouter`、`thinkwatch`（ThinkWatch 企业网关）、`sub2api`、`newapi`（New API / One API）、`ollama` 或 `custom`。省略时由应用按 `url` 识别，与编辑对话框的识别方式相同：官方地址按主机识别，标准 Bedrock 地址识别为 Bedrock，端口 11434 识别为 Ollama，其余地址一律为 `custom`。链接中有参数不适用于识别出的服务类型时，按 `custom` 处理，自定义上游接受全部参数。明确写出的 `service` 不会被改变。 |
| `auth` | `key`（默认）、`oauth`、`account` 或 `aws-keys`，须为该服务类型提供的认证方式。`openai` 的 `account` 是 ChatGPT 账号，`zai` 的 `account` 是账号登录。 |
| `site` | `bigmodel`（中国大陆）或 `zai`（国际），仅用于 `zai`。省略时按 `url` 确定，没有 `url` 时为 `bigmodel`。 |

### 连接

| 参数 | 取值 |
|---|---|
| `name` | 上游在应用中的名称。省略时由应用按服务类型或地址生成。 |
| `url` | 服务的 Base URL，不含 `/chat/completions`、`/messages` 等接口路径。须为 `https://`，本机与内网地址也可以使用 `http://`（见下文）。不得包含用户名或密码、查询串或片段。`custom`、`thinkwatch`、`sub2api`、`newapi` 必须提供；Bedrock 可选（VPC 端点等），Ollama 可选（其他机器）；自带地址的服务只接受该地址。`auth=account` 时不接受。 |
| `protocol` | `anthropic`、`openai-chat`、`openai-responses` 或 `gemini`，仅用于对话框提供选择的服务类型。省略时由应用按地址识别。 |
| `region` | AWS 区域，例如 `eu-west-1`，仅用于 Bedrock。没有 `url` 时，按该区域生成标准地址；`url` 为标准地址时，须与其中的区域一致；`url` 为其他地址时，它是签名所用的区域，须配合 `auth=aws-keys`。 |
| `key` | API 密钥，按原样保存（Bedrock 为 Bedrock API 密钥）。配合 `auth=key`。Ollama 没有密钥栏位。 |
| `oauth_endpoint` | Token 端点，规则与 `url` 相同，通常带路径。`auth=oauth` 时必须提供。主机与接口地址不同时，应用会同时列出两个主机。 |
| `oauth_refresh` | Refresh Token。`auth=oauth` 时必须提供。 |
| `oauth_client_id` | Client ID，配合 `auth=oauth`，可选。 |
| `oauth_client_secret` | Client Secret，配合 `auth=oauth`，可选。 |
| `aws_access_key_id` | 访问密钥 ID，配合 `service=bedrock` 与 `auth=aws-keys`，此时必须提供。 |
| `aws_secret_access_key` | 私有访问密钥。`auth=aws-keys` 时必须提供。 |
| `aws_session_token` | 临时凭证的会话令牌，配合 `auth=aws-keys`，可选。 |

`url` 与 `oauth_endpoint` 指向本机或内网时也接受 `http://`，例如部署在公司内网的企业网关。主机须为 `localhost`、`127.0.0.1` 或 `[::1]`；`10.0.0.0/8`、`172.16.0.0/12`、`192.168.0.0/16`、`100.64.0.0/10`、`169.254.0.0/16` 内的 IPv4 地址；`fc00::/7`、`fe80::/10` 内的 IPv6 地址；不含点的主机名；或以 `.local`、`.lan`、`.internal`、`.intranet`、`.corp`、`.home.arpa`、`.localhost` 结尾的主机名。其他 `http://` 地址一律拒绝。本机以外的 `http://` 地址，对话框与网页会在主机下方写明密钥和请求内容以明文传输。

### 高级设置

| 参数 | 取值 |
|---|---|
| `headers` | 额外的请求头，每行一个 `名称: 值`，编码方式见[编码](#编码)。`auth=account` 时不接受。 |
| `client_identity` | `on` 表示开启「转发客户端身份」，用于只接受特定客户端的中转站。仅用于 Sub2API、New API 与自定义上游。 |
| `concurrency` | 并发上限：1 到 1000 之间的整数，不带正负号，不以 0 开头。`auth=account` 时不接受。 |
| `limits` | 用量上限，各项以 `;` 分隔，每项为 `per\|measure\|max\|every\|cache_reads`，例如每 5 分钟 10,000,000 token、每天 20 美元，编码方式见[编码](#编码)。`auth=account` 时不接受。 |
| `balance` | 余额的读取来源：`off`、`openrouter`、`deepseek`、`moonshot`、`sub2api`、`newapi` 或 `thinkwatch`。省略时自动识别。仅用于自定义上游，其他服务类型自行决定来源。 |

### 模型

| 参数 | 取值 |
|---|---|
| `models` | 以逗号分隔的模型 ID，作为手动添加的模型写入上游。应用把它们与服务自己列出的模型一起使用，只列出部分模型的服务可以在这里写上其余的模型；服务不提供模型列表时，它们就是全部模型。重复的 ID 只保留一个。 |
| `models_only` | 以逗号分隔的模型 ID 或含 `*`、`?` 的通配规则。启用范围设为「指定模型」，只包含这些模型。 |
| `specs` | 模型规格，各项以 `;` 分隔，每项为 `model\|context\|max_output\|reasoning\|image`。上游创建之后，为最终模型列表中的模型保存。既不在 `models` 中、也不在上游模型列表中的模型，其规格不会保存，「模型」一步会写明。 |

### 计费

| 参数 | 取值 |
|---|---|
| `billing` | `per-token`（按量计费）或 `free`（不计费）。省略时使用服务类型的默认值：Ollama 不计费，其他按量计费。 |
| `price_multiplier` | 新价目表的倍率，大于 0、不超过 100，例如 `0.8`。不计费时不接受。 |
| `prices` | 新价目表中的模型价格覆盖，各项以 `;` 分隔，每项为 `model\|input\|output\|cache_read\|cache_write_5m\|cache_write_1h`。不计费时不接受。 |

链接含有 `price_multiplier` 或 `prices` 时，「计费」一步预先选中一张与上游同名的新价目表，倍率取自链接（省略时为 1），模型覆盖取自 `prices`。这张价目表可以像其他新建的价目表一样修改，在选择「创建」时与上游一同创建。同名的价目表已存在时，对话框会要求改用其他名称，与上游名称被占用时的处理相同。

## 按服务类型

| 服务类型 | `service` | `auth` | 地址 | 接口协议 |
|---|---|---|---|---|
| Anthropic | `anthropic` | `key` | `https://api.anthropic.com` | `anthropic` |
| OpenAI | `openai` | `key`、`account`（ChatGPT 账号） | `https://api.openai.com` | `openai-chat`（默认）或 `openai-responses` |
| Google Gemini | `gemini` | `key` | `https://generativelanguage.googleapis.com` | `gemini` |
| DeepSeek | `deepseek` | `key` | `https://api.deepseek.com/anthropic` | `anthropic` |
| Z.ai / BigModel | `zai` | `key`、`account` | 按 `site` 为 `https://open.bigmodel.cn/api/anthropic` 或 `https://api.z.ai/api/anthropic` | `anthropic` |
| Amazon Bedrock | `bedrock` | `key`（Bedrock API 密钥）、`aws-keys` | `region` 的标准地址，或 `url` 中的端点 | 链接不能设置 |
| OpenRouter | `openrouter` | `key` | `https://openrouter.ai/api` | `openai-chat` |
| ThinkWatch 企业版 | `thinkwatch` | `key` | `url`，必须提供 | 链接不能设置；企业网关接受各客户端自己的格式 |
| Sub2API | `sub2api` | `key` | `url`，必须提供 | 任一协议，或自动识别 |
| New API / One API | `newapi` | `key` | `url`，必须提供 | 任一协议，或自动识别 |
| Ollama | `ollama` | `key`，没有密钥栏位 | `http://127.0.0.1:11434`，或 `url` 中的其他地址 | `openai-chat` |
| 自定义 | `custom` | `key`、`oauth` | `url`，必须提供 | 任一协议，或自动识别 |

`headers`、`concurrency` 与 `limits` 适用于账号登录以外的所有服务类型；`client_identity` 适用于 Sub2API、New API 与自定义上游；`balance` 只适用于自定义上游。「模型」与「计费」两组参数适用于所有服务类型，包括账号登录。

`auth=account` 的链接不含任何凭据，登录在应用中进行。这样的链接只接受 `service`、`auth`、`site`、`name` 以及「模型」与「计费」两组参数。

## 编码

- 每个值都要经过百分号编码，例如使用 `encodeURIComponent`，应用只解码一次。未编码的 `+` 表示空格，因此含 `+` 的密钥应写作 `%2B`。
- 每个参数最多出现一次，值为空的参数一律拒绝。
- 任何值都不得包含 `$`、`{`、`}`、控制字符或不可见字符。应用会从用户的环境变量中读取 `${NAME}`，这些字符可能让应用把本机的机密发往链接所指的主机。
- 任一值不符合规则时，整条链接作废。应用只记录原因，不记录内容。

列表与条目：

| 参数 | 编码 | 示例值（百分号编码之前） |
|---|---|---|
| `models` | 以 `,` 分隔的模型 ID；只含字母、数字与 `- _ . : / @ +` | `glm-5,glm-5-air` |
| `models_only` | 同 `models`，通配规则另可使用 `*` 与 `?` | `claude-*,gpt-5` |
| `headers` | 以换行符（`%0A`）分隔的多行，每行为 `名称: 值` | `X-Relay-Group: pro`、换行、`X-Relay-Region: hk` |
| `specs` | 以 `;` 分隔的多项，每项为 `model\|context\|max_output\|reasoning\|image` | `glm-5-air\|128000\|96000\|y\|n` |
| `prices` | 以 `;` 分隔的多项，每项为 `model\|input\|output\|cache_read\|cache_write_5m\|cache_write_1h` | `glm-5\|1\|3.2\|0.2` |
| `limits` | 以 `;` 分隔的多项，每项为 `per\|measure\|max\|every\|cache_reads` | `minute\|tokens\|10000000\|5;day\|cost\|20` |

`headers` 中，名称只能使用 HTTP 的 token 字符（字母、数字与 `` ! # % & ' * + - . ^ _ ` | ~ ``），值为可打印 ASCII 字符，首尾空白会被去除。名称不得重复（不区分大小写）。携带凭据或由网关自行写入的请求头一律拒绝：`Authorization`、`Proxy-Authorization`、`X-Api-Key`、`X-Goog-Api-Key`、`Api-Key`、`Cookie`、`Host`、`Content-Length`、`Content-Type`、`Content-Encoding`、`Transfer-Encoding`、`Connection`、`Keep-Alive`、`Upgrade`、`TE`、`Trailer`、`User-Agent`，以及以 `Proxy-` 或 `Sec-` 开头的名称。

`specs` 中，`context` 与 `max_output` 为 1 到 10,000,000 之间的 token 数，`reasoning` 与 `image` 为 `y` 或 `n`。四项都可以留空，但不能全部留空。

`prices` 中，各单价以美元 / 百万 tokens 计，整数部分与小数部分各最多 6 位。`input` 与 `output` 必须填写；缓存单价留空或省略时，等于输入单价。

`limits` 中，`per` 为 `minute`、`hour`、`day`、`week` 或 `month`，`measure` 为 `requests`、`tokens` 或 `cost`。请求次数与 token 数的 `max` 为 1 到 999,999,999,999,999 之间的整数，不以 0 开头；费用的 `max` 为美元金额，至少 `0.01`，整数部分最多 9 位、小数部分最多 6 位，不以多余的 0 开头，例如 `5` 或 `0.5`。`every` 为窗口跨越的分钟数（1 到 60）或小时数（1 到 24），只用于 `minute` 与 `hour`，留空时为 1。`cache_reads` 写 `y` 表示计入缓存读取，只用于 `tokens`，留空时不计入。末尾留空的几项可以省略，因此 `day|cost|5` 是完整的一项。`per`、`every`、`measure` 与 `cache_reads` 都相同的两项不能同时出现。

长度与字符限制：

| 项目 | 限制 |
|---|---|
| 整条链接 | 8192 个字符 |
| `name` | 64 个字符；首尾无空白；不含 `/`、`\`、`$`、`{`、`}`、`<`、`>`、`"` 与反引号；不能是 `.` 或 `..`；不以 `__` 开头 |
| `url`、`oauth_endpoint` | 2048 个字符 |
| `key`、`oauth_client_id`、`oauth_client_secret`、`aws_secret_access_key` | 512 个字符；只含字母、数字与 `- _ . ~ + / = :` |
| `oauth_refresh`、`aws_session_token` | 4096 个字符；字符范围与 `key` 相同 |
| `aws_access_key_id` | 16 到 128 个大写字母与数字 |
| `region` | 32 个字符；只含小写字母、数字与 `-` |
| `headers` | 最多 16 行；名称最长 64 个字符，值最长 1024 个字符 |
| `models`、`models_only`、`specs`、`prices` | 各最多 64 项；模型 ID 最长 128 个字符；`specs` 与 `prices` 中同一模型只能出现一次 |
| `limits` | 最多 16 项 |

## 应用如何处理链接

1. **校验链接。**本页的规则全部在应用中执行，与生成链接的页面做过哪些校验无关。
2. **打开预填好的「新建上游」对话框。**对话框直接停在第二步「连接」，账号登录时为「账号」。步骤条下方的一行说明写明接收请求与密钥的主机，Token 端点的主机不同时一并写明。主机以 ASCII 显示：国际化域名显示为 punycode（`xn--…`），外形相近的域名无法冒充熟悉的域名。所有值都可以修改；退回第一步改选其他服务类型时，新服务类型不接受的值会被舍弃。
3. **用户操作之前不写入、不发送。**在第二步选择「下一步」（此时检测连接）或开始登录之前，应用不写入配置，也不向外发出任何请求。
4. **只创建一个新的上游。**导入不会修改、替换或删除已有的上游，不会把新上游设为默认，也不会把它加入任何路由。名称已被使用时，对话框会要求改用其他名称。同一地址上使用不同密钥的多个上游属于正常用法。
5. **一次只处理一条链接。**对话框打开期间到达的链接会被忽略。已有「新建上游」或「编辑上游」对话框打开时，到达的链接会被舍弃，正在填写的表单不会被替换。

## 较新版本的链接

已安装的应用不认识某个参数时，不再静默忽略：应用显示「无法导入这条链接」，写明该参数；有可用更新时，提供安装更新的按钮。网页形式的处理相同：列出能识别的设置，说明需要更新版本的 ThinkWatch Lite，并仍然提供打开链接的按钮。参数名只在由最多 32 个小写字母、数字与下划线组成时才会显示。

## 链接不能设置的内容

任何网页都能打开链接，因此链接只包含用户在对话框中能够判断的内容。链接试图设置以下任一项时，整条链接作废。

| 不接受 | 原因 |
|---|---|
| 出站代理，以及代理不可用时的处理方式 | 链接的提供方不了解用户的网络环境，这两项由用户在对话框中选择。 |
| AWS profile 与环境变量引用（`${NAME}`） | 它们会让应用读取本机的凭据或环境变量，再发往链接所指的主机。一条 `key=${OPENAI_API_KEY}` 的链接会把用户自己的密钥发送给中转站。 |
| 模型别名、路由、默认上游与路由权重 | 它们会改变已配置客户端的流量去向。 |
| 停用开关，以及仅用于检测的 Access Token | 新上游创建后即为启用状态，Access Token 由 Refresh Token 换取。 |
| 账号登录的凭据 | 登录在应用中与服务直接进行。 |
| 鉴权、Cookie 与连接相关的请求头 | 请求头不得取代密钥，也不得改变网关发出的身份。 |
| 指向公网主机的 `http://` | 密钥将以明文经过互联网传输。本机与内网地址接受 `http://`，并标明不加密。 |
| MCP 服务与客户端配置 | 它们会执行命令或修改其他应用的设置。 |
| 图标等展示内容 | 连接不需要它们，且可被用于仿冒熟悉的服务。 |

这些设置可以在上游创建之后在应用中修改。

## 示例

需要两个请求头、并发上限为 4、每 5 分钟最多 10,000,000 token 且每天最多 20 美元、只列出部分模型、按公开价格的 0.8 倍计费并覆盖一个模型价格的中转站（省略 `service`：该地址识别为自定义上游）：

```text
thinkwatch://import?name=example-relay&url=https%3A%2F%2Fapi.relay.example%2Fv1&protocol=openai-chat&key=sk-relay-EXAMPLE&headers=X-Relay-Group%3A%20pro%0AX-Relay-Region%3A%20hk&concurrency=4&limits=minute%7Ctokens%7C10000000%7C5%3Bday%7Ccost%7C20&models=glm-5%2Cglm-5-air&specs=glm-5-air%7C128000%7C96000%7Cy%7Cn&price_multiplier=0.8&prices=glm-5%7C1%7C3.2%7C0.2
```

同一条链接的网页形式：

```text
https://thinkwat.ch/import#name=example-relay&url=https%3A%2F%2Fapi.relay.example%2Fv1&protocol=openai-chat&key=sk-relay-EXAMPLE&headers=X-Relay-Group%3A%20pro%0AX-Relay-Region%3A%20hk&concurrency=4&limits=minute%7Ctokens%7C10000000%7C5%3Bday%7Ccost%7C20&models=glm-5%2Cglm-5-air&specs=glm-5-air%7C128000%7C96000%7Cy%7Cn&price_multiplier=0.8&prices=glm-5%7C1%7C3.2%7C0.2
```

使用访问密钥的 Amazon Bedrock，区域为 `eu-west-1`：

```text
thinkwatch://import?service=bedrock&auth=aws-keys&region=eu-west-1&aws_access_key_id=AKIAIOSFODNN7EXAMPLE&aws_secret_access_key=wJalrXUtnFEMI%2FK7MDENG%2FbPxRfiCYEXAMPLEKEY
```

ThinkWatch 企业网关。ThinkWatch 企业版控制台中的「添加到 ThinkWatch Lite」按钮会用网关地址与新密钥写出这样的链接：

```text
thinkwatch://import?service=thinkwatch&name=thinkwatch&url=https%3A%2F%2Fai.example.com&key=tw-EXAMPLE
```

ChatGPT 账号。链接打开登录界面，不含任何凭据：

```text
thinkwatch://import?service=openai&auth=account&name=chatgpt
```

为更早版本编写、仍然有效的链接：

```text
thinkwatch://import?name=example-relay&url=https%3A%2F%2Fapi.relay.example&protocol=anthropic&key=sk-relay-EXAMPLE
```

即使识别出的服务类型不接受，为更早版本编写的链接仍然有效：例如官方地址带有其他路径（`https://api.openai.com/v1`）、Ollama 地址带有 `key`，或 `https://api.deepseek.com` 配合 `protocol=openai-chat`。这样的链接与以前一样创建为自定义上游。

## 在 New API 站点上

New API 或 One API 站点不用改代码，就能为每一把密钥提供 ThinkWatch Lite。在站点的系统设置中添加一个聊天预设，名称为 ThinkWatch Lite，地址为：

```text
thinkwatch://import?service=newapi&url={address}&key={key}
```

站点会填入自己的服务器地址和这一行的密钥，每把密钥的聊天菜单中随之出现这一项。打开它需要 ThinkWatch Lite 2026.10.16 或更新版本；版本更早或没有安装应用时，点击没有反应。

## 由 Lite 生成

ThinkWatch Lite 2026.10.25 起也能为已有的上游生成导入链接，把一个上游交给另一台设备或另一位用户。上游行的 ⋯ 菜单中，「查看流量」之后是「分享…」，它打开「分享上游」对话框：

- 对话框显示网页形式的链接，「复制网页链接」与「复制 thinkwatch:// 链接」分别复制两种形式。网页链接在未安装 Lite 的设备上显示安装说明，`#` 之后的内容不发送至网站服务器。
- 「包含密钥」缺省开启，此时对话框提示「链接包含密钥。持有链接即可使用该密钥，请仅通过可信渠道发送。」关闭后链接不含密钥，接收方在对话框中自行填写。
- 对话框底部列出链接包含与不包含的内容，例如「包含：地址、协议、密钥、2 个模型、余额来源。不包含：出站代理、路由。」

链接写入的内容如下：

| 内容 | 是否写入 | 说明 |
|---|---|---|
| 服务类型、认证方式、站点、名称、地址、协议（`service`、`auth`、`site`、`name`、`url`、`protocol`） | 写入 | — |
| 并发上限、用量上限、转发客户端身份、余额来源、模型列表、只用这些模型、手动规格、计费方式、价格倍率、价目（`concurrency`、`limits`、`client_identity`、`balance`、`models`、`models_only`、`specs`、`billing`、`price_multiplier`、`prices`） | 写入 | 与缺省值相同的不写 |
| 密钥、请求头、AWS 访问密钥、OAuth 凭据 | 由「包含密钥」决定，缺省写入 | 值写成 `${变量名}` 时不能写入，因为链接不接受这种写法；该项省略，并注明原因 |
| 出站代理、别名、路由、权重、停用状态、AWS profile | 不写入 | 导入链接不接受这些参数，见[链接不能设置的内容](#链接不能设置的内容) |
| ChatGPT、Z.ai / BigModel 的账号登录凭据 | 不写入 | 链接只写登录方式，接收方停在登录一步，自行登录 |
| 200K 以上的分档价格；含有链接不接受的字符的值 | 不写入 | 对话框底部的「不包含」中注明 |

链接超过 8192 个字符时（通常因为价目或规格较多），链接形式不可用，对话框写明链接的长度，提示改用配置包；上游无法写成导入链接时同样如此。「导出为配置包…」打开导出对话框，并预先勾选这个上游；口令加密可选，缺省不加密。接收方通过「导入配置…」导入，配置包也能带上上游所用的出站代理等链接不能设置的内容，见[同步与备份](/zh-CN/docs/lite/sync-and-backup#导出配置)。

链接的生成与解析遵循本页的同一套规则：生成的链接在同一版本的应用中打开时，「新建上游」对话框中的设置与原上游一致，上表中不写入的内容除外。

## 链接中的密钥

含有密钥、Refresh Token 或私有访问密钥的链接本身就是凭据。应为每位客户单独生成链接，并通过私密渠道提供，例如客户自己的控制台。不含密钥的链接会让密钥栏位留空，由用户在对话框中填写。
