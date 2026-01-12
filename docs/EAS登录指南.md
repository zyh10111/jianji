# EAS 登录指南

本文档说明如何使用 `eas login` 命令登录 Expo 账户。

---

## 登录步骤

### 1. 运行登录命令

在项目根目录运行：

```bash
eas login
```

### 2. 输入邮箱或用户名

命令会提示：
```
? Email or username: 
```

此时您需要：

1. **输入您的 Expo 账户邮箱或用户名**
   - 如果已有账户：输入注册时使用的邮箱或用户名
   - 如果是新用户：输入您想要使用的邮箱（将用于注册）

2. **按 Enter 键确认**

### 3. 输入密码

系统会提示：
```
? Password: [hidden]
```

1. **输入密码**
   - 注意：输入时不会显示字符（这是正常的安全措施）
   - 输入完成后按 Enter

2. **如果是新用户**，系统可能会提示注册
   - 按照提示完成注册流程

### 4. 完成登录

登录成功后，会显示：
```
✓ Logged in as [您的用户名]
```

---

## 如果没有账户（新用户）

### 方法一：使用 eas login 注册

1. 运行 `eas login`
2. 输入您想使用的邮箱（如：yourname@example.com）
3. 如果该邮箱未注册，系统会提示注册
4. 输入密码并完成注册

### 方法二：在网站注册（推荐）

1. **访问 Expo 官网**
   - 打开 https://expo.dev/signup

2. **选择注册方式**
   - **使用邮箱注册**：
     - 输入邮箱地址
     - 输入密码
     - 点击"Sign up"
     - 验证邮箱（检查邮件）
   
   - **使用GitHub账号注册**（推荐）：
     - 点击"Sign up with GitHub"
     - 授权GitHub账号
     - 自动完成注册

3. **注册完成后**
   - 返回命令行
   - 运行 `eas login`
   - 输入邮箱和密码登录

---

## 使用 GitHub 账号登录（推荐）

如果您有 GitHub 账号，推荐使用 GitHub 登录：

### 方法一：在网站注册后使用

1. 访问 https://expo.dev/signup
2. 点击"Sign up with GitHub"
3. 授权后注册完成
4. 在命令行运行 `eas login`
5. 输入邮箱和密码（或使用GitHub关联的邮箱）

### 方法二：直接使用 GitHub 令牌

如果您熟悉GitHub，也可以：
1. 在GitHub设置中创建Personal Access Token
2. 使用token登录（高级用法，不推荐初学者）

---

## 常见问题

### 1. 提示 "Invalid credentials"（凭据无效）

**原因**：邮箱或密码错误

**解决方案**：
- 检查邮箱是否正确
- 检查密码是否正确（注意大小写）
- 尝试在浏览器中登录 https://expo.dev/ 验证账户
- 如果忘记密码，访问 https://expo.dev/forgot-password 重置

### 2. 提示 "User not found"（用户不存在）

**原因**：该邮箱未注册

**解决方案**：
- 在 https://expo.dev/signup 注册账户
- 或使用不同的邮箱

### 3. 密码输入不显示字符

**这是正常的！**
- 出于安全考虑，密码输入时不会显示
- 直接输入密码，然后按 Enter
- 不要担心看不到字符，这是正常的安全措施

### 4. 提示 "Network error"（网络错误）

**原因**：网络连接问题

**解决方案**：
- 检查网络连接
- 如果在国内，可能需要使用VPN
- 尝试使用移动热点
- 稍后重试

### 5. 使用 GitHub 账号注册后如何登录

**方法**：
- 使用GitHub账号关联的邮箱地址登录
- 使用GitHub账号的邮箱和密码
- 或继续使用GitHub OAuth方式（在网站）

---

## 登录示例

### 完整的登录流程示例

```bash
$ eas login
? Email or username: student@example.com    # 输入邮箱
? Password: ********                        # 输入密码（不显示）
✓ Logged in as student
```

### 新用户注册流程示例

```bash
$ eas login
? Email or username: newuser@example.com    # 输入新邮箱
? Password: ********                        # 输入密码
? This email is not registered. Would you like to create an account? (Y/n) Y
✓ Account created successfully
✓ Logged in as newuser
```

---

## 验证登录状态

登录后，您可以验证是否已登录：

```bash
eas whoami
```

如果已登录，会显示：
```
Logged in as [您的用户名]
```

如果未登录，会提示：
```
Not logged in
```

---

## 退出登录

如果需要退出登录：

```bash
eas logout
```

---

## 注意事项

1. **账户是免费的**
   - Expo 账户免费注册
   - 免费构建次数通常足够学生作业使用

2. **邮箱验证**
   - 注册后可能需要验证邮箱
   - 检查邮件并点击验证链接

3. **密码安全**
   - 使用强密码
   - 不要在公共场所输入密码

4. **网络要求**
   - 需要能够访问 expo.dev
   - 如果在国内，可能需要VPN

---

## 快速开始（推荐流程）

**对于新用户**：

1. 在浏览器中访问 https://expo.dev/signup
2. 点击"Sign up with GitHub"（如果有GitHub账号）或使用邮箱注册
3. 完成注册并验证邮箱
4. 返回命令行，运行：
   ```bash
   eas login
   ```
5. 输入邮箱和密码
6. 完成登录

**对于已有账户**：

1. 运行 `eas login`
2. 输入邮箱和密码
3. 完成登录

---

**文档版本**：v1.0  
**最后更新**：2024年
