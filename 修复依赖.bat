@echo off
chcp 65001 >nul
REM 修复依赖脚本（Windows版本）
REM 使用方法：双击运行或在命令行中执行

echo ==========================================
echo   修复依赖脚本
echo ==========================================
echo.

echo 1. 删除 node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✅ node_modules 已删除
) else (
    echo ℹ️  node_modules 不存在
)

echo.
echo 2. 删除 package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo ✅ package-lock.json 已删除
) else (
    echo ℹ️  package-lock.json 不存在
)

echo.
echo 3. 清除 npm 缓存...
call npm cache clean --force
if %errorlevel% equ 0 (
    echo ✅ npm 缓存已清除
) else (
    echo ⚠️  清除缓存失败（可能不是致命错误）
)

echo.
echo 4. 重新安装依赖...
echo 这可能需要几分钟，请耐心等待...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 安装失败
    pause
    exit /b 1
)
echo ✅ 依赖安装完成

echo.
echo 5. 修复 Expo 依赖版本...
call npx expo install --fix
if %errorlevel% neq 0 (
    echo ⚠️  修复依赖版本失败（可能不是致命错误）
) else (
    echo ✅ Expo 依赖版本已修复
)

echo.
echo ==========================================
echo ✅ 修复完成！
echo.
echo 请运行以下命令验证：
echo   npx expo config
echo.
echo 如果显示 JSON 配置且没有错误，说明修复成功
echo ==========================================
echo.

pause
