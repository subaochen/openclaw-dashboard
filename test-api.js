#!/usr/bin/env node

/**
 * OpenClaw Dashboard SQLite API 端点测试脚本
 * 测试所有 API 端点并生成 HTML 报告
 */

const BASE_URL = "http://127.0.0.1:33334";
const API_BASE = BASE_URL;

// 存储测试结果
const testResults = [];

// 测试工具函数
async function testApi(name, fn) {
  const startTime = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    testResults.push({
      name,
      status: "PASS",
      duration,
      message: result.message || "OK",
      data: result.data,
    });
    console.log(`✅ ${name} (${duration}ms)`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    testResults.push({
      name,
      status: "FAIL",
      duration,
      message: error.message,
      data: null,
    });
    console.log(`❌ ${name}: ${error.message}`);
    throw error;
  }
}

// 生成 HTML 报告
function generateHtmlReport() {
  const passed = testResults.filter((r) => r.status === "PASS").length;
  const failed = testResults.filter((r) => r.status === "FAIL").length;
  const total = testResults.length;

  const rows = testResults
    .map(
      (r) => `
    <tr class="${r.status === "PASS" ? "pass" : "fail"}">
      <td>${r.name}</td>
      <td><span class="badge ${r.status.toLowerCase()}">${r.status}</span></td>
      <td>${r.duration}ms</td>
      <td>${escapeHtml(r.message)}</td>
    </tr>
  `,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OpenClaw Dashboard API 测试报告</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
    }
    h1 {
      color: #333;
      margin-bottom: 20px;
    }
    .summary {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 20px 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .stat {
      font-size: 36px;
      font-weight: bold;
    }
    .stat.total { color: #333; }
    .stat.pass { color: #22c55e; }
    .stat.fail { color: #ef4444; }
    .stat-label {
      font-size: 14px;
      color: #666;
      margin-top: 5px;
    }
    table {
      width: 100%;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-collapse: collapse;
    }
    th, td {
      padding: 12px 20px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
    }
    tr.pass { background: #f0fdf4; }
    tr.fail { background: #fef2f2; }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge.pass {
      background: #dcfce7;
      color: #166534;
    }
    .badge.fail {
      background: #fee2e2;
      color: #991b1b;
    }
    .timestamp {
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🧪 OpenClaw Dashboard API 测试报告</h1>
    <p class="timestamp">生成时间: ${new Date().toLocaleString("zh-CN")}</p>
    
    <div class="summary">
      <div class="card">
        <div class="stat total">${total}</div>
        <div class="stat-label">总测试数</div>
      </div>
      <div class="card">
        <div class="stat pass">${passed}</div>
        <div class="stat-label">通过</div>
      </div>
      <div class="card">
        <div class="stat fail">${failed}</div>
        <div class="stat-label">失败</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>测试用例</th>
          <th>状态</th>
          <th>耗时</th>
          <th>消息</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>
</body>
</html>`;
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 主测试函数
async function runTests() {
  console.log("🧪 OpenClaw Dashboard SQLite API 测试");
  console.log("=".repeat(50));
  console.log(`API 地址: ${BASE_URL}\n`);

  let baseId = null;

  // 测试 1: POST /api/base-info — 插入新项目
  await testApi("1. POST /api/base-info — 插入新项目", async () => {
    const response = await fetch(`${API_BASE}/api/base-info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        record_id: "test_001",
        project: "test-project",
        type: "feature",
        status: "active",
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`HTTP ${response.status}: ${err}`);
    }

    const data = await response.json();
    if (!data.id) {
      throw new Error("返回数据缺少 id 字段");
    }

    baseId = data.id;
    return { message: `创建成功, id=${data.id}`, data };
  });

  // 测试 2: GET /api/task-board — 查询任务列表
  await testApi("2. GET /api/task-board — 查询任务列表", async () => {
    const response = await fetch(`${API_BASE}/api/task-board`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("返回数据不是数组");
    }

    return { message: `返回 ${data.length} 条记录`, data };
  });

  // 测试 3: PUT /api/task-board/:id — 更新任务状态
  // 先创建测试数据
  if (baseId) {
    // 创建任务
    const createResponse = await fetch(`${API_BASE}/api/task-board`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        base_id: baseId,
        title: "测试任务",
        description: "测试描述",
        status: "待开发",
        priority: "normal",
      }),
    });

    const taskData = await createResponse.json();
    const taskId = taskData.id;

    if (taskId) {
      await testApi("3. PUT /api/task-board/:id — 更新任务状态", async () => {
        const response = await fetch(`${API_BASE}/api/task-board/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "开发中",
            priority: "P0",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (data.status !== "开发中" || data.priority !== "P0") {
          throw new Error(
            `状态更新失败: status=${data.status}, priority=${data.priority}`,
          );
        }

        return { message: `更新成功`, data };
      });
    }
  }

  // 测试 4: GET /api/task-board?base_id=1 — 按��目查询任务
  if (baseId) {
    await testApi(
      "4. GET /api/task-board?base_id — 按项目查询任务",
      async () => {
        const response = await fetch(
          `${API_BASE}/api/task-board?base_id=${baseId}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("返回数据不是数组");
        }

        return { message: `返回 ${data.length} 条记录`, data };
      },
    );
  }

  // 测试 5: GET /api/requirement-pool?base_id=1 — 查询需求池
  if (baseId) {
    await testApi(
      "5. GET /api/requirement-pool?base_id — 查询需求池",
      async () => {
        const response = await fetch(
          `${API_BASE}/api/requirement-pool?base_id=${baseId}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("返回数据不是数组");
        }

        return { message: `返回 ${data.length} 条记录`, data };
      },
    );
  }

  // 生成报告
  const report = generateHtmlReport();

  // 保存报告
  const fs = await import("fs");
  const reportPath = "./test-report.html";
  fs.writeFileSync(reportPath, report);

  console.log("\n" + "=".repeat(50));
  console.log(`📊 测试完成: ${testResults.length} 个测试`);
  console.log(
    `   ✅ 通过: ${testResults.filter((r) => r.status === "PASS").length}`,
  );
  console.log(
    `   ❌ 失败: ${testResults.filter((r) => r.status === "FAIL").length}`,
  );
  console.log(`📄 报告已保存: ${reportPath}`);

  // 退出码
  const hasFailed = testResults.some((r) => r.status === "FAIL");
  process.exit(hasFailed ? 1 : 0);
}

// 运行测试
runTests().catch((err) => {
  console.error("❌ 测试执行失败:", err);
  process.exit(1);
});
