# 开发与测试

## 运行测试

```bash
cargo test --workspace     # 单元与集成测试
scripts/smoke.sh           # 从零起，在真二进制上把每条路走一遍
```

`scripts/smoke.sh` 用真实的二进制、真实的 socket 和真实的数据面来跑。它能抓到单元测试在结构上抓不到的问题：文件权限、socket 路径长度限制、根本没注册的端点、被悄悄吞掉的配置字段。这个项目最早的四个真实 bug 全都出在这些接缝处。

冒烟脚本不碰你自己的任何东西：`HOME` 和 `THINKWATCH_HOME` 都指向一个临时目录，跑完就删。

访问真实网络的测试标记为 `#[ignore]`，不在 CI 中运行。

## 提 PR 之前

```bash
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
./scripts/smoke.sh
```

警告即错误，在 CI 上放宽这一点就等于把它删掉。工具链是 `stable`，比你本地更新的 stable 可能报出你本地复现不了的 lint；怪 CI 之前先跑一下 `rustup update stable`。

PR 请提到 `dev`，而不是 `main`：

```bash
gh pr create --base dev --head your-branch
```

`main` 是发布线，`dev` 是日常工作合入的地方。提交信息遵循 Conventional Commits（`fix(scope): subject`），用英文书写。在正文里写清楚*为什么*，而不只是*改了什么*。

## 承重的规则

两个版本都依赖这些 crate，所以「在我的场景下能用」不是标准。破坏以下任何一条规则的 PR 都会被要求修改，无论 diff 多干净：

- **绝不回显真实的密钥**：界面、diff、日志、事件、诊断包、测试夹具里都不行。打码在数据离开进程之前完成。
- **绝不把估算当成精确值。** 成本有三种状态：实测、估算、完全没有价格。把第三种当成 0，会让合计悄无声息地出错。
- **观测绝不能阻塞转发。** 存储、计价和扫描都走有界通道；通道满了就丢掉这次观测，而不是拖慢请求。
- **只报告，绝不自动删除。** 扫描器没有写路径，并且有一个测试会读产品代码来证明这一点。
- **任何绕过主流水线的路径都要重新施加它的保护。** 重放功能差一点就成了绕过脱敏的正当途径。

## 价目表

`crates/tw-pricing` 内嵌一份固定的快照，不会自动更新。更新步骤写在 `crates/tw-pricing/data/PROVENANCE.md` 里，CI 中有一个测试会把快照与人工核对过的 `data/verified.yaml` 逐行比对。
