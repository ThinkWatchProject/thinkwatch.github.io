# ThinkWatch Lite

ThinkWatch Lite 是本地 AI API 网关的桌面端。它是一个菜单栏应用，托管 [ThinkWatch Core](/zh-CN/docs/core)，把它的配置、流量和花费摆到你眼前。

> ThinkWatch Lite 先做 macOS，不分发构建产物。没有签名的 `.app`，没有安装包，没有 release 页面：请[从源码运行](/zh-CN/docs/lite/run-from-source)。

把 Claude Code、Codex，或者任何说 Anthropic / OpenAI API 的东西指向一个本地端口，Lite 就是看接下来发生了什么的那个窗口。

## 一次会话花了多少，以及那个数字有多可信

实测、估算、算不出价钱是三个分开的数字，绝不相加。价目表的快照日期就标在合计旁边：一个两个月前的价目表算出来的数，和昨天的不是一回事。

## 每个请求去了哪儿、为什么

每个请求都能看到命中的规则（按名字说）、经过的策略组，以及完整的故障转移链，每一跳带着原因和耗时。

## 跟着它出去的还有什么

Lite 会显示被抓到正发往不受信任上游的密钥、做过的脱敏，以及看起来危险的工具调用。请求体和响应体在上屏之前就已经打过码。

## 配置有两种改法

改一个值用表单，结构性的改动用 CodeMirror 编辑器。两条路走同一个 span 补丁层，所以改一个字段就只有那一行变，你的注释一字不动。

## 菜单栏那 50 像素

菜单栏显示今日花费，或者订阅账号的剩余额度。它渲染成图片，因为菜单栏放不下两行文字。

## 网关在哪里

网关本体在 ThinkWatch Core 里。Lite 不含任何路由、转发或计费逻辑，它通过一个 unix socket 和 Core 通信。详见[架构](/zh-CN/docs/lite/architecture)。

## 许可

ThinkWatch Lite 采用 MIT 许可。
