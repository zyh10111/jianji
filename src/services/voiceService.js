/**
 * 语音服务 - 处理语音转文字功能
 * 
 * 支持多种语音识别API：
 * - 百度语音识别API（推荐，国内使用）
 * - 模拟实现（用于演示）
 */

import { CURRENT_API_PROVIDER, ENABLE_VOICE_RECOGNITION } from '../config/apiConfig';
import { baiduSpeechToText } from './baiduSpeechService';

/**
 * 语音转文字主函数
 * 根据配置选择使用真实API或模拟实现
 * @param {string} audioUri - 音频文件URI
 * @param {object} options - 识别选项
 * @returns {Promise<object>} 识别结果 {text: string, confidence: number}
 */
export const speechToText = async (audioUri, options = {}) => {
  // 如果未启用语音识别，使用模拟实现
  if (!ENABLE_VOICE_RECOGNITION) {
    console.log('语音识别未启用，使用模拟实现');
    return await mockSpeechToText(audioUri);
  }

  // 根据配置选择API提供商
  switch (CURRENT_API_PROVIDER) {
    case 'baidu':
      try {
        console.log('使用百度语音识别API...');
        const result = await baiduSpeechToText(audioUri, options);
        console.log('语音识别成功:', result.text);
        return result;
      } catch (apiError) {
        console.error('百度语音识别API调用失败:', apiError.message);
        
        // 配置错误：提示用户配置
        if (apiError.message.includes('配置') || 
            apiError.message.includes('API Key') ||
            apiError.message.includes('Token失败')) {
          throw new Error(`API配置错误: ${apiError.message}\n\n请检查 src/config/apiConfig.js 中的 API Key 和 Secret Key 是否正确。`);
        }
        
        // 其他错误：重新抛出，让调用者处理
        throw apiError;
      }
    
    default:
      console.warn(`未知的API提供商: ${CURRENT_API_PROVIDER}，使用模拟实现`);
      return await mockSpeechToText(audioUri);
  }
};

/**
 * 模拟语音转文字（用于演示和测试）
 * @param {string} audioUri - 音频文件URI（未使用）
 * @returns {Promise<object>} 识别结果
 */
const mockSpeechToText = async (audioUri) => {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟返回结果
  const mockTexts = [
    '今天学习了React Native开发，感觉很有意思。',
    '记得明天要交作业，还有项目报告要完成。',
    '想到一个新的App创意，可以做一个智能待办事项应用。',
    '今天天气很好，适合出去散步。',
    '下午3点有会议，记得准时参加。'
  ];
  
  const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
  return {
    text: randomText,
    confidence: 0.95
  };
};

/**
 * 使用Web Speech API进行语音识别（浏览器环境）
 * 在React Native中，需要使用原生模块或第三方库
 */
export const startRecognition = (onResult, onError) => {
  if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN';
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      onResult(finalTranscript || interimTranscript, !finalTranscript);
    };
    
    recognition.onerror = (event) => {
      onError(event.error);
    };
    
    recognition.start();
    return recognition;
  } else {
    onError('浏览器不支持语音识别');
    return null;
  }
};

/**
 * 智能分类笔记内容
 * 根据关键词自动判断分类
 */
export const classifyContent = (content) => {
  const lowerContent = content.toLowerCase();
  
  // 学习相关关键词
  if (/\b(学习|作业|考试|课程|笔记|复习|预习)\b/.test(lowerContent)) {
    return '学习';
  }
  
  // 工作相关关键词
  if (/\b(工作|会议|项目|任务|报告|客户|同事)\b/.test(lowerContent)) {
    return '工作';
  }
  
  // 生活相关关键词
  if (/\b(生活|购物|吃饭|休息|运动|健康|家人|朋友)\b/.test(lowerContent)) {
    return '生活';
  }
  
  // 灵感相关关键词
  if (/\b(创意|想法|灵感|设计|创新|项目|app|应用)\b/.test(lowerContent)) {
    return '灵感';
  }
  
  return '其他';
};

/**
 * 提取标签（基于关键词）
 */
export const extractTags = (content) => {
  // 简单的标签提取逻辑
  // 实际应用中可以使用NLP技术提取关键词
  const commonTags = ['重要', '紧急', '待办', '想法', '提醒'];
  const tags = [];
  
  commonTags.forEach(tag => {
    if (content.includes(tag)) {
      tags.push(tag);
    }
  });
  
  return tags;
};
