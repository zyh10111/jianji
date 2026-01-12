/**
 * API配置
 * 
 * 使用说明：
 * 百度语音识别API（推荐，国内使用）
 *    - 访问 https://ai.baidu.com/ 注册账号
 *    - 创建语音识别应用，获取API Key和Secret Key
 *    - 将API_KEY和SECRET_KEY填入下方配置
 */

// 百度语音识别API配置（推荐）
export const BAIDU_API_CONFIG = {
  API_KEY: 'JRlJxAC3hZUL9XuAwX2gObXf',        // 替换为你的百度API Key
  SECRET_KEY: 'SaXKB6QzFIfsUUoShcKt0w7EJY2V3GFg',   // 替换为你的百度Secret Key
  BASE_URL: 'https://vop.baidu.com/server_api',
  TOKEN_URL: 'https://aip.baidubce.com/oauth/2.0/token',
};

// 当前使用的API提供商（'baidu'）
export const CURRENT_API_PROVIDER = 'baidu';

// 是否启用语音识别（false时使用模拟实现）
export const ENABLE_VOICE_RECOGNITION = true;
