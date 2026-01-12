const { withProjectBuildGradle, withAppBuildGradle } = require('expo/config-plugins');

/**
 * 添加阿里云镜像源到 repositories 块
 */
function addAliyunMirrors(buildGradle, repositoriesPattern) {
  if (!buildGradle.includes('maven.aliyun.com')) {
    // 在 repositories 块的开头添加阿里云镜像
    buildGradle = buildGradle.replace(
      repositoriesPattern,
      `$1
        // 阿里云镜像源（加速依赖下载）
        maven { url 'https://maven.aliyun.com/repository/public/' }
        maven { url 'https://maven.aliyun.com/repository/google/' }
        maven { url 'https://maven.aliyun.com/repository/gradle-plugin/' }
        maven { url 'https://maven.aliyun.com/repository/central/' }
        maven { url 'https://maven.aliyun.com/repository/jcenter/' }
        // 回退到官方源
        `
    );
  }
  return buildGradle;
}

/**
 * Expo Config Plugin 用于配置 Gradle 使用阿里云镜像源
 * 这会修改项目级别和 app 级别的 build.gradle 文件
 */
const withGradleMirror = (config) => {
  // 修改项目级别的 build.gradle
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      let buildGradle = config.modResults.contents;

      // 修改 buildscript repositories
      const buildscriptReposPattern = /(buildscript\s*\{[\s\S]*?repositories\s*\{)/;
      if (buildscriptReposPattern.test(buildGradle)) {
        buildGradle = addAliyunMirrors(buildGradle, buildscriptReposPattern);
      }

      // 修改 allprojects repositories
      const allprojectsReposPattern = /(allprojects\s*\{[\s\S]*?repositories\s*\{)/;
      if (allprojectsReposPattern.test(buildGradle)) {
        buildGradle = addAliyunMirrors(buildGradle, allprojectsReposPattern);
      }

      config.modResults.contents = buildGradle;
    }
    return config;
  });

  // 修改 app 级别的 build.gradle
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      let buildGradle = config.modResults.contents;

      // 修改 repositories 块
      const reposPattern = /(repositories\s*\{)/;
      if (reposPattern.test(buildGradle)) {
        buildGradle = addAliyunMirrors(buildGradle, reposPattern);
      } else {
        // 如果没有 repositories 块，在 android 块中添加
        const androidPattern = /(android\s*\{)/;
        if (androidPattern.test(buildGradle)) {
          buildGradle = buildGradle.replace(
            androidPattern,
            `$1
    repositories {
        // 阿里云镜像源（加速依赖下载）
        maven { url 'https://maven.aliyun.com/repository/public/' }
        maven { url 'https://maven.aliyun.com/repository/google/' }
        maven { url 'https://maven.aliyun.com/repository/central/' }
        maven { url 'https://maven.aliyun.com/repository/jcenter/' }
        google()
        mavenCentral()
    }
`
          );
        }
      }

      config.modResults.contents = buildGradle;
    }
    return config;
  });

  return config;
};

module.exports = withGradleMirror;
