# 开发与测试

## 运行测试

```bash
cargo test --workspace     # 单元与集成测试
scripts/smoke.sh           # 从初始状态出发，在真实二进制上覆盖每条路径
```

`scripts/smoke.sh` 使用真实的二进制、socket 与数据面运行，可发现单元测试在结构上无法覆盖的问题：文件权限、socket 路径长度限制、未注册的端点，以及被静默忽略的配置字段。本项目最早的四个真实缺陷均出自这些环节。

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

PR 应提交至 `dev` 分支，而非 `main`：

```bash
gh pr create --base dev --head your-branch
```

`main` 为发布分支，`dev` 用于合入日常工作。提交信息遵循 Conventional Commits（`fix(scope): subject`），以英文书写。正文应说明*原因*，而不仅是*改动内容*。

## 强制规则

两个版本均依赖这些 crate，因此仅满足单一场景并不足够。违反以下任何一条规则的 PR 都将被要求修改，无论 diff 质量如何：

- **禁止回显真实密钥**：界面、diff、日志、事件、诊断包与测试夹具中均不得出现。遮蔽在数据离开进程之前完成。
- **禁止将估算值作为精确值呈现。** 成本有三种状态：实测、估算、无价格。将第三种视为 0 会导致合计在无任何提示的情况下出错。
- **观测不得阻塞转发。** 存储、计价与扫描均通过有界通道执行；通道已满时丢弃该次观测，而不延迟请求。
- **只报告，不自动删除。** 扫描器不存在写入路径，并有一项测试通过读取产品代码加以验证。
- **任何绕过主流水线的路径都必须重新施加其保护措施。** 重放功能曾险些成为绕过脱敏的合法途径。

## 价目表

`crates/tw-pricing` 内嵌一份固定快照，不会自动更新。更新步骤记录于 `crates/tw-pricing/data/PROVENANCE.md`，CI 中的测试会将快照与人工核对的 `data/verified.yaml` 逐行比对。
