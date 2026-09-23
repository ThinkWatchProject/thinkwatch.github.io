# 贡献指南

## PR 目标分支

```bash
gh pr create --base dev --head your-branch
```

`main` 为发布分支，`dev` 用于合入日常工作。GitHub 新建 PR 时以默认分支 `main` 作为 base，**该默认值并非正确的目标分支**。如已向 `main` 提交 PR，点击 PR 标题旁的 *Edit* 修改 base 即可，提交与讨论记录均会保留。

## 已确定的范围

以下决定已经确定，不接受相关 PR：

- **macOS 与 Windows，同一个 tag 发布。** 每个版本的 tag 产出三个供安装的文件，网关都在包内，旁边各附 sha256：macOS 的 arm64 磁盘映像，以及 Windows 的 x64 与 arm64 安装程序。没有 Linux 版本。
- **macOS：只面向 Apple Silicon，且未经 Apple 签名。** macOS 的产物是磁盘映像中的 arm64 `.app`，使用项目自己的自签名证书签名。该证书不满足 Gatekeeper 的要求，它的作用是让每个版本的签名者保持一致，Homebrew 升级时才不会提示签名者变更。Intel 的通用二进制和 Developer ID 签名都是持续成本，目前没有人承担，因此只加公证步骤、没有对应账号的 PR 无法合并；让构建回退到本机架构的 PR 同样无法合并——那会发出一个部分用户下载后打不开的文件。
- **Windows：未经代码签名。** 安装程序不带 Authenticode 签名，项目也不会购买证书，因此首次运行下载的安装程序时 SmartScreen 会发出警告。更新包与 macOS 一样，用编译进应用的公钥验签。

网关本体（路由、转发、成本核算、脱敏）由 [ThinkWatch Core](https://github.com/ThinkWatchProject/ThinkWatch-Core) 实现。涉及数据通路的行为变更，应提交至该仓库。

## 提交信息

使用 Conventional Commits（`fix(scope): subject`），并以**英文**书写：本仓库为公开仓库，提交历史即为文档。

正文应说明*原因*，而不仅是*改动内容*；改动内容已由 diff 体现。

## 提交 PR 前的检查

```bash
pnpm typecheck
pnpm test
cargo fmt --manifest-path src-tauri/Cargo.toml --all --check
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
cargo test --manifest-path src-tauri/Cargo.toml
```

警告视为错误。工具链为 `stable`，若其版本新于本地工具链，可能报告本地未出现的 lint；排查 CI 问题前，请先执行 `rustup update stable`。

另请参阅[界面约束](/zh-CN/docs/lite/architecture)。
