# Git 提交命令

请按顺序执行以下命令来提交代码到 GitHub：

## 步骤 1：添加所有更改的文件

```bash
git add .
```

或者分别添加：

```bash
git add .github/workflows/build-apk.yml
git add "docs/GitHub Actions构建指南.md"
git add src/screens/CreateNoteScreen.js
git add src/services/baiduSpeechService.js
git add src/services/noteService.js
git add src/services/voiceService.js
git add "docs/语音识别真实API配置完成.md"
git add "docs/问题修复说明.md"
```

## 步骤 2：提交更改

```bash
git commit -m "fix: 修复搜索崩溃和语音输入问题，优化构建流程

- 修复搜索功能：添加安全检查，防止崩溃
- 优化语音识别：改进错误处理，使用真实API
- 优化录音配置：匹配百度API要求（16000Hz采样率，单声道，WAV格式）
- 优化GitHub Actions：移除等待构建完成步骤，加快workflow执行
- 改进用户提示：根据错误类型显示不同提示
- 添加问题修复和API配置文档"
```

## 步骤 3：推送到远程仓库

```bash
git push origin main
```

---

## 完整命令（一键执行）

如果想一次性执行所有命令，可以复制以下内容：

```bash
git add . && git commit -m "fix: 修复搜索崩溃和语音输入问题，优化构建流程

- 修复搜索功能：添加安全检查，防止崩溃
- 优化语音识别：改进错误处理，使用真实API
- 优化录音配置：匹配百度API要求（16000Hz采样率，单声道，WAV格式）
- 优化GitHub Actions：移除等待构建完成步骤，加快workflow执行
- 改进用户提示：根据错误类型显示不同提示
- 添加问题修复和API配置文档" && git push origin main
```

---

## 提交的文件列表

### 修改的文件
- `.github/workflows/build-apk.yml` - 优化构建流程
- `docs/GitHub Actions构建指南.md` - 更新文档
- `src/screens/CreateNoteScreen.js` - 优化录音配置和用户提示
- `src/services/baiduSpeechService.js` - 添加调试日志
- `src/services/noteService.js` - 修复搜索崩溃问题
- `src/services/voiceService.js` - 改进错误处理

### 新增的文件
- `docs/语音识别真实API配置完成.md` - API配置文档
- `docs/问题修复说明.md` - 问题修复文档

---

## 验证提交

提交后，可以运行以下命令验证：

```bash
# 查看提交历史
git log --oneline -3

# 查看远程状态
git status
```

---

## 注意事项

1. **确保在正确的分支**：当前应该在 `main` 分支
2. **检查更改**：提交前可以运行 `git diff` 查看更改
3. **推送到远程**：`git push` 会将更改推送到 GitHub

---

**生成时间**：2024年
