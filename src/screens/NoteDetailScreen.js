import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getNoteById, deleteNote } from '../services/noteService';
import { shareNote } from '../utils/exportService';

const NoteDetailScreen = ({ navigation, route }) => {
  const { noteId } = route.params;
  const [note, setNote] = useState(null);

  useEffect(() => {
    loadNote();
    
    // 设置导航栏按钮
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleEdit}
          >
            <Text style={styles.headerButtonText}>编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleShare}
          >
            <Text style={styles.headerButtonText}>分享</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={[styles.headerButtonText, styles.deleteButtonText]}>删除</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, noteId]);

  const loadNote = async () => {
    try {
      const noteData = await getNoteById(noteId);
      setNote(noteData);
    } catch (error) {
      Alert.alert('错误', '加载笔记失败');
      navigation.goBack();
    }
  };

  const handleEdit = () => {
    navigation.navigate('CreateNote', { noteId });
  };

  const handleShare = async () => {
    try {
      await shareNote(note);
      Alert.alert('成功', '笔记已分享');
    } catch (error) {
      Alert.alert('错误', '分享失败');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '确认删除',
      `确定要删除笔记"${note?.title}"吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
              Alert.alert('成功', '笔记已删除', [
                { text: '确定', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert('错误', '删除失败');
            }
          },
        },
      ]
    );
  };

  if (!note) {
    return (
      <View style={styles.centerContainer}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const createdDate = new Date(note.createdAt);
  const updatedDate = new Date(note.updatedAt);
  const formattedCreatedDate = createdDate.toLocaleString('zh-CN');
  const formattedUpdatedDate = updatedDate.toLocaleString('zh-CN');

  // 获取分类颜色
  const getCategoryColor = (category) => {
    const colors = {
      学习: '#4CAF50',
      生活: '#FF9800',
      工作: '#2196F3',
      灵感: '#9C27B0',
      其他: '#9E9E9E',
    };
    return colors[category] || colors.其他;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={styles.title}>{note.title}</Text>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(note.category) },
            ]}
          >
            <Text style={styles.categoryText}>{note.category}</Text>
          </View>
        </View>

        {/* 标签 */}
        {note.tags && note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {note.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 内容 */}
        <View style={styles.contentSection}>
          <Text style={styles.contentText}>{note.content || '（无内容）'}</Text>
        </View>

        {/* 时间信息 */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>创建时间：</Text>
            {formattedCreatedDate}
          </Text>
          {formattedCreatedDate !== formattedUpdatedDate && (
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>更新时间：</Text>
              {formattedUpdatedDate}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#2196F3',
    fontSize: 14,
  },
  contentSection: {
    marginBottom: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  infoSection: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 10,
  },
  headerButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 5,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  deleteButton: {
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#FF6B6B',
  },
});

export default NoteDetailScreen;
