# 安装指南

## 快速开始

### 1. 克隆项目

```bash
cd ~/git
git clone https://github.com/yourusername/openclaw-dashboard.git
cd openclaw-dashboard
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置（可选）

如果只需要本地查看 Dashboard，跳过此步骤。

如果需要飞书推送功能：

```bash
# 复制配置模板
cp config.example.js config.js

# 编辑配置文件
nano config.js

# 填写飞书 Webhook URL 和其他配置
```

### 4. 启动 Dashboard

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

访问：http://localhost:3000

---

## 配置飞书推送

### 1. 创建飞书机器人

1. 登录 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 添加机器人能力
4. 获取 Webhook URL

### 2. 配置环境变量

```bash
# .env 文件
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
FEISHU_APP_ID=cli_xxx
FEISHU_APP_SECRET=xxx
```

### 3. 测试推送

```bash
node scripts/daily-report.js --test
```

---

## 设置定时任务

### 方法 1：使用 cron（Linux/macOS）

```bash
# 编辑 crontab
crontab -e

# 添加每日报告任务（每天早上 9:00）
0 9 * * * node /home/sbc/git/openclaw-dashboard/scripts/daily-report.js

# 添加数据聚合任务（每小时）
0 * * * * node /home/sbc/git/openclaw-dashboard/scripts/aggregate-metrics.js
```

### 方法 2：使用 Windows 任务计划程序

1. 打开"任务计划程序"
2. 创建基本任务
3. 设置触发器（每天 9:00）
4. 设置操作：
   - 程序：`node.exe`
   - 参数：`C:\path\to\openclaw-dashboard\scripts\daily-report.js`
   - 起始于：`C:\path\to\openclaw-dashboard`

---

## 验证安装

### 1. 检查 Dashboard 是否启动

```bash
curl http://localhost:3000
```

应该返回 HTML 内容。

### 2. 检查 API

```bash
curl http://localhost:3000/api/metrics/dashboard
```

应该返回 JSON 数据。

### 3. 检查飞书推送

```bash
# 发送测试消息
node scripts/send-feishu.js --test
```

---

## 故障排查

### Dashboard 无法启动

**问题**：端口被占用

```bash
# 查看端口占用
lsof -i :3000

# 杀死占用端口的进程
kill -9 <PID>

# 或使用不同端口
PORT=3001 npm start
```

### 飞书推送失败

**问题**：Webhook URL 错误

检查 `config.js` 中的 Webhook URL 是否正确。

**问题**：网络问题

```bash
# 测试网络连接
curl https://open.feishu.cn
```

### 数据不显示

**问题**：指标目录不存在

```bash
# 创建指标目录
mkdir -p ~/.openclaw/shared/metrics

# 检查权限
chmod 755 ~/.openclaw/shared/metrics
```

---

## 下一步

- [ ] 查看 [CONFIG.md](CONFIG.md) 了解详细配置
- [ ] 查看 [EXTENSION.md](EXTENSION.md) 了解如何扩展
- [ ] 访问 Dashboard：http://localhost:3000

---

*Last updated: 2026-04-23*
