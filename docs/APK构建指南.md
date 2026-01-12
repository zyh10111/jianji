# Android APK 构建指南

本指南将帮助您生成简记（NoteEase）应用的Android APK文件。

---

## 方法一：使用 EAS Build（推荐）

EAS Build是Expo官方的云端构建服务，无需配置Android开发环境，适合所有用户。

### 步骤

#### 1. 安装 EAS CLI

```bash
npm install -g eas-cli
```

或者使用npx（不需要全局安装）：

```bash
npx eas-cli --version
```

#### 2. 登录 Expo 账户

```bash
eas login
```

如果没有账户，请访问 [Expo官网](https://expo.dev/) 免费注册。

**注册步骤**：
1. 访问 https://expo.dev/signup
2. 使用邮箱或GitHub账号注册
3. 验证邮箱
4. 登录完成

#### 3. 配置项目

在项目根目录运行：

```bash
eas build:configure
```

这个命令会：
- 创建 `eas.json` 配置文件
- 检测项目配置
- 提示您选择构建类型

#### 4. 构建 APK

**构建开发版本APK（用于测试）：**

```bash
eas build --platform android --profile development
```

**构建生产版本APK（用于发布）：**

```bash
eas build --platform android --profile production
```

**构建APK文件（不签名，可直接安装）：**

```bash
eas build --platform android --profile preview
```

**推荐使用 `preview` 模式**，因为生成的APK不需要签名，可以直接安装到设备上。

#### 5. 等待构建完成

构建过程通常需要 10-20 分钟，您会看到：
- 构建进度提示
- 构建完成后会提供下载链接

#### 6. 下载 APK

构建完成后，您可以通过以下方式下载：

1. **从终端链接下载**
   - 构建完成后，终端会显示下载链接
   - 在浏览器中打开链接
   - 下载APK文件

2. **从Expo网站下载**
   - 访问 https://expo.dev/accounts/[your-username]/projects/noteease/builds
   - 找到最新的构建
   - 点击下载按钮

#### 7. 安装 APK

1. **传输APK到设备**
   - 通过USB传输
   - 通过云盘传输
   - 通过邮件发送

2. **在设备上安装**
   - 打开文件管理器
   - 找到APK文件
   - 点击安装
   - 如果提示"禁止安装未知来源应用"，请在设置中允许安装

---

## 方法二：本地构建（需要Android开发环境）

如果您已配置Android开发环境，可以使用本地构建。

### 前置条件

1. **安装Android Studio**
   - 下载：https://developer.android.com/studio
   - 安装Android SDK
   - 配置环境变量

2. **安装Java JDK**
   - 推荐JDK 11或更高版本

3. **配置环境变量**
   ```bash
   # Windows
   ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   JAVA_HOME=C:\Program Files\Java\jdk-11
   
   # macOS/Linux
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home
   ```

### 步骤

#### 1. 生成本地Android项目

```bash
npx expo prebuild --platform android
```

#### 2. 构建APK

**调试版本（Debug）：**

```bash
cd android
./gradlew assembleDebug
```

**发布版本（Release）：**

```bash
cd android
./gradlew assembleRelease
```

#### 3. 找到APK文件

APK文件位置：
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

---

## EAS Build 配置文件说明

如果使用EAS Build，配置文件 `eas.json` 示例：

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 常见问题

### 1. 构建失败：缺少图标文件

**问题**：`app.json`中引用了图标文件，但实际不存在。

**解决方案**：
- 创建 `assets` 目录
- 添加图标文件：
  - `assets/icon.png` (1024x1024)
  - `assets/adaptive-icon.png` (1024x1024)
  - `assets/splash.png` (1242x2436)
- 或者修改 `app.json`，移除图标配置（构建时会使用默认图标）

### 2. 构建失败：API配置错误

**问题**：API密钥配置错误导致构建失败。

**解决方案**：
- 检查 `src/config/apiConfig.js` 配置
- 如果使用模拟实现，确保 `ENABLE_VOICE_RECOGNITION = false`
- 如果使用真实API，确保API密钥正确

### 3. 构建时间过长

**问题**：构建时间超过30分钟。

**解决方案**：
- 这是正常的，首次构建需要下载依赖
- 后续构建会更快（使用缓存）
- 可以查看构建日志了解进度

### 4. 下载APK失败

**问题**：无法下载构建好的APK。

**解决方案**：
- 检查网络连接
- 尝试使用VPN（如果在中国大陆）
- 从Expo网站直接下载

### 5. 安装APK失败

**问题**：在设备上安装APK时提示错误。

**解决方案**：
- 确保设备允许安装未知来源应用
- Android 8.0+：设置 > 应用和通知 > 特殊访问权限 > 安装未知应用
- 检查APK文件是否完整下载
- 尝试重新下载APK

### 6. 应用崩溃

**问题**：安装后应用无法启动或崩溃。

**解决方案**：
- 检查Android版本（要求Android 6.0+）
- 检查权限设置
- 查看日志：`adb logcat`
- 使用开发版本构建进行调试

---

## 构建类型说明

### Preview（预览版）
- **用途**：测试和分发
- **签名**：不需要签名
- **安装**：可直接安装
- **推荐**：适合大多数用户

### Development（开发版）
- **用途**：开发和调试
- **签名**：开发签名
- **安装**：需要开发环境
- **推荐**：仅用于开发

### Production（生产版）
- **用途**：正式发布
- **签名**：需要签名密钥
- **安装**：可直接安装
- **推荐**：用于发布到应用商店

---

## 构建命令速查

```bash
# 查看所有构建
eas build:list

# 构建Android APK（预览版）
eas build --platform android --profile preview

# 构建Android APK（生产版）
eas build --platform android --profile production

# 构建iOS IPA
eas build --platform ios

# 同时构建Android和iOS
eas build --platform all

# 取消正在进行的构建
eas build:cancel [build-id]
```

---

## 费用说明

### EAS Build 免费额度

- **每月构建次数**：有限的免费构建次数
- **构建时间**：免费构建可能较慢
- **存储**：构建文件保留一定时间后自动删除

### 付费计划

如果需要更多构建次数或更快的构建速度，可以升级到付费计划：
- 访问 https://expo.dev/pricing 查看详细价格

**对于学生作业**：免费额度通常足够使用。

---

## 推荐方案

**对于大学生作业**，推荐使用：

1. **EAS Build Preview模式**
   - 最简单快捷
   - 不需要Android开发环境
   - 生成的APK可以直接安装
   - 适合提交作业

2. **步骤**：
   ```bash
   # 1. 安装EAS CLI
   npm install -g eas-cli
   
   # 2. 登录
   eas login
   
   # 3. 配置
   eas build:configure
   
   # 4. 构建APK
   eas build --platform android --profile preview
   
   # 5. 等待构建完成并下载
   ```

---

**文档版本**：v1.0  
**最后更新**：2024年
