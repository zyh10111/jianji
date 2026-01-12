/**
 * 生成应用图标和启动屏幕占位符图片
 * 使用 Node.js 的 Canvas API 或 Sharp 库生成简单的占位符图片
 * 
 * 运行方法：
 * npm install sharp --save-dev
 * node scripts/generate-assets.js
 */

const fs = require('fs');
const path = require('path');

// 检查是否安装了 sharp
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ 请先安装 sharp: npm install sharp --save-dev');
  process.exit(1);
}

const assetsDir = path.join(__dirname, '..', 'assets');

// 确保 assets 目录存在
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 生成图标函数
async function generateIcon(size, outputPath, backgroundColor = '#ffffff', text = 'NE') {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${backgroundColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" 
            font-weight="bold" fill="#333333" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  
  console.log(`✅ 已生成: ${outputPath} (${size}x${size})`);
}

// 生成启动屏幕函数
async function generateSplash(width, height, outputPath, backgroundColor = '#ffffff', text = '简记 NoteEase') {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${width * 0.06}" 
            font-weight="bold" fill="#333333" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  
  console.log(`✅ 已生成: ${outputPath} (${width}x${height})`);
}

// 主函数
async function main() {
  console.log('开始生成应用资源文件...\n');
  
  try {
    // 生成主图标 (1024x1024)
    await generateIcon(1024, path.join(assetsDir, 'icon.png'), '#4A90E2', 'NE');
    
    // 生成 Android 自适应图标 (1024x1024)
    await generateIcon(1024, path.join(assetsDir, 'adaptive-icon.png'), '#ffffff', 'NE');
    
    // 生成启动屏幕 (1242x2436 - iPhone 标准尺寸)
    await generateSplash(1242, 2436, path.join(assetsDir, 'splash.png'), '#ffffff', '简记 NoteEase');
    
    // 生成 favicon (256x256)
    await generateIcon(256, path.join(assetsDir, 'favicon.png'), '#4A90E2', 'NE');
    
    console.log('\n✅ 所有资源文件生成完成！');
    console.log('\n📝 注意：这些是占位符图片。建议之后替换为专业设计的图标和启动屏幕。');
    console.log('   您可以修改此脚本来自定义颜色和文本。\n');
    
  } catch (error) {
    console.error('❌ 生成失败:', error.message);
    process.exit(1);
  }
}

// 运行
main();
