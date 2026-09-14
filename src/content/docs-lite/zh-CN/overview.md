# ThinkWatch Lite

ThinkWatch Lite 是本地 AI API 网关的桌面应用。它是一个菜单栏应用，负责托管 [ThinkWatch Core](/zh-CN/docs/core)，并展示其配置、流量与成本。

> ThinkWatch Lite 正在开发中，优先支持 macOS，其他平台将在 macOS 版本完成后适配。项目不分发构建产物：不提供签名的 `.app`、安装包或 release 页面，需[从源码构建](/zh-CN/docs/lite/run-from-source)。

将 Claude Code、Codex 或任何使用 Anthropic / OpenAI API 的客户端指向本地端口后，即可通过 Lite 查看每个请求的处理过程。

## 会话成本及其可信度

实测、估算与无法计价的成本分别列为三个数字，不会相加。合计旁标注价目表的快照日期，因为基于不同日期价目表计算的数字不可直接比较。

## 请求路由

每个请求均显示命中的规则名称、策略组以及完整的故障转移链，每一跳附有原因与耗时。

## 出站内容

Lite 会标记发往不受信任上游的密钥、已执行的脱敏以及潜在危险的工具调用。请求体与响应体在显示前即已遮蔽。

## 配置编辑

修改单个值使用表单，结构性修改使用 CodeMirror 编辑器。两者均通过同一 span 补丁层写入，因此修改一个字段仅变更对应的一行，并保留原有注释。

## 菜单栏

Lite 在菜单栏中占用 50 像素，显示当日花费，或订阅账号的剩余额度。由于菜单栏无法容纳两行文字，该区域以位图形式渲染。

## 与 ThinkWatch Core 的关系

网关由 ThinkWatch Core 实现。Lite 不包含路由、转发或计量逻辑，通过 unix socket 与 Core 通信。详见[架构](/zh-CN/docs/lite/architecture)。

## 许可证

ThinkWatch Lite 采用 MIT 许可证。
