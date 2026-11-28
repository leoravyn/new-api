# TOKEX 项目架构与开发管理手册

> **最后更新**：2026-11-28  
> **适用对象**：后续接手本项目的开发者与 AI Agent（阅读本文件即可掌握当前架构、前端全局接口、主机运维边界与精准验证/发布流程）。

---

## 1. 线上全景与核心功能实现

- **三域名流量隔离与防超时架构**：
  - **Web 控制台主站**：`https://tokex.vip`（Cloudflare Proxy / 橙云开启）— 仅承载前端控制台与 `/api` 等控制台接口；Cloudflare WAF 在边缘直接拦截 `/v1*`，避免 API 长连接命中 Cloudflare 100–125s 读取超时。
  - **API 独立网关（防超时流式代理）**：`https://api.tokex.vip`（Custom Domain -> Cloudflare Worker `tokex-api-proxy`，已禁用默认 `*.workers.dev` 域名）— 流式请求在等待上游首字期间先返回 `HTTP 200` 并每 `15s` 发送 `: keep-alive` SSE 保活，首字到达后通过 `pipeTo` 零拷贝透传响应流，绕过 Cloudflare 100s 超时且将 Worker CPU 控制在 10ms 内。
  - **Worker 专用隐藏源站**：`https://origin-1n1m4s5l1s4b1w9c1n9m8d1b0.tokex.vip`（DNS Only / 灰云直连主机公网 IP）— 专供 Worker 回源，监听 `443 ssl`（通配符 Cloudflare Origin CA `/etc/nginx/ssl/origin-tokex/{cert,key}.pem`），配置 `client_max_body_size 50m;`、`proxy_read/send_timeout 600s;`、`proxy_buffering off;`，反代至 `127.0.0.1:3000`。
- **上游号池管理端**：`https://sub.tokex.vip`
- **整体架构**：**React 静态托管 + Nginx 反向代理 + Docker 后端**
  - **前端产物**：基于 New API 前端（`/home/ubuntu/tokex/web`）二次开发，Rsbuild 编译后发布至 `/var/www/tokex/dist`，由 Nginx 直接托管。
  - **后端网关**：`tokex-web`（镜像 `tokex-web:v1.0.0-rc.51-tokex`，由 GitHub Actions 构建 `ghcr.io/leoravyn/tokex-web:latest` 后拉取打标或本地兜底构建，基于 `QuantumNous/new-api` `v1.0.0-rc.51` 并合入 TOKEX 补丁，`127.0.0.1:3000`）。
  - **数据库与缓存**：`tokex-db`（`postgres:18-alpine`，承载 `newapi` 与 `sub2api` 库，Docker 内网 `tokex-net:5432`）、`tokex-redis`（`redis:8-alpine`，Docker 内网 `tokex-net:6379`）。
  - **上游代理**：`tokex-pool`（`weishaw/sub2api:latest`，`RUN_MODE=simple`，`127.0.0.1:8080` / 内网 `http://tokex-pool:8080`）。

### 当前核心功能实现
1. **品牌视觉与双语**：纯中性**曜石黑 + 铂金银灰**磨砂玻璃材质体系（外框/侧栏 `#050506` → 主画布 `#08080A` → 一级毛玻璃卡片 `rgba(14, 14, 17, 0.56)` 配 `blur(12px) saturate(130%)` → `--muted` `#141418` / `--secondary` `#19191E`；拉丝铂金主按钮 `#FAFAFA → #EBEBEF → #D6D6DB` 配 `#08080A` 文字；中性 1px 高光描边 `rgba(255, 255, 255, 0.08)`），底层由全局 [`AmbientBackdrop`](file:///home/ubuntu/tokex/web/src/components/layout/components/ambient-backdrop.tsx) 提供纯中性银灰环境光与点阵光束视差；顶栏采用全宽三栏居中结构（左 Logo — 中主导航 — 右工具区与 `Console` 入口）；控制台锁定 `dark` 模式与 `zhCN`/`en` 双语，完整 Token 与动效规范见 [DESIGN.md](file:///home/ubuntu/tokex/DESIGN.md)。
2. **首页与模型广场**：首页（`src/features/home/`）桌面端采用双屏平滑翻页与透明顶栏（第 1 屏 `1440px` 宽屏 Hero + 实时旗舰模型卡片 + 底部生态跑马灯；第 2 屏交互式接入终端沙盒含纯前端流式试运行 + 4 格 Bento 卡片 + 页脚，背景中性银灰光源随翻页视差流动），实时接入 `/api/pricing` 旗舰模型并直链 `/pricing/$modelId`；模型广场支持分组倍率胶囊、侧边栏分组筛选与详情页多分组切换。
3. **认证与安全链路**：Resend 邮件验证码（`noreply@tokex.vip`）、邮箱域名白名单、Cloudflare Turnstile、GitHub OAuth 与 Google OIDC。
4. **站内文档、法务与关于页面**：
   - `/docs`（`src/features/docs/`、`src/routes/docs/index.tsx`）：双语接入文档，涵盖网关域名 `https://api.tokex.vip`、Codex（`/v1/responses`）、Claude Code（`/v1/messages`）、通用 SDK（`/v1/chat/completions`）及令牌分组引导；`use-top-nav-links.ts` 对相对路径按站内路由跳转，`general_setting.docs_link` 设为 `/docs`。
   - `/terms`、`/user-agreement`、`/privacy-policy`、`/aup`（`src/features/legal/`、`Waffo Pancake` MoR、`support@tokex.vip`、中国香港法律与 HKIAC 仲裁）；`/about` 保留精简说明。
5. **多币种钱包充值、Epay 回跳路由与后端补丁**：
   - 钱包额度以 `USD` 计价；**Waffo Pancake**（`waffo_pancake`，`USD` 结算，内置 W 图标需将 `icon` 留空）与 **Epay / Zpay**（`CNY` 按 `Price=7` 结算）共存时，前端按 `getPaymentSettlementCurrency` 自动区分展示 `USD`/`CNY`。
   - Epay 支付回跳 `/usage-logs` 时由 `src/routes/_authenticated/usage-logs/index.tsx`（`isEpayReturnQuery`）重定向回 `/wallet`。
   - 后端保留 `MatchAmountDiscount` 阶梯匹配、全局 `MinTopUp` 下限校验（PR #8437 / #8438）；`model/model_meta.go` 中 `SearchModels` 按 `.Order("models.vendor_id ASC, models.id DESC")` 按供应商聚拢排序；[`service/group.go`](file:///home/ubuntu/tokex/service/group.go#L14-L37) 中 `GetUserUsableGroups` 移除自动追加未开放 `userGroup`（`"User group"`）的兜底逻辑，仅返回 `UserUsableGroups` 与 `GroupSpecialUsableGroup` 允许的分组（单测见 [`service/group_usable_test.go`](file:///home/ubuntu/tokex/service/group_usable_test.go)）。
6. **独立邀请推广中心（`/referrals`）、首充 9 折与 5% 自动入账返佣**：
   - **受邀首充 9 折覆盖**：推荐注册且未完成真实充值的用户，合规确认且 `InviteFirstTopUpDiscount < 1` 时直接覆盖常规阶梯折扣。
   - **5% 充值返佣与冷静期自动入账**：6 条充值路径同一事务幂等写入 `aff_commissions`，按 `AffCommissionRate`（`0.05`）与 `AffCommissionCooldownDays`（`7` 天）由 `service/aff_commission_task.go` 自动核验入账；页面入口 `/referrals`（`src/features/referrals/`，保留路由声明于 [`pkg/jsplugin/routing.go`](file:///home/ubuntu/tokex/pkg/jsplugin/routing.go#L489)），`/api/user/referral/{summary,commissions}` 声明于 [`middleware/access_token_routes.go`](file:///home/ubuntu/tokex/middleware/access_token_routes.go#L84-L85)，设置项位于 `/system-settings/billing/quota`。

---

## 2. 目录与 Git 分支工作流

| 路径 | 用途 | 备注 |
|---|---|---|
| `/home/ubuntu/tokex/` | **TOKEX 开发仓库** | 维护 `web/`、文档与少量 Go 补丁 |
| `/home/ubuntu/tokex/web/` | **React 19 + Rsbuild v2 前端工程** | 使用 `bun` 运行类型检查、Vitest 与构建 |
| `/home/ubuntu/tokex/.github/workflows/tokex-dev-test.yml` | **云端 Go 单测工作流** | `dev` 推送改动 Go 相关文件时自动跑 `go vet` + `make test`（含 `setup-go` 缓存） |
| `/home/ubuntu/tokex/.github/workflows/tokex-build.yml` | **CI/CD 构建工作流** | `main` 推送构建 `web-dist` 并复用产物 + ARM64 `setup-go` 缓存构建/推送 `tokex-web` 镜像 |
| `/var/www/tokex/dist/` | **线上 Nginx 静态根目录** | 静态产物直接部署于此目录 |
| `/opt/tokex/` | **生产容器编排根目录** | `docker-compose.yml`、`.env`、`data/`、`logs/`、`backups/`、`sub2api/` |
| `/etc/nginx/sites-available/tokex.conf` | **Nginx 主站点配置** | 含 `tokex.vip`、`sub.tokex.vip`、隐藏源站与 `default_server` `444` 兜底 |
| `/etc/nginx/conf.d/cloudflare-geo.conf` & `/etc/nginx/snippets/cloudflare-access.conf` | **Cloudflare 源站访问控制** | `geo $realip_remote_addr $cf_allowed` 校验回源 IP；由 `/usr/local/bin/update-cf-nginx.sh` 同步 |

- **Git 分支与远程**（位于 `/home/ubuntu/tokex/`）：
  - `upstream-base`：`QuantumNous/new-api` 只读对照基线（当前已合并 `v1.0.0-rc.51` `c9c6da2`）；勿向 `upstream` 直接 `push`。
  - `dev` 为日常开发分支，验收后 `--no-ff` 合并到 `main` 并推送 `origin`（`leoravyn/new-api`）。

---

## 3. 主机资源边界与多模态调优参数

主机物理内存 **1.8Gi（2GB 规格）** + **`/swapfile`（2.0Gi，`vm.swappiness=20`）**，磁盘 **30G（`/` 分区 27G）**；全链路请求体上限对齐 **40 MiB** 防 OOM：

| 组件 | 配置文件 | 关键生效参数 |
|---|---|---|
| **Nginx** | `/etc/nginx/sites-available/tokex.conf` | `tokex.vip`: `client_max_body_size 40m;`, `proxy_read/send_timeout 1800s;`, `limit_conn api_key_conn 3;`; `origin-*`: `50m` / `600s` / `proxy_buffering off;` |
| **tokex-web** | `/opt/tokex/docker-compose.yml` | `mem_limit: 900m`, `GOMEMLIMIT=700MiB`, `GOGC=75`, `MAX_REQUEST_BODY_MB=40`, `MAX_FILE_DOWNLOAD_MB=32`, `STREAM_SCANNER_MAX_BUFFER_MB=32` |
| **DiskCache** | DB `options` (`newapi`) | `disk_cache_enabled=true`, `threshold_mb=4`, `max_size_mb=256` |
| **tokex-pool** | `/opt/tokex/docker-compose.yml` & `.env` | `mem_limit: 384m`, `GOMEMLIMIT=280MiB`, `RUN_MODE=simple`, `LOG_OUTPUT_TO_FILE=false`, `GATEWAY_REQUEST_BODY_MEMORY_BUDGET_BYTES=134217728` |
| **tokex-db / tokex-redis** | `/opt/tokex/docker-compose.yml` | `tokex-db`: `320m` / `shared_buffers=96MB`; `tokex-redis`: `96m` / `--maxmemory 64mb` |

> 历史配置文件与数据库变更前备份保存在 `/opt/tokex/backups/`。

---

## 4. 前端全局统一接口（毛玻璃、动画、背景与表格）

日常开发或扩展页面时**必须复用以下全局统一接口**，不要自行手写过渡外壳或零散颜色：

### A. 全局环境背景与壳层
* **`AmbientBackdrop`**（[`ambient-backdrop.tsx`](file:///home/ubuntu/tokex/web/src/components/layout/components/ambient-backdrop.tsx)）：统一渲染全屏点阵、中性银灰辐射光晕与斜向发丝光束。
  * 已集成于 [`PublicLayout`](file:///home/ubuntu/tokex/web/src/components/layout/components/public-layout.tsx)（支持 `backdropPreset`: `'home-0' | 'home-1' | 'default'`）与 [`AuthenticatedLayout`](file:///home/ubuntu/tokex/web/src/components/layout/components/authenticated-layout.tsx)（暗色模式自动挂载 `preset='console'`）。
* **路由壳层约束**：[`AuthenticatedLayout`](file:///home/ubuntu/tokex/web/src/components/layout/components/authenticated-layout.tsx#L66) 直接渲染 `{props.children ?? <Outlet />}`；路由 `<Outlet />` 与玻璃卡片外层壳体保持无 `opacity` / `filter` / `transform` 过渡的纯容器结构，否则会触发 Backdrop Root 导致卡片“先透明后闪变毛玻璃”。

### B. 毛玻璃与半透明表面系统（[`index.css`](file:///home/ubuntu/tokex/web/src/styles/index.css#L278-L406)）
| 类名 / 选择器 | 暗色效果 | 适用场景与规则 |
|---|---|---|
| `.tokex-liquid-card` / `.tokex-console-panel` / `<Card>`（`[data-slot='card']`） | `rgba(14, 14, 17, 0.56)` + `blur(12px) saturate(130%)` + 鼠标近场边框高光 | **一级容器**：表格外框、仪表盘面板、卡片；内部圆角贴边光泽层需加 `rounded-[inherit]` 且外层加 `overflow-hidden transform-gpu` |
| `.tokex-surface-subtle` | `rgba(255, 255, 255, 0.03)` + 细微描边（**无二次模糊**） | 嵌在玻璃面板内部的子卡片/代码块/分组条（内部可安全挂动画） |
| `.tokex-surface-pill` | `rgba(11, 11, 14, 0.58)` + 细微描边 | 胶囊标签、分段控件底壳 |
| `.tokex-glass` / `.tokex-glass-interactive` / `.tokex-glass-elevated` | `rgba(14, 14, 17, 0.52 / 0.62)` + `blur(12px / 16px)` | 独立悬浮玻璃模块（非通用 `<Card>` 场景） |
* **鼠标近场高光追踪**：[`installLiquidGlassTracker()`](file:///home/ubuntu/tokex/web/src/lib/liquid-glass-tracker.ts#L55) 已在 [`__root.tsx`](file:///home/ubuntu/tokex/web/src/routes/__root.tsx#L55) 全局挂载，通过 `rAF` 零重渲染更新 `--lg-o`/`--lg-x`/`--lg-y` 驱动 `[data-slot='card']` / `.tokex-liquid-card` / `.tokex-console-panel` / `[data-slot='sidebar-inner']` 的 `::after` 边框高光。

### C. 内容级入场动效接口
* **CSS 动画类（[`index.css`](file:///home/ubuntu/tokex/web/src/styles/index.css#L746-L822)）**：用在**玻璃容器内部**的子内容节点上，动画完成后自动释放 `transform`/`opacity`：
  * `.tokex-content-enter`（单块内容上浮渐现 `0.24s`，如 [`PanelWrapper`](file:///home/ubuntu/tokex/web/src/features/dashboard/components/ui/panel-wrapper.tsx#L109)）
  * `.tokex-content-reveal`（直接子元素错峰渐现 `0.28s + 40ms/item`）
  * 表格行默认入场 `[data-slot='table'] tbody tr > td:not(.sticky)`（`tableRowEnter` 仅作用于非固定单元格）
* **Motion 原语（[`page-transition.tsx`](file:///home/ubuntu/tokex/web/src/components/page-transition.tsx) + [`motion.ts`](file:///home/ubuntu/tokex/web/src/lib/motion.ts)）**：只保留内容级组件 `FadeIn`、`StaggerContainer` / `StaggerItem`、`TableStaggerContainer` / `TableStaggerRow`（全内置 `useReducedMotion` 降级）。

### D. 表格统一规范
* **表头与表体**：[`table.tsx`](file:///home/ubuntu/tokex/web/src/components/ui/table.tsx) 中 `<TableHeader>` 默认使用不透明 `--table-header`（`#121215` / hover `#17171B`），[`SplitHeaderTableView`](file:///home/ubuntu/tokex/web/src/components/data-table/core/data-table-view.tsx#L159) 表头固定 `sticky top-0 z-20`；`TableHead` 与 `TableCell` 统一使用 `px-3` 水平内边距（对齐勾选框与列头文字）。
* **固定列（[`column-pinning.ts`](file:///home/ubuntu/tokex/web/src/components/data-table/core/column-pinning.ts)）**：固定表体单元格暗色底统一为贴合卡片合成色的 `#0b0b0e`（hover `#121215` / selected `#19191d`，禁用双层 `backdrop-blur-xl`）；[`ModelsTable`](file:///home/ubuntu/tokex/web/src/features/models/components/models-table.tsx#L252) 仅右侧固定 `actions` 列。

---

## 5. 路由边界、接口与数据库现状

- **Nginx 静态 SPA（`tokex.vip`）**：`/static/*`（30d 缓存）、`/index.html`（禁缓存）及前端路由走 `try_files $uri $uri/ /index.html;`。**勿将 `/dashboard` 整体反代给后端。**
- **后端反代**：`tokex.vip` 仅反代 `/(api|v1|v1beta|pg|mj)` 与 `dashboard/billing/`；实际 `/v1*` 外部 API 流量由 Cloudflare WAF 拦截并引流至 `api.tokex.vip` -> Worker -> `origin-1n1m4s5l1s4b1w9c1n9m8d1b0.tokex.vip` -> `127.0.0.1:3000`。
- **线上计费与渠道现状（`newapi` 库）**：`QuotaDisplayType=USD`、`USDExchangeRate=1`、`MinTopUp=5`、`Price=7`；启用 `Waffo Pancake`（`USD`，`min_topup=10`）与 `Epay / Zpay`（`CNY`，`min_topup=5`）；分组 `Codex Pro`（`0.18x`）、`Claude Max`（`0.36x`）、`Official`（`1.2x`）；启用渠道 `id=3 Codex-Pool` 与 `id=5 DeRouter`。直接改库 `options` 后需 `docker restart tokex-web`。

---

## 6. 精准验证与发布流程（节约时间、适配 2GB 主机）

### A. 分级精准检测原则（严禁局部变量盲跑全量测试）
由于主机仅 **2 vCPU / 1.8Gi 内存**，日常验证遵循**“精准最小验证”**，避免无意义的慢速全量重跑：

| 改动范围 | 必跑检查 | 无需重复执行 |
|---|---|---|
| **文案 / 局部 CSS 样式 / 单页面微调** | `bun check -b` + **1~3 个直接受影响的 Vitest 文件** + `rsbuild build` | 不跑全仓库 Vitest、不跑已通过未再改源码的测试 |
| **公共组件 / 跨模块核心逻辑 / 路由契约** | `bun check -b` + 受影响模块测试集 + `rsbuild build` | 无关业务模块测试 |
| **Go 后端或数据库逻辑** | 推送 `dev` 由云端 [`.github/workflows/tokex-dev-test.yml`](file:///home/ubuntu/tokex/.github/workflows/tokex-dev-test.yml) 执行 `go vet` 与 `make test`（**不在 1.8Gi 主机本地跑 Go 单测/编译**） | 前端未改时可不重建前端 |

### B. 本机环境与缓存硬约束
1. **运行时路径**：容器默认 `node` 为 `v18.19.1`（缺少 Vitest/Rolldown 所需 API），本地命令必须通过 Bun 执行：`bun --bun ./node_modules/.bin/vitest run <file...>` 与 `bun --bun ./node_modules/.bin/rsbuild build`。
2. **跳过 ARM64 崩溃工具**：`oxlint` 与 `oxfmt` 在当前 ARM64 容器环境触发 allocator `SIGABRT` panic，本地跳过，使用 `bun check -b`（`~10s`）与 CI 校验兜底。
3. **保持 `buildCache: false`**：[`rsbuild.config.ts`](file:///home/ubuntu/tokex/web/rsbuild.config.ts#L89) 必须保持 `buildCache: false`。实测在 1.8Gi 内存下开启会写入约 `598M` 缓存并顶满 Swap（`1.9Gi/2.0Gi`），导致构建从约 `38s–51s` 恶化为 `1m39s–2m32s`。

### C. 本地微调快速上线 vs 完整 CI 发布
```bash
# 方式 1：纯前端局部改动 — 本地精准校验并直接热同步到 Nginx（推荐日常使用）
export PATH="$HOME/.bun/bin:$PATH"
cd /home/ubuntu/tokex/web
bun check -b
bun --bun ./node_modules/.bin/vitest run src/features/<module>/__tests__/<target>.test.tsx
bun --bun ./node_modules/.bin/rsbuild build
rsync -a --delete /home/ubuntu/tokex/web/dist/ /var/www/tokex/dist/

# 方式 2：合并发版 / 涉及后端改动 — 先推 dev 跑云端 Go 单测（tokex-dev-test.yml），再推 main 走镜像构建（tokex-build.yml）
cd /home/ubuntu/tokex
git push origin dev
# 待 tokex-dev-test.yml 通过后合并 main 发版：
git checkout main && git merge dev --no-ff
git push origin main
git checkout dev
# 待 tokex-build.yml 完成后，按需下载 web-dist 同步至 /var/www/tokex/dist/，或拉取新镜像更新容器：
docker pull ghcr.io/leoravyn/tokex-web:latest && docker tag ghcr.io/leoravyn/tokex-web:latest tokex-web:v1.0.0-rc.51-tokex
cd /opt/tokex && docker compose up -d web
```
*(线上基础冒烟：`curl -sS -o /dev/null -w "%{http_code}\n" https://tokex.vip/`、`https://tokex.vip/api/status`、`https://tokex.vip/pricing`。)*
