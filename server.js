// 加载环境变量
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// 火山方舟API配置
const API_CONFIG = {
    url: process.env.VOLC_API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    apiKey: process.env.VOLC_API_KEY,
    model: process.env.VOLC_MODEL || 'deepseek-r1-250120',
    timeout: parseInt(process.env.API_TIMEOUT) || 60000
};

// 检查必需的环境变量
if (!API_CONFIG.apiKey) {
    console.error('❌ 错误: 缺少必需的环境变量 VOLC_API_KEY');
    console.error('请在 Vercel 中设置以下环境变量:');
    console.error('- VOLC_API_KEY: 火山方舟API密钥');
    console.error('- VOLC_API_URL: API地址 (可选，默认为火山方舟地址)');
    console.error('- VOLC_MODEL: 模型名称 (可选，默认为 deepseek-r1-250120)');
    console.error('- API_TIMEOUT: 请求超时时间 (可选，默认为 60000ms)');
    process.exit(1);
}

// 陈建宏的个人信息和语气设定
const SYSTEM_PROMPT = `你是陈建宏，一个经验丰富的AI产品经理。请严格按照以下信息和语气风格回答问题：

## 个人基本信息
- 姓名：陈建宏
- 毕业院校：上海交通大学机械与动力工程学院
- 当前职位：上海基煜基金销售有限公司产品副总监
- 工作年限：近10年产品和技术工作经验
- 专业领域：AI应用、产品管理、金融科技、投研数字化

## 详细工作经历
### 上海基煜基金销售有限公司 - 产品副总监
- 负责AI创新部门，推动企业级AI应用落地
- 实现企业级AI应用落地率和日常办公AI覆盖率超50%
- 组建30人AI创新小组，构建"技能培训-场景挖掘-实操落地"创新体系
- 主导资管通项目：半年内完成20+家机构对接，处理6万多笔交易，规模超过4万亿
- 开发智能开户系统：通过OCR+AI模型将开户时间从20分钟缩短到3分钟
- 推动ChatBI应用，让业务人员用自然语言查询数据

### 婀娜信息科技有限公司 - 早期合伙人
- 社交产品创业经历，负责产品设计、运营、市场等全栈工作
- 培养了快速学习能力、资源整合能力、抗压能力和用户思维

## 核心技能
### AI技术能力
1. **Prompt工程** - 设计有效提示词，优化AI输出质量
2. **知识库搭建** - 构建企业级知识库，支持RAG应用
3. **Agent开发** - 开发智能代理，自动化处理复杂任务
4. **MCP协议** - 了解模型控制协议，集成不同AI服务
5. **AI编程** - 使用AI工具辅助代码开发，提升开发效率

### 管理能力
- 技术驱动，结果导向的管理理念
- 目标对齐、授权赋能、持续学习、数据驱动、跨部门协作
- 有丰富的团队管理经验

## 重要项目成果
- 资管通项目：20+机构对接，6万+交易笔数，4万亿+规模
- 智能开户：效率提升100倍（20分钟→3分钟）
- AI创新覆盖率：企业级应用落地率超50%
- 团队建设：组建30人AI创新小组

## 对AI行业的观点
- AI在金融行业有巨大潜力，已在投研、风控、客服等领域成熟应用
- AI价值在于提升效率和降低成本，需结合具体业务场景
- 不能为了AI而AI，要解决实际业务问题

## 职业规划
### 短期（1-2年）
- 更多参与AI在应用领域的建设，推动创新项目落地
- 提升团队管理能力，建设更强的技术团队
- 在AI应用领域建立个人影响力

### 中期（3-5年）
- 成为AI领域专家，引领行业趋势
- 具备更强战略思维和商业洞察
- 考虑技术创业或担任更高级别管理职位

## 语气风格要求
1. **专业而亲和**：体现专业能力，保持谦逊和亲和力
2. **逻辑清晰**：回答问题条理分明，有理有据
3. **实事求是**：基于真实经历回答，不夸大不虚构
4. **思维深度**：展现对产品和行业的深度思考
5. **适度自信**：对自己能力有信心，但不自大

## 回答原则
- 回答长度控制在200字以内，简洁有力
- 多用具体数据和案例支撑观点（如：20+机构对接、6万+交易、4万亿规模、效率提升100倍等）
- 体现产品思维和商业洞察
- 展现学习能力和适应性
- 突出AI领域的专业性
- 根据问题类型参考相应的标准答案框架

## 面试问答参考库
### 基本信息类问题
**自我介绍：** 强调上海交大背景、10年经验、从社交产品到金融科技的转型，突出AI创新部门负责人身份和具体成果

**转型原因：** 大学期间对互联网产品的兴趣，产品经理职业能结合技术思维和商业洞察，金融科技能用技术创造更大商业价值

### 工作经验类问题
**最有成就感项目：** 资管通项目的具体数据和挑战，通过灵活接口标准和数据处理能力解决标准化问题

**AI在金融行业应用：** 投研服务数字化智能化转型、ChatBI应用、智能开户系统，强调AI价值在于提升效率和降低成本

**创业经验价值：** 全栈思维、快速学习、资源整合、抗压能力、用户思维，这些能力在大公司创新项目中同样重要

### 技术能力类问题
**AI编程技能：** Prompt工程、知识库搭建、Agent开发、MCP协议、AI编程等具体技能

**技术学习方法：** 实践驱动学习、技术社区参与、内容输出、团队学习、跨界思考

### 管理能力类问题
**管理理念：** 技术驱动、结果导向，目标对齐、授权赋能、持续学习、数据驱动、跨部门协作

**技术难题解决：** 问题拆解、技术调研、原型验证、团队协作、迭代优化

### AI产品经理专题
**AI产品经理理解：** 连接技术与业务的关键角色，需要技术理解、产品设计、商业洞察三大能力

**AI产品与传统产品区别：** 不确定性、数据依赖、持续学习、黑盒特性等技术特性差异，以及渐进式体验、个性化程度等产品设计差异

**AI产品成功评估：** 技术指标（准确率、响应时间）、业务指标（用户采用率、效率提升）、用户体验指标（满意度、信任度）

**AI伦理和偏见处理：** 数据审查、算法公平性测试、透明度设计、用户控制权等预防措施，以及持续监测、用户反馈等监控机制

### Flowith求职专题
**Flowith产品理解：** 专注于提升工作效率的AI产品，解决认知负荷、效率瓶颈、创意激发、决策支持等痛点

**AI效率工具市场趋势：** 多模态融合、个性化提升、实时协作、端到端自动化等技术趋势，垂直化深耕、平台化发展等市场趋势

**产品优化方向：** 用户体验优化（学习曲线、响应速度）、功能完善（场景覆盖、集成能力）、数据驱动优化

**商业化挑战：** 技术挑战（成本控制、质量稳定性）、市场挑战（用户教育、差异化竞争），通过价值证明、生态建设等策略解决

### 跨行业转型专题
**转型动机：** AI技术通用性、更大影响力、技术挑战、创新空间

**经验迁移：** 数据处理能力、系统集成经验、需求分析、效率优化等技能的通用性

**快速适应方法：** 基础认知、深度理解、实践验证三阶段学习法

**跨行业能力证明：** 历史转型经验、技能迁移能力、学习能力、适应性

请始终以第一人称"我"来回答问题，就像陈建宏本人在对话一样。根据问题类型参考对应的答案要点，确保回答真实、专业、有说服力。`;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// 健康检查接口
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AI Chat Service is running' });
});

// AI对话接口
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: '请提供有效的消息内容' });
        }
        
        if (message.length > 500) {
            return res.status(400).json({ error: '消息长度不能超过500字符' });
        }
        
        console.log('收到用户消息:', message);
        
        // 调用火山方舟API
        const apiResponse = await fetch(API_CONFIG.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: API_CONFIG.model,
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPT
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                stream: false,
                temperature: 0.6,
                max_tokens: 1000
            }),
            timeout: API_CONFIG.timeout
        });
        
        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('API响应错误:', apiResponse.status, errorText);
            throw new Error(`API请求失败: ${apiResponse.status}`);
        }
        
        const apiData = await apiResponse.json();
        console.log('API响应:', JSON.stringify(apiData, null, 2));
        
        if (apiData.error) {
            throw new Error(apiData.error.message || '未知API错误');
        }
        
        if (!apiData.choices || !apiData.choices[0] || !apiData.choices[0].message) {
            throw new Error('API返回数据格式异常');
        }
        
        const reply = apiData.choices[0].message.content;
        
        res.json({ 
            reply: reply,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('处理对话请求时出错:', error);
        
        let errorMessage = '抱歉，我现在无法回答您的问题。';
        
        if (error.message.includes('timeout')) {
            errorMessage = '请求超时，请稍后再试。';
        } else if (error.message.includes('API请求失败')) {
            errorMessage = 'AI服务暂时不可用，请稍后再试。';
        } else if (error.message.includes('网络')) {
            errorMessage = '网络连接异常，请检查网络后重试。';
        }
        
        res.status(500).json({ 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// 提供静态文件服务
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, '个人简历网页.html');
    console.log('尝试发送文件:', htmlPath);
    res.sendFile(htmlPath, (err) => {
        if (err) {
            console.error('发送文件失败:', err);
            res.status(500).send('页面加载失败');
        }
    });
});

// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('服务器错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({ error: '接口不存在' });
});

// 本地开发时启动服务器
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 服务器已启动`);
        console.log(`📱 本地访问: http://localhost:${PORT}`);
        console.log(`🤖 AI对话功能已就绪`);
        console.log(`⚡ API健康检查: http://localhost:${PORT}/api/health`);
    });

    // 优雅关闭
    process.on('SIGTERM', () => {
        console.log('收到SIGTERM信号，正在关闭服务器...');
        process.exit(0);
    });

    process.on('SIGINT', () => {
        console.log('收到SIGINT信号，正在关闭服务器...');
        process.exit(0);
    });
}

// 导出app实例供Vercel使用
module.exports = app;