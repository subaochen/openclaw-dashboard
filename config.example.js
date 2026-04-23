/**
 * OpenClaw Dashboard 配置文件
 * 
 * 复制此文件为 config.js 并填写实际配置
 */

module.exports = {
  // 服务器配置
  port: process.env.PORT || 3000,
  
  // 飞书配置（可选）
  feishu: {
    webhookUrl: process.env.FEISHU_WEBHOOK_URL || '',
    appId: process.env.FEISHU_APP_ID || '',
    appSecret: process.env.FEISHU_APP_SECRET || ''
  },
  
  // 监控配置
  monitoring: {
    // 告警阈值
    alertThresholds: {
      lowHitRate: 0.5,      // 命中率低于 50% 告警
      suddenDrop: 0.2,      // 较昨日下降超过 20% 告警
      highReads: 1000       // 单项目日读取超过 1000 次告警
    },
    
    // 刷新间隔（毫秒）
    refreshInterval: 5 * 60 * 1000,  // 5 分钟
    
    // 数据保留天数
    dataRetention: 30  // 30 天
  },
  
  // 报告配置
  report: {
    // 每日报告发送时间（cron 格式）
    dailyReportTime: '0 9 * * *',  // 每天早上 9:00
    
    // 报告接收人（飞书 open_id）
    recipients: []
  }
};
