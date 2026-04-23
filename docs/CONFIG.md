# 配置指南

## 配置文件

配置文件位于项目根目录：`config.js`

### 基础配置

```javascript
module.exports = {
  // 服务器端口
  port: 3000,
  
  // 飞书配置
  feishu: {
    webhookUrl: 'https://open.feishu.cn/open-apis/bot/v2/hook/xxx',
    appId: 'cli_xxx',
    appSecret: 'xxx'
  }
};
```

---

## 环境变量

优先使用环境变量（推荐用于生产环境）：

```bash
# .env 文件
PORT=3000
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
FEISHU_APP_ID=cli_xxx
FEISHU_APP_SECRET=xxx
```

---

## 监控配置

### 告警阈值

```javascript
monitoring: {
  alertThresholds: {
    lowHitRate: 0.5,      // 命中率低于 50% 触发告警
    suddenDrop: 0.2,      // 较昨日下降超过 20% 触发告警
    highReads: 1000       // 单项目日读取超过 1000 次触发告警
  }
}
```

### 刷新间隔

```javascript
monitoring: {
  refreshInterval: 5 * 60 * 1000  // 5 分钟自动刷新
}
```

### 数据保留

```javascript
monitoring: {
  dataRetention: 30  // 保留 30 天的数据
}
```

---

## 报告配置

### 每日报告时间

```javascript
report: {
  dailyReportTime: '0 9 * * *'  // 每天早上 9:00（cron 格式）
}
```

### 报告接收人

```javascript
report: {
  recipients: [
    'ou_xxx',  // 飞书 open_id
    'ou_yyy'
  ]
}
```

---

## 自定义主题

### 修改 Dashboard 颜色

编辑 `dashboard/index.html`：

```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* 修改渐变色 */
}

.metric-card {
  background: white;
  /* 修改卡片背景色 */
}
```

### 添加公司 Logo

在 `dashboard/index.html` 的 `<header>` 中添加：

```html
<header>
  <img src="logo.png" alt="Company Logo" style="height: 40px; margin-bottom: 16px;">
  <h1>🚀 缓存监控仪表板</h1>
  <!-- ... -->
</header>
```

---

## 高级配置

### 使用反向代理（Nginx）

```nginx
server {
  listen 80;
  server_name dashboard.yourdomain.com;
  
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

### HTTPS 配置（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d dashboard.yourdomain.com
```

---

## 性能优化

### 启用 Gzip 压缩

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 配置缓存

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

---

## 故障排查

### 查看日志

```bash
# 服务器日志
tail -f logs/server.log

# 每日报告日志
tail -f logs/daily-report.log
```

### 调试模式

```bash
# 启用调试模式
DEBUG=true npm start
```

---

*Last updated: 2026-04-23*
