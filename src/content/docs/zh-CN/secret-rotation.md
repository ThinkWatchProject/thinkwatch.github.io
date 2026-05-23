# 密钥轮换指南

本文档介绍 ThinkWatch 使用的各类密钥的轮换流程。

## JWT Secret 轮换

JWT Secret（`JWT_SECRET`）用于签发和校验访问令牌 / 刷新令牌。

### 操作步骤

1. **生成新 Secret**（至少 32 字符）：
   ```bash
   openssl rand -hex 32
   ```

2. **安排停机窗口** —— 轮换 JWT Secret 会立即使所有现有令牌失效。

3. **更新部署中的环境变量**（`.env.production`、Kubernetes Secret 等）：
   ```
   JWT_SECRET=<new-secret>
   ```

4. **同时重启所有 ThinkWatch 服务器实例**。

5. **用户需要重新登录** —— 现有的访问令牌和刷新令牌都将失效。

### 影响

- 所有活跃会话被终止
- 使用 JWT 令牌的 API 消费方必须重新认证
- API 密钥（Bearer `tw-*`）**不受影响**（使用基于哈希的认证）

---

## 加密密钥轮换

加密密钥（`ENCRYPTION_KEY`）用于加密存储在数据库中的 Provider API 密钥与 MCP 服务器认证机密（AES-256-GCM）。

### 操作步骤

1. **生成新的 32 字节密钥**（64 位 hex 字符）：
   ```bash
   openssl rand -hex 32
   ```

2. **重新加密所有 Provider API 密钥与 MCP 机密**：
   ```sql
   -- 必须通过程序完成。
   -- 导出密文 → 用旧 key 解密 → 用新 key 加密 → 写回数据库。
   ```

   推荐通过迁移脚本完成：
   ```rust
   let old_key = parse_encryption_key(&old_hex)?;
   let new_key = parse_encryption_key(&new_hex)?;

   // 对每个 provider
   let decrypted = decrypt(&provider.api_key_encrypted, &old_key)?;
   let re_encrypted = encrypt(&decrypted, &new_key)?;
   // UPDATE providers SET api_key_encrypted = $1 WHERE id = $2
   ```

3. **更新环境变量**：
   ```
   ENCRYPTION_KEY=<new-64-hex-chars>
   ```

4. **重启所有实例**。

### 影响

- 如果忘记重新加密现有机密，它们将变得不可读
- 新建的 Provider / MCP 机密会使用新 key
- 部署前务必先用新 key 验证一次解密

---

## API 密钥轮换

API 密钥可通过内置的轮换 API 实现零停机轮换。

### 通过 API

```bash
# 轮换密钥（旧密钥在宽限期内仍然有效）
curl -X POST /api/keys/{key_id}/rotate \
  -H "Authorization: Bearer <access_token>" \
  -H "X-Signature-Timestamp: ..." \
  -H "X-Signature-Nonce: ..." \
  -H "X-Signature: hmac-sha256:..."

# 响应包含新的明文密钥
{
  "id": "new-key-uuid",
  "key": "tw-...",
  "name": "My Key (rotated)",
  "key_prefix": "tw-..."
}
```

### 通过 Web UI

1. 进入 **AI Gateway → API Keys**
2. 在目标密钥行点击 **Rotate** 按钮
3. 在弹窗中确认轮换
4. 立即复制新密钥（仅显示一次）
5. 用新密钥更新你的应用
6. 旧密钥在配置的宽限期内继续有效（默认：24 小时）

### 自动轮换

在 **Settings → API Key Policies** 中配置自动轮换：

- **Rotation Period (days)**：设置为 > 0 即启用自动轮换
- **Grace Period (hours)**：轮换后旧密钥继续有效的时长

---

## OIDC Client Secret 轮换

OIDC Client Secret 用于与你的身份提供商（如 Zitadel）建立认证。

### 操作步骤

1. **在 OIDC Provider 的管理控制台中生成新的 Client Secret**。

2. **更新环境变量**：
   ```
   OIDC_CLIENT_SECRET=<new-secret>
   ```

3. **重启所有 ThinkWatch 实例** —— OIDC 发现在启动时执行。

### 影响

- 重启期间 SSO 登录可能短暂失败
- 现有 JWT 令牌在过期前仍然有效
- 已建立会话的用户不受影响

---

### Redis Signing Keys

Signing Keys 用于对状态变更类请求（POST、PUT、PATCH、DELETE）做 HMAC-SHA256 签名校验。其特性：

- 登录与令牌刷新时自动生成（32 字节随机值，hex 编码）
- 存储于 Redis，TTL 为 24 小时（与刷新令牌一致）
- **绑定客户端 IP** —— 登录时的 IP 与 key 一同存储；来自不同 IP 的请求会被拒绝
- 通过 httpOnly Cookie（`signing_key`）下发到客户端

**轮换：** Signing Keys 在每次登录和令牌刷新时自动轮换。如需强制为某个用户立即轮换，可在管理后台执行「强制登出」，该操作会使其所有会话与 Signing Key 失效。

无需手动轮换。

---

## 最佳实践

1. **尽量在业务低峰期执行轮换**
2. **先在预发环境测试**，再轮换生产密钥
3. **在运维日志中记录轮换操作**
4. **轮换后监控异常** —— 检查 `/api/health` 与应用日志
5. **不同环境使用不同的密钥**（dev / staging / production）
6. **将密钥存放在 Vault 中**（HashiCorp Vault、AWS Secrets Manager 等），而非明文文件
7. **日志转发器凭证** —— 如果使用带认证的 Kafka、HTTP Webhook 或 Syslog，在 Admin > Log Forwarding 中轮换这些凭证，并在轮换后测试连通性
