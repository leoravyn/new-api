---
name: tokex-upstream-sync
description: Sync the TOKEX fork with a new QuantumNous/new-api upstream release tag while preserving custom patches, UI, and host constraints. Use when the user asks to sync upstream, update to a new rc/release version, or check upstream updates (e.g., "同步上游", "跟进上游", "升级到 rc.53").
---

# TOKEX Upstream Sync

执行前必须先完整阅读仓库根目录的 `UPSTREAM_SYNC.md`、`TOKEX_DEV_GUIDE.md` 以及 `VERSION` 文件，严格遵守其中的冲突取舍原则与 1.8Gi ARM64 主机构建约束。

## 执行流程

1. 确认当前位于 `/home/ubuntu/tokex` 的 `dev` 分支且工作区干净；执行 `git fetch upstream --tags` 检查最新 tag（若用户未指定目标版本，先列出最新可用 tag 并汇报差异概览，待确认后再执行 merge）。
2. 严格按 `UPSTREAM_SYNC.md` 创建 `sync/upstream-<tag>` 临时分支合并，同步更新根目录 `VERSION` 文件与 `upstream-base` 指针，并检查上游是否新增 Go 子模块影响到 `.github/workflows/` 缓存配置。
3. 解冲突时守住 `web/rsbuild.config.ts` 中的 `buildCache: false`，前端本地验证必须通过 `bun --bun` 执行并跳过 `oxlint`/`oxfmt`，严禁在本地运行 Go 编译或单测。

## 人工确认卡点（不可跳过）

- 遇到拿不准的业务逻辑冲突时，必须暂停并列出差异向用户确认，不要自行猜测。
- 推送 `origin/dev` 并确认云端 `tokex-dev-test.yml` 通过后即停止，明确汇报结果，等用户确认后再执行合并 `main`、拉取镜像或同步 Nginx 静态产物。
