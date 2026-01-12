/**
 * 百度语音识别服务
 * 
 * 使用说明：
 * 1. 访问 https://ai.baidu.com/ 注册账号
 * 2. 进入控制台，创建语音识别应用
 * 3. 获取API Key和Secret Key
 * 4. 在 src/config/apiConfig.js 中配置
 * 
 * API文档：https://ai.baidu.com/ai-doc/SPEECH/Vk38lxily
 */

import { BAIDU_API_CONFIG } from '../config/apiConfig';
import { audioToBase64 } from '../utils/audioUtils';

// Token缓存
let accessToken = null;
let tokenExpireTime = 0;

/**
 * 获取百度API访问Token
 * @returns {Promise<string>} Access Token
 */
const getAccessToken = async () => {
  // 如果token未过期，直接返回
  if (accessToken && Date.now() < tokenExpireTime) {
    return accessToken;
  }

  try {
    const url = `${BAIDU_API_CONFIG.TOKEN_URL}?grant_type=client_credentials&client_id=${BAIDU_API_CONFIG.API_KEY}&client_secret=${BAIDU_API_CONFIG.SECRET_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`获取Token失败: ${data.error_description || data.error}`);
    }

    accessToken = data.access_token;
    // Token有效期通常为30天，这里设置29天过期
    tokenExpireTime = Date.now() + (data.expires_in - 86400) * 1000;

    return accessToken;
  } catch (error) {
    console.error('获取Token失败:', error);
    throw new Error('获取百度API Token失败，请检查API配置');
  }
};

/**
 * 百度语音识别（支持多种音频格式）
 * @param {string} audioUri - 音频文件URI
 * @param {object} options - 识别选项
 * @param {string} options.format - 音频格式（pcm、wav、amr、m4a等）
 * @param {number} options.rate - 采样率（16000、8000等）
 * @param {string} options.language - 语言（zh-普通话、ct-粤语、en-英文）
 * @returns {Promise<object>} 识别结果 {text: string, confidence: number}
 */
export const baiduSpeechToText = async (audioUri, options = {}) => {
  try {
    // 检查配置
    if (!BAIDU_API_CONFIG.API_KEY || 
        !BAIDU_API_CONFIG.SECRET_KEY ||
        BAIDU_API_CONFIG.API_KEY === 'YOUR_BAIDU_API_KEY' || 
        BAIDU_API_CONFIG.SECRET_KEY === 'YOUR_BAIDU_SECRET_KEY') {
      throw new Error('请先在 src/config/apiConfig.js 中配置百度API Key和Secret Key');
    }

    // 获取Token
    const token = await getAccessToken();

    // 将音频转换为Base64
    const audioBase64 = await audioToBase64(audioUri);
    
    // 验证音频数据
    if (!audioBase64 || audioBase64.length === 0) {
      throw new Error('音频数据为空，请重新录制');
    }
    
    // 检查音频数据长度（百度API要求至少100字节）
    if (audioBase64.length < 100) {
      throw new Error('音频数据太短，请录制更长的语音');
    }

    // 默认配置（匹配 expo-av 录音配置）
    // 注意：百度API推荐使用PCM格式，WAV格式需要确保是原始PCM数据
    // 如果使用WAV，需要确保是16位PCM编码的WAV文件
    const defaultOptions = {
      format: 'pcm',      // 音频格式：pcm（推荐）或wav（需要是PCM编码的WAV）
      rate: 16000,        // 采样率（必须是8000或16000）
      channel: 1,         // 声道数（1-单声道，2-双声道）
      language: 'zh',     // 语言（zh-普通话）
      ...options,
    };
    
    // 验证参数
    const validFormats = ['pcm', 'wav', 'amr', 'm4a'];
    if (!validFormats.includes(defaultOptions.format)) {
      throw new Error(`不支持的音频格式: ${defaultOptions.format}，支持的格式: ${validFormats.join(', ')}`);
    }
    
    const validRates = [8000, 16000];
    if (!validRates.includes(defaultOptions.rate)) {
      throw new Error(`不支持的采样率: ${defaultOptions.rate}，支持的采样率: ${validRates.join(', ')}`);
    }
    
    if (defaultOptions.channel !== 1 && defaultOptions.channel !== 2) {
      throw new Error(`不支持的声道数: ${defaultOptions.channel}，支持的声道数: 1, 2`);
    }
    
    console.log('百度语音识别配置:', {
      format: defaultOptions.format,
      rate: defaultOptions.rate,
      channel: defaultOptions.channel,
      language: defaultOptions.language,
      audioLength: audioBase64.length,
      audioUri: audioUri,
    });

    // 构建请求参数
    // 注意：百度API的len参数应该是Base64解码后的实际字节长度
    // Base64编码：每3个字节编码为4个字符，所以解码后的长度 = Base64长度 * 3 / 4
    // 但根据百度API文档，len应该是speech的字节长度（Base64解码后）
    const actualLength = Math.floor(audioBase64.length * 3 / 4);
    
    const params = {
      format: defaultOptions.format,
      rate: defaultOptions.rate,
      channel: defaultOptions.channel,
      cuid: 'noteease-app',  // 用户唯一标识
      len: actualLength,  // 使用实际音频数据长度（Base64解码后的字节数）
      speech: audioBase64,
      token: token,
    };
    
    console.log('发送请求参数:', {
      format: params.format,
      rate: params.rate,
      channel: params.channel,
      len: params.len,
      tokenLength: params.token ? params.token.length : 0,
      speechLength: params.speech ? params.speech.length : 0,
    });

    // 发送请求
    const response = await fetch(BAIDU_API_CONFIG.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const result = await response.json();

    // 处理错误
    if (result.err_no !== 0) {
      const errorMessages = {
        3300: '输入参数不正确（请检查音频格式、采样率、声道数是否正确）',
        3301: '音频质量过差',
        3302: '鉴权失败（请检查API Key和Secret Key）',
        3303: '语音服务器后端问题',
        3304: '请求GPS信息失败',
        3305: '请求IP信息失败',
        3306: '请求地址信息失败',
        3307: '解码失败（音频格式可能不正确）',
        3308: '语音过长（超过60秒）',
        3309: '语音数据不存在',
        3310: '输入的音频文件不存在',
        3311: '输入的音频格式错误（请确保是WAV格式，且采样率为16000Hz，单声道）',
        3312: '输入的采样率错误（必须是8000或16000）',
        3313: '输入的声道数错误（必须是1或2）',
        5000: '未知错误',
      };

      const errorMsg = errorMessages[result.err_no] || `识别失败: ${result.err_msg || result.err_no}`;
      
      // 对于3300错误，提供更详细的调试信息
      if (result.err_no === 3300) {
        console.error('参数错误详情:', {
          format: defaultOptions.format,
          rate: defaultOptions.rate,
          channel: defaultOptions.channel,
          audioLength: audioBase64.length,
          audioUri: audioUri,
        });
      }
      
      throw new Error(errorMsg);
    }

    // 返回识别结果
    if (result.result && result.result.length > 0) {
      const text = result.result[0];
      return {
        text: text,
        confidence: result.result[0].length > 0 ? 0.9 : 0.5, // 百度API不返回confidence，使用估算值
      };
    }

    throw new Error('识别结果为空');
  } catch (error) {
    console.error('百度语音识别失败:', error);
    throw error;
  }
};
