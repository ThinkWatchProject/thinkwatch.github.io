# 贡献指南

## PR 请提到 `dev` 分支

```bash
gh pr create --base dev --head your-branch
```

`main` 是发布线，`dev` 是日常工作合入的地方。GitHub 新建 PR 时默认的 base 是默认分支 `main`，所以**默认值不是你想要的那个**。如果已经提到了 `main`，点 PR 标题旁边的 *Edit* 把 base 改掉即可，提交和讨论都会保留。

## 已经定下的范围

有两件事已经定了，不接受为此提的 PR：

- **先做 macOS。** Windows 和 Linux 等 macOS 版做完再适配，所以现在添加它们的 PR 暂时不会合并。
- **不分发构建产物。** 没有签名的 `.app`，没有安装包，没有发布流程，没有自动更新。从源码运行。

网关本体（路由、转发、计费、脱敏）在 [ThinkWatch Core](https://github.com/ThinkWatchProject/ThinkWatch-Core) 里。如果你想改的行为在数据通路上，应该去那个仓库。

## 提交信息

使用 Conventional Commits（`fix(scope): subject`），并用**英文**书写：这是一个公开仓库，提交历史就是文档。

在正文里写清楚*为什么*，而不只是*改了什么*；改了什么 diff 已经说明了。

## 提 PR 之前

```bash
pnpm typecheck
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
cargo test --manifest-path src-tauri/Cargo.toml
```

警告即错误。工具链是 `stable`，比你本地更新的 stable 可能报出你本地看不到的 lint；怪 CI 之前先跑一下 `rustup update stable`。

另外请读一读[界面绝不能做的事](/zh-CN/docs/lite/architecture)。
