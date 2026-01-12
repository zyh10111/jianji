import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { searchNotes, getCategories } from '../services/noteService';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const categories = getCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 搜索笔记
  const handleSearch = async (searchQuery) => {
    try {
      setQuery(searchQuery);
      if (!searchQuery || !searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await searchNotes(searchQuery);
        
        // 确保返回的是数组
        if (!Array.isArray(searchResults)) {
          console.error('搜索结果不是数组:', searchResults);
          setResults([]);
          return;
        }
        
        // 如果选择了分类，进一步过滤
        let filteredResults = searchResults;
        if (selectedCategory) {
          filteredResults = searchResults.filter(note => {
            try {
              return note && note.category === selectedCategory;
            } catch (err) {
              console.error('过滤笔记失败:', err, note);
              return false;
            }
          });
        }
        
        setResults(filteredResults || []);
      } catch (error) {
        console.error('搜索失败:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('处理搜索输入失败:', error);
      setLoading(false);
    }
  };

  // 按分类筛选
  const handleCategoryFilter = async (category) => {
    try {
      const newCategory = selectedCategory === category ? null : category;
      setSelectedCategory(newCategory);

      if (!query || !query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await searchNotes(query);
        
        // 确保返回的是数组
        if (!Array.isArray(searchResults)) {
          console.error('搜索结果不是数组:', searchResults);
          setResults([]);
          return;
        }
        
        let filteredResults = searchResults;
        if (newCategory) {
          filteredResults = searchResults.filter(note => {
            try {
              return note && note.category === newCategory;
            } catch (err) {
              console.error('过滤笔记失败:', err, note);
              return false;
            }
          });
        }
        
        setResults(filteredResults || []);
      } catch (error) {
        console.error('搜索失败:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('处理分类筛选失败:', error);
      setLoading(false);
    }
  };

  // 渲染搜索结果项
  const renderResultItem = ({ item }) => {
    try {
      // 安全地格式化日期
      let formattedDate = '';
      try {
        if (item.updatedAt) {
          const date = new Date(item.updatedAt);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleDateString('zh-CN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
          }
        }
      } catch (dateError) {
        console.error('日期格式化失败:', dateError);
        formattedDate = '未知日期';
      }

      // 高亮匹配的文本（安全实现）
      const highlightText = (text, query) => {
        if (!text || typeof text !== 'string') return text || '';
        if (!query || !query.trim()) return text;
        
        try {
          // 转义特殊字符，避免正则表达式错误
          const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
          return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
              <Text key={index} style={styles.highlight}>
                {part}
              </Text>
            ) : (
              part
            )
          );
        } catch (regexError) {
          console.error('高亮文本失败:', regexError);
          return text;
        }
      };

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

      // 安全获取字段值
      const safeTitle = item.title || '无标题';
      const safeContent = item.content || '';
      const safeCategory = item.category || '其他';
      const safeTags = Array.isArray(item.tags) ? item.tags : [];

      return (
        <TouchableOpacity
          style={styles.resultItem}
          onPress={() => {
            try {
              if (item.id) {
                navigation.navigate('NoteDetail', { noteId: item.id });
              } else {
                console.error('笔记ID不存在:', item);
              }
            } catch (navError) {
              console.error('导航失败:', navError);
            }
          }}
        >
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle} numberOfLines={1}>
              {highlightText(safeTitle, query)}
            </Text>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(safeCategory) },
              ]}
            >
              <Text style={styles.categoryText}>{safeCategory}</Text>
            </View>
          </View>
          <Text style={styles.resultContent} numberOfLines={2}>
            {highlightText(safeContent, query)}
          </Text>
          <View style={styles.resultFooter}>
            <Text style={styles.resultDate}>{formattedDate || '未知日期'}</Text>
            {safeTags.length > 0 && (
              <View style={styles.tagsContainer}>
                {safeTags.slice(0, 3).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag || ''}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    } catch (error) {
      console.error('渲染搜索结果项失败:', error, item);
      // 返回一个安全的占位符
      return (
        <View style={styles.resultItem}>
          <Text style={styles.resultTitle}>加载错误</Text>
          <Text style={styles.resultContent}>无法显示此笔记</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={handleSearch}
          placeholder="搜索笔记内容、标题、标签..."
          placeholderTextColor="#999"
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setQuery('');
              setResults([]);
            }}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 分类筛选 */}
      <View style={styles.categoryFilter}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryFilterContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryFilterButton,
                selectedCategory === cat && styles.categoryFilterButtonActive,
              ]}
              onPress={() => handleCategoryFilter(cat)}
            >
              <Text
                style={[
                  styles.categoryFilterButtonText,
                  selectedCategory === cat && styles.categoryFilterButtonTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 搜索结果 */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : results.length === 0 && query.trim() ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>未找到匹配的笔记</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderResultItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>输入关键词开始搜索</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    fontSize: 24,
    color: '#999',
  },
  categoryFilter: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryFilterContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  categoryFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryFilterButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  categoryFilterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  categoryFilterButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  resultsContainer: {
    padding: 10,
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  resultContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultDate: {
    fontSize: 12,
    color: '#999',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 5,
  },
  tagText: {
    fontSize: 10,
    color: '#2196F3',
  },
  highlight: {
    backgroundColor: '#FFF9C4',
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default SearchScreen;
