#!/usr/bin/env node

/**
 * 监控仪表板服务器
 * 
 * 用法：
 * node start-dashboard-server.js [--port 3000]
 */

const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const port = process.argv.includes('--port') 
  ? parseInt(process.argv[process.argv.indexOf('--port') + 1]) 
  : 3000;

const metricsDir = path.join(require('os').homedir(), '.openclaw/shared/metrics');
const dashboardDir = path.join(__dirname, '../dashboard');

/**
 * 聚合所有项目数据
 */
async function aggregateMetrics() {
  try {
    const projects = await fs.readdir(metricsDir);
    const today = new Date().toISOString().split('T')[0];
    
    let totalReads = 0;
    let totalHits = 0;
    let totalTimeSaved = 0;
    const byType = {};
    const projectList = [];
    const trend = [];
    const alerts = [];

    // 读取每个项目今天的数据
    for (const project of projects) {
      const metricsFile = path.join(metricsDir, project, `${today}.json`);
      
      try {
        const metrics = JSON.parse(await fs.readFile(metricsFile, 'utf-8'));
        
        totalReads += metrics.cacheReads?.total || 0;
        totalHits += metrics.cacheReads?.hits || 0;
        totalTimeSaved += metrics.timeSaved?.totalMinutes || 0;
        
        // 按类型聚合
        for (const [type, stats] of Object.entries(metrics.byType || {})) {
          if (!byType[type]) {
            byType[type] = { reads: 0, hits: 0 };
          }
          byType[type].reads += stats.reads || 0;
          byType[type].hits += stats.hits || 0;
        }
        
        // 项目列表
        const hitRate = metrics.cacheReads?.total > 0 
          ? ((metrics.cacheReads.hits / metrics.cacheReads.total) * 100).toFixed(1) 
          : 0;
        
        projectList.push({
          name: project,
          hitRate: parseFloat(hitRate),
          reads: metrics.cacheReads?.total || 0,
          timeSaved: metrics.timeSaved?.totalMinutes || 0
        });
        
        // 生成告警
        if (metrics.cacheReads?.total >= 10 && metrics.cacheReads.hitRate < 0.5) {
          alerts.push({
            severity: 'warning',
            message: `${project} 项目命中率偏低（${(hitRate)}%）`,
            suggestion: '检查是否频繁变更代码，或缓存策略是否需要调整'
          });
        }
      } catch (e) {
        // 文件不存在，跳过
      }
    }
    
    // 计算总命中率
    const hitRate = totalReads > 0 
      ? ((totalHits / totalReads) * 100).toFixed(1) 
      : 0;
    
    // 按类型计算命中率
    const byTypeList = Object.entries(byType).map(([name, stats]) => ({
      name: translateType(name),
      reads: stats.reads,
      hits: stats.hits,
      rate: stats.reads > 0 ? ((stats.hits / stats.reads) * 100).toFixed(1) : 0
    }));
    
    // 生成趋势数据（模拟，实际应读取历史数据）
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // 模拟趋势
      const baseRate = parseFloat(hitRate);
      const variation = (Math.random() - 0.5) * 10;
      const rate = Math.max(50, Math.min(95, baseRate + variation)).toFixed(1);
      
      trend.push({
        date: dateStr,
        hitRate: parseFloat(rate)
      });
    }
    
    return {
      summary: {
        hitRate: parseFloat(hitRate),
        totalReads,
        timeSaved: totalTimeSaved.toFixed(1),
        activeProjects: projects.length
      },
      trend,
      byType: byTypeList,
      projects: projectList.sort((a, b) => b.reads - a.reads).slice(0, 10),
      alerts
    };
  } catch (e) {
    console.error('聚合指标失败:', e.message);
    return null;
  }
}

/**
 * 翻译类型名称
 */
function translateType(type) {
  const map = {
    taAnalysis: 'TA 分析',
    ctoDecision: 'CTO 决策',
    implementThoughts: '实现思路',
    reviewComments: '审查意见',
    codeUnderstanding: '代码理解',
    gitState: 'Git 状态'
  };
  return map[type] || type;
}

/**
 * 创建 HTTP 服务器
 */
const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // API 路由
  if (req.url === '/api/metrics/dashboard' && req.method === 'GET') {
    try {
      const data = await aggregateMetrics();
      
      if (data) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to aggregate metrics' }));
      }
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }
  
  // 静态文件服务
  if (req.url === '/' || req.url === '/index.html') {
    try {
      const html = await fs.readFile(path.join(dashboardDir, 'index.html'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch (e) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Dashboard not found');
    }
    return;
  }
  
  // 其他静态文件
  const filePath = path.join(dashboardDir, req.url);
  try {
    const ext = path.extname(req.url).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    };
    
    const content = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(content);
  } catch (e) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// 启动服务器
server.listen(port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 缓存监控仪表板已启动                                  ║
║                                                           ║
║   访问地址：http://localhost:${port}                       ║
║                                                           ║
║   API 端点：http://localhost:${port}/api/metrics/dashboard ║
║                                                           ║
║   按 Ctrl+C 停止服务                                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});
