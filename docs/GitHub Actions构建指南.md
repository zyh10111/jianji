# GitHub Actions APK 自动构建指南

本指南将帮助您配置 GitHub Actions 来自动构建 Android APK。

---

## 功能特点

✅ **自动化构建**：推送代码到 GitHub 时自动触发构建  
✅ **多种触发方式**：支持 push、tag、pull request 和手动触发  
✅ **构建类型选择**：支持 preview、production、development 三种构建类型  
✅ **快速完成**：不等待构建完成，workflow 快速结束（2-5 分钟）  
✅ **构建链接**：自动生成构建链接，方便查看状态和下载 APK  

---

## 前置条件

### 1. 获取 Expo Access Token

要使用 GitHub Actions 自动构建，您需要获取 Expo Access Token：

#### 方法一：通过 EAS CLI（推荐）

```bash
# 1. 安装 EAS CLI（如果还没有）
npm install -g eas-cli

# 2. 登录 Expo
eas login
# 输入您的 Expo 账户邮箱和密码

# 3. 生成 Access Token
eas token:create
# 输入 token 名称，例如：GitHub Actions
# 复制生成的 token（只显示一次，请妥善保存）
```

**注意事项**：
- Token 只显示一次，请立即复制并保存
- Token 名称仅用于标识，可以任意命名
- 确保 token 具有 `build` 权限（创建时会自动包含）

#### 方法二：通过 Expo 网站

1. 访问 https://expo.dev/accounts/[your-username]/settings/access-tokens
   - 将 `[your-username]` 替换为您的 Expo 用户名
2. 点击 **Create Token** 按钮
3. 输入 Token 名称（如 "GitHub Actions"）
4. 确认权限（通常默认包含 `build` 权限）
5. 点击 **Create Token**
6. **立即复制生成的 token**（只显示一次）

### 2. 配置 GitHub Secrets

1. 打开您的 GitHub 仓库
2. 进入 **Settings** > **Secrets and variables** > **Actions**
3. 点击 **New repository secret**
4. 添加以下 secret：

   - **Name**: `EXPO_TOKEN`
   - **Value**: 您刚才获取的 Expo Access Token

5. 点击 **Add secret**

---

## 使用方法

### 自动触发（推荐）

配置完成后，以下操作会自动触发构建：

1. **推送到主分支**
   ```bash
   git push origin main
   ```

2. **创建标签**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **创建 Pull Request**
   - 创建 PR 到 main 或 master 分支时会自动构建

### 手动触发

1. 打开 GitHub 仓库
2. 进入 **Actions** 标签页
3. 选择 **Build Android APK** workflow
4. 点击 **Run workflow**
5. 选择构建类型：
   - **preview**：预览版（推荐，可直接安装）
   - **production**：生产版（需要签名）
   - **development**：开发版
6. 点击 **Run workflow** 开始构建

---

## 查看构建结果

### 从 Expo 网站下载（推荐）

**注意**：为了加快 workflow 执行速度，GitHub Actions 不会等待构建完成，也不会自动下载 APK。

**下载步骤**：

1. **获取构建链接**
   - 进入 GitHub Actions 页面
   - 点击最新的 workflow run
   - 在 Build Summary 中找到构建链接

2. **访问 Expo 网站**
   - 点击构建链接，或访问：
   - https://expo.dev/accounts/zyh123456/projects/noteease/builds

3. **查看构建状态**
   - 构建通常需要 10-20 分钟
   - 状态会显示为：in-progress → finished

4. **下载 APK**
   - 构建完成后，点击下载按钮
   - 或等待构建完成通知

### 构建状态说明

- **in-progress**：正在构建中（10-20 分钟）
- **finished**：构建完成，可以下载
- **errored**：构建失败，查看日志
- **canceled**：构建已取消

---

## Workflow 配置说明

### 触发条件

```yaml
on:
  push:
    branches:
      - main
      - master
    tags:
      - 'v*'
  pull_request:
    branches:
      - main
      - master
  workflow_dispatch:  # 允许手动触发
```

### 构建步骤

1. **Checkout repository**：检出代码
2. **Setup Node.js**：设置 Node.js 环境
3. **Install dependencies**：安装项目依赖
4. **Fix Expo dependencies**：修复依赖版本
5. **Check Expo doctor**：检查项目配置（警告不影响构建）
6. **Install EAS CLI**：安装 EAS CLI 工具
7. **Verify app.json**：验证应用配置
8. **Configure EAS**：检查 EAS 配置（如果已存在则跳过）
9. **Verify Expo authentication**：验证 EXPO_TOKEN 是否有效
10. **Build APK**：触发 EAS build（不等待完成）
11. **Build Summary**：显示构建链接和状态

**注意**：Workflow 不会等待构建完成，构建在 Expo 云端进行。完成后从 Expo 网站下载 APK。

---

## 常见问题

### 1. 构建失败：account: login 命令失败

**错误信息**：
```
Error: account: login command failed
```

**解决方案**：

**快速检查清单**：
- [ ] 是否在 GitHub Secrets 中配置了 `EXPO_TOKEN`？
- [ ] Token 名称是否完全匹配（大小写敏感）？
- [ ] Token 值是否正确（没有多余空格或换行）？
- [ ] Token 是否有效且未过期？
- [ ] Token 是否具有 `build` 权限？

**详细解决步骤**：

1. **验证 Token 是否正确配置**
   ```bash
   # 在本地测试 token 是否有效
   export EXPO_TOKEN="your-token-here"
   eas whoami
   ```
   如果命令成功，说明 token 有效。

2. **检查 GitHub Secrets**
   - 进入 GitHub 仓库的 **Settings** > **Secrets and variables** > **Actions**
   - 确认存在名为 `EXPO_TOKEN` 的 secret（注意大小写）
   - 如果不存在或值错误，重新添加或更新

3. **重新生成 Token**
   ```bash
   # 方法一：通过 EAS CLI
   eas token:create
   
   # 方法二：通过网站
   # 访问 https://expo.dev/accounts/[your-username]/settings/access-tokens
   # 点击 "Create Token"，复制新生成的 token
   ```

4. **更新 GitHub Secret**
   - 在 GitHub Secrets 中更新 `EXPO_TOKEN` 的值
   - 确保粘贴时没有多余的空格或换行符

5. **验证修复**
   - 重新运行 GitHub Actions workflow
   - 查看 "Verify Expo authentication" 步骤是否成功

### 2. 构建失败：EXPO_TOKEN 未设置

**错误信息**：
```
❌ EXPO_TOKEN secret is not set
```

**解决方案**：
- 检查是否在 GitHub Secrets 中正确配置了 `EXPO_TOKEN`
- 确保 secret 名称完全匹配：`EXPO_TOKEN`（大小写敏感）
- 在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加或更新

### 3. 构建失败：权限不足

**错误信息**：
```
❌ Invalid EXPO_TOKEN
```

**解决方案**：
- 确保 Expo token 具有 `build` 权限
- 重新生成 token 并选择正确的权限（至少需要 `build` 权限）
- 确保 token 没有过期

### 4. 构建超时

**问题**：构建时间超过 30 分钟

**解决方案**：
- 这是正常的，首次构建需要下载依赖
- 可以增加等待时间（修改 workflow 中的循环次数）
- 或者使用 `--no-wait` 参数，然后手动检查构建状态

### 5. 无法下载 APK

**问题**：构建完成但无法下载 APK

**解决方案**：
- 检查网络连接
- 从 Expo 网站直接下载
- 检查 artifact 是否成功上传
- 确保下载 URL 有效

### 6. 构建状态一直显示 "in progress"

**问题**：构建似乎卡住了

**解决方案**：
- 检查 Expo 网站上的实际构建状态
- 可能是网络问题导致状态更新延迟
- 可以手动取消并重新触发构建
- 首次构建可能需要更长时间（下载依赖等）

---

## 优化建议

### 1. 减少构建频率

如果不想每次 push 都构建，可以修改触发条件：

```yaml
on:
  push:
    branches:
      - main
    tags:
      - 'v*'
  workflow_dispatch:
```

### 2. 添加构建通知

可以在 workflow 中添加通知步骤，比如发送邮件或 Slack 消息：

```yaml
- name: Notify on success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'APK build completed successfully!'
```

### 3. 缓存依赖

Workflow 已经配置了 npm 缓存，可以加快构建速度。

### 4. 并行构建多个平台

如果需要同时构建 Android 和 iOS：

```yaml
strategy:
  matrix:
    platform: [android, ios]
```

---

## 费用说明

### GitHub Actions

- **免费额度**：每月 2000 分钟（公开仓库无限）
- **超出后**：按使用量计费

### EAS Build

- **免费额度**：每月有限的免费构建次数
- **超出后**：需要升级到付费计划

**对于学生作业**：免费额度通常足够使用。

---

## 安全建议

1. **保护 Token**：
   - 永远不要将 `EXPO_TOKEN` 提交到代码仓库
   - 只使用 GitHub Secrets 存储敏感信息
   - 定期轮换 token

2. **权限最小化**：
   - 只授予 token 必要的权限
   - 不要使用具有管理员权限的 token

3. **审查 Workflow**：
   - 定期检查 workflow 文件
   - 确保没有泄露敏感信息

---

## 相关文档

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [EAS Build 文档](https://docs.expo.dev/build/introduction/)
- [Expo Access Tokens](https://docs.expo.dev/accounts/programmatic-access/)

---

**文档版本**：v1.0  
**最后更新**：2024年
