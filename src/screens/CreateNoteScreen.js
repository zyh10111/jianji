import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { saveNote, getNoteById, getCategories } from '../services/noteService';
import { classifyContent, extractTags, speechToText } from '../services/voiceService';

const CreateNoteScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('其他');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const categories = getCategories();
  const noteId = route.params?.noteId;

  // 如果是编辑模式，加载笔记数据
  useEffect(() => {
    if (noteId) {
      loadNote();
    }
  }, [noteId]);

  // 加载笔记数据
  const loadNote = async () => {
    try {
      const note = await getNoteById(noteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category);
        setTags(note.tags || []);
      }
    } catch (error) {
      Alert.alert('错误', '加载笔记失败');
    }
  };

  // 开始录音
  const startRecording = async () => {
    try {
      // 请求录音权限
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 配置录音选项，匹配百度API要求
      // 使用 HIGH_QUALITY 预设作为基础，然后根据平台调整
      const baseOptions = Audio.RecordingOptionsPresets.HIGH_QUALITY;
      
      // 针对 Android 和 iOS 平台优化配置
      const recordingOptions = {
        ...baseOptions,
        android: {
          ...baseOptions.android,
          extension: '.wav',
          sampleRate: 16000,  // 百度API推荐采样率
          numberOfChannels: 1, // 单声道
        },
        ios: {
          ...baseOptions.ios,
          extension: '.wav',
          sampleRate: 16000,  // 百度API推荐采样率
          numberOfChannels: 1, // 单声道
        },
      };

      const { recording } = await Audio.Recording.createAsync(
        recordingOptions
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      Alert.alert('错误', '无法开始录音：' + error.message);
    }
  };

  // 停止录音并转换
  const stopRecording = async () => {
    try {
      if (!recording) return;

      setIsRecording(false);
      setIsProcessing(true);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      // 语音转文字
      try {
        const result = await speechToText(uri);
        if (result && result.text) {
          // 添加到内容
          setContent(prev => prev ? prev + '\n' + result.text : result.text);
          
          // 自动分类
          const autoCategory = classifyContent(result.text);
          if (category === '其他') {
            setCategory(autoCategory);
          }
          
          // 自动提取标签
          const extractedTags = extractTags(result.text);
          if (extractedTags.length > 0) {
            setTags(prev => {
              const newTags = [...prev];
              extractedTags.forEach(tag => {
                if (!newTags.includes(tag)) {
                  newTags.push(tag);
                }
              });
              return newTags;
            });
          }
          
          // 成功提示（可选）
          console.log('语音识别成功，已添加到笔记内容');
        } else {
          Alert.alert('提示', '语音识别未返回结果，请重试');
        }
      } catch (error) {
        console.error('语音识别错误:', error);
        
        // 根据错误类型显示不同的提示
        let errorMessage = '语音识别失败';
        if (error.message) {
          if (error.message.includes('配置') || error.message.includes('API Key')) {
            errorMessage = `API配置错误\n\n${error.message}\n\n请检查 src/config/apiConfig.js 中的配置。`;
          } else if (error.message.includes('网络') || error.message.includes('连接')) {
            errorMessage = `网络连接失败\n\n${error.message}\n\n请检查网络连接后重试。`;
          } else if (error.message.includes('音频') || error.message.includes('格式')) {
            errorMessage = `音频处理失败\n\n${error.message}\n\n请重新录制。`;
          } else {
            errorMessage = `${error.message}\n\n如果问题持续，请检查API配置和网络连接。`;
          }
        }
        
        Alert.alert('语音识别失败', errorMessage);
      }
    } catch (error) {
      Alert.alert('错误', '录音失败：' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 添加标签
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  // 删除标签
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 保存笔记
  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('提示', '请输入标题或内容');
      return;
    }

    try {
      await saveNote({
        id: noteId,
        title: title.trim() || '无标题',
        content: content.trim(),
        category,
        tags,
      });
      Alert.alert('成功', '笔记已保存', [
        { text: '确定', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('错误', '保存失败');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* 标题输入 */}
        <View style={styles.section}>
          <Text style={styles.label}>标题</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="输入笔记标题（可选）"
            placeholderTextColor="#999"
          />
        </View>

        {/* 分类选择 */}
        <View style={styles.section}>
          <Text style={styles.label}>分类</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 内容输入 */}
        <View style={styles.section}>
          <View style={styles.contentHeader}>
            <Text style={styles.label}>内容</Text>
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
                isProcessing && styles.recordButtonDisabled,
              ]}
              onPress={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.recordButtonText}>
                  {isRecording ? '⏹️ 停止录音' : '🎤 语音输入'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="输入笔记内容或使用语音输入..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* 标签输入 */}
        <View style={styles.section}>
          <Text style={styles.label}>标签</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="输入标签后按添加"
              placeholderTextColor="#999"
              onSubmitEditing={addTag}
            />
            <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
              <Text style={styles.addTagButtonText}>添加</Text>
            </TouchableOpacity>
          </View>
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() => removeTag(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                  <Text style={styles.tagRemove}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* 保存按钮 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存笔记</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  titleInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  recordButtonActive: {
    backgroundColor: '#F44336',
  },
  recordButtonDisabled: {
    backgroundColor: '#999',
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contentInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333',
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
  },
  addTagButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addTagButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#2196F3',
    fontSize: 14,
    marginRight: 6,
  },
  tagRemove: {
    color: '#2196F3',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateNoteScreen;
