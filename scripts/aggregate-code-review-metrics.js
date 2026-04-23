#!/usr/bin/env node

/**
 * Code Reviewer 架构审查监控数据聚合脚本
 * 
 * 用法：
 * node scripts/aggregate-code-review-metrics.js [project-path]
 */

const fs = require('fs').promises;
const path = require('path');

const metricsDir = path.join(require('os').homedir(), '.openclaw/shared/metrics');
const codeReviewMetricsDir = path.join(metricsDir, 'code-review');

/**
 * 从飞书多维表格或日志文件读取 Code Reviewer 数据
 */
async function aggregateCodeReviewMetrics() {
  const today = new Date().toISOString().split('T')[0];
  
  // 示例数据结构
  const metrics = {
    date: today,
    summary: {
      totalReviews: 0,
      architectureReviews: 0,
      issuesFound: 0,
      refactorSuggestions: 0,
      refactorExecuted: 0,
      avgArchitectureScore: 0.0
    },
    byProject: {},
    trend: [],
    alerts: []
  };
  
  // TODO: 实际实现需要从以下来源读取数据：
  // 1. 飞书多维表格 API
  // 2. Code Reviewer 日志文件
  // 3. Git commit 历史
  
  console.log('✅ Code Reviewer 指标聚合完成');
  console.log(JSON.stringify(metrics, null, 2));
  
  return metrics;
}

/**
 * 保存指标到文件
 */
async function saveMetrics(metrics) {
  const today = new Date().toISOString().split('T')[0];
  const metricsFile = path.join(codeReviewMetricsDir, `${today}.json`);
  
  await fs.mkdir(codeReviewMetricsDir, { recursive: true });
  await fs.writeFile(metricsFile, JSON.stringify(metrics, null, 2));
  
  console.log(`📊 指标已保存到：${metricsFile}`);
}

// 主函数
async function main() {
  try {
    const metrics = await aggregateCodeReviewMetrics();
    await saveMetrics(metrics);
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { aggregateCodeReviewMetrics, saveMetrics };
