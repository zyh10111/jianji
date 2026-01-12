import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

/**
 * 错误边界组件
 * 捕获子组件树中的 JavaScript 错误，记录错误并显示降级 UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    console.error('ErrorBoundary 捕获到错误:', error);
    console.error('错误信息:', errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // 可以自定义降级后的 UI
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.title}>❌ 应用出现错误</Text>
            <Text style={styles.message}>
              很抱歉，应用遇到了一个错误。请查看控制台日志获取详细信息。
            </Text>
            {this.state.error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>错误信息:</Text>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}
            {this.state.errorInfo && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>错误堆栈:</Text>
                <Text style={styles.errorText} numberOfLines={10}>
                  {this.state.errorInfo.componentStack}
                </Text>
              </View>
            )}
            <Text style={styles.hint}>
              💡 提示：请查看开发者工具的控制台获取完整错误信息
            </Text>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  errorContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: 14,
    color: '#999',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default ErrorBoundary;
