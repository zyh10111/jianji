@echo off
chcp 65001 >nul
REM 简记（NoteEase）APK构建脚本（Windows版本）
REM 使用方法：双击运行或在命令行中执行

echo ==========================================
echo   简记（NoteEase）APK构建脚本
echo ==========================================
echo.

REM 检查是否安装了EAS CLI
where eas >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到EAS CLI
    echo 正在安装EAS CLI...
    call npm install -g eas-cli
    if %errorlevel% neq 0 (
        echo ❌ 安装失败，请手动运行: npm install -g eas-cli
        pause
        exit /b 1
    )
    echo ✅ EAS CLI安装成功
) else (
    echo ✅ EAS CLI已安装
)

echo.

REM 检查是否已登录
echo 检查登录状态...
eas whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  未登录，请先登录Expo账户
    echo 如果没有账户，请访问 https://expo.dev/ 注册
    call eas login
    if %errorlevel% neq 0 (
        echo ❌ 登录失败
        pause
        exit /b 1
    )
) else (
    echo ✅ 已登录
)

echo.

REM 检查eas.json是否存在
if not exist "eas.json" (
    echo ⚠️  未检测到eas.json配置文件
    echo 正在配置项目...
    call eas build:configure
    if %errorlevel% neq 0 (
        echo ❌ 配置失败
        pause
        exit /b 1
    )
    echo ✅ 配置完成
) else (
    echo ✅ 已找到eas.json配置文件
)

echo.

REM 选择构建类型
echo 请选择构建类型：
echo 1) Preview（预览版，推荐，可直接安装）
echo 2) Production（生产版，需要签名）
echo 3) Development（开发版）
set /p choice="请输入选项 (1-3，默认为1): "

if "%choice%"=="2" (
    set profile=production
    echo 您选择了：Production（生产版）
) else if "%choice%"=="3" (
    set profile=development
    echo 您选择了：Development（开发版）
) else (
    set profile=preview
    echo 您选择了：Preview（预览版）
)

echo.

REM 开始构建
echo ==========================================
echo 开始构建APK...
echo 构建类型：%profile%
echo 这可能需要 10-20 分钟，请耐心等待...
echo ==========================================
echo.

call eas build --platform android --profile %profile%

if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo ✅ 构建成功！
    echo 请按照提示下载APK文件
    echo 或者访问 https://expo.dev/ 查看构建列表
    echo ==========================================
) else (
    echo.
    echo ==========================================
    echo ❌ 构建失败
    echo 请检查错误信息并重试
    echo ==========================================
    pause
    exit /b 1
)

pause
