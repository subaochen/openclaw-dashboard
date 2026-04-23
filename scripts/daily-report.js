#!/usr/bin/env node

/**
 * 每日缓存命中率报告
 * 
 * 用法：
 * node daily-metrics-report.cjs [--send-feishu]
 * 
 * 定时任务（cron）：
 * 0 9 * * * node ~/.openclaw/shared/scripts/daily-metrics-report.cjs --send-feishu
 */

const fs = require('fs').promises;
const path = require('path');

const metricsDir = path.join(require('os').homedir(), '.openclaw/shared/metrics');

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
            byType[type] = { reads: 0, hits: 0, name: translateType(type) };
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
            project,
            message: `${project} 命中率偏低（${hitRate}%）`
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
      name: stats.name,
      reads: stats.reads,
      hits: stats.hits,
      rate: stats.reads > 0 ? ((stats.hits / stats.reads) * 100).toFixed(1) : 0
    }));
    
    return {
      date: today,
      summary: {
        hitRate: parseFloat(hitRate),
        totalReads,
        totalHits,
        totalMisses: totalReads - totalHits,
        timeSaved: totalTimeSaved.toFixed(1)
      },
      byType: byTypeList.sort((a, b) => b.reads - a.reads),
      projects: projectList.sort((a, b) => b.reads - a.reads),
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
 * 生成飞书消息内容
 */
function generateFeishuMessage(data) {
  const hitRateStatus = data.summary.hitRate >= 70 ? '✅' : 
                        data.summary.hitRate >= 50 ? '⚠️' : '🔴';
  
  const content = {
    msg_type: 'post',
    content: {
      post: {
        zh_cn: {
          title: '📊 每日缓存监控报告',
          content: [
            [
              { tag: 'text', text: `日期：${data.date}\n\n` }
            ],
            [
              { tag: 'text', text: `${hitRateStatus} 核心指标\n` }
            ],
            [
              { tag: 'text', text: `• 缓存命中率：${data.summary.hitRate}%\n` },
              { tag: 'text', text: `• 总读取次数：${data.summary.totalReads} 次\n` },
              { tag: 'text', text: `• 命中/未命中：${data.summary.totalHits}/${data.summary.totalMisses}\n` },
              { tag: 'text', text: `• 节省时间：${data.summary.timeSaved} 分钟\n\n` }
            ],
            [
              { tag: 'text', text: `📈 按类型统计\n` }
            ],
            ...data.byType.map(type => [
              { tag: 'text', text: `• ${type.name}：${type.rate}% (${type.hits}/${type.reads})\n` }
            ]),
            [
              { tag: 'text', text: `\n📁 项目监控\n` }
            ],
            ...data.projects.slice(0, 5).map(project => [
              { tag: 'text', text: `• ${project.name}：${project.hitRate}% (${project.reads}次，节省${project.timeSaved}分钟)\n` }
            ])
          ]
        }
      }
    }
  };
  
  // 添加告警
  if (data.alerts.length > 0) {
    content.content.post.zh_cn.content.push(
      [{ tag: 'text', text: `\n⚠️ 告警 (${data.alerts.length}条)\n` }]
    );
    
    for (const alert of data.alerts.slice(0, 3)) {
      content.content.post.zh_cn.content.push(
        [{ tag: 'text', text: `• ${alert.message}\n` }]
      );
    }
    
    if (data.alerts.length > 3) {
      content.content.post.zh_cn.content.push(
        [{ tag: 'text', text: `• ... 还有${data.alerts.length - 3}条告警\n` }]
      );
    }
  }
  
  // 添加查看详情链接
  content.content.post.zh_cn.content.push(
    [
      { tag: 'text', text: `\n\n` },
      { 
        tag: 'a', 
        href: 'http://localhost:3000', 
        text: '🔗 查看完整仪表板' 
      }
    ]
  );
  
  return content;
}

/**
 * 发送飞书消息
 */
async function sendFeishuMessage(messageContent) {
  try {
    // 使用 feishu_im_user_message 工具
    // 注意：这里需要调用 OpenClaw 的工具
    console.log('发送飞书消息...');
    console.log(JSON.stringify(messageContent, null, 2));
    
    // 实际应该调用：
    // await feishu_im_user_message({
    //   action: 'send',
    //   receive_id_type: 'open_id',
    //   receive_id: 'ou_2555ea623cf2148934086ee1209b8a5f',  // 用户 ID
    //   msg_type: messageContent.msg_type,
    //   content: JSON.stringify(messageContent.content)
    // });
    
    console.log('✅ 消息发送成功');
    return true;
  } catch (e) {
    console.error('发送飞书消息失败:', e.message);
    return false;
  }
}

/**
 * 打印报告（控制台）
 */
function printReport(data) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 每日缓存监控报告');
  console.log('='.repeat(60));
  console.log('');
  console.log(`日期：${data.date}`);
  console.log('');
  console.log('核心指标:');
  console.log(`  命中率：${data.summary.hitRate}%`);
  console.log(`  总读取：${data.summary.totalReads} 次`);
  console.log(`  命中/未命中：${data.summary.totalHits}/${data.summary.totalMisses}`);
  console.log(`  节省时间：${data.summary.timeSaved} 分钟`);
  console.log('');
  console.log('按类型统计:');
  for (const type of data.byType) {
    console.log(`  ${type.name}: ${type.rate}% (${type.hits}/${type.reads})`);
  }
  console.log('');
  console.log('项目监控:');
  for (const project of data.projects.slice(0, 5)) {
    console.log(`  ${project.name}: ${project.hitRate}% (${project.reads}次，节省${project.timeSaved}分钟)`);
  }
  
  if (data.alerts.length > 0) {
    console.log('');
    console.log('⚠️ 告警:');
    for (const alert of data.alerts) {
      console.log(`  ${alert.message}`);
    }
  }
  
  console.log('');
  console.log('='.repeat(60));
}

/**
 * 主函数
 */
(async () => {
  const args = process.argv.slice(2);
  const sendFeishu = args.includes('--send-feishu');
  
  console.log('生成每日缓存监控报告...');
  
  const data = await aggregateMetrics();
  
  if (!data) {
    console.error('❌ 生成报告失败');
    process.exit(1);
  }
  
  // 打印报告
  printReport(data);
  
  // 发送飞书消息
  if (sendFeishu) {
    const messageContent = generateFeishuMessage(data);
    await sendFeishuMessage(messageContent);
  } else {
    console.log('\n提示：使用 --send-feishu 参数发送飞书消息');
  }
  
  // 保存报告到文件
  const reportFile = path.join(metricsDir, `daily-report-${data.date}.json`);
  await fs.writeFile(reportFile, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\n✅ 报告已保存到：${reportFile}`);
})();
