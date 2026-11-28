# TOKEX 上游同步操作手册（UPSTREAM_SYNC）

> **当前基线**：`v1.0.0-rc.52`（`04dfcbb`）  
> **配套文档**：后端定制与前端全局接口约定见 [TOKEX_DEV_GUIDE.md](file:///home/ubuntu/tokex/TOKEX_DEV_GUIDE.md)（第 1 节与第 4 节）。  
> **前置状态**：本仓库已开启 `git config rerere.enabled true`，可自动记忆并复用同类冲突解法。

---

## 1. 标准同步流程

以同步上游新 tag（例如 `v1.0.0-rc.53`）为例：

```bash
cd /home/ubuntu/tokex

# 1. 拉取上游最新提交与 tag（严禁向 upstream push）
git fetch upstream --tags

# 2. 从 dev 切临时同步分支并合并目标 tag
git checkout dev
git checkout -b sync/upstream-v1.0.0-rc.53
git merge v1.0.0-rc.53
```

3. **逐项检查冲突与新增子模块**：
   - 按第 2 节原则处理冲突；
   - **必查项 — 上游新增/调整 Go 子模块**：例如 `rc.52` 将插件契约拆为独立子模块 `pluginkit/`。每次合并后需对比上游 `makefile`、`Dockerfile` 与 `.github/workflows/ci.yml`，确认 [`.github/workflows/tokex-dev-test.yml`](file:///home/ubuntu/tokex/.github/workflows/tokex-dev-test.yml)（`paths` 触发器、`cache-dependency-path`、`go vet`）和 [`.github/workflows/tokex-build.yml`](file:///home/ubuntu/tokex/.github/workflows/tokex-build.yml)（`cache-dependency-path`）是否需要同步加入新子模块。
4. **更新 `VERSION` 文件并合回 `dev`、推进基线指针**：
   - 上游仓库内的 [`VERSION`](file:///home/ubuntu/tokex/VERSION) 默认是 0 字节空文件；若合入后 `VERSION` 未自动体现新版本，需同步更新为 `<新tag>-tokex`（例如 `echo "v1.0.0-rc.53-tokex" > VERSION` 并提交；日常 `dev`/`main` 自有改动保持 `VERSION` 不变）：
   ```bash
   echo "v1.0.0-rc.53-tokex" > VERSION
   git add VERSION && git commit -m "chore(version): bump VERSION to v1.0.0-rc.53-tokex"
   git checkout dev
   git merge --no-ff sync/upstream-v1.0.0-rc.53 -m "merge: sync v1.0.0-rc.53 into dev"
   git branch -d sync/upstream-v1.0.0-rc.53
   git branch -f upstream-base v1.0.0-rc.53
   ```

> **向上游提 PR 铁律**：若需单独向上游提 PR，**必须从 `upstream/main` 切干净分支**，仅提交或 `cherry-pick` 该修复本身，**严禁从 `dev` 提 PR**。

---

## 2. 冲突取舍原则

- **后端 Go 定制**：所有 TOKEX 后端补丁清单以 [TOKEX_DEV_GUIDE.md](file:///home/ubuntu/tokex/TOKEX_DEV_GUIDE.md) **第 1 节**为准（含 `service/group.go`、`controller/topup.go`、邀请返佣与路由权限/保留命名空间声明等）。合入时保留上游新增渠道、模型、协议转换与 Bug 修复，同时确保 TOKEX 补丁与保留路由声明不丢失（若上游将某段声明迁移到新文件或新子模块，如 `rc.52` 将 `reservedRouteNamespaces` 从 `pkg/jsplugin/routing.go` 迁至 `pkg/jsplugin/host.go` 并配合 `pluginkit/host.go`，需在目标位置补回 TOKEX 条目）。
- **前端分层处理**（全局视觉与动效接口约定见 [TOKEX_DEV_GUIDE.md](file:///home/ubuntu/tokex/TOKEX_DEV_GUIDE.md) **第 4 节**）：
  1. **TOKEX 独占模块**（如首页 `features/home/`、文档 `features/docs/`、法务 `features/legal/`、推广 `features/referrals/`、`ambient-backdrop.tsx`、`liquid-glass-tracker.ts`）：上游不存在，默认无冲突保留。
  2. **全局视觉底座**（如 `web/src/styles/`、`components/layout/`、`components/ui/`、`components/data-table/`）：以 TOKEX 曜石黑与铂金磨砂玻璃底座为准，仅按需吸收上游新增的功能性 props。
  3. **业务功能页**（如 `pricing/`、`wallet/`、`channels/`、`system-settings/` 等）：**功能逻辑、字段、校验与类型跟上游走，容器样式、玻璃卡片与动效外壳沿用 TOKEX 全局接口**。
- **i18n 语言文件（`web/src/i18n/locales/*.json`）**：两边新增词条全部保留；若同一 key 冲突，以 TOKEX 中文品牌与文案习惯为准；合并后必须校验 JSON 语法合法（注意尾随逗号）。
- **硬性保护项**：合并时**必须守住 [`web/rsbuild.config.ts`](file:///home/ubuntu/tokex/web/rsbuild.config.ts#L89) 中的 `buildCache: false` 不被上游改写**，防止 1.8Gi 主机构建时写入缓存顶满 Swap。
- **人工确认红线**：遇到**拿不准的业务逻辑冲突**（例如上游重构了计费/鉴权/支付核心链路且与 TOKEX 补丁语义交叉）时，**必须立即停下来向用户确认，严禁自行猜测取舍**。

---

## 3. 验证与发布流程（适配 1.8Gi ARM64 主机）

1. **主机硬约束**：
   - **严禁在 1.8Gi 主机本地运行 `go test` 或 Go 编译**，全部交由 GitHub Actions 云端执行；
   - **前端校验必须通过 Bun 调用**（容器默认 `node` 版本过旧），且**跳过在当前 ARM64 容器触发 `SIGABRT` 的 `oxlint` / `oxfmt`**：
     ```bash
     export PATH="$HOME/.bun/bin:$PATH"
     cd /home/ubuntu/tokex/web
     bun check -b
     bun --bun ./node_modules/.bin/vitest run src/features/<受影响模块>/__tests__/<测试文件>.test.tsx
     ```
2. **推送 `dev` 跑云端 Go 测试**：
   ```bash
   cd /home/ubuntu/tokex
   git push origin dev
   ```
   等待 [`.github/workflows/tokex-dev-test.yml`](file:///home/ubuntu/tokex/.github/workflows/tokex-dev-test.yml)（全量 `go vet` + `make test`）全部通过后再进入发布。
3. **合并 `main` 云端构建并部署上线**：
   ```bash
   cd /home/ubuntu/tokex
   git checkout main && git merge dev --no-ff -m "Merge branch 'dev'"
   git push origin main
   git checkout dev
   ```
   等待 [`.github/workflows/tokex-build.yml`](file:///home/ubuntu/tokex/.github/workflows/tokex-build.yml) 构建完成（可直接在主机下载 Actions 产出的 `web-dist` 同步 Nginx，避免本地执行耗时 `rsbuild build`）：
   ```bash
   # 1) 同步前端静态产物到 Nginx（若本机刚运行过 bun --bun ./node_modules/.bin/rsbuild build，也可直接 rsync web/dist/）
   gh run download <RUN_ID> -R leoravyn/new-api -n web-dist -D /tmp/tokex-web-dist
   rsync -a --delete /tmp/tokex-web-dist/ /var/www/tokex/dist/
   rm -rf /tmp/tokex-web-dist

   # 2) 拉取新镜像并重建 tokex-web 容器（compose 默认引用 ${TOKEX_WEB_IMAGE:-ghcr.io/leoravyn/tokex-web:latest}）
   cd /opt/tokex && docker compose pull web && docker compose up -d web
   # 如需回滚或固定版本，在 /opt/tokex/.env 设置 TOKEX_WEB_IMAGE=ghcr.io/leoravyn/tokex-web:<short_sha>（或 :<VERSION>）后执行 docker compose up -d web
   ```
4. **线上冒烟验证**：
   ```bash
   curl -sS -o /dev/null -w "local:%{http_code}\n" http://127.0.0.1:3000/api/status
   curl -sS -o /dev/null -w "root:%{http_code}\n" https://tokex.vip/
   curl -sS -o /dev/null -w "status:%{http_code}\n" https://tokex.vip/api/status
   curl -sS -o /dev/null -w "pricing:%{http_code}\n" https://tokex.vip/pricing
   ```
