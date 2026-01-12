# Web 平台运行说明

本文档说明如何在 Web 浏览器中运行项目。

---

## ✅ 是否需要安装额外依赖？

### 简短回答

**需要安装 Web 依赖！**

虽然 Expo SDK 50 支持 Web 平台，但 Web 相关的依赖（`react-native-web`、`react-dom`、`@expo/metro-runtime`）需要手动安装。

### 安装命令

在运行 Web 版本之前，请先运行：

```bash
npx expo install react-native-web react-dom @expo/metro-runtime
```

### 详细说明

1. **基础依赖已安装**
   - 运行 `npm install` 时，已经安装了所有基础依赖
   - 这些依赖包括 Expo、React Native 等

2. **Web 依赖需要手动安装**
   - Web 依赖不会自动安装
   - 需要运行上述命令手动安装：
     - `react-native-web`：React Native 的 Web 实现
     - `react-dom`：React 的 DOM 渲染器
     - `@expo/metro-runtime`：Expo Metro 运行时

3. **只需安装一次**
   - 安装后，后续运行 `npm run web` 就不需要再次安装

---

## 🚀 运行步骤

### 步骤 1：确保基础依赖已安装

```bash
npm install
```

### 步骤 2：安装 Web 依赖（必需）

```bash
npx expo install react-native-web react-dom @expo/metro-runtime
```

**输出示例**：
```
› Installing 3 SDK 50.0.0 compatible native modules using npm
added 12 packages in 7s
```

### 步骤 3：启动 Web 版本

```bash
npm run web
```

或者：

```bash
npx expo start --web
```

### 步骤 4：等待启动

启动后，Expo 会：
1. 启动 Metro Bundler
2. 编译 Web 版本
3. 在浏览器中打开应用（或显示 URL）

**输出示例**：
```
Starting Metro Bundler...
Web is waiting on http://localhost:8081
```

---

## 📋 完整流程

### 首次运行

```bash
# 1. 安装基础依赖（如果还没安装）
npm install

# 2. 安装 Web 依赖（必需）
npx expo install react-native-web react-dom @expo/metro-runtime

# 3. 启动 Web 版本
npm run web

# 4. 浏览器会自动打开 http://localhost:8081
```

### 后续运行

```bash
# 直接运行即可，Web 依赖只需安装一次
npm run web
```

---

## ⚠️ 注意事项

### 1. 某些功能在 Web 上可能不可用

由于 Web 平台的限制，以下功能可能不可用或有限制：

- **语音录制**：需要浏览器支持（Chrome、Edge 等现代浏览器）
- **文件系统访问**：有限制
- **原生模块**：某些原生模块在 Web 上不可用

### 2. 浏览器兼容性

推荐使用现代浏览器：
- Chrome（推荐）
- Edge
- Firefox
- Safari

### 3. 性能差异

Web 版本的性能可能与原生应用不同：
- 启动速度可能较慢
- 某些动画可能不够流畅
- 内存使用可能较高

---

## 🔧 如果遇到问题

### 问题 1：Web 依赖未安装

**错误信息**：
```
CommandError: It looks like you're trying to use web support but don't have the required dependencies installed.
Please install react-native-web@~0.19.6, react-dom@18.2.0, @expo/metro-runtime@~3.1.3
```

**解决方案**：
```bash
# 安装 Web 依赖
npx expo install react-native-web react-dom @expo/metro-runtime

# 然后重新运行
npm run web
```

### 问题 2：Web 依赖版本不匹配

**错误信息**：
```
Version mismatch: react-native-web version doesn't match
```

**解决方案**：
```bash
# 使用 expo install 会自动安装兼容版本
npx expo install react-native-web react-dom @expo/metro-runtime
```

### 问题 2：端口被占用

**错误信息**：
```
Error: listen EADDRINUSE: address already in use :::8081
```

**解决方案**：
```bash
# 使用其他端口
npx expo start --web --port 8082
```

### 问题 3：浏览器无法打开

**解决方案**：
1. 手动访问终端显示的 URL（通常是 `http://localhost:8081`）
2. 或按 `w` 键在浏览器中打开

### 问题 4：样式显示异常

**解决方案**：
```bash
# 清除缓存并重新启动
npm start -- --clear
npm run web
```

---

## 📝 快速测试

### 测试 Web 是否正常工作

1. **运行命令**：
   ```bash
   npm run web
   ```

2. **检查输出**：
   - 应该看到 "Installing web dependencies..."（第一次）
   - 然后看到 "Web is waiting on http://localhost:8081"
   - 浏览器应该自动打开

3. **验证功能**：
   - 应用界面应该正常显示
   - 导航应该正常工作
   - 基本功能应该可用

---

## 🎯 总结

| 问题 | 答案 |
|------|------|
| 需要手动安装 Web 依赖吗？ | ✅ **需要**，运行 `npx expo install react-native-web react-dom @expo/metro-runtime` |
| 需要运行 `npm install react-native-web` 吗？ | ✅ 使用 `npx expo install` 更安全（自动匹配版本） |
| 第一次运行需要做什么？ | ✅ 1. `npm install` 2. `npx expo install react-native-web react-dom @expo/metro-runtime` 3. `npm run web` |
| 后续运行需要重新安装吗？ | ❌ 不需要，Web 依赖只需安装一次 |

---

## 💡 提示

1. **首次运行**：第一次运行前，必须先安装 Web 依赖：
   ```bash
   npx expo install react-native-web react-dom @expo/metro-runtime
   ```

2. **版本匹配**：使用 `npx expo install` 而不是 `npm install`，可以确保安装的版本与 Expo SDK 兼容

3. **开发模式**：Web 版本支持热重载，修改代码后会自动刷新

4. **调试**：可以使用 Chrome DevTools 进行调试：
   - 按 `F12` 打开开发者工具
   - 在 Console 查看日志
   - 在 Sources 设置断点

5. **性能**：如果 Web 版本运行缓慢，可以：
   - 清除浏览器缓存
   - 使用 Chrome 浏览器
   - 关闭不必要的浏览器扩展

---

**文档版本**：v1.0  
**最后更新**：2024年
