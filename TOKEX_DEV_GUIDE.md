# TOKEX 项目架构与开发管理手册

> **最后更新**：2026-11-26  
> **适用对象**：后续接手本项目的开发者与 AI Agent（阅读本文件即可掌握当前架构、分支规范、主机运维边界与发布流程）。

---

## 1. 线上全景与核心功能实现

- **主站与 API 网关**：`https://tokex.vip`
- **上游号池管理端**：`https://sub.tokex.vip`
- **整体架构**：**React 静态托管 + Nginx 反向代理 + Docker 后端**
  - **前端产物**：基于 New API 前端（`/home/ubuntu/tokex/web`）二次开发，Rsbuild 编译后发布至 `/var/www/tokex/dist`，由 Nginx 直接托管。
  - **后端网关**：`tokex-web`（镜像 `tokex-web:v1.0.0-rc.51-tokex`，由 GitHub Actions 构建 `ghcr.io/leoravyn/tokex-web:latest` 后拉取打标或本地兜底构建，基于 `QuantumNous/new-api` `v1.0.0-rc.51` 并合入 TOKEX 补丁，`127.0.0.1:3000`）。
  - **数据库与缓存**：`tokex-db`（`postgres:18-alpine`，承载 `newapi` 与 `sub2api` 库，Docker 内网 `tokex-net:5432`）、`tokex-redis`（`redis:8-alpine`，Docker 内网 `tokex-net:6379`）。
  - **上游代理**：`tokex-pool`（官方 `weishaw/sub2api:latest`，`RUN_MODE=simple`，`127.0.0.1:8080` / 内网 `http://tokex-pool:8080`）。

### 当前核心功能实现
1. **品牌视觉与双语**：纯无色相石墨黑 + 拉丝铂金 + 银灰深色材质体系（外框/侧栏 `#08080A`、主工作区 `#0C0C0E`、卡片 `#121214`、内嵌/次级 `#17171A`/`#1B1B1F`、拉丝铂金渐变主按钮 `#FAFAFA`→`#D6D6DB` 配 `#0A0A0B` 深色字、中性 1px 高光描边 `rgba(255,255,255,0.07)`、顶部柔和中性棚光 `rgba(255,255,255,0.04)` 与 SVG `feTurbulence` 细腻胶片颗粒层，状态色统一收敛为低饱和鼠尾草绿/香槟金/暗玫瑰红），公开页顶栏在顶部完全透明融入画布、滚动后渐变为毛玻璃细线栏，桌面端控制台采用 Linear 嵌入式工作区外壳，锁定 `dark` 模式与 `zhCN`/`en` 双语；完整 Token 与 Waffo 收银台定制视觉规范见 [DESIGN.md](file:///home/ubuntu/tokex/DESIGN.md)。
2. **首页与模型广场**：首页右侧实时接入 `/api/pricing` 旗舰模型并直链 `/pricing/$modelId`；模型广场支持分组倍率胶囊（`Official` / `Proxy`）、侧边栏分组筛选、详情页多分组切换，并对所有 `groupRatio !== 1` 分组展示带删除线的 `1x` 原价与当前价格。
3. **认证与安全链路**：Resend 邮件验证码（`noreply@tokex.vip`）、邮箱域名白名单、Cloudflare Turnstile、GitHub OAuth 与 Google OIDC。
4. **Waffo MoR 合规与法务页面**：免登录公开路由 `/terms`、`/user-agreement`、`/privacy-policy`、`/aup`（仅面向中国大陆以外非受限地区、`Waffo Pancake` MoR、`support@tokex.vip`、10% 清算与行政管理手续费例外条款、中国香港特别行政区法律与 HKIAC 仲裁）；全站 `PublicLayout` 页脚、认证页及钱包结账页均常驻合规入口。
5. **多币种钱包充值、Epay 回跳路由与后端补丁**：
   - 钱包额度以 `USD` 计价；**Waffo Pancake**（`waffo_pancake`，`1.0` USD 结算，内置 W 图标需在 `PayMethods` 中将 `icon` 留空）与 **Epay / Zpay**（`https://zpayz.cn`，涵盖 `alipay`、`wxpay` 等非 Waffo/Stripe 渠道，按 `Price=7` 折算 `CNY` 结算）共存时，前端按 `getPaymentSettlementCurrency` 在充值页、确认弹窗与账单历史中自动区分展示 `USD` 与 `CNY`（默认预览优先对齐 Waffo Pancake 的 `USD` 展示）。
   - Epay 支付完成回跳 `/usage-logs` 时，前端路由 `src/routes/_authenticated/usage-logs/index.tsx` 通过 `isEpayReturnQuery` 识别回调参数（`trade_status` / `out_trade_no` / `trade_no`）并直接重定向回 `/wallet`；常规访问 `/usage-logs` 仍跳转 `/usage-logs/common`。
   - 后端基于已合入的 `v1.0.0-rc.51`（`c9c6da2`）保留 `MatchAmountDiscount`（`>= 阈值` 阶梯折扣匹配；Stripe 保留精确键匹配）、全局 `MinTopUp` 下限校验，以及邀请推广返佣与首充 9 折覆盖能力（对应 PR #8437 / #8438 及 TOKEX 推广返佣补丁）。
6. **独立邀请推广中心（`/referrals`）、首充 9 折特权与 5% 自动入账返佣**：
   - **受邀首充 9 折覆盖**：通过推荐链接注册（`inviter_id > 0`）且尚无已完成真实钱包充值（`top_ups.status = 'success' AND amount > 0`，订阅镜像 `amount = 0` 记录不消耗资格）的用户，在合规条款已确认且 `InviteFirstTopUpDiscount < 1` 时，`GET /api/user/topup/info` 返回 `first_topup_discount_eligible: true` 与 `first_topup_discount`（默认 `0.9`）。前后端全链路（Epay、Waffo Pancake、Waffo、Stripe 报价、钱包预设卡片、自定义金额优惠提示、Epay CNY 预估及确认弹窗）统一以首充特权折扣**直接覆盖**常规阶梯折扣（不叠加），并在钱包充值卡片顶部展示翡翠绿特权横幅。
   - **5% 充值返佣与冷静期自动入账**：所有 6 条充值入账路径（Epay / Stripe / Admin 手动补单 / Creem / Waffo / Waffo Pancake）在同一事务内幂等写入 `aff_commissions`（`trade_no` 唯一索引）；按实付 USD（Epay 实付 CNY 按 `Price` 换算为 USD）的 `AffCommissionRate`（默认 `0.05`）计算返佣，进入 `AffCommissionCooldownDays`（默认 `7` 天）冷静期。后台主节点定时任务 `service/aff_commission_task.go` 启动及每 10 分钟扫描到期记录，自动核验订单与双方账户状态后直接计入邀请人钱包余额（`users.quota` + `users.aff_history`）并刷新缓存。
   - **独立页面与配置入口**：控制台左侧导航 `Personal` 组新增 `/referrals`（`src/features/referrals/`），对接 `GET /api/user/referral/summary` 与 `GET /api/user/referral/commissions`，展示专属推广链接、动态规则说明、4 项核心 KPI、分页/状态筛选的返佣流水（脱敏展示被邀请人）及历史遗留余额手动划转入口（仅 `legacy_aff_quota > 0` 时展示）；`/wallet` 保持聚焦充值，底部精简为单行 `/referrals` 跳转卡片；超管可在 `/system-settings/billing/quota` 调整 `AffCommissionEnabled`、`AffCommissionRate`、`AffCommissionCooldownDays`、`InviteFirstTopUpDiscount`。

---

## 2. 目录与 Git 分支工作流

| 路径 | 用途 | 备注 |
|---|---|---|
| `/home/ubuntu/tokex/` | **TOKEX 开发仓库** | 主要维护 `web/`、文档与少量 Go 充值补丁（见第 1 节） |
| `/home/ubuntu/tokex/web/` | **React 19 + Rsbuild v2 前端工程** | 使用 Bun 运行类型检查、测试与构建 |
| `/home/ubuntu/tokex/.github/workflows/tokex-build.yml` | **TOKEX CI/CD 构建工作流** | `main` 推送自动构建 `web-dist` 与 ARM64 镜像 |
| `/var/www/tokex/dist/` | **线上 Nginx 静态根目录** | 优先从 Actions `web-dist` 产物同步至此目录 |
| `/opt/tokex/` | **生产容器编排根目录** | `docker-compose.yml`、`.env`、`data/`、`logs/`、`backups/`、`sub2api/` |
| `/opt/tokex/sub2api/` | **Sub2API 数据目录** | `data/`、`postgres_data/`、`redis_data/`（`.env` 软链至 `/opt/tokex/.env`） |
| `/etc/nginx/sites-available/tokex.conf` | **Nginx 主站点配置** | 软链至 `/etc/nginx/sites-enabled/tokex.conf` |

- **Git 分支与远程**（位于 `/home/ubuntu/tokex/`）：
  - `upstream-base`：`QuantumNous/new-api` 初始只读对照基线（`48a6c87` / `v1.0.0-rc.49`；当前 `dev`/`main` 已合并 `v1.0.0-rc.51` `c9c6da2`）。
  - **`main`**：生产发布分支；推送到 `origin/main` 会触发 `.github/workflows/tokex-build.yml`。
  - **`dev`**：默认开发分支，日常改动在此提交验收后再 `--no-ff` 合并到 `main`。
  - 远程 `origin` 指向 TOKEX Fork 仓库（`https://github.com/leoravyn/new-api.git`），日常 `dev` / `main` 均推送至此仓库。
  - 远程 `upstream` 指向官方 GitHub 主仓（`Calcium-Ion/new-api` -> `QuantumNous/new-api`），**勿直接 `git push`**；升级官方版本时先拉取 `upstream`，确认 PR #8437 / #8438 是否已合入后再决定直接切换官方镜像或合并后重编镜像。

---

## 3. 主机资源边界与多模态调优参数

主机物理内存 **1.8Gi（2GB 规格）** + **`/swapfile`（2.0Gi，`vm.swappiness=20`）**，磁盘 **30G（`/` 分区 27G）**；全链路请求体上限对齐 **40 MiB** 防 OOM：

| 组件 | 配置文件 | 关键生效参数 | 说明 |
|---|---|---|---|
| **Nginx** | `/etc/nginx/sites-available/tokex.conf` | `client_max_body_size 40m;` / `client_body_buffer_size 128k;` / `client_body_timeout 120s;` / `proxy_request_buffering on;` / `proxy_buffering off;` / `proxy_connect_timeout 30s;` / `proxy_read/send_timeout 600s;` / `limit_conn api_key_conn 3;`（`limit_conn_status 429`） | 吸收慢速大请求至磁盘缓冲，保持 SSE 零缓冲；`/v1/` 按 `Authorization`/`x-api-key` 限制单 Key 并发 |
| **tokex-web** | `/opt/tokex/docker-compose.yml` | `mem_limit: 900m` / `GOMEMLIMIT=700MiB` / `GOGC=75` / `MAX_REQUEST_BODY_MB=40` / `MAX_FILE_DOWNLOAD_MB=32` / `STREAM_SCANNER_MAX_BUFFER_MB=32` / `DEBUG=false` | 日志截断保留 `LocalLogContentLimit=2048`；`json-file` 限 `20m x 3` |
| **DiskCache** | DB `options` (`newapi`) | `disk_cache_enabled=true` / `threshold_mb=4` / `max_size_mb=256` | `>=4MB` 请求体暂存临时文件并在请求结束后清理 |
| **tokex-pool** | `/opt/tokex/docker-compose.yml` & `.env` | `mem_limit: 384m` / `GOMEMLIMIT=280MiB` / `GOGC=75` / `RUN_MODE=simple` / `SERVER_MAX_REQUEST_BODY_SIZE=41943040` / `GATEWAY_MAX_BODY_SIZE=41943040` / `GATEWAY_REQUEST_BODY_MEMORY_BUDGET_BYTES=134217728` / `LOG_OUTPUT_TO_FILE=false` | 防大图 Base64 OOM，关闭全量日志落盘 |
| **tokex-db** | `/opt/tokex/docker-compose.yml` | `mem_limit: 320m` / `shared_buffers=96MB` / `max_connections=100` / `effective_cache_size=192MB` | Docker 日志轮转 `10m x 3` |
| **tokex-redis** | `/opt/tokex/docker-compose.yml` | `mem_limit: 96m` / `--maxmemory 64mb` / `--appendonly yes` | Docker 日志轮转 `10m x 3` |

> 历史配置文件与数据库变更前备份保存在 `/opt/tokex/backups/`。

---

## 4. 前端源码核心定位（`/home/ubuntu/tokex/web/`）

- **品牌、样式与锁定约束**：
  - 资产与入口：`public/{favicon,logo-tokex,banner-tokex}.svg`、`index.html`、`rsbuild.config.ts`
  - 主题与双语：`src/styles/{theme,index}.css`、`src/lib/{constants,avatar,nav-modules}.ts`、`src/context/{theme,theme-customization,layout}-provider.tsx`（锁定 `dark` + 默认样式）、`src/i18n/{languages,config}.ts`
- **导航与通用 UI**：
  - 布局与导航：`src/components/layout/components/{public-header,public-layout,header,app-header,system-brand,footer,section-page-layout,authenticated-layout}.tsx`、`src/components/{profile-dropdown,notification-popover}.tsx`
  - 深色玻璃基元：`src/components/ui/{card,titled-card,icon-badge,tabs,table,dropdown-menu,popover,dialog,alert-dialog,alert,empty,sidebar}.tsx`
- **核心业务页面**：
  - 首页：`src/features/home/index.tsx`、`src/features/home/components/tokex/hero-section.tsx`
  - 法务与关于：`src/features/legal/`（`content/{legal-config,terms,privacy-policy,aup}.ts`、`components/legal-document-layout.tsx`）、`src/routes/{terms,aup,user-agreement,privacy-policy}.tsx`、`src/features/about/`
  - 认证：`src/features/auth/`（`sign-in`、`sign-up`、`forgot-password`、`secure-verification`、`components/{terms-footer,legal-consent}.tsx`、`hooks/`）
  - 模型广场与榜单：`src/features/pricing/`（`index.tsx`、`lib/{model-helpers,price,dynamic-price}.ts`、`components/{model-card,price-comparison,pricing-table,pricing-columns,pricing-sidebar,model-group-ratio-badges,model-details,dynamic-pricing-breakdown}.tsx`）、`src/features/rankings/`
  - 渠道与计费设置：`src/features/channels/`、`src/features/system-settings/integrations/`
  - 控制台与账户：`src/features/dashboard/`、`src/features/profile/`、`src/features/security/`、`src/features/wallet/`、`src/features/referrals/`；全部控制台路由见 `src/routes/_authenticated/`

---

## 5. 路由边界、接口与数据库现状

### Nginx 动静分流
- **静态 SPA**：`/static/*`（30d 强缓存）、`/index.html`（`no-cache, no-store, must-revalidate`）及所有前端路由（`/`, `/pricing`, `/rankings`, `/about`, `/terms`, `/user-agreement`, `/privacy-policy`, `/aup`, `/sign-in`, `/sign-up`, `/dashboard`, `/keys`, `/channels` 等）走 `try_files $uri $uri/ /index.html;`。
- **后端反代**：`location ^~ /v1/`（通过 `map` 提取 `$http_authorization`、为空时回退 `$http_x_api_key` 作为 `limit_conn_zone` 键，单 Key 上限 `3` 并发、超限返回 `429`）与 `location ~ ^/(api|v1|v1beta|pg|mj)(/|$)|^/[^/]+/mj/|^/(v1/)?dashboard/billing/` -> `http://127.0.0.1:3000`。**勿将 `/dashboard` 整体反代给后端。**

### 线上计费、分组与渠道现状（`newapi` 库）
- **计费与支付口径**：`QuotaDisplayType=USD`、`USDExchangeRate=1`、`MinTopUp=5`、`Price=7`（Epay/Zpay CNY 汇率）；启用 `Waffo Pancake`（`USD` 结算，`min_topup=10`，`icon` 留空使用内置 W 图标）与 `Epay / Zpay`（`Alipay`，`CNY` 结算，`min_topup=5`）。
- **现行分组**：`Codex Pro`（`0.36x`）、`Claude Max`（`0.46x`）、`Official`（`1.2x`），见 `options` 表 `GroupRatio` / `UserUsableGroups`。
- **启用渠道**（`channels` 表）：
  - `id=3`：`Codex-Pool`（`status=1`, `group=Codex Pro`, `http://tokex-pool:8080`, `gpt-6.1-sol` / `gpt-6-astra` / `gpt-6.2-sol` / `gpt-6.2-astra`）
  - `id=5`：`CCone`（`status=1`, `group=Claude Max`, `https://api.ccone.cc`, `claude-fable-5.2` / `claude-opus-5.5` / `claude-sonnet-5.5`）
- **重要提示**：直接修改库内 `options` 后需 `docker restart tokex-web` 重载；连接凭据见 `/opt/tokex/docker-compose.yml` 与 `/opt/tokex/.env`。

---

## 6. 开发、验证与发布标准流程

### 主流程：GitHub Actions 云端构建 + 服务端拉取同步（推荐）

由于生产主机仅 **2GB 内存**，日常发布优先走云端构建流水线（`.github/workflows/tokex-build.yml`）：
- **本地编辑并在 `dev` 验证后合并推送 `origin`**（`leoravyn/new-api`）
- **GitHub Actions 自动并发构建**：
  1. `build-web`（`ubuntu-latest`）：使用 Bun 执行 `bun check -b` 与 `bun run build`，上传 `web-dist` Artifact（供 Nginx 快速静态同步）。
  2. `build-docker`（`ubuntu-24.04-arm`，原生 ARM64）：使用 `Dockerfile` + `docker/build-push-action`（含 GHA 缓存）构建 `linux/arm64` 镜像，并通过 `GITHUB_TOKEN` 推送至 `ghcr.io/leoravyn/tokex-web:latest` 与 `ghcr.io/leoravyn/tokex-web:<short-sha>`。
- **服务端下载同步并重启容器**：拉取 GHCR 镜像打标重启 `tokex-web`，下载 `web-dist` 同步到 `/var/www/tokex/dist` 并重载 Nginx。

```bash
# 1. 本地（dev 分支）轻量校验、合并至 main 并推送 origin
export PATH="$HOME/.bun/bin:$PATH"
cd /home/ubuntu/tokex/web
bun check -b
# 按需运行相关单测：bun --bun x vitest run src/features/wallet/__tests__/copy.test.tsx

cd /home/ubuntu/tokex
git checkout main && git merge dev --no-ff
git push origin dev && git push origin main
git checkout dev

# 2. 查看 GitHub Actions 构建状态（push main 自动触发）
gh run list --workflow=tokex-build.yml --limit 5
# 如需等待最近一次运行完成：gh run watch

# 3. 同步前端 web-dist 至 /var/www/tokex/dist 并重载 Nginx
RUN_ID=$(gh run list --workflow=tokex-build.yml --branch main --status success --limit 1 --json databaseId -q '.[0].databaseId')
rm -rf /tmp/tokex-web-dist && gh run download "$RUN_ID" -n web-dist -D /tmp/tokex-web-dist
sudo rm -rf /var/www/tokex/dist && sudo mkdir -p /var/www/tokex/dist
sudo cp -r /tmp/tokex-web-dist/* /var/www/tokex/dist/
sudo chmod -R a+rX /var/www/tokex/dist
sudo nginx -t && sudo systemctl reload nginx
rm -rf /tmp/tokex-web-dist

# 4. 拉取最新 ARM64 镜像、打标并重启 tokex-web（若仅改前端可跳过）
# 若 ghcr.io/leoravyn/tokex-web 为私有包，先执行：gh auth token | docker login ghcr.io -u leoravyn --password-stdin
docker pull ghcr.io/leoravyn/tokex-web:latest
docker tag ghcr.io/leoravyn/tokex-web:latest tokex-web:v1.0.0-rc.51-tokex
cd /opt/tokex && docker compose up -d --force-recreate web

# 5. 线上基础冒烟
curl -sS -o /dev/null -w "root:%{http_code}\n" https://tokex.vip/
curl -sS -o /dev/null -w "api_status:%{http_code}\n" https://tokex.vip/api/status
curl -sS -o /dev/null -w "pricing:%{http_code}\n" https://tokex.vip/pricing
```

### 兜底方案：本地 2GB ARM64 离线构建（Fallback）

仅在 GitHub Actions / GHCR 不可用时使用本地构建：

> **2GB ARM64 构建约束**：
> 1. **`oxlint` 在 ARM64 存在原生 panic，禁止运行 `oxlint`**，统一使用 `bun check -b` 做类型校验。
> 2. 内存紧张，**全量构建前先停止临时 `rsbuild dev` 进程**，并限制 `NODE_OPTIONS="--max-old-space-size=1536"`；如本地重编 Go 后端镜像，应先确保 `VERSION` 已写入版本号，并使用 `GOMEMLIMIT=700MiB`（或先以 `golang:1.26.10-alpine` 运行 `go test -p 1`），完成后及时 `docker builder prune -f` 清理临时构建缓存（避免占用 `/` 分区）。

```bash
# 1. 本地前端校验、单测与生产构建（在 dev 分支）
export PATH="$HOME/.bun/bin:$PATH"
cd /home/ubuntu/tokex/web
bun check -b
bun --bun x vitest run src/features/pricing/__tests__/group-ratio-display.test.tsx
NODE_OPTIONS="--max-old-space-size=1536" bun --bun x rsbuild build

# 2. 合并至 main 并发布前端静态产物
cd /home/ubuntu/tokex
git checkout main && git merge dev --no-ff
sudo rm -rf /var/www/tokex/dist && sudo mkdir -p /var/www/tokex/dist
sudo cp -r /home/ubuntu/tokex/web/dist/* /var/www/tokex/dist/
sudo chmod -R a+rX /var/www/tokex/dist
sudo nginx -t && sudo systemctl reload nginx

# 3. （仅后端有改动时）本地构建 tokex-web 镜像并重启
docker build -t tokex-web:v1.0.0-rc.51-tokex /home/ubuntu/tokex
cd /opt/tokex && docker compose up -d --force-recreate web
docker builder prune -f
cd /home/ubuntu/tokex && git checkout dev
```
