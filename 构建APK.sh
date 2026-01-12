#!/bin/bash

# 简记（NoteEase）APK构建脚本
# 使用方法：bash 构建APK.sh

echo "=========================================="
echo "  简记（NoteEase）APK构建脚本"
echo "=========================================="
echo ""

# 检查是否安装了EAS CLI
if ! command -v eas &> /dev/null; then
    echo "❌ 未检测到EAS CLI"
    echo "正在安装EAS CLI..."
    npm install -g eas-cli
    if [ $? -ne 0 ]; then
        echo "❌ 安装失败，请手动运行: npm install -g eas-cli"
        exit 1
    fi
    echo "✅ EAS CLI安装成功"
else
    echo "✅ EAS CLI已安装"
fi

echo ""

# 检查是否已登录
echo "检查登录状态..."
if ! eas whoami &> /dev/null; then
    echo "⚠️  未登录，请先登录Expo账户"
    echo "如果没有账户，请访问 https://expo.dev/ 注册"
    eas login
    if [ $? -ne 0 ]; then
        echo "❌ 登录失败"
        exit 1
    fi
else
    echo "✅ 已登录"
fi

echo ""

# 检查eas.json是否存在
if [ ! -f "eas.json" ]; then
    echo "⚠️  未检测到eas.json配置文件"
    echo "正在配置项目..."
    eas build:configure
    if [ $? -ne 0 ]; then
        echo "❌ 配置失败"
        exit 1
    fi
    echo "✅ 配置完成"
else
    echo "✅ 已找到eas.json配置文件"
fi

echo ""

# 选择构建类型
echo "请选择构建类型："
echo "1) Preview（预览版，推荐，可直接安装）"
echo "2) Production（生产版，需要签名）"
echo "3) Development（开发版）"
read -p "请输入选项 (1-3，默认为1): " choice

case $choice in
    2)
        profile="production"
        echo "您选择了：Production（生产版）"
        ;;
    3)
        profile="development"
        echo "您选择了：Development（开发版）"
        ;;
    *)
        profile="preview"
        echo "您选择了：Preview（预览版）"
        ;;
esac

echo ""

# 开始构建
echo "=========================================="
echo "开始构建APK..."
echo "构建类型：$profile"
echo "这可能需要 10-20 分钟，请耐心等待..."
echo "=========================================="
echo ""

eas build --platform android --profile $profile

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ 构建成功！"
    echo "请按照提示下载APK文件"
    echo "或者访问 https://expo.dev/ 查看构建列表"
    echo "=========================================="
else
    echo ""
    echo "=========================================="
    echo "❌ 构建失败"
    echo "请检查错误信息并重试"
    echo "=========================================="
    exit 1
fi
