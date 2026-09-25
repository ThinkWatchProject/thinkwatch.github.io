# 开发与测试

## 运行测试

```bash
cargo test --workspace     # 单元与集成测试
scripts/smoke.sh           # 从初始状态出发，在真实二进制上覆盖每条路径
```

`scripts/smoke.sh` 使用真实的二进制、socket 与数据面运行，并通过 `twcore call` 访问控制面：每条控制连接都先进行 Noise 握手，`curl` 无法直接访问。它可发现单元测试在结构上无法覆盖的问题：文件权限、socket 路径长度限制、未注册的端点，以及被静默忽略的配置字段。本项目最早的四个真实缺陷均出自这些环节。

冒烟脚本不会修改用户的任何文件：`HOME` 与 `THINKWATCH_HOME` 均指向临时目录，执行结束后自动删除。

访问真实网络的测试标记为 `#[ignore]`，不在 CI 中运行。

## 提交 PR 前的检查

```bash
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
./scripts/smoke.sh
```

警告视为错误，在 CI 上放宽该规则即等同于取消该规则。工具链为 `stable`，若其版本新于本地工具链，可能报告本地无法复现的 lint；排查 CI 问题前，请先执行 `rustup update stable`。

PR 提交至 `main`，这是唯一的长期分支；发布版本即其上打了 tag 的提交：

```bash
gh pr create --base main --head your-branch
```

提交信息遵循 Conventional Commits（`fix(scope): subject`），以英文书写。正文应说明*原因*，而不仅是*改动内容*。

## 强制规则

ThinkWatch Lite 与 ThinkWatch 企业版都依赖这些 crate，因此仅满足单一场景并不足够。违反以下任何一条规则的 PR 都将被要求修改，无论 diff 质量如何：

- **禁止回显真实密钥**：界面、diff、日志、事件、诊断包与测试夹具中均不得出现。遮蔽在数据离开进程之前完成。
- **禁止将估算值作为精确值呈现。** 费用有三种状态：实测、估算、无价格。将第三种视为 0 会导致合计在无任何提示的情况下出错。
- **观测不得阻塞转发。** 存储、计价与扫描均通过有界通道执行；通道已满时丢弃该次观测，而不延迟请求。
- **任何绕过主流水线的路径都必须重新施加其保护措施。** 重放功能曾险些成为绕过脱敏的合法途径。
- **控制面只有一个入口。** 每种传输方式（unix socket、Windows 回环端口与远程控制端口）都先把连接交给同一套握手，之后才进入 HTTP。控制密钥不会经控制面流出，也无法经控制面修改。

## 配置手册

[配置手册](/zh-CN/docs/core/configuration)即仓库中的 `docs/config.zh-CN.md`（英文版为 `docs/config.md`），本站从最新的发布版本取用。正文由人工撰写，字段表与内置规则列表则由 `crates/tw-config/tests/manual/schema.rs` 生成。该文件按 Rust 类型声明 `config.yaml` 的每一节，并由测试对照代码检查这份声明：字段名取自 serde 本身，声明的默认值会被解析并与省略该字段的效果比较，手册中的示例也会作为配置解析。

修改配置类型后，须同时补充或修改中英文两份说明，再重新生成字段表：

```bash
UPDATE_CONFIG_DOCS=1 cargo test -p tw-config --test manual
```

## 价目表

价格分两层。默认价目表是 LiteLLM 的公开数据集：`crates/tw-pricing` 内嵌一份固定快照，更新步骤记录于 `crates/tw-pricing/data/PROVENANCE.md`，CI 中的测试会将快照与人工核对的 `data/verified.yaml` 逐行比对。运行时，控制面每天刷新一次（`pricing.auto_update: false` 时不刷新），并保存为 `config.yaml` 旁的 `model_prices.json`；两份中较新的一份用于计价。

自定义价目表写在 `config.yaml` 的 `pricing.sheets` 下：在默认价目表之上乘一个倍率，外加逐个模型写全各项价格的覆盖。上游用 `pricing:` 选择一张价目表；未选择时使用默认价目表。

## 发布

发布版本是 `main` 上的一个 `vX.Y.Z` tag，打 tag 前须先提升工作区 `Cargo.toml` 中的版本号。发布流程为 Apple silicon 的 macOS、x64 与 ARM64 的 Windows、x86_64 与 aarch64 的 Linux 构建 `twcore`，逐一检查后连同各自的 `.sha256` 文件一并发布；任何一个目标构建失败，则什么都不发布。Linux 压缩包另含 systemd 服务单元，供服务器安装脚本使用；单独的二进制文件由 ThinkWatch Lite 打包，也由 `twcore upgrade` 下载。
