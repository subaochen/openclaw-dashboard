# OpenClaw Dashboard API 使用说明

## 概述

OpenClaw Dashboard 提供了 RESTful API 接口，用于管理任务看板、需求分析池和基础信息数据。所有数据存储在本地 SQLite 数据库中。

## 服务地址

- **本地访问**: http://localhost:33333
- **局域网访问**: http://<本机IP>:33333
- **健康检查**: http://localhost:33333/health
- **Dashboard**: http://localhost:33333/

## 基础信息

### 端口配置
- 默认端口：33333
- 监听地址：0.0.0.0（所有 IP 地址）
- 服务进程：systemd user level

### 启动/停止服务
```bash
# 启动服务
systemctl --user start openclaw-dashboard

# 停止服务
systemctl --user stop openclaw-dashboard

# 查看状态
systemctl --user status openclaw-dashboard

# 查看日志
journalctl --user -u openclaw-dashboard -f

# 重启服务
systemctl --user restart openclaw-dashboard
```

## API 端点规范

所有 API 端点都使用标准 JSON 格式，支持 CORS 跨域访问。

### 响应格式

**成功响应**：
```json
{
  "id": 1,
  "field1": "value1",
  "field2": "value2"
}
```

**错误响应**：
```json
{
  "error": "错误消息"
}
```

---

## 1. 基础信息 API

### 1.1 列举基础信息

**请求**
```bash
GET /api/base-info
```

**响应**
```json
[
  {
    "id": 1,
    "record_id": "rec-001",
    "project": "openclaw-dashboard",
    "type": "dashboard",
    "status": "active",
    "created_at": "2026-04-25 10:00:00",
    "updated_at": "2026-04-25 10:00:00"
  }
]
```

### 1.2 创建基础信息

**请求**
```bash
POST /api/base-info
Content-Type: application/json

{
  "record_id": "rec-001",
  "project": "openclaw-dashboard",
  "type": "dashboard"
}
```

**响应**
```json
{
  "id": 1,
  "record_id": "rec-001",
  "project": "openclaw-dashboard",
  "type": "dashboard",
  "status": "active",
  "created_at": "2026-04-25 10:00:00",
  "updated_at": "2026-04-25 10:00:00"
}
```

### 1.3 获取单个基础信息

**请求**
```bash
GET /api/base-info/:id
```

**响应**
```json
{
  "id": 1,
  "record_id": "rec-001",
  "project": "openclaw-dashboard",
  "type": "dashboard",
  "status": "active",
  "created_at": "2026-04-25 10:00:00",
  "updated_at": "2026-04-25 10:00:00"
}
```

### 1.4 更新基础信息

**请求**
```bash
PUT /api/base-info/:id
Content-Type: application/json

{
  "record_id": "rec-new-001",
  "status": "archived"
}
```

**响应**
```json
{
  "id": 1,
  "record_id": "rec-new-001",
  "project": "openclaw-dashboard",
  "type": "dashboard",
  "status": "archived",
  "created_at": "2026-04-25 10:00:00",
  "updated_at": "2026-04-25 11:00:00"
}
```

### 1.5 删除基础信息

**请求**
```bash
DELETE /api/base-info/:id
```

**响应**
```json
{
  "deleted": true
}
```

---

## 2. 需求分析池 API

### 2.1 列举需求分析池

**请求**
```bash
GET /api/requirement-pool
```

**响应**
```json
[
  {
    "id": 1,
    "base_id": 1,
    "title": "新功能需求",
    "description": "这是一个新功能需求",
    "priority": "high",
    "category": "feature",
    "owner": "zhangsan",
    "created_at": "2026-04-25 10:00:00",
    "updated_at": "2026-04-25 10:00:00"
  }
]
```

### 2.2 创建需求分析池

**请求**
```bash
POST /api/requirement-pool
Content-Type: application/json

{
  "base_id": 1,
  "title": "新功能需求",
  "description": "这是一个新功能需求",
  "priority": "high",
  "category": "feature",
  "owner": "zhangsan"
}
```

**响应**
```json
{
  "id": 1,
  "base_id": 1,
  "title": "新功能需求",
  "description": "这是一个新功能需求",
  "priority": "high",
  "category": "feature",
  "owner": "zhangsan",
  "created_at": "2026-04-25 10:00:00",
  "updated_at": "2026-04-25 10:00:00"
}
```

### 2.3 获取单个需求

**请求**
```bash
GET /api/requirement-pool/:id
```

### 2.4 更新需求

**请求**
```bash
PUT /api/requirement-pool/:id
Content-Type: application/json

{
  "title": "更新后的需求标题",
  "priority": "normal"
}
```

### 2.5 删除需求

**请求**
```bash
DELETE /api/requirement-pool/:id
```

---

## 3. 任务看板 API

### 3.1 列举任务看板

**请求**
```bash
GET /api/task-board
```

**响应**
```json
[
  {
    "id": 1,
    "base_id": 1,
    "title": "修复 Bug",
    "description": "修复某某 Bug",
    "status": "pending",
    "priority": "high",
    "assignee": "lisi",
    "start_time": "2026-04-25 09:00:00",
    "deadline": "2026-04-26 18:00:00",
    "tags": "bug,支付",
    "created_at": "2026-04-25 10:00:00",
    "updated_at": "2026-04-25 10:00:00"
  }
]
```

### 3.2 创建任务

**请求**
```bash
POST /api/task-board
Content-Type: application/json

{
  "base_id": 1,
  "title": "修复 Bug",
  "description": "修复某某 Bug",
  "status": "pending",
  "priority": "high",
  "assignee": "lisi",
  "start_time": "2026-04-25 09:00:00",
  "deadline": "2026-04-26 18:00:00",
  "tags": "bug,支付"
}
```

**响应**
```json
{
  "id": 1,
  "base_id": 1,
  "title": "修复 Bug",
  "description": "修复某某 Bug",
  "status": "pending",
  "priority": "high",
  "assignee": "lisi",
  "start_time": "2026-04-25 09:00:00",
  "deadline": "2026-04-26 18:00:00",
  "tags": "bug,支付",
  "created_at": "2026-04-25 10:00:00",
  "updated_at": "2026-04-25 10:00:00"
}
```

### 3.3 获取单个任务

**请求**
```bash
GET /api/task-board/:id
```

### 3.4 更新任务

**请求**
```bash
PUT /api/task-board/:id
Content-Type: application/json

{
  "title": "更新后的任务标题",
  "status": "in-progress"
}
```

### 3.5 删除任务

**请求**
```bash
DELETE /api/task-board/:id
```

---

## 4. 状态和优先级枚举

### 4.1 任务状态 (status)
- `pending` - 待处理
- `in-progress` - 进行中
- `review` - 待审核
- `done` - 已完成

### 4.2 优先级 (priority)
- `low` - 低
- `normal` - 中
- `high` - 高
- `critical` - 紧急

### 4.3 需求类别 (category)
- `feature` - 新功能
- `bug` - Bug 修复
- `refactor` - 代码重构
- `document` - 文档完善

---

## 5. 完整使用示例

### 5.1 创建完整任务流程

```bash
# Step 1: 创建基础信息
curl -s -X POST http://localhost:33333/api/base-info \
  -H "Content-Type: application/json" \
  -d '{"record_id": "task-001", "project": "openclaw-dashboard", "type": "dashboard"}'

# Step 2: 创建需求分析池
curl -s -X POST http://localhost:33333/api/requirement-pool \
  -H "Content-Type: application/json" \
  -d '{
    "base_id": 1,
    "title": "新增用户统计功能",
    "description": "统计每天的活跃用户数",
    "priority": "high",
    "category": "feature",
    "owner": "zhangsan"
  }'

# Step 3: 创建任务看板
curl -s -X POST http://localhost:33333/api/task-board \
  -H "Content-Type: application/json" \
  -d '{
    "base_id": 1,
    "title": "开发用户统计功能",
    "description": "实现用户统计页面和后端 API",
    "status": "in-progress",
    "priority": "high",
    "assignee": "lisi",
    "start_time": "2026-04-25 09:00:00",
    "deadline": "2026-04-28 18:00:00",
    "tags": "feature,statistics"
  }'
```

### 5.2 批量删除数据

```bash
# 删除所有任务（先删引用表）
curl -s -X DELETE http://localhost:33333/api/task-board/1
curl -s -X DELETE http://localhost:33333/api/task-board/2

# 删除所有需求
curl -s -X DELETE http://localhost:33333/api/requirement-pool/1
curl -s -X DELETE http://localhost:33333/api/requirement-pool/2

# 删除所有基础信息（后删主表）
curl -s -X DELETE http://localhost:33333/api/base-info/1
curl -s -X DELETE http://localhost:33333/api/base-info/2
```

### 5.3 使用 jq 格式化输出

```bash
# 安装 jq（Ubuntu/Debian）
sudo apt-get install jq

# 格式化输出
curl -s http://localhost:33333/api/base-info | jq .
curl -s http://localhost:33333/api/task-board | jq .
curl -s http://localhost:33333/api/requirement-pool | jq .
```

---

## 6. Agent 集成示例

### 6.1 OpenCode 创建任务

```javascript
// Node.js/JavaScript
const fetch = require('node-fetch');

async function createTask(title, description, status, priority, assignee) {
  const response = await fetch('http://localhost:33333/api/task-board', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      description,
      status,
      priority,
      assignee
    })
  });
  
  return await response.json();
}

// 调用示例
const task = await createTask(
  '修复支付超时问题',
  '用户支付后订单状态未正确更新',
  'in-progress',
  'high',
  'zhangsan'
);
console.log('任务创建成功:', task);
```

### 6.2 CTO 助理创建需求

```python
# Python
import requests

def create_requirement(title, description, priority, category, owner):
    url = 'http://localhost:33333/api/requirement-pool'
    payload = {
        'title': title,
        'description': description,
        'priority': priority,
        'category': category,
        'owner': owner
    }
    
    response = requests.post(url, json=payload)
    return response.json()

# 调用示例
requirement = create_requirement(
    '新增数据导出功能',
    '支持将统计数据导出为 Excel 文件',
    'high',
    'feature',
    'lisi'
)
print('需求创建成功:', requirement)
```

### 6.3 Deploy Agent 更新任务状态

```bash
# Bash 脚本
#!/bin/bash

TASK_ID=$1
NEW_STATUS=$2
API_URL="http://localhost:33333/api/task-board"

# 更新任务状态
curl -s -X PUT "${API_URL}/${TASK_ID}" \
  -H "Content-Type: application/json" \
  -d "{\"status\": \"${NEW_STATUS}\"}"

echo ""
```

---

## 7. 数据库结构

### 7.1 base_info 表（基础信息）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| record_id | TEXT | 唯一标识符 |
| project | TEXT | 项目名 |
| type | TEXT | 类型 |
| status | TEXT | 状态，默认 'active' |
| created_at | TEXT | 创建时间 |
| updated_at | TEXT | 更新时间 |

### 7.2 requirement_pool 表（需求分析池）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| base_id | INTEGER | 外键，关联 base_info |
| title | TEXT | 标题 |
| description | TEXT | 描述 |
| priority | TEXT | 优先级 |
| category | TEXT | 类别 |
| owner | TEXT | 负责人 |
| created_at | TEXT | 创建时间 |
| updated_at | TEXT | 更新时间 |

### 7.3 task_board 表（任务看板）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| base_id | INTEGER | 外键，关联 base_info |
| title | TEXT | 标题 |
| description | TEXT | 描述 |
| status | TEXT | 状态 |
| priority | TEXT | 优先级 |
| assignee | TEXT | 负责人 |
| start_time | TEXT | 开始时间 |
| deadline | TEXT | 截止时间 |
| tags | TEXT | 标签 |
| created_at | TEXT | 创建时间 |
| updated_at | TEXT | 更新时间 |

---

## 8. 常见问题

### 8.1 服务无法启动

```bash
# 检查服务状态
systemctl --user status openclaw-dashboard

# 查看日志
journalctl --user -u openclaw-dashboard -n 50

# 重启服务
systemctl --user restart openclaw-dashboard
```

### 8.2 数据库损坏

```bash
# 停止服务
systemctl --user stop openclaw-dashboard

# 删除数据库（数据会丢失！）
rm /home/sbc/git/openclaw-dashboard/data/tasks.db

# 重启服务（会自动重建数据库）
systemctl --user start openclaw-dashboard
```

### 8.3 API 返回 404

检查 URL 路径：
- 正确：`/api/base-info`
- 错误：`/api/baseinfo`（缺少连字符）

### 8.4 API 返回 500

检查：
1. 数据库是否存在：`ls /home/sbc/git/openclaw-dashboard/data/tasks.db`
2. 服务是否运行：`systemctl --user status openclaw-dashboard`
3. 端口是否被占用：`ss -tlnp | grep 33333`

---

## 9. 监控和健康检查

### 9.1 健康检查

```bash
curl -s http://localhost:33333/health | jq .
```

**响应示例**
```json
{
  "status": "ok",
  "timestamp": "2026-04-25T12:00:00.000Z"
}
```

### 9.2 设置监控

```bash
# 每分钟检查一次
while true; do
  if ! curl -s http://localhost:33333/health | grep -q '"status":"ok"'; then
    echo "服务异常！" | mail -s "Dashboard 服务异常" admin@example.com
  fi
  sleep 60
done
```

---

## 附录

### 完整 API 端点列表

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/base-info` | GET | 列举基础信息 |
| `/api/base-info` | POST | 创建基础信息 |
| `/api/base-info/:id` | GET | 获取基础信息 |
| `/api/base-info/:id` | PUT | 更新基础信息 |
| `/api/base-info/:id` | DELETE | 删除基础信息 |
| `/api/requirement-pool` | GET | 列举需求池 |
| `/api/requirement-pool` | POST | 创建需求 |
| `/api/requirement-pool/:id` | GET | 获取需求 |
| `/api/requirement-pool/:id` | PUT | 更新需求 |
| `/api/requirement-pool/:id` | DELETE | 删除需求 |
| `/api/task-board` | GET | 列举任务 |
| `/api/task-board` | POST | 创建任务 |
| `/api/task-board/:id` | GET | 获取任务 |
| `/api/task-board/:id` | PUT | 更新任务 |
| `/api/task-board/:id` | DELETE | 删除任务 |
| `/health` | GET | 健康检查 |

### 版本信息

- **API Version**: 1.0
- **Dashboard Version**: 1.0
- **Database**: SQLite 3
- **Created**: 2026-04-25
