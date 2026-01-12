/**
 * 音频处理工具函数
 */
import * as FileSystem from 'expo-file-system';

/**
 * 将音频文件转换为Base64编码
 * @param {string} audioUri - 音频文件URI
 * @returns {Promise<string>} Base64编码的音频数据
 */
export const audioToBase64 = async (audioUri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('音频转Base64失败:', error);
    throw error;
  }
};

/**
 * 将音频文件转换为Blob（用于FormData）
 * @param {string} audioUri - 音频文件URI
 * @returns {Promise<Blob>} Blob对象
 */
export const audioToBlob = async (audioUri) => {
  try {
    const response = await fetch(audioUri);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('音频转Blob失败:', error);
    throw error;
  }
};

/**
 * 获取音频文件信息
 * @param {string} audioUri - 音频文件URI
 * @returns {Promise<object>} 音频文件信息
 */
export const getAudioInfo = async (audioUri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    return fileInfo;
  } catch (error) {
    console.error('获取音频信息失败:', error);
    throw error;
  }
};
