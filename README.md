# OpenClaw Dashboard

🚀 多 Agent 系统缓存监控与性能可视化仪表板

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-blue.svg)](https://nodejs.org/)
[![GitHub stars](https://img.shields.io/github/stars/subaochen/openclaw-dashboard.svg)](https://github.com/subaochen/openclaw-dashboard/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/subaochen/openclaw-dashboard.svg)](https://github.com/subaochen/openclaw-dashboard/issues)

---

## 📋 项目简介

OpenClaw Dashboard 是一个专为多 Agent 系统设计的监控仪表板，提供：

- ✅ **实时缓存命中率监控**
- ✅ **Agent 性能分析**
- ✅ **项目维度统计**
- ✅ **告警通知**
- ✅ **飞书集成**

**核心价值**：
- 📊 **可视化**：告别命令行，直观的数据图表
- ⚠️ **告警**：命中率偏低时自动通知
- 📈 **趋势**：7 天趋势分析，发现性能问题
- 🎯 **优化**：定位低效环节，持续改进

---

## 🎯 功能特性

### 1. 缓存命中率监控

- **核心指标**：命中率、总读取次数、节省时间
- **按类型统计**：TA 分析、CTO 决策、代码理解、审查意见等
- **项目对比**：多个项目的命中率对比
- **趋势分析**：近 7 天命中率变化趋势

### 2. Code Reviewer 架构审查监控（新增）

- **架构审查覆盖率**：执行架构审查的任务比例
- **重构建议数**：提出的重构建议数量
- **架构维度评分**：6 个维度（SRP/依赖/配置/错误处理/日志/扩展性）平均分
- **重构采纳率**：OpenCode 已执行的重构比例

### 3. 告警系统

- **命中率告警**：低于 50% 时触发警告
- **异常检测**：突然下降时通知
- **优化建议**：自动给出改进建议

### 3. 飞书集成

- **每日报告**：每天早上 9:00 自动发送
- **告警推送**：实时推送异常告警
- **一键访问**：报告含 Dashboard 链接

### 4. 可扩展架构

- **插件化设计**：轻松添加新监控模块
- **REST API**：便于集成其他系统
- **自定义主题**：支持 UI 主题定制

---

## 🚀 快速开始

### 前置要求

- Node.js >= 16
- npm >= 8
- （可选）飞书开放平台账号

### 安装

```bash
# 1. 克隆项目
cd ~/git
git clone https://github.com/yourusername/openclaw-dashboard.git
cd openclaw-dashboard

# 2. 安装依赖
npm install

# 3. 启动 Dashboard 服务器
npm start

# 4. 访问仪表板
open http://localhost:3000
```

### 配置

**环境变量**（可选）：

```bash
# .env 文件
PORT=3000
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
FEISHU_APP_ID=cli_xxx
FEISHU_APP_SECRET=xxx
```

---

## 📊 功能演示

### 主仪表板

![Dashboard](docs/images/dashboard-main.png)

- **核心指标卡片**：命中率、读取次数、节省时间、活跃项目
- **趋势图表**：近 7 天命中率变化
- **类型统计**：各类型缓存的命中情况
- **项目监控**：每个项目的详细指标
- **告警信息**：需要关注的异常

### 飞书每日报告

![Feishu Report](docs/images/feishu-report.png)

每天早上 9:00 自动发送：
- 核心指标汇总
- 按类型统计
- 项目监控
- 告警信息
- Dashboard 链接

---

## 🛠️ 技术架构

### 后端

```
server/
├── index.js                 # HTTP 服务器
├── metrics-aggregator.js    # 数据聚合
└── api/
    ├── metrics.js           # 指标 API
    ├── alerts.js            # 告警 API
    └── projects.js          # 项目 API
```

### 前端

```
dashboard/
├── index.html               # 主页面
├── css/
│   └── style.css            # 样式表
└── js/
    ├── charts.js            # 图表组件
    └── dashboard.js         # Dashboard 逻辑
```

### 脚本

```
scripts/
├── daily-report.js          # 每日报告生成
├── send-feishu.js           # 飞书推送
└── aggregate-metrics.js     # 数据聚合
```

---

## 📁 目录结构

```
openclaw-dashboard/
├── README.md
├── package.json
├── server/
│   ├── index.js
│   ├── metrics-aggregator.js
│   └── api/
├── dashboard/
│   ├── index.html
│   ├── css/
│   └── js/
├── scripts/
│   ├── daily-report.js
│   └── send-feishu.js
├── docs/
│   ├── INSTALL.md
│   ├── CONFIG.md
│   └── EXTENSION.md
└── examples/
    └── sample-data.json
```

---

## 🔧 使用指南

### 1. 启动 Dashboard

```bash
npm start
```

访问：http://localhost:3000

### 2. 配置飞书推送

```bash
# 编辑配置文件
cp config.example.js config.js

# 填写飞书 Webhook URL
nano config.js
```

### 3. 设置定时任务

```bash
# 每天 9:00 发送报告
crontab -e

# 添加以下行
0 9 * * * node /path/to/openclaw-dashboard/scripts/daily-report.js
```

---

## 📈 监控指标说明

### 核心指标

| 指标 | 说明 | 计算方式 |
|------|------|---------|
| **命中率** | 缓存命中的比例 | 命中次数 / 总读取次数 × 100% |
| **总读取次数** | 缓存读取总次数 | 累加所有读取操作 |
| **节省时间** | 因缓存节省的时间 | 命中次数 × 平均节省时间 |
| **活跃项目** | 有缓存读取的项目数 | 统计项目数量 |

### 告警阈值

| 告警类型 | 阈值 | 建议操作 |
|---------|------|---------|
| **命中率偏低** | < 50% | 检查缓存策略 |
| **命中率突降** | 较昨日下降 > 20% | 检查代码变更 |
| **读取异常** | 单项目读取 > 1000 次/天 | 检查是否有死循环 |

---

## 🔌 扩展开发

### 添加新监控模块

1. 创建监控数据收集器
2. 添加 API 路由
3. 更新前端 Dashboard
4. 添加配置选项

详见：[docs/EXTENSION.md](docs/EXTENSION.md)

### 自定义图表

使用 Chart.js 或 ECharts：

```javascript
// dashboard/js/charts.js
import { Chart } from 'chart.js';

const ctx = document.getElementById('myChart');
new Chart(ctx, {
  type: 'bar',
  data: { /* ... */ },
  options: { /* ... */ }
});
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发环境

```bash
# Fork 项目
git clone https://github.com/yourusername/openclaw-dashboard.git

# 创建分支
git checkout -b feature/your-feature

# 开发并提交
git commit -m "feat: add new feature"

# 推送到 GitHub
git push origin feature/your-feature
```

### 提交规范

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 重构
- `test:` 测试
- `chore:` 构建/工具

---

## 📄 License

MIT License © 2026 OpenClaw Contributors

---

## 🙏 致谢

- [OpenClaw](https://github.com/openclaw/openclaw) - 多 Agent 协作框架
- [Chart.js](https://www.chartjs.org/) - 图表库
- [Feishu Open Platform](https://open.feishu.cn/) - 飞书开放平台

---

## 📬 联系方式

- **GitHub Issues**: https://github.com/yourusername/openclaw-dashboard/issues
- **Discord**: https://discord.gg/xxx
- **微信群**: 扫码加入（见 docs/wechat-group.png）

---

*Last updated: 2026-04-23*
