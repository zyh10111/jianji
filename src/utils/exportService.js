/**
 * 导出服务 - 处理笔记导出和分享功能
 */
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/**
 * 导出笔记为文本文件
 */
export const exportNoteAsText = async (note) => {
  try {
    const content = `标题: ${note.title}\n\n分类: ${note.category}\n\n标签: ${note.tags.join(', ')}\n\n内容:\n${note.content}\n\n创建时间: ${new Date(note.createdAt).toLocaleString('zh-CN')}\n更新时间: ${new Date(note.updatedAt).toLocaleString('zh-CN')}`;
    
    const filename = `${note.title || 'note'}_${Date.now()}.txt`;
    const fileUri = FileSystem.documentDirectory + filename;
    
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    
    return fileUri;
  } catch (error) {
    console.error('导出失败:', error);
    throw error;
  }
};

/**
 * 分享笔记
 */
export const shareNote = async (note) => {
  try {
    const fileUri = await exportNoteAsText(note);
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: '分享笔记',
      });
    } else {
      throw new Error('分享功能不可用');
    }
    
    return true;
  } catch (error) {
    console.error('分享失败:', error);
    throw error;
  }
};

/**
 * 导出所有笔记
 */
export const exportAllNotes = async (notes) => {
  try {
    let content = `简记 (NoteEase) - 笔记导出\n生成时间: ${new Date().toLocaleString('zh-CN')}\n\n`;
    content += '='.repeat(50) + '\n\n';
    
    notes.forEach((note, index) => {
      content += `笔记 ${index + 1}\n`;
      content += `标题: ${note.title}\n`;
      content += `分类: ${note.category}\n`;
      content += `标签: ${note.tags.join(', ')}\n`;
      content += `创建时间: ${new Date(note.createdAt).toLocaleString('zh-CN')}\n`;
      content += `内容:\n${note.content}\n\n`;
      content += '-'.repeat(50) + '\n\n';
    });
    
    const filename = `noteease_export_${Date.now()}.txt`;
    const fileUri = FileSystem.documentDirectory + filename;
    
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: '导出所有笔记',
      });
    }
    
    return fileUri;
  } catch (error) {
    console.error('导出失败:', error);
    throw error;
  }
};
