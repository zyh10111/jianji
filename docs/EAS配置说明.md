# EAS Build 配置说明

本文档说明如何正确配置 EAS Build，包括 `eas build:configure` 命令的使用。

---

## 重要提示

### `eas build:configure` 不支持 `--non-interactive` 参数

⚠️ **重要**：`eas build:configure` 命令**不支持** `--non-interactive` 参数。

这个命令是**交互式的**，需要用户输入来配置项目。

---

## 正确的使用方法

### 方法一：交互式配置（推荐）

**适用于**：首次配置项目或需要修改配置

```bash
# 直接运行命令，会提示您输入配置选项
eas build:configure
```

**交互式流程**：
1. 选择构建类型（development/preview/production）
2. 选择平台（Android/iOS/All）
3. 配置选项（签名、环境变量等）

### 方法二：跳过配置（适用于已配置项目）

**适用于**：项目已有 `eas.json` 配置文件

在自动化脚本或 CI/CD 中，**不要运行 `eas build:configure`**，直接检查 `eas.json` 是否存在：

```bash
# 检查配置文件是否存在
if [ -f "eas.json" ]; then
    echo "✅ eas.json already exists, skipping configuration"
else
    echo "⚠️ eas.json not found"
    echo "Note: EAS build will use default configuration"
    # 不要在这里运行 eas build:configure（需要交互）
fi
```

---

## 在 GitHub Actions 中的配置

### 当前实现（正确）

我们的 GitHub Actions workflow 使用以下方式：

```yaml
- name: Configure EAS
  run: |
    # 检查 eas.json 是否存在，如果存在则跳过配置
    if [ -f "eas.json" ]; then
      echo "✅ eas.json already exists, skipping configuration"
    else
      echo "⚠️ eas.json not found"
      echo "Note: EAS build will use default configuration"
      echo "You can manually configure by running: eas build:configure"
    fi
  continue-on-error: true
  env:
    EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

**为什么这样做？**
- ✅ 避免了不支持的 `--non-interactive` 参数
- ✅ 如果 `eas.json` 已存在，直接使用（无需配置）
- ✅ 如果不存在，使用 EAS 的默认配置（通常可以正常工作）

---

## 在本地构建脚本中的配置

### Windows 脚本（构建APK.bat）

```batch
REM 检查eas.json是否存在
if not exist "eas.json" (
    echo ⚠️  未检测到eas.json配置文件
    echo 正在配置项目...
    call eas build:configure
    REM 这是交互式的，用户需要输入配置选项
    if %errorlevel% neq 0 (
        echo ❌ 配置失败
        pause
        exit /b 1
    )
    echo ✅ 配置完成
) else (
    echo ✅ 已找到eas.json配置文件
)
```

**为什么这样做？**
- ✅ 本地脚本可以交互式运行
- ✅ 用户可以直接输入配置选项
- ✅ 这是正确的用法

### Linux/Mac 脚本（构建APK.sh）

```bash
# 检查eas.json是否存在
if [ ! -f "eas.json" ]; then
    echo "⚠️  未检测到eas.json配置文件"
    echo "正在配置项目..."
    eas build:configure
    # 这是交互式的，用户需要输入配置选项
    if [ $? -ne 0 ]; then
        echo "❌ 配置失败"
        exit 1
    fi
    echo "✅ 配置完成"
else
    echo "✅ 已找到eas.json配置文件"
fi
```

---

## 首次配置项目

### 手动配置（推荐）

**步骤**：

1. **确保已登录**
   ```bash
   eas login
   ```

2. **配置项目**
   ```bash
   eas build:configure
   ```

3. **按照提示配置**
   - 选择构建类型
   - 选择平台
   - 配置选项

4. **提交配置文件**
   ```bash
   git add eas.json
   git commit -m "Add EAS build configuration"
   git push
   ```

### 配置文件示例

配置完成后，会生成 `eas.json` 文件：

```json
{
  "cli": {
    "version": ">= 16.28.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 常见问题

### Q: 为什么不能在 CI/CD 中使用 `--non-interactive`？

**A:** `eas build:configure` 命令设计为交互式命令，需要用户输入配置选项。它不支持非交互式模式。

**解决方案**：
- 在 CI/CD 中，检查 `eas.json` 是否存在
- 如果存在，直接使用
- 如果不存在，使用 EAS 的默认配置（或手动配置后提交）

### Q: 如何在 CI/CD 中自动配置？

**A:** 不建议在 CI/CD 中自动配置，因为：

1. **配置文件应该提交到代码仓库**
   - `eas.json` 应该作为项目配置的一部分
   - 团队成员可以共享相同的配置

2. **配置是一次性的**
   - 项目配置后，`eas.json` 应该保持不变
   - 不需要每次构建都重新配置

3. **可以使用默认配置**
   - 如果没有 `eas.json`，EAS 会使用默认配置
   - 对于简单的项目，默认配置通常足够

### Q: 如果项目没有 `eas.json`，构建会失败吗？

**A:** 不会。EAS Build 会使用默认配置：

- **Android**：使用默认签名和配置
- **iOS**：使用默认配置（需要 Apple 开发者账户）
- **构建类型**：默认使用 `production` profile

**建议**：还是应该创建 `eas.json` 文件，以便更好地控制构建过程。

---

## 最佳实践

### 1. 首次配置

1. 在本地运行 `eas build:configure`
2. 按照提示配置项目
3. 提交 `eas.json` 到代码仓库

### 2. CI/CD 配置

1. 检查 `eas.json` 是否存在
2. 如果存在，直接使用
3. 如果不存在，使用默认配置或提示用户手动配置

### 3. 团队协作

1. 将 `eas.json` 提交到代码仓库
2. 团队成员拉取代码后自动获得配置
3. 如需修改配置，在本地运行 `eas build:configure`，然后提交更改

---

## 相关命令

### 其他 EAS 命令（支持 --non-interactive）

以下命令**支持** `--non-interactive` 参数：

```bash
# 登录（使用 token）
eas login --non-interactive
# 需要设置 EXPO_TOKEN 环境变量

# 查看构建
eas build:view <build-id> --non-interactive

# 列出构建
eas build:list --non-interactive

# 构建（部分支持）
eas build --platform android --non-interactive --no-wait
```

### 不支持 --non-interactive 的命令

```bash
# ❌ 不支持
eas build:configure --non-interactive

# ✅ 正确用法
eas build:configure  # 交互式
```

---

## 总结

- ✅ **`eas build:configure` 不支持 `--non-interactive`**
- ✅ **在 CI/CD 中，检查 `eas.json` 是否存在，而不是运行配置命令**
- ✅ **在本地脚本中，可以交互式运行 `eas build:configure`**
- ✅ **配置文件应该提交到代码仓库**

---

**文档版本**：v1.0  
**最后更新**：2024年
