# TOKEX 项目架构与开发管理手册

> **最后更新**：2026-11-15  
> **适用对象**：后续接手本项目的开发者与 AI Agent（阅读本文件即可掌握全局结构、分支规范、接口边界与构建部署流程，无需全仓盲搜）。

---

## 1. 项目概览与当前进度

- **主站与 API 网关**：`https://tokex.vip`
- **上游账号池管理端（CPA WebUI）**：`https://sub.tokex.vip`
- **架构模式**：**前后端分离静态托管 + Docker 原生后端**
  - **后端核心**：直接运行上游官方容器 `calciumion/new-api:latest`（容器名 `tokex-web`，监听 `127.0.0.1:3000`），配合 `tokex-db`（MariaDB 10.11）与 `tokex-cpa`（CLIProxyAPI，`127.0.0.1:8317`）。
  - **前端工程**：基于原 New API 的 React 19 单页应用（`/home/ubuntu/tokex/web`）进行深度商业化与设计重构，通过 Rsbuild 编译生成纯静态产物并部署至 `/var/www/tokex/dist`，由主机 Nginx 直接托管并反向代理 `/api`、`/v1` 等后端接口到 `127.0.0.1:3000`（已彻底摒弃早期外部 `sub_filter` 注入模式）。

### 已完成里程碑清单
- [x] **全局极黑极简设计重构（OpenRouter 质感）**：纯黑单色体系（`#000000` / `#050506` / `#0a0a0c` / 1px 微光边框），永久锁定暗黑模式（Dark Mode Only）与中/英双语（`zhCN` / `en`）。
- [x] **首页与模型广场重塑**：首页 Hero 展示最新旗舰模型路由与 SDK 示例；`/pricing` 与 `/rankings` 净化管理员内部字段（渠道/Endpoint 等）。
- [x] **认证与风控链路上线**：
  - 开放用户注册，新用户初始额度 `0`，开启邮箱域名白名单限制。
  - 配置 **Resend API** 发信（`noreply@tokex.vip`）与强制注册邮箱验证码。
  - 配置 **GitHub OAuth** 与 **Google OAuth (OIDC)** 第三方登录。
  - 配置 **Cloudflare Turnstile** 人机验证（`TurnstileSiteKey: 0x4AAAAAAGBJP7HOD4ZkNFVM`）。
- [x] **导航栏与控制台最终打磨**：
  - 移除「关于」入口及控制台右上角「自定义风格」抽屉，锁定全站单一默认外观。
  - 统一前台与控制台顶部导航栏（`sticky top-0`、`h-14` / `3.5rem`、毛玻璃质感一致）。
  - 修复控制台「概览」标题吸顶问题（标题随页面正常滚动）；左侧边栏与主内容区统一 `rounded-2xl` 圆角玻璃容器。
- [x] **工程清理与生产上线**：
  - 将源码目录由 `/home/ubuntu/new-api` 规范更名为 `/home/ubuntu/tokex`。
  - 建立清晰的 Git 分支体系（`upstream-base` / `main` / `dev`），关闭临时 `5173` 开发预览，完成全量生产构建并部署至 `https://tokex.vip`。

### 后续规划建议
- [ ] 配置更多正式生产上游渠道与充值/订阅支付回调。
- [ ] 按需为 `/home/ubuntu/tokex` 添加自有私有 Git 远程仓库（`git remote add origin <你的私有仓地址>`）做代码云端备份。

---

## 2. 服务器目录与服务全景

| 路径 / 容器 | 用途说明 | 备注 |
|---|---|---|
| `/home/ubuntu/tokex/` | **TOKEX 开发源码仓库**（原 `/home/ubuntu/new-api/`） | 实际只二次开发构建 `web/`；根目录 Go 代码仅作上游后端与路由对照参考 |
| `/home/ubuntu/tokex/web/` | **React 前端工程源码目录** | Bun + Rsbuild v2 + React 19 + TanStack |
| `/var/www/tokex/dist/` | **生产环境前端静态资源目录** | `tokex.vip` Nginx 直接托管此目录（不含旧 `tokex-brand.js` / `tokex-theme.css`） |
| `/opt/tokex/` | **生产环境容器编排与持久化目录** | 含 `docker-compose.yml`、`mariadb/`、`cpa/`、`data/`、`logs/` |
| `/opt/tokex/cpa/` | CLIProxyAPI 部署与认证目录 | `docker-compose.yml`、`config/config.yaml`、`auths/` |
| `/etc/nginx/sites-available/tokex.conf` | Nginx 主站点与 SSL 配置 | 软链至 `/etc/nginx/sites-enabled/tokex.conf`，包含 `tokex.vip` 与 `sub.tokex.vip` |

### 运行中 Docker 容器
- `tokex-web`（`calciumion/new-api:latest`）-> `127.0.0.1:3000`
- `tokex-db`（`mariadb:10.11`）-> Docker 内网 `tokex-net:3306`（数据库名 `newapi`）
- `tokex-cpa`（`eceasy/cli-proxy-api:latest`）-> `127.0.0.1:8317`（同时通过 `tokex-net` 供 `tokex-web` 访问 `http://tokex-cpa:8317`）

> 查看/管理容器统一在 `/opt/tokex` 或 `/opt/tokex/cpa` 下使用 `docker compose` 或 `docker ps`。数据库连接凭据见 `/opt/tokex/docker-compose.yml`。

---

## 3. Git 分支结构与版本工作流

当前仓库位于 `/home/ubuntu/tokex/`，已完成规范化分支划分：

| 分支 / 引用 | 定位 | 说明 |
|---|---|---|
| `upstream-base` | 上游只读基线 | 指向 `Calcium-Ion/new-api` `v1.0.0-rc.49`（`48a6c87`），用于对比所有 TOKEX 改动（`git diff upstream-base..main`） |
| **`main`** | **生产分支** | 与当前线上 `/var/www/tokex/dist/` 运行版本严格对应（带发布标签 `tokex-web-v1.0.0`） |
| **`dev`** | **日常开发分支（默认当前分支）** | 所有新页面、样式、功能改造均在 `dev` 进行并预览验收；确认无误后合并到 `main` 并发布上线 |

- 远程仓库：`upstream` 指向 `https://github.com/Calcium-Ion/new-api.git`（已重命名原 `origin`，避免误推送到上游公共仓库）。

---

## 4. 前端源码核心改写索引（`/home/ubuntu/tokex/web/`）

后续 Agent 如需修改前端特定功能，可直接定位以下模块，无需全仓扫描：

### 全局主题、样式与语言锁定
- `web/index.html` & `web/rsbuild.config.ts`：页面标题（`TOKEX | Multi-Model Gateway`）、PWA/构建配置
- `web/src/styles/theme.css` & `web/src/styles/index.css`：纯黑单色变量体系、`--app-header-height: 3.5rem`、玻璃表面样式
- `web/src/context/theme-provider.tsx`：永久锁定 `dark` 模式
- `web/src/context/theme-customization-provider.tsx`：锁定默认预设与圆角，禁止自定义主题切换
- `web/src/context/layout-provider.tsx`：锁定控制台为 `inset` 布局模式
- `web/src/i18n/languages.ts` & `web/src/i18n/config.ts`：仅保留 `zhCN` 与 `en` 双语

### 导航、侧边栏与通用页面骨架
- `web/src/hooks/use-top-nav-links.ts` & `web/src/lib/nav-modules.ts`：顶部导航链接控制（已强制关闭 `about`）
- `web/src/components/layout/components/public-header.tsx` & `public-layout.tsx`：前台顶部导航栏（`sticky top-0 h-14`）
- `web/src/components/layout/components/header.tsx` & `app-header.tsx`：控制台顶部导航栏（与前台保持统一高度与定位，已移除 `ConfigDrawer`）
- `web/src/components/layout/components/system-brand.tsx`：站点 Logo 与 `TOKEX` 品牌名归一化
- `web/src/components/layout/components/footer.tsx`：页脚（已移除关于链接）
- `web/src/components/layout/components/section-page-layout.tsx`：控制台页面标题与滚动容器（非 `fixedContent` 页面标题随内容自然滚动）
- `web/src/components/layout/components/authenticated-layout.tsx` & `web/src/components/ui/sidebar.tsx`：圆角左侧边栏、圆角 `SidebarInset` 主视图容器及菜单胶囊样式
- `web/src/components/ui/card.tsx`, `tabs.tsx`, `table.tsx`, `web/src/components/data-table/core/data-table-view.tsx`：统一暗黑玻璃边框与表格质感

### 业务功能页
- **首页（`/`)**：`web/src/features/home/index.tsx`、`constants.ts`、`components/hero-terminal-demo.tsx`、`components/tokex/hero-section.tsx`、`components/sections/*`
- **认证页（`/sign-in`, `/sign-up`, `/forgot-password`, `/oauth/*`)**：`web/src/features/auth/`（含邮箱验证码、GitHub/Google OAuth、`turnstile.tsx`）
- **模型广场与排行榜（`/pricing`, `/rankings`)**：`web/src/features/pricing/`、`web/src/features/rankings/`
- **控制台概览与看板（`/dashboard/*`)**：`web/src/features/dashboard/`（`index.tsx`、`components/overview/*`、`components/ui/panel-wrapper.tsx`）
- **其他控制台管理路由**（位于 `web/src/routes/_authenticated/`）：`/keys`、`/usage-logs`、`/channels`、`/wallet`、`/redemption-codes`、`/subscriptions`、`/models`、`/playground`、`/profile`、`/security`、`/users`、`/system-settings`

---

## 5. 路由分流、后端接口与数据库速查

### Nginx 动静分流边界（`/etc/nginx/sites-available/tokex.conf`）
- **静态资源与 SPA 路由**（由 `/var/www/tokex/dist` 提供）：
  - `/static/*`（强缓存 30d `immutable`）
  - `/index.html`（禁止缓存 `no-cache, no-store, must-revalidate`）
  - `/`、`/pricing`、`/rankings`、`/sign-in`、`/sign-up`、`/oauth/:provider`、`/dashboard`、`/keys`、`/usage-logs`、`/channels`、`/system-settings` 等前端路由均走 `try_files $uri $uri/ /index.html;`
- **后端反代路由**（`location ~ ^/(api|v1|v1beta|pg|mj)(/|$)|^/[^/]+/mj/|^/(v1/)?dashboard/billing/` -> `http://127.0.0.1:3000`，已开启 SSE 零缓冲与 WebSocket）：
  - 注意：`dashboard/billing/` 走后端计费旧接口，`/dashboard` 与 `/dashboard/overview` 留给 React SPA，切勿将 `/dashboard` 整体代理给后端。

### 高频核心后端 API 路径（前缀 `/api` 或中继前缀）
- **系统与公开接口**：
  - `GET /api/status`（返回系统名称、注册/邮箱验证/OAuth/Turnstile 开关及 `turnstile_site_key`）
  - `GET /api/pricing`、`GET /api/rankings`、`GET /api/notice`、`GET /api/models`
- **用户认证与 OAuth**：
  - `POST /api/user/login`、`POST /api/user/register`、`GET /api/verification`（受 Turnstile 与频控保护）
  - `GET /api/oauth/:provider`、`POST /api/oauth/state`、`POST /api/user/auth/refresh`、`POST /api/user/auth/logout`
- **业务与管理组**（均挂载于 `/api/*`，源码见 `/home/ubuntu/tokex/router/`）：
  - `/api/user/*`、`/api/token/*`、`/api/channel/*`、`/api/log/*`、`/api/usage/*`、`/api/data/*`
  - `/api/option/*`、`/api/redemption/*`、`/api/subscription/*`、`/api/models/*`、`/api/group/*`、`/api/vendors/*`
- **AI 模型网关中继接口**：
  - `/v1/chat/completions`、`/v1/responses`、`/v1/messages`、`/v1/models`、`/v1/images/*`、`/v1/videos/*`、`/v1/tasks/*`
  - `/v1beta/models/*`（Gemini）、`/pg/*`（Playground）、`/mj/*` 与 `/:mode/mj/*`（Midjourney）

### 数据库关键信息（容器 `tokex-db`，库名 `newapi`）
- **已有管理员与测试账号**（`users` 表）：
  - `id=1`: `admin`（`role=100` 超级管理员）
  - `id=2`: `test`（`role=1` 普通用户）
  - `id=3`: `tokex_preview`（`role=100` 预览验收管理员）
  - `id=4`: `leoravyn`（`role=1` 普通用户）
- **已配置渠道**（`channels` 表）：
  - `id=1`: `AWS-Bedrock-Tokyo`（`status=2` 禁用）
  - `id=2`: `Claude`（`status=1` 启用，`group=default`）
  - `id=3`: `CPA-Claude-Pool`（`status=1` 启用，`group=pool`，`base_url=http://tokex-cpa:8317`）
- **关键 `options` 键名**（修改后需 `docker restart tokex-web` 使其全部重载，密钥/Token 值保存在库内）：
  - 站点与注册：`SystemName`、`RegisterEnabled`、`PasswordRegisterEnabled`、`QuotaForNewUser`、`EmailDomainRestrictionEnabled`、`EmailDomainWhitelist`
  - 邮件（Resend）：`EmailProvider`（`resend`）、`EmailVerificationEnabled`、`ResendFrom`（`noreply@tokex.vip`）、`ResendApiKey`
  - OAuth：`GitHubOAuthEnabled`、`GitHubClientId`、`GitHubClientSecret`、`oidc.enabled`、`oidc.display_name`、`oidc.client_id`、`oidc.client_secret`、`oidc.well_known`、`oidc.authorization_endpoint`、`oidc.token_endpoint`、`oidc.user_info_endpoint`
  - 人机验证（Turnstile）：`TurnstileCheckEnabled`、`TurnstileSiteKey`、`TurnstileSecretKey`

---

## 6. 开发、构建与上线标准流程（必读约束）

> **主机环境约束（2GB 内存 ARM64）**：
> 1. **`oxlint` 在 ARM64 存在原生 panic，请始终跳过 `oxlint`**，仅使用 `bun check -b` 做全量 TypeScript 检查。
> 2. 内存紧张，**执行全量构建前务必关闭临时 `rsbuild dev` 预览进程**，并限制 Node/Bun 堆内存（`NODE_OPTIONS="--max-old-space-size=1536"`）。

### 日常开发预览（在 `dev` 分支）
```bash
export PATH="$HOME/.bun/bin:$PATH"
cd /home/ubuntu/tokex/web
NODE_OPTIONS="--max-old-space-size=1536" bun --bun x rsbuild dev --host 0.0.0.0 --port 5173
# 预览结束后记得停止 dev 进程释放内存
```

### 类型校验与生产构建
```bash
export PATH="$HOME/.bun/bin:$PATH"
cd /home/ubuntu/tokex/web
bun check -b
NODE_OPTIONS="--max-old-space-size=1536" bun --bun x rsbuild build
```

### 合并至生产分支并发布到 `https://tokex.vip`
```bash
# 1. 在 /home/ubuntu/tokex 确认 dev 已提交并合入 main
cd /home/ubuntu/tokex
git checkout main && git merge dev --no-ff

# 2. 同步最新构建产物到生产 Nginx 根目录
sudo rm -rf /var/www/tokex/dist
sudo mkdir -p /var/www/tokex/dist
sudo cp -r /home/ubuntu/tokex/web/dist/* /var/www/tokex/dist/
sudo chmod -R a+rX /var/www/tokex/dist

# 3. 校验并重载 Nginx
sudo nginx -t && sudo systemctl reload nginx

# 4. 切回 dev 继续日常开发
git checkout dev
```

### 上线必测检查命令
```bash
curl -sS https://tokex.vip/api/status
curl -I https://tokex.vip/
curl -I https://tokex.vip/sign-in
curl -I https://tokex.vip/dashboard
```
