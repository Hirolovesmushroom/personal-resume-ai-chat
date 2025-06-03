# 陈建宏个人简历AI对话系统

一个基于AI的个人简历展示网站，集成了智能对话功能，让访问者可以与AI版本的陈建宏进行互动交流。

## 功能特点

- 📄 **个人简历展示** - 完整的个人信息、工作经历、技能展示
- 🤖 **AI智能对话** - 基于火山方舟API的智能问答系统
- 📱 **响应式设计** - 适配各种设备屏幕
- ✨ **现代化UI** - 毛玻璃效果、动画交互
- 🔒 **安全配置** - 环境变量管理，无硬编码密钥

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (原生)
- **后端**: Node.js, Express.js
- **AI服务**: 火山方舟API (DeepSeek模型)
- **部署**: Vercel

## 本地开发

### 1. 克隆项目
```bash
git clone <repository-url>
cd ai-resume-chat
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
复制 `.env.example` 为 `.env` 并填入你的配置：
```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的实际配置：
```env
VOLC_API_KEY=请填入你的火山方舟API密钥
VOLC_API_URL=https://ark.cn-beijing.volces.com/api/v3/chat/completions
VOLC_MODEL=deepseek-r1-250120
API_TIMEOUT=60000
```

⚠️ **安全提醒**：
- 请确保 `.env` 文件已添加到 `.gitignore` 中，避免密钥泄露
- 不要在任何公开场所分享你的API密钥
- 定期更换API密钥以确保安全

### 4. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看效果。

## Vercel部署指南

### 步骤1: 准备代码
确保你的代码已推送到GitHub仓库。

### 步骤2: 连接Vercel
1. 访问 [Vercel官网](https://vercel.com)
2. 使用GitHub账号登录
3. 点击 "New Project"
4. 选择你的GitHub仓库
5. 点击 "Import"

### 步骤3: 配置环境变量
在Vercel项目设置中添加以下环境变量：

#### 必需的环境变量
| 变量名 | 值 | 说明 |
|--------|----|---------|
| `VOLC_API_KEY` | `你的火山方舟API密钥` | 从火山方舟控制台获取 |

#### 可选的环境变量
| 变量名 | 默认值 | 说明 |
|--------|--------|---------|
| `VOLC_API_URL` | `https://ark.cn-beijing.volces.com/api/v3/chat/completions` | API端点地址 |
| `VOLC_MODEL` | `deepseek-r1-250120` | 使用的AI模型 |
| `API_TIMEOUT` | `60000` | 请求超时时间(毫秒) |
| `NODE_ENV` | `production` | Node.js环境 |

### 步骤4: 设置环境变量的具体操作

1. **进入项目设置**
   - 在Vercel仪表板中选择你的项目
   - 点击 "Settings" 标签

2. **添加环境变量**
   - 在左侧菜单中选择 "Environment Variables"
   - 点击 "Add" 按钮

3. **逐个添加变量**
   ```
   Name: VOLC_API_KEY
   Value: 请填入你的火山方舟API密钥
   Environment: Production, Preview, Development
   ```
   
   ```
   Name: VOLC_MODEL
   Value: deepseek-r1-250120
   Environment: Production, Preview, Development
   ```
   
   ```
   Name: NODE_ENV
   Value: production
   Environment: Production
   ```

4. **保存并重新部署**
   - 点击 "Save" 保存环境变量
   - 在 "Deployments" 标签中触发重新部署

### 步骤5: 验证部署
1. 部署完成后，访问Vercel提供的域名
2. 测试AI对话功能是否正常工作
3. 检查浏览器控制台是否有错误

## 获取火山方舟API密钥

1. 访问 [火山方舟控制台](https://console.volcengine.com/ark)
2. 注册/登录账号
3. 创建API密钥
4. 复制密钥到环境变量中

## 故障排除

### 常见问题

**Q: AI对话不工作，显示"AI对话服务暂时不可用"**
A: 检查环境变量 `VOLC_API_KEY` 是否正确设置

**Q: 部署后页面空白**
A: 检查Vercel构建日志，确认所有依赖都已正确安装

**Q: API请求超时**
A: 可以增加 `API_TIMEOUT` 环境变量的值

### 调试步骤
1. 检查Vercel部署日志
2. 查看浏览器控制台错误
3. 验证环境变量设置
4. 测试API密钥有效性

## 项目结构

```
.
├── server.js              # Express服务器主文件
├── 个人简历网页.html        # 前端页面
├── 照片.jpg               # 个人照片
├── package.json           # 项目依赖配置
├── vercel.json           # Vercel部署配置
├── .env.example          # 环境变量示例
└── README.md             # 项目说明文档
```

## 许可证

MIT License

## 联系方式

如有问题，请通过以下方式联系：
- 邮箱: [你的邮箱]
- GitHub: [你的GitHub]