/**
 * 笔记服务 - 处理笔记的CRUD操作和本地存储
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@noteease:notes';
const CATEGORIES = ['学习', '生活', '工作', '灵感', '其他'];

/**
 * 获取所有笔记
 */
export const getAllNotes = async () => {
  try {
    const notesJson = await AsyncStorage.getItem(NOTES_KEY);
    if (notesJson) {
      const notes = JSON.parse(notesJson);
      // 按创建时间倒序排列
      return notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return [];
  } catch (error) {
    console.error('获取笔记失败:', error);
    return [];
  }
};

/**
 * 保存笔记
 */
export const saveNote = async (note) => {
  try {
    const notes = await getAllNotes();
    const newNote = {
      id: note.id || Date.now().toString(),
      title: note.title || '无标题',
      content: note.content || '',
      category: note.category || '其他',
      tags: note.tags || [],
      createdAt: note.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const existingIndex = notes.findIndex(n => n.id === newNote.id);
    if (existingIndex >= 0) {
      notes[existingIndex] = newNote;
    } else {
      notes.push(newNote);
    }
    
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return newNote;
  } catch (error) {
    console.error('保存笔记失败:', error);
    throw error;
  }
};

/**
 * 删除笔记
 */
export const deleteNote = async (noteId) => {
  try {
    const notes = await getAllNotes();
    const filteredNotes = notes.filter(n => n.id !== noteId);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filteredNotes));
    return true;
  } catch (error) {
    console.error('删除笔记失败:', error);
    throw error;
  }
};

/**
 * 根据ID获取笔记
 */
export const getNoteById = async (noteId) => {
  try {
    const notes = await getAllNotes();
    return notes.find(n => n.id === noteId) || null;
  } catch (error) {
    console.error('获取笔记失败:', error);
    return null;
  }
};

/**
 * 搜索笔记
 */
export const searchNotes = async (query) => {
  try {
    const notes = await getAllNotes();
    const lowerQuery = query.toLowerCase();
    return notes.filter(note => {
      try {
        // 安全检查：确保所有字段存在
        const titleMatch = note.title && note.title.toLowerCase().includes(lowerQuery);
        const contentMatch = note.content && note.content.toLowerCase().includes(lowerQuery);
        const tagsMatch = note.tags && Array.isArray(note.tags) && 
          note.tags.some(tag => tag && tag.toLowerCase().includes(lowerQuery));
        const categoryMatch = note.category && note.category.toLowerCase().includes(lowerQuery);
        
        return titleMatch || contentMatch || tagsMatch || categoryMatch;
      } catch (err) {
        console.error('搜索单个笔记时出错:', err, note);
        return false;
      }
    });
  } catch (error) {
    console.error('搜索笔记失败:', error);
    return [];
  }
};

/**
 * 根据分类获取笔记
 */
export const getNotesByCategory = async (category) => {
  try {
    const notes = await getAllNotes();
    return notes.filter(note => note.category === category);
  } catch (error) {
    console.error('获取分类笔记失败:', error);
    return [];
  }
};

/**
 * 获取所有分类
 */
export const getCategories = () => {
  return CATEGORIES;
};
