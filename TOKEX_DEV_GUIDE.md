# TOKEX 项目架构与开发管理手册

> **最后更新**：2026-11-19  
> **适用对象**：后续接手本项目的开发者与 AI Agent（阅读本文件即可掌握全局结构、分支规范、2GB 内存运维边界与部署流程，无需全仓盲搜）。

---

## 1. 线上全景与当前版本

- **主站与 API 网关**：`https://tokex.vip`
- **CPA 上游管理端**：`https://sub.tokex.vip`
- **整体架构**：**React 静态托管 + Nginx 反向代理 + Docker 原生后端**
  - **前端产物**：基于原 New API 前端（`/home/ubuntu/tokex/web`）重构，Rsbuild 编译后发布至 `/var/www/tokex/dist`，由 Nginx 直接托管静态资源。
  - **后端网关**：`tokex-web`（本地自定义镜像 `tokex-web:v1.0.0-rc.51-tokex`，基于 `v1.0.0-rc.51` 源码构建，`127.0.0.1:3000`），针对阶梯金额折扣（`MatchAmountDiscount`）与全局 `MinTopUp` 下限强制校验进行了补丁编译；备份于 `/opt/tokex/backups/2026-11-19-docker-compose-before.yml`。
  - **数据库**：`tokex-db`（`mariadb:10.11`，库名 `newapi`，Docker 内网 `tokex-net:3306`）。
  - **上游代理**：`tokex-cpa`（官方 `eceasy/cli-proxy-api:latest`，当前 `v8.0.76`，`127.0.0.1:8317` / 内网 `http://tokex-cpa:8317`）。

### 已完成关键改造摘要
- **品牌与设计定稿（`v1.0.0` ~ `v1.2.0`）**：极黑单色体系（`#000000`/`#050506`/`#0a0a0c` + 1px 微光边框），永久锁定暗黑模式与 `zhCN`/`en` 双语；替换 `favicon.svg` / `logo-tokex.svg` / `banner-tokex.svg`；重构首页、顶部导航、公告栏、头像菜单、个人资料/安全/钱包与通用弹窗基元；移除「关于」与风格抽屉。
- **认证与安全链路**：Resend 邮件验证码（`noreply@tokex.vip`）、邮箱域名白名单、Cloudflare Turnstile（`0x4AAAAAAGBJP7HOD4ZkNFVM`）、GitHub OAuth（`/oauth/github`）、Google 自定义 OAuth 提供商（Custom OAuth，`/oauth/google`，`OAuthProviders` 按 `provider.icon` 大小写兼容映射 `google` 至标准 Google "G" SVG 图标，已停用内置 OIDC）；`v1.2.4` 修复注册与换绑邮箱验证码输入框在手机端强制数字键盘的问题（改为 `inputMode='text'`）。
- **渠道与模型广场（`v1.2.1` ~ `v1.2.3`）**：修复通道编辑页 `filterTransformPlugins` 空 `models` 崩溃；模型广场隐藏无意义 `37.5x` 与「能力：动态计费」回退，改为分组倍率胶囊（`Official · 1.35x` / `Proxy · 0.4x`）、恢复侧边栏分组筛选、支持详情页多分组倍率切换、清理表头重复 ID 与未使用的 `default` 分组。
- **2GB 内存与 Base64 多模态链路调优（2026-11-18）**：Nginx、New API、CLIProxyAPI 全链路请求体上限对齐为 **40 MiB**，启用 DiskCache 落盘缓冲与容器内存/GC 硬限制（详见第 3 节）。
- **Waffo MoR 合规与定价/钱包重构（2026-11-19）**：
  - **法务合规与全站页脚**：新增/重构公开双语页面 `/terms`、`/user-agreement`、`/privacy-policy`、`/aup`（`Waffo Pancake` MoR、`support@tokex.vip`、Delaware 法律适用、24h 未使用额度退款与完整 Anthropic/OpenAI AUP 对齐）；将 `<Footer />` 移入 `PublicLayout` 覆盖全站公开页面（首页去重），同步清理认证页与关于页法务链接及冗余文案。
  - **首页实时模型展示**：重构 `hero-section.tsx`，移除示例提示词与虚假统计，接入 live `/api/pricing` 旗舰模型报价、分组倍率对比与 `/pricing/$modelId` 直达链接。
  - **纯美元钱包与管理员折扣**：Wallet 充值流统一为 USD（`$xx.xx USD`、`effectivePriceRatio = 1`、`usdExchangeRate = 1`）并增加结账合规提醒，与后端 `Waffo Pancake` 100% 对齐；修复管理员金额折扣展示为「`Final price multiplier (0.95 = 5% off)` / `优惠 5% (9.5折)`」，同步 `en/zh/zh-TW` i18n。
  - **模型广场原价对比**：Model Square 对所有 `groupRatio !== 1`（含 `< 1x` 与 `> 1x`）统一展示 `1x` 删除线原价对比。
  - **数据库 `options` 清理（`tokex-db`）**：更新 `Price=1`、`USDExchangeRate=1`，清空遗留 `TopUpLink` 与 `Footer`，修正 `UserUsableGroups` 中 `Offical API` 拼写为 `Official API`（修改前备份位于 `/opt/tokex/backups/2026-11-19-options-before.txt`）。
  - **后端自定义构建与充值计价/下限修复（`tokex-web:v1.0.0-rc.51-tokex`）**：新增 `PaymentSetting.MatchAmountDiscount` 阶梯折扣匹配（`>= threshold` 匹配最高满足档位）与全局 `MinTopUp` 下限校验（覆盖 `GetTopUpInfo` 及 Waffo Pancake / Waffo / Stripe 支付路由，防止被网关单独最小值绕过），同步修复前端钱包阶梯折扣展示、自定义金额折扣试算与最低充值校验提示，并补充 `DESIGN.md`（Waffo Pancake 托管结账暗黑视觉规范）。

---

## 2. 目录与 Git 分支工作流

| 路径 | 用途 | 备注 |
|---|---|---|
| `/home/ubuntu/tokex/` | **TOKEX 开发仓库** | 日常二次开发仅修改 `web/` 及本手册；Go 文件作上游参考 |
| `/home/ubuntu/tokex/web/` | **React 19 + Rsbuild v2 前端工程** | 使用 Bun 运行类型检查、测试与构建 |
| `/var/www/tokex/dist/` | **线上 Nginx 静态根目录** | `main` 合并构建后同步至此目录 |
| `/opt/tokex/` | **生产容器编排根目录** | `docker-compose.yml`、`mariadb/`、`data/`、`logs/`、`backups/` |
| `/opt/tokex/cpa/` | **CLIProxyAPI 部署目录** | `docker-compose.yml`、`config/config.yaml`、`auths/` |
| `/etc/nginx/sites-available/tokex.conf` | **Nginx 主站点配置** | 软链至 `/etc/nginx/sites-enabled/tokex.conf` |

- **Git 分支**（位于 `/home/ubuntu/tokex/`）：
  - `upstream-base`：`Calcium-Ion/new-api` 只读对照基线（`48a6c87`）。
  - **`main`**：**生产分支**（当前发布标签 `tokex-web-v1.2.4`，commit `fb6aefa`）。
  - **`dev`**：**默认开发分支**，日常改动在此提交验收后再 `--no-ff` 合并到 `main`。
  - 远程名已将原 `origin` 重命名为 `upstream`（指向官方 GitHub），**勿误推**。

---

## 3. 2GB 内存主机运维边界与多模态调优参数

主机物理内存 **1.8Gi（2GB 规格）** + **`/swapfile`（2.0Gi，`vm.swappiness=20`）**，全链路以 **40 MiB**（可容纳单张 20MB 原图 Base64 后 ~27MB + 上下文）对齐防外放内截与 OOM：

| 组件 | 配置文件 | 关键生效参数 | 说明 |
|---|---|---|---|
| **Nginx** | `/etc/nginx/sites-available/tokex.conf` | `client_max_body_size 40m;` / `client_body_buffer_size 128k;` / `client_body_timeout 120s;` / `proxy_request_buffering on;` / `proxy_buffering off;` / `proxy_connect_timeout 30s;` / `proxy_read/send_timeout 600s;` | 吸收手机端慢速大请求到 `/var/lib/nginx/body`，保持 SSE 零缓冲 |
| **tokex-web** | `/opt/tokex/docker-compose.yml` | `mem_limit: 900m` / `GOMEMLIMIT=700MiB` / `GOGC=75` / `MAX_REQUEST_BODY_MB=40` / `MAX_FILE_DOWNLOAD_MB=32` / `STREAM_SCANNER_MAX_BUFFER_MB=32` / `DEBUG=false` | 日志截断保留 `LocalLogContentLimit=2048`；`json-file` 限 `20m x 3` |
| **DiskCache** | DB `options` (`newapi`) | `disk_cache_enabled=true` / `threshold_mb=4` / `max_size_mb=256` | `>=4MB` 请求体自动暂存临时文件并在请求结束后清理 |
| **tokex-cpa** | `/opt/tokex/cpa/docker-compose.yml` & `config/config.yaml` | `mem_limit: 384m` / `GOMEMLIMIT=280MiB` / `GOGC=75` / `max-request-body-bytes: 41943040` / `shutdown-timeout: 15` / `request-log: false` / `logging-to-file: false` | 解除原 `120m` 过低导致的 20MB+ 大图 OOM；关闭全量请求体落盘 |
| **tokex-db** | `/opt/tokex/docker-compose.yml` & `mariadb/my.cnf` | `mem_limit: 512m` / `innodb_buffer_pool_size=256M` / `max_connections=60` | Docker 日志轮转 `10m x 3` |

> 上述配置文件的修改前原始备份保存在 `/opt/tokex/backups/2026-11-18/`。

---

## 4. 前端源码核心定位（`/home/ubuntu/tokex/web/`）

- **品牌、样式与锁定约束**：
  - 资产与入口：`public/{favicon,logo-tokex,banner-tokex}.svg`、`index.html`、`rsbuild.config.ts`
  - 主题与双语：`src/styles/{theme,index}.css`、`src/lib/{constants,avatar,nav-modules}.ts`、`src/context/{theme,theme-customization,layout}-provider.tsx`（锁定 `dark` + 默认样式）、`src/i18n/{languages,config}.ts`
- **导航与通用 UI**：
  - 顶栏与菜单：`src/components/layout/components/{public-header,public-layout,header,app-header,system-brand,footer,section-page-layout,authenticated-layout}.tsx`、`src/components/{profile-dropdown,notification-popover}.tsx`
  - 统一深色玻璃基元：`src/components/ui/{card,titled-card,icon-badge,tabs,table,dropdown-menu,popover,dialog,alert-dialog,alert,empty,sidebar}.tsx`
- **核心业务页面**：
  - 首页：`src/features/home/`（`constants.ts`、`components/tokex/hero-section.tsx`、`components/hero-terminal-demo.tsx`）
  - 法务与关于：`src/features/legal/`（`content/{legal-config,terms,privacy-policy,aup}.ts`、`components/legal-document-layout.tsx`）、`src/routes/{terms,aup,user-agreement,privacy-policy}.tsx`、`src/features/about/`
  - 认证：`src/features/auth/`（`sign-in`、`sign-up`、`forgot-password`、`secure-verification`、`components/{terms-footer,legal-consent}.tsx`、`hooks/`）
  - 模型广场与榜单：`src/features/pricing/`（`index.tsx`、`lib/{model-helpers,price,dynamic-price}.ts`、`components/{model-card,price-comparison,pricing-table,pricing-columns,pricing-sidebar,model-group-ratio-badges,model-details,dynamic-pricing-breakdown}.tsx`）、`src/features/rankings/`
  - 渠道与系统设置：`src/features/channels/`（注意 `task-plugins` 目录下的插件模型转换过滤逻辑）、`src/features/system-settings/integrations/`（金额折扣等支付配置）
  - 控制台与账户：`src/features/dashboard/`、`src/features/profile/`、`src/features/security/`、`src/features/wallet/`；全部控制台路由见 `src/routes/_authenticated/`

---

## 5. 路由边界、接口与数据库现状

### Nginx 动静分流
- **静态 SPA**：`/static/*`（30d 强缓存）、`/index.html`（`no-cache, no-store, must-revalidate`）、以及所有前端路由（`/`, `/pricing`, `/rankings`, `/about`, `/terms`, `/user-agreement`, `/privacy-policy`, `/aup`, `/sign-in`, `/sign-up`, `/dashboard`, `/keys`, `/channels` 等）走 `try_files $uri $uri/ /index.html;`。
- **后端反代**：`location ~ ^/(api|v1|v1beta|pg|mj)(/|$)|^/[^/]+/mj/|^/(v1/)?dashboard/billing/` -> `http://127.0.0.1:3000`。**勿将 `/dashboard` 整体反代给后端。**

### 线上分组、渠道与关键配置（`newapi` 库）
- **现行分组**（已清理 `default` 分组）：`Official`（`1.35x`）、`Proxy`（`0.4x`），见 `options` 表 `GroupRatio` / `UserUsableGroups`。
- **启用渠道**（`channels` 表）：
  - `id=2`：`OpenRouter`（`status=1`, `group=Official`, `claude-fable-5.2`）
  - `id=3`：`Codex-Pool`（`status=1`, `group=Proxy`, `http://tokex-cpa:8317`, `gpt-6-astra` / `gpt-6.1-sol` / `gpt-6.2-sol` / `gpt-6.2-astra`）
- **重要提示**：直接改库内 `options` 后需 `docker restart tokex-web` 立即重载；连接凭据见 `/opt/tokex/docker-compose.yml`。

---

## 6. 开发、验证与发布标准流程

> **2GB ARM64 构建约束**：
> 1. **`oxlint` 在 ARM64 存在原生 panic，禁止运行 `oxlint`**，统一使用 `bun check -b` 做类型校验。
> 2. 内存紧张，**全量构建前先停止临时 `rsbuild dev` 进程**，并限制 `NODE_OPTIONS="--max-old-space-size=1536"`。

```bash
# 1. 类型校验、单元测试与生产构建（在 dev 分支）
export PATH="$HOME/.bun/bin:$PATH"
cd /home/ubuntu/tokex/web
bun check -b
bun --bun x vitest run src/features/pricing/__tests__/group-ratio-display.test.tsx
NODE_OPTIONS="--max-old-space-size=1536" bun --bun x rsbuild build

# 2. 合并至 main 并发布上线
cd /home/ubuntu/tokex
git checkout main && git merge dev --no-ff
sudo rm -rf /var/www/tokex/dist && sudo mkdir -p /var/www/tokex/dist
sudo cp -r /home/ubuntu/tokex/web/dist/* /var/www/tokex/dist/
sudo chmod -R a+rX /var/www/tokex/dist
sudo nginx -t && sudo systemctl reload nginx
git checkout dev

# 3. 线上基础冒烟
curl -sS -o /dev/null -w "root:%{http_code}\n" https://tokex.vip/
curl -sS -o /dev/null -w "api_status:%{http_code}\n" https://tokex.vip/api/status
curl -sS -o /dev/null -w "pricing:%{http_code}\n" https://tokex.vip/pricing
```
