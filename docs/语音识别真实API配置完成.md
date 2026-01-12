# 语音识别真实 API 配置完成

本文档说明已完成的语音识别真实 API 配置和优化。

---

## ✅ 已完成的配置

### 1. API 配置

在 `src/config/apiConfig.js` 中已配置：

```javascript
export const BAIDU_API_CONFIG = {
  API_KEY: 'JRlJxAC3hZUL9XuAwX2gObXf',
  SECRET_KEY: 'SaXKB6QzFIfsUUoShcKt0w7EJY2V3GFg',
  BASE_URL: 'https://vop.baidu.com/server_api',
  TOKEN_URL: 'https://aip.baidubce.com/oauth/2.0/token',
};

export const CURRENT_API_PROVIDER = 'baidu';
export const ENABLE_VOICE_RECOGNITION = true;
```

### 2. 代码优化

#### ✅ 改进错误处理 (`src/services/voiceService.js`)

- **不再总是回退到模拟数据**
- **配置错误时明确提示用户**
- **网络错误时给出明确提示**
- **添加了详细的日志输出**

**主要改进**：
```javascript
// 配置错误：提示用户配置
if (apiError.message.includes('配置') || 
    apiError.message.includes('API Key') ||
    apiError.message.includes('Token失败')) {
  throw new Error(`API配置错误: ${apiError.message}\n\n请检查 src/config/apiConfig.js 中的 API Key 和 Secret Key 是否正确。`);
}
```

#### ✅ 优化录音配置 (`src/screens/CreateNoteScreen.js`)

- **匹配百度 API 要求**
- **采样率：16000 Hz（百度推荐）**
- **声道：单声道**
- **格式：WAV**

**录音配置**：
```javascript
const recordingOptions = Audio.RecordingOptionsPresets.HIGH_QUALITY;

if (Platform.OS === 'android') {
  recordingOptions.android = {
    ...recordingOptions.android,
    extension: '.wav',
    sampleRate: 16000,
    numberOfChannels: 1,
  };
} else if (Platform.OS === 'ios') {
  recordingOptions.ios = {
    ...recordingOptions.ios,
    extension: '.wav',
    sampleRate: 16000,
    numberOfChannels: 1,
  };
}
```

#### ✅ 改进用户提示 (`src/screens/CreateNoteScreen.js`)

- **根据错误类型显示不同的提示**
- **配置错误：提示检查配置**
- **网络错误：提示检查网络**
- **音频错误：提示重新录制**
- **移除了总是提示模拟数据的逻辑**

#### ✅ 添加调试日志 (`src/services/baiduSpeechService.js`)

- **记录识别配置**
- **记录音频长度**
- **便于调试问题**

---

## 🎯 功能说明

### 语音识别流程

1. **用户点击"🎤 语音输入"**
2. **开始录音**（使用优化后的配置）
3. **用户停止录音**
4. **音频转换为 Base64**
5. **调用百度语音识别 API**
6. **返回识别结果**
7. **自动添加到笔记内容**
8. **自动分类和提取标签**

### 错误处理

- **配置错误**：明确提示检查 API Key
- **网络错误**：提示检查网络连接
- **音频错误**：提示重新录制
- **API 错误**：显示具体错误信息

---

## 📋 测试清单

### 基础功能测试

- [ ] 点击"🎤 语音输入"按钮
- [ ] 开始录音（应该显示"⏹️ 停止录音"）
- [ ] 停止录音
- [ ] 查看识别结果（应该使用真实 API）

### 错误处理测试

- [ ] **配置错误**：如果 API Key 错误，应该显示配置错误提示
- [ ] **网络错误**：断网时应该显示网络错误提示
- [ ] **音频错误**：如果音频格式不对，应该显示相应提示

### 功能验证

- [ ] 识别结果正确添加到笔记内容
- [ ] 自动分类功能正常
- [ ] 自动提取标签功能正常

---

## 🔧 如果仍然使用模拟数据

### 检查清单

1. **API Key 是否正确**
   - 检查 `src/config/apiConfig.js`
   - 确保 API_KEY 和 SECRET_KEY 已正确配置

2. **网络连接**
   - 确保设备有网络连接
   - 可以访问百度 API 服务器

3. **查看控制台日志**
   - 查看是否有错误信息
   - 查看 "使用百度语音识别API..." 日志
   - 查看识别结果日志

4. **检查 API 配额**
   - 访问百度控制台
   - 检查 API 调用次数和配额

### 调试步骤

1. **打开开发者工具**
   ```bash
   # 运行应用
   npm start
   # 在浏览器中打开开发者工具查看日志
   ```

2. **查看日志输出**
   - 应该看到 "使用百度语音识别API..."
   - 应该看到 "语音识别成功: [识别结果]"
   - 如果有错误，会显示具体错误信息

3. **测试 API 配置**
   - 可以在浏览器中测试 Token 获取
   - 检查 API Key 和 Secret Key 是否正确

---

## 📝 相关文件

### 修改的文件

1. **`src/config/apiConfig.js`**
   - API 配置（已配置）

2. **`src/services/voiceService.js`**
   - 改进错误处理
   - 不再总是回退到模拟数据

3. **`src/services/baiduSpeechService.js`**
   - 添加调试日志
   - 改进配置检查

4. **`src/screens/CreateNoteScreen.js`**
   - 优化录音配置
   - 改进用户提示
   - 改进错误处理

---

## 🚀 下一步

1. **测试语音识别**
   - 运行应用
   - 尝试语音输入
   - 查看是否使用真实 API

2. **如果遇到问题**
   - 查看控制台日志
   - 检查错误提示
   - 参考本文档的调试步骤

3. **提交更改**
   ```bash
   git add src/
   git commit -m "feat: 优化语音识别真实API配置

   - 改进错误处理，不再总是回退到模拟数据
   - 优化录音配置，匹配百度API要求
   - 改进用户提示，根据错误类型显示不同提示
   - 添加调试日志，便于问题排查"
   git push origin main
   ```

---

## ⚠️ 注意事项

1. **API 配额**
   - 百度语音识别有免费额度
   - 超出后需要付费
   - 注意使用量

2. **网络要求**
   - 需要网络连接
   - 离线时无法使用真实 API

3. **音频质量**
   - 在安静环境中录音效果更好
   - 说话清晰可以提高识别准确率

4. **隐私安全**
   - API Key 和 Secret Key 不要提交到公开仓库
   - 可以考虑使用环境变量

---

**配置完成日期**：2024年  
**配置状态**：✅ 已完成
