# Cursor 中运行项目指南

本指南说明如何在 Cursor IDE 中运行和调试简记（NoteEase）项目。

---

## 📋 前置条件

### 1. 安装 Node.js

- **版本要求**：Node.js >= 14.0.0（推荐 18.x 或更高）
- **下载地址**：https://nodejs.org/
- **验证安装**：
  ```bash
  node --version
  npm --version
  ```

### 2. 安装 Expo CLI（可选）

```bash
npm install -g expo-cli
```

或者使用 npx（不需要全局安装）：
```bash
npx expo --version
```

---

## 🚀 运行步骤

### 步骤 1：打开项目

1. **在 Cursor 中打开项目**
   - File > Open Folder
   - 选择项目目录：`C:\Users\zhangyuhan\Desktop\dazy`

2. **打开终端**
   - 在 Cursor 中按 `` Ctrl + ` ``（反引号）打开集成终端
   - 或使用菜单：Terminal > New Terminal

### 步骤 2：安装依赖

在终端中运行：

```bash
npm install
```

**如果安装失败**，可以尝试：

```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rmdir /s /q node_modules
del package-lock.json

# 重新安装
npm install
```

### 步骤 3：启动开发服务器

```bash
npm start
```

或者：

```bash
npx expo start
```

### 步骤 4：选择运行平台

启动后，终端会显示一个二维码和选项：

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor
```

**选项**：

1. **在手机上运行（推荐）**：
   - 安装 Expo Go App
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - 扫描二维码

2. **在模拟器上运行**：
   - 按 `a` 键：打开 Android 模拟器
   - 按 `i` 键：打开 iOS 模拟器（需要 Mac）

3. **在浏览器中运行**：
   - **先安装 Web 依赖**（必需）：
     ```bash
     npx expo install react-native-web react-dom @expo/metro-runtime
     ```
   - 然后按 `w` 键：在浏览器中打开
   - 或运行：`npm run web`

---

## 🛠️ Cursor 中的调试

### 方法一：使用集成终端

1. **查看日志**
   - 在终端中查看 `console.log` 和 `console.error` 输出
   - 错误信息会以红色显示

2. **重新加载**
   - 在终端中按 `r` 键重新加载应用
   - 或修改代码后自动热重载

### 方法二：使用 Chrome DevTools

1. **启动应用**
   ```bash
   npm start
   ```

2. **打开调试器**
   - 在终端中按 `j` 键
   - 或访问：http://localhost:19002/debugger-ui

3. **查看控制台**
   - 在 Chrome DevTools 的 Console 标签页查看日志
   - 可以设置断点调试

### 方法三：使用 React Native Debugger

1. **下载安装**
   - 下载：https://github.com/jhen0409/react-native-debugger/releases
   - 安装并启动

2. **连接调试器**
   - 运行应用
   - 在设备上摇一摇，选择 "Debug"
   - 或按 `Cmd+D` (Mac) / `Ctrl+M` (Android)

---

## 📝 常用命令

### 启动相关

```bash
# 启动开发服务器
npm start

# 启动并清除缓存
npm start -- --clear

# 启动 Android
npm run android
# 或
npx expo start --android

# 启动 iOS（需要 Mac）
npm run ios
# 或
npx expo start --ios

# 启动 Web
npm run web
# 或
npx expo start --web
```

### 调试相关

```bash
# 查看 Expo 配置
npx expo config

# 检查项目配置
npx expo-doctor

# 修复依赖
npx expo install --fix
```

---

## 🔧 Cursor 配置建议

### 1. 安装推荐扩展

在 Cursor 中安装以下扩展（如果还没有）：

- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **React Native Tools**

### 2. 配置代码格式化

创建 `.prettierrc` 文件（如果还没有）：

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### 3. 配置终端

- 使用 PowerShell 或 Git Bash
- 确保 Node.js 在 PATH 中

---

## 🐛 常见问题

### 问题 1：npm install 失败

**解决方案**：
```bash
# 清除缓存
npm cache clean --force

# 使用国内镜像（如果网络慢）
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

### 问题 2：端口被占用

**错误信息**：
```
Error: listen EADDRINUSE: address already in use :::8081
```

**解决方案**：
```bash
# Windows: 查找占用端口的进程
netstat -ano | findstr :8081

# 杀死进程（替换 PID）
taskkill /PID <PID> /F

# 或使用其他端口
npx expo start --port 8082
```

### 问题 3：无法连接到设备

**解决方案**：
- 确保手机和电脑在同一 WiFi 网络
- 检查防火墙设置
- 尝试使用 USB 连接（Android）

### 问题 4：热重载不工作

**解决方案**：
```bash
# 清除缓存并重启
npm start -- --clear
```

---

## 📱 在手机上运行

### Android

1. **安装 Expo Go**
   - 从 Google Play Store 安装

2. **连接设备**
   - 确保手机和电脑在同一 WiFi
   - 或使用 USB 连接（需要启用 USB 调试）

3. **启动应用**
   ```bash
   npm start
   # 扫描二维码
   ```

### iOS

1. **安装 Expo Go**
   - 从 App Store 安装

2. **连接设备**
   - 确保手机和电脑在同一 WiFi

3. **启动应用**
   ```bash
   npm start
   # 扫描二维码
   ```

---

## 🎯 快速开始

### 一键启动脚本

创建 `启动项目.bat`（Windows）：

```batch
@echo off
chcp 65001 >nul
echo 正在启动项目...
echo.

REM 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查依赖
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
)

REM 启动项目
echo 正在启动开发服务器...
echo.
echo 💡 提示：
echo    - 按 'a' 打开 Android 模拟器
echo    - 按 'i' 打开 iOS 模拟器
echo    - 按 'w' 在浏览器中打开
echo    - 扫描二维码在手机上运行
echo.
call npm start

pause
```

---

## 📚 相关文档

- [安装说明.md](../安装说明.md) - 详细安装指南
- [APK构建指南.md](APK构建指南.md) - 构建 APK 说明
- [问题修复说明.md](问题修复说明.md) - 常见问题修复

---

## 💡 提示

1. **首次运行**：可能需要下载依赖，请耐心等待
2. **网络问题**：如果下载慢，可以使用国内镜像
3. **端口冲突**：如果 8081 端口被占用，可以使用其他端口
4. **热重载**：修改代码后会自动重新加载，无需重启

---

**文档版本**：v1.0  
**最后更新**：2026年
