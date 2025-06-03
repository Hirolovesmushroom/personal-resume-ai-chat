require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();

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
- 如果问题超出个人经历范围，诚实说明并提供相关思考

请始终以第一人称"我"来回答问题，体现这是陈建宏本人在对话。`;

// 中间件配置
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API健康检查
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        message: 'AI对话服务运行正常',
        config: {
            model: API_CONFIG.model,
            hasApiKey: !!API_CONFIG.apiKey,
            timeout: API_CONFIG.timeout
        }
    });
});

// AI对话接口
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: '消息内容不能为空' });
        }

        if (!API_CONFIG.apiKey) {
            return res.status(500).json({ 
                error: '服务配置错误：缺少API密钥',
                details: '请联系管理员配置VOLC_API_KEY环境变量'
            });
        }

        console.log('收到用户消息:', message);
        
        const requestBody = {
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
            temperature: 0.7,
            max_tokens: 1000,
            stream: false
        };

        console.log('发送API请求到:', API_CONFIG.url);
        console.log('请求模型:', API_CONFIG.model);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
        
        const response = await fetch(API_CONFIG.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API响应错误:', response.status, errorText);
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API响应成功');
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('API响应格式错误:', data);
            throw new Error('API响应格式不正确');
        }
        
        const aiResponse = data.choices[0].message.content;
        console.log('AI回复:', aiResponse.substring(0, 100) + '...');
        
        res.json({ 
            response: aiResponse,
            timestamp: new Date().toISOString(),
            model: API_CONFIG.model
        });
        
    } catch (error) {
        console.error('处理对话请求时出错:', error);
        
        if (error.name === 'AbortError') {
            res.status(408).json({ 
                error: '请求超时',
                details: `请求超过${API_CONFIG.timeout}ms未响应`
            });
        } else if (error.message.includes('fetch')) {
            res.status(503).json({ 
                error: '网络连接错误',
                details: '无法连接到AI服务，请稍后重试'
            });
        } else {
            res.status(500).json({ 
                error: '服务器内部错误',
                details: error.message
            });
        }
    }
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

// 导出给Vercel使用
module.exports = app;