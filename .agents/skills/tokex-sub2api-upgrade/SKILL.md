---
name: tokex-sub2api-upgrade
description: Upgrade the TOKEX sub2api upstream pool service (service `pool` / container `tokex-pool`) safely with release-note checks, rollback image tagging, PostgreSQL backup, smoke tests, and safe dangling-image pruning. Use when the user asks to upgrade sub2api, update tokex-pool, or check weishaw/sub2api updates (e.g., "升级 sub2api", "更新号池", "升级 tokex-pool").
---

# TOKEX sub2api 升级手册

[`/opt/tokex/docker-compose.yml`](file:///opt/tokex/docker-compose.yml) 中 `tokex-pool` 对应的 compose service 名称为 **`pool`**（镜像 `weishaw/sub2api:latest`，内存限制 `mem_limit: 384m`、`GOMEMLIMIT=280MiB`）。升级时只操作 `pool` 服务，严禁影响 `web`、`db`、`redis`。

## 执行流程

1. **核对当前版本与最新 Release Notes（破坏性变更卡点）**
   - 查看当前运行版本与上游最新 Release：
     ```bash
     docker inspect -f '{{index .Config.Labels "org.opencontainers.image.version"}}' weishaw/sub2api:latest
     gh release list -R Wei-Shaw/sub2api --limit 5
     gh release view <latest_tag> -R Wei-Shaw/sub2api
     ```
   - 若 Release Notes 存在**破坏性变更**、数据库不可逆迁移警告，或需要修改 `/opt/tokex/.env` / `/opt/tokex/docker-compose.yml` 配置，**必须立即暂停并向用户列出变更点确认**，未获确认前不要拉取或重启。

2. **保留回滚镜像并备份 `sub2api` 数据库**
   - 为当前运行中的旧镜像打上 `weishaw/sub2api:rollback` 标签：
     ```bash
     docker tag "$(docker inspect -f '{{.Image}}' tokex-pool)" weishaw/sub2api:rollback
     ```
   - 备份 `tokex-db` 中的 `sub2api` 数据库到 `/opt/tokex/backups/`（确认文件非空）：
     ```bash
     BACKUP_FILE="/opt/tokex/backups/sub2api-pre-upgrade-$(date +%Y%m%d-%H%M%S).sql.gz"
     docker exec tokex-db sh -c 'pg_dump --clean --if-exists -U "${POSTGRES_USER:-sub2api}" -d "${POSTGRES_DB:-sub2api}"' | gzip > "$BACKUP_FILE"
     ls -lh "$BACKUP_FILE"
     ```

3. **仅拉取并重建 `pool` 服务，随后检查日志与冒烟**
   - 仅拉取 `pool` 新镜像并无依赖重建：
     ```bash
     cd /opt/tokex && docker compose pull pool && docker compose up -d --no-deps pool
     ```
   - 等待启动后检查容器健康、OOM 状态与日志：
     ```bash
     sleep 5
     docker ps --filter name=tokex-pool --format "{{.Names}} {{.Status}}"
     docker inspect -f 'OOMKilled={{.State.OOMKilled}} Health={{.State.Health.Status}}' tokex-pool
     docker logs --tail 50 tokex-pool
     ```
   - 冒烟验证本地端口与线上域名：
     ```bash
     curl -sS -o /dev/null -w "local_8080:%{http_code}\n" http://127.0.0.1:8080/health
     curl -sS -o /dev/null -w "sub_tokex:%{http_code}\n" https://sub.tokex.vip/
     ```

4. **清理无标签悬空镜像**
   - 确认冒烟全部正常后，仅清理更早的无标签悬空镜像（**严禁加 `-a`**，避免误删 `weishaw/sub2api:rollback` 镜像）：
     ```bash
     docker image prune -f
     ```

---

## 回滚步骤（升级异常时使用）

1. **停止 `pool` 并恢复旧镜像标签**：
   ```bash
   cd /opt/tokex && docker compose stop pool
   docker tag weishaw/sub2api:rollback weishaw/sub2api:latest
   ```
2. **如新版本已改写数据库结构，恢复备份的 `sub2api` 库**：
   ```bash
   gunzip -c /opt/tokex/backups/sub2api-pre-upgrade-<timestamp>.sql.gz | \
     docker exec -i tokex-db sh -c 'psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER:-sub2api}" -d "${POSTGRES_DB:-sub2api}"'
   ```
   *(若新版本只是新增兼容列未破坏旧版，可先仅回滚镜像验证；仅当出现 schema 不兼容报错时再执行删库重建或按备份恢复。)*
3. **重启 `pool` 并复核健康与冒烟**：
   ```bash
   cd /opt/tokex && docker compose up -d --no-deps pool
   curl -sS -o /dev/null -w "local_8080:%{http_code}\n" http://127.0.0.1:8080/health
   curl -sS -o /dev/null -w "sub_tokex:%{http_code}\n" https://sub.tokex.vip/
   ```
