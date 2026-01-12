# Android Keystore 说明

本文档说明关于Android Keystore（签名密钥）的问题。

---

## 什么是 Android Keystore？

**Android Keystore** 是Android应用的签名密钥文件，用于：
- 验证应用的开发者身份
- 确保应用在更新时来自同一开发者
- 发布应用到Google Play商店

---

## 提示："Generate a new Android Keystore?"

当运行 `eas build --platform android --profile production` 时，系统会提示是否生成新的Android Keystore。

### 选项说明

**1. Yes（是）- 生成新的Keystore**
- Expo会自动生成和管理Keystore
- 适用于首次构建生产版应用
- **推荐选择**：如果不确定，选择"Yes"

**2. No（否）- 使用现有的Keystore**
- 使用已有的Keystore文件
- 适用于已有签名密钥的项目

---

## 对于学生作业

### 推荐方案：使用 Preview 模式（不需要Keystore）

**对于大学生作业**，**强烈推荐使用 Preview 模式**，因为：

1. ✅ **不需要签名**：Preview模式不需要Keystore
2. ✅ **可以直接安装**：生成的APK可以直接安装到设备
3. ✅ **简单快捷**：不需要管理签名密钥
4. ✅ **适合作业**：完全满足作业要求

### 构建命令

```bash
# 使用Preview模式（推荐，不需要Keystore）
eas build --platform android --profile preview
```

### Preview vs Production

| 特性 | Preview（预览版） | Production（生产版） |
|------|------------------|---------------------|
| 需要Keystore | ❌ 不需要 | ✅ 需要 |
| 可以直接安装 | ✅ 可以 | ✅ 可以 |
| 适合作业 | ✅ 非常适合 | ⚠️ 可以但复杂 |
| 适合发布到商店 | ❌ 不适合 | ✅ 适合 |
| 推荐学生使用 | ✅ **强烈推荐** | ⚠️ 不推荐 |

---

## 如果需要生成Keystore（Production模式）

如果您确实需要使用Production模式，可以：

### 选项1：让Expo自动生成（推荐）

当提示"Generate a new Android Keystore?"时，选择：
- **Y** (Yes) - 生成新的Keystore

Expo会：
- 自动生成Keystore
- 安全地存储在Expo服务器上
- 自动管理，无需手动处理

**这是最简单的方式，推荐选择！**

### 选项2：手动管理Keystore（高级）

如果您需要手动管理Keystore：

1. **生成Keystore**
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **配置到EAS**
   ```bash
   eas credentials
   ```

**注意**：手动管理Keystore需要专业知识，不推荐初学者使用。

---

## 常见问题

### 1. 提示"Generate a new Android Keystore?"时应该选择什么？

**推荐**：选择 **Yes（是）**

- Expo会自动生成和管理
- 最简单方便
- 适合首次构建

### 2. 学生作业需要用Production模式吗？

**不需要！**

- 使用Preview模式即可
- 生成的APK可以直接安装
- 完全满足作业要求

### 3. 如果选择了No会怎样？

- 需要提供现有的Keystore文件
- 如果不确定，建议选择Yes

### 4. 生成的Keystore在哪里？

- Expo会自动存储在服务器上
- 不需要手动管理
- 可以随时查看：`eas credentials`

### 5. 如果丢失了Keystore怎么办？

- 如果是Expo管理的，可以通过 `eas credentials` 查看
- 如果丢失且应用已发布，无法更新应用
- **重要**：请妥善保管Keystore

---

## 推荐操作流程

### 对于学生作业（推荐）

```bash
# 1. 使用Preview模式（不需要Keystore）
eas build --platform android --profile preview

# 2. 等待构建完成
# 3. 下载APK文件
# 4. 安装到设备
```

### 如果需要Production模式

```bash
# 1. 运行构建命令
eas build --platform android --profile production

# 2. 当提示"Generate a new Android Keystore?"时
#    选择：Y (Yes)

# 3. 等待构建完成
# 4. 下载APK文件
```

---

## 总结

### 对于学生作业

✅ **推荐使用Preview模式**
- 不需要Keystore
- 简单快捷
- 完全满足要求

```bash
eas build --platform android --profile preview
```

### 如果需要Production模式

✅ **选择Yes生成新的Keystore**
- Expo自动管理
- 最简单方便

---

**文档版本**：v1.0  
**最后更新**：2024年
