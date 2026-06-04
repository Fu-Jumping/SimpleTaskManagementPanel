# 接口契约

本文档用于约定前后端接口。前端 Mock 数据、后端接口实现和测试验收均以本文档为准。若接口路径、请求字段、响应字段或状态码发生变化，必须同步更新本文档。

## 一、基础约定

后端基础地址：

```text
http://localhost:3000
```

接口前缀：

```text
/api
```

认证方式：

```text
Authorization: Bearer <token>
```

统一成功响应：

```json
{
  "success": true,
  "data": {}
}
```

统一失败响应：

```json
{
  "success": false,
  "message": "错误信息"
}
```

常用状态码：

| 状态码 | 说明 |
| --- | --- |
| `200` | 请求成功 |
| `201` | 创建成功 |
| `400` | 请求参数错误 |
| `401` | 未登录或 token 无效 |
| `403` | 无权限访问该资源 |
| `404` | 资源不存在 |
| `500` | 服务端错误 |

## 二、数据模型

### 1. 用户 User

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 用户 ID |
| `username` | string | 用户名 |
| `passwordHash` | string | 密码哈希，仅后端保存，不返回给前端 |
| `createdAt` | string | 创建时间，ISO 字符串 |

前端可见用户信息：

```json
{
  "id": "user_001",
  "username": "test"
}
```

### 2. 任务 Task

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 任务 ID |
| `userId` | string | 是 | 所属用户 ID，后端内部使用 |
| `title` | string | 是 | 任务标题，建议 1-50 个字符 |
| `description` | string | 否 | 任务描述，建议不超过 500 个字符 |
| `dueDate` | string | 否 | 截止日期，格式 `YYYY-MM-DD` |
| `priority` | string | 是 | 优先级：`high`、`medium`、`low` |
| `status` | string | 是 | 状态：`todo`、`doing`、`done` |
| `order` | number | 是 | 列内排序，数值越小越靠前 |
| `createdAt` | string | 是 | 创建时间，ISO 字符串 |
| `updatedAt` | string | 是 | 更新时间，ISO 字符串 |

前端任务示例：

```json
{
  "id": "task_001",
  "title": "完成接口文档",
  "description": "整理前后端需要共同遵守的接口字段",
  "dueDate": "2026-06-10",
  "priority": "high",
  "status": "todo",
  "order": 1,
  "createdAt": "2026-06-04T10:00:00.000Z",
  "updatedAt": "2026-06-04T10:00:00.000Z"
}
```

## 三、认证接口

### 0. 健康检查

```text
GET /api/health
```

成功响应：

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

说明：

- 该接口用于确认后端服务是否正常启动。
- 不需要登录认证。

### 1. 注册

```text
POST /api/auth/register
```

请求体：

```json
{
  "username": "test",
  "password": "123456"
}
```

字段规则：

| 字段 | 规则 |
| --- | --- |
| `username` | 必填，建议 3-20 个字符，不允许重复 |
| `password` | 必填，建议至少 6 个字符 |

成功响应：

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_001",
      "username": "test"
    },
    "token": "jwt-token"
  }
}
```

失败响应示例：

```json
{
  "success": false,
  "message": "用户名已存在"
}
```

说明：

- 注册成功后可以直接返回 token，让前端进入看板页。
- 新用户首次登录或注册后，需要生成一组示例任务。

### 2. 登录

```text
POST /api/auth/login
```

请求体：

```json
{
  "username": "test",
  "password": "123456"
}
```

成功响应：

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_001",
      "username": "test"
    },
    "token": "jwt-token"
  }
}
```

失败响应示例：

```json
{
  "success": false,
  "message": "用户名或密码错误"
}
```

说明：

- JWT 有效期为 7 天。
- 密码必须使用 bcrypt 哈希存储，不能明文保存。

### 3. 获取当前用户

```text
GET /api/auth/me
```

请求头：

```text
Authorization: Bearer <token>
```

成功响应：

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_001",
      "username": "test"
    }
  }
}
```

说明：

- 该接口不是题目硬性要求，但可用于前端刷新后恢复用户状态。
- 如果实现成本较高，前端也可以从本地 token 和登录返回信息恢复状态。

## 四、任务接口

以下接口均需要登录认证。

### 1. 获取任务列表

```text
GET /api/tasks
```

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `keyword` | string | 否 | 按标题和描述搜索 |
| `status` | string | 否 | `todo`、`doing`、`done` |
| `priority` | string | 否 | `high`、`medium`、`low` |

请求示例：

```text
GET /api/tasks?keyword=文档&status=todo&priority=high
```

成功响应：

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task_001",
        "title": "完成接口文档",
        "description": "整理前后端需要共同遵守的接口字段",
        "dueDate": "2026-06-10",
        "priority": "high",
        "status": "todo",
        "order": 1,
        "createdAt": "2026-06-04T10:00:00.000Z",
        "updatedAt": "2026-06-04T10:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

说明：

- 只返回当前登录用户的任务。
- 默认按 `status`、`priority` 或页面需要的列分组由前端处理。
- 同一列内按 `order` 升序展示。

### 2. 新增任务

```text
POST /api/tasks
```

请求体：

```json
{
  "title": "完成前端页面",
  "description": "完成登录页、看板页和数据中心",
  "dueDate": "2026-06-12",
  "priority": "medium",
  "status": "todo"
}
```

成功响应：

```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task_002",
      "title": "完成前端页面",
      "description": "完成登录页、看板页和数据中心",
      "dueDate": "2026-06-12",
      "priority": "medium",
      "status": "todo",
      "order": 0,
      "createdAt": "2026-06-04T11:00:00.000Z",
      "updatedAt": "2026-06-04T11:00:00.000Z"
    }
  }
}
```

说明：

- 新任务插入对应状态列顶部。
- `createdAt`、`updatedAt`、`order` 由后端生成。

### 3. 修改任务

```text
PATCH /api/tasks/:id
```

请求体示例：

```json
{
  "title": "完成前端页面和接口接入",
  "description": "完成主要页面并接入真实接口",
  "dueDate": "2026-06-13",
  "priority": "high",
  "status": "doing"
}
```

成功响应：

```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task_002",
      "title": "完成前端页面和接口接入",
      "description": "完成主要页面并接入真实接口",
      "dueDate": "2026-06-13",
      "priority": "high",
      "status": "doing",
      "order": 0,
      "createdAt": "2026-06-04T11:00:00.000Z",
      "updatedAt": "2026-06-04T12:00:00.000Z"
    }
  }
}
```

说明：

- 可用于编辑任务内容、修改状态或修改优先级。
- 只能修改当前登录用户自己的任务。

### 4. 删除任务

```text
DELETE /api/tasks/:id
```

成功响应：

```json
{
  "success": true,
  "data": {
    "id": "task_002"
  }
}
```

说明：

- 删除前端需要统一弹出确认框。
- 按钮删除和 Del 快捷键删除都调用同一删除逻辑。

### 5. 批量排序

```text
PATCH /api/tasks/reorder
```

请求体：

```json
{
  "items": [
    {
      "id": "task_001",
      "status": "todo",
      "priority": "high",
      "order": 0
    },
    {
      "id": "task_002",
      "status": "doing",
      "priority": "medium",
      "order": 1
    }
  ]
}
```

成功响应：

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task_001",
        "title": "完成接口文档",
        "description": "整理前后端需要共同遵守的接口字段",
        "dueDate": "2026-06-10",
        "priority": "high",
        "status": "todo",
        "order": 0,
        "createdAt": "2026-06-04T10:00:00.000Z",
        "updatedAt": "2026-06-04T12:30:00.000Z"
      }
    ]
  }
}
```

说明：

- 状态看板拖拽时，可修改 `status` 和 `order`。
- 优先级看板拖拽时，只修改 `priority` 和 `order`，不能修改 `status`。
- 前端负责根据当前视图传入正确字段，后端需要校验任务归属和字段合法性。

## 五、导入导出接口

### 1. 导入任务

```text
POST /api/tasks/import
```

请求体：

```json
{
  "tasks": [
    {
      "title": "导入任务",
      "description": "从 JSON 文件导入",
      "dueDate": "2026-06-15",
      "priority": "low",
      "status": "todo"
    }
  ]
}
```

成功响应：

```json
{
  "success": true,
  "data": {
    "imported": 1,
    "skipped": 0,
    "tasks": [
      {
        "id": "task_010",
        "title": "导入任务",
        "description": "从 JSON 文件导入",
        "dueDate": "2026-06-15",
        "priority": "low",
        "status": "todo",
        "order": 0,
        "createdAt": "2026-06-04T13:00:00.000Z",
        "updatedAt": "2026-06-04T13:00:00.000Z"
      }
    ]
  }
}
```

说明：

- 导入方式为追加，不覆盖已有任务。
- 不做导入前预览。
- 非法项跳过。
- 前端只展示成功数量和跳过数量。

### 2. 导出任务

```text
GET /api/tasks/export
```

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `keyword` | string | 否 | 与任务列表筛选一致 |
| `status` | string | 否 | 与任务列表筛选一致 |
| `priority` | string | 否 | 与任务列表筛选一致 |

成功响应：

```json
{
  "success": true,
  "data": {
    "exportedAt": "2026-06-04T14:00:00.000Z",
    "count": 1,
    "tasks": [
      {
        "id": "task_001",
        "title": "完成接口文档",
        "description": "整理前后端需要共同遵守的接口字段",
        "dueDate": "2026-06-10",
        "priority": "high",
        "status": "todo",
        "order": 0,
        "createdAt": "2026-06-04T10:00:00.000Z",
        "updatedAt": "2026-06-04T12:30:00.000Z"
      }
    ]
  }
}
```

说明：

- 默认导出当前筛选结果。
- 前端可将 `data` 保存为 JSON 文件。

## 六、示例数据接口

### 1. 追加示例任务

```text
POST /api/tasks/sample
```

成功响应：

```json
{
  "success": true,
  "data": {
    "created": 6,
    "tasks": []
  }
}
```

说明：

- 该接口用于用户菜单中的“生成示例数据”。
- 示例数据只追加，不覆盖已有任务。
- 新用户首次登录或注册后，也可以复用同一套示例任务生成逻辑。
- 如果时间不足，该接口入口可以隐藏。

## 七、校验规则

任务校验：

| 字段 | 规则 |
| --- | --- |
| `title` | 必填，建议 1-50 个字符 |
| `description` | 可选，建议不超过 500 个字符 |
| `dueDate` | 可选；如填写，必须是合法日期字符串，推荐 `YYYY-MM-DD` |
| `priority` | 必须是 `high`、`medium`、`low` |
| `status` | 必须是 `todo`、`doing`、`done` |
| `order` | 后端生成或在排序接口中更新，必须是数字 |

认证校验：

| 场景 | 处理 |
| --- | --- |
| 未带 token | 返回 `401` |
| token 无效或过期 | 返回 `401` |
| 访问其他用户任务 | 返回 `404` 或 `403` |
| 用户名重复 | 返回 `400` |
| 密码错误 | 返回 `400` 或 `401` |

## 八、前端字段映射

状态显示：

| 接口值 | 页面文案 |
| --- | --- |
| `todo` | 待处理 |
| `doing` | 进行中 |
| `done` | 已完成 |

优先级显示：

| 接口值 | 页面文案 |
| --- | --- |
| `high` | 高 |
| `medium` | 中 |
| `low` | 低 |
