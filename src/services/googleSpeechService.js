/**
 * Google Cloud Speech-to-Text服务
 * 
 * 使用说明：
 * 1. 访问 https://cloud.google.com/speech-to-text 注册账号
 * 2. 创建项目并启用Speech-to-Text API
 * 3. 创建API密钥或服务账号
 * 4. 在 src/config/apiConfig.js 中配置
 * 
 * API文档：https://cloud.google.com/speech-to-text/docs
 */

import { GOOGLE_API_CONFIG } from '../config/apiConfig';
import { audioToBase64 } from '../utils/audioUtils';

/**
 * Google语音识别
 * @param {string} audioUri - 音频文件URI
 * @param {object} options - 识别选项
 * @param {string} options.languageCode - 语言代码（zh-CN、en-US等）
 * @param {number} options.sampleRateHertz - 采样率
 * @returns {Promise<object>} 识别结果 {text: string, confidence: number}
 */
export const googleSpeechToText = async (audioUri, options = {}) => {
  try {
    // 检查配置
    if (GOOGLE_API_CONFIG.API_KEY === 'YOUR_GOOGLE_API_KEY') {
      throw new Error('请先在 src/config/apiConfig.js 中配置Google API Key');
    }

    // 将音频转换为Base64
    const audioBase64 = await audioToBase64(audioUri);

    // 默认配置
    const defaultOptions = {
      languageCode: 'zh-CN',     // 语言代码
      sampleRateHertz: 16000,    // 采样率
      encoding: 'LINEAR16',      // 编码格式
      ...options,
    };

    // 构建请求
    const requestBody = {
      config: {
        encoding: defaultOptions.encoding,
        sampleRateHertz: defaultOptions.sampleRateHertz,
        languageCode: defaultOptions.languageCode,
      },
      audio: {
        content: audioBase64,
      },
    };

    // 发送请求
    const url = `${GOOGLE_API_CONFIG.BASE_URL}?key=${GOOGLE_API_CONFIG.API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    // 处理错误
    if (result.error) {
      throw new Error(`Google识别失败: ${result.error.message}`);
    }

    // 返回识别结果
    if (result.results && result.results.length > 0) {
      const firstResult = result.results[0];
      if (firstResult.alternatives && firstResult.alternatives.length > 0) {
        const alternative = firstResult.alternatives[0];
        return {
          text: alternative.transcript,
          confidence: alternative.confidence || 0.9,
        };
      }
    }

    throw new Error('识别结果为空');
  } catch (error) {
    console.error('Google语音识别失败:', error);
    throw error;
  }
};
