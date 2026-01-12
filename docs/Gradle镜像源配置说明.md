# Gradle 镜像源配置说明

本文档说明如何为 Expo EAS Build 配置阿里云镜像源以加速 Android Gradle 构建。

---

## 配置说明

项目已配置使用阿里云 Maven 镜像源，这将显著加速 Gradle 依赖下载速度，特别是在中国大陆地区。

### 配置内容

1. **创建了 Config Plugin**：`plugins/withGradleMirror.js`
   - 自动在 Gradle 构建脚本中添加阿里云镜像源
   - 修改项目级别和 app 级别的 `build.gradle` 文件

2. **已添加到 app.json**：
   ```json
   {
     "expo": {
       "plugins": [
         "./plugins/withGradleMirror"
       ]
     }
   }
   ```

3. **依赖说明**：
   - 使用 `expo/config-plugins`（Expo 包自带的子导出）
   - 不需要单独安装 `@expo/config-plugins`

---

## 工作原理

### 配置插件会在以下位置添加阿里云镜像：

1. **项目级别 build.gradle**
   - `buildscript.repositories` 块
   - `allprojects.repositories` 块

2. **App 级别 build.gradle**
   - `repositories` 块（如果存在）
   - 或在 `android` 块中添加

### 使用的镜像源

- **公共仓库**：`https://maven.aliyun.com/repository/public/`
- **Google 仓库**：`https://maven.aliyun.com/repository/google/`
- **Gradle 插件**：`https://maven.aliyun.com/repository/gradle-plugin/`
- **Central 仓库**：`https://maven.aliyun.com/repository/central/`
- **JCenter 仓库**：`https://maven.aliyun.com/repository/jcenter/`

### 回退机制

如果阿里云镜像源不可用，会自动回退到官方源（Google、Maven Central）。

---

## 验证配置

### 方法一：查看预构建文件

运行 `npx expo prebuild` 后，检查生成的 `android/build.gradle` 文件：

```bash
npx expo prebuild --platform android
cat android/build.gradle | grep -A 10 "repositories"
```

应该能看到阿里云镜像源配置。

### 方法二：查看构建日志

在 EAS Build 的构建日志中，应该能看到依赖从阿里云镜像下载：

```
> Task :app:dependencies
Download https://maven.aliyun.com/repository/public/...
```

---

## 加速效果

使用阿里云镜像源后：

- **首次构建**：从 30-60 分钟减少到 10-20 分钟（取决于网络）
- **后续构建**：从 15-30 分钟减少到 5-10 分钟
- **依赖下载速度**：显著提升（特别是中国大陆用户）

---

## 常见问题

### 1. 配置不生效

**问题**：构建仍然很慢，没有使用阿里云镜像

**解决方案**：
1. 确保 `plugins/withGradleMirror.js` 存在
2. 确保 `app.json` 中已添加插件
3. 确保 `@expo/config-plugins` 已安装
4. 重新运行构建

### 2. 构建失败：找不到依赖

**问题**：某些依赖无法从阿里云镜像下载

**解决方案**：
- 插件已配置回退到官方源
- 如果仍有问题，检查依赖名称是否正确
- 某些特殊的依赖可能需要从特定仓库下载

### 3. 需要添加其他镜像源

**修改 `plugins/withGradleMirror.js`**：

```javascript
maven { url 'https://your-mirror-url/' }
```

### 4. 临时禁用镜像源

**方法一**：从 `app.json` 中移除插件

```json
{
  "expo": {
    "plugins": [
      // "./plugins/withGradleMirror"  // 注释掉
    ]
  }
}
```

**方法二**：修改插件代码，注释掉镜像配置

---

## 其他镜像源选项

### 腾讯云镜像

```groovy
maven { url 'https://mirrors.cloud.tencent.com/nexus/repository/maven-public/' }
```

### 华为云镜像

```groovy
maven { url 'https://repo.huaweicloud.com/repository/maven/' }
```

### 网易镜像

```groovy
maven { url 'https://mirrors.163.com/maven/repository/maven-public/' }
```

如果需要使用其他镜像源，可以修改 `plugins/withGradleMirror.js`。

---

## 技术细节

### Expo Config Plugins

配置插件使用 Expo Config Plugins API：
- `withProjectBuildGradle`：修改项目级别的 build.gradle
- `withAppBuildGradle`：修改 app 级别的 build.gradle

### Gradle 仓库优先级

Gradle 会按照 repositories 块中的顺序查找依赖：
1. 先查找阿里云镜像
2. 如果找不到，回退到官方源

这确保了：
- 优先使用快速镜像源
- 如果镜像源不可用，仍能正常工作

---

## 注意事项

1. **首次使用**：首次构建可能需要更长的时间（下载 Gradle 本身和依赖）

2. **网络环境**：如果您的网络可以直接访问 Google/Maven Central，可能不需要镜像源

3. **构建环境**：EAS Build 服务器位于国外，使用镜像源主要对依赖下载有帮助

4. **缓存**：EAS Build 会缓存依赖，后续构建会更快

---

## 相关文档

- [Expo Config Plugins](https://docs.expo.dev/config-plugins/introduction/)
- [Gradle 仓库配置](https://docs.gradle.org/current/userguide/declaring_repositories.html)
- [阿里云 Maven 镜像](https://developer.aliyun.com/mirror/maven)

---

**文档版本**：v1.0  
**最后更新**：2024年
