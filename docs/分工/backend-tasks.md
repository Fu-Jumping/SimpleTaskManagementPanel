# 后端任务单

本文档给后端负责人 A/B 使用。后端开发以 `docs/api.md` 为准，接口变更必须同步更新接口文档，并通知前端和测试报告负责人。

## 一、职责范围

后端负责人 A：接口与认证主责。

- Express 服务启动
- 注册登录接口
- JWT 认证
- 任务 CRUD
- 批量排序
- 导入导出接口
- 接口说明维护

后端负责人 B：数据与验证主责。

- lowdb 数据结构
- 用户任务隔离
- 示例数据
- 数据校验
- 接口测试
- 协助修复后端问题

开发分支：

```text
feature/server
```

说明：

- A/B 是责任主次，不是严格文件边界。
- 两名后端同学可以共同修改后端代码。
- 阶段性可合并回 `main`，但合并前必须确认后端能启动。

## 二、技术要求

必须使用：

- Node.js
- Express
- lowdb
- JWT
- bcrypt

建议依赖：

- `cors`
- `nanoid`
- `dotenv`
- `vitest`
- `supertest`

## 三、建议目录

```text
server/
├── src/
│   ├── app.js
│   ├── index.js
│   ├── db/
│   │   └── index.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── taskService.js
│   │   └── sampleService.js
│   └── utils/
│       ├── response.js
│       └── validators.js
├── db.json
└── package.json
```

可根据实际实现调整，但需要保持路由、中间件、数据访问和工具函数边界清晰。

## 四、数据结构

`db.json` 建议结构：

```json
{
  "users": [],
  "tasks": []
}
```

用户示例：

```json
{
  "id": "user_001",
  "username": "test",
  "passwordHash": "$2b$10$hash",
  "createdAt": "2026-06-04T10:00:00.000Z"
}
```

任务示例：

```json
{
  "id": "task_001",
  "userId": "user_001",
  "title": "完成接口文档",
  "description": "整理前后端需要共同遵守的接口字段",
  "dueDate": "2026-06-10",
  "priority": "high",
  "status": "todo",
  "order": 0,
  "createdAt": "2026-06-04T10:00:00.000Z",
  "updatedAt": "2026-06-04T10:00:00.000Z"
}
```

要求：

- 密码不得明文保存。
- 任务必须带 `userId`。
- 查询、修改、删除任务时必须校验用户归属。
- 返回给前端的任务不需要包含 `userId`。

## 五、接口任务

### 1. 认证接口

需要实现：

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`，可选但建议实现

要求：

- 用户名不能重复。
- 密码使用 bcrypt 哈希。
- 登录成功返回用户信息和 token。
- token 有效期 7 天。
- 认证失败返回统一错误格式。

### 2. 任务 CRUD

需要实现：

- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

要求：

- 所有任务接口必须校验登录态。
- `GET /api/tasks` 支持 `keyword`、`status`、`priority` 查询参数。
- `POST /api/tasks` 新建任务插入对应状态列顶部。
- `PATCH /api/tasks/:id` 支持修改内容、状态、优先级。
- `DELETE /api/tasks/:id` 只能删除当前用户自己的任务。

### 3. 批量排序接口

需要实现：

- `PATCH /api/tasks/reorder`

要求：

- 接收任务 `id`、`status`、`priority`、`order`。
- 校验所有任务属于当前用户。
- 更新 `order` 和需要改变的列字段。
- 状态看板拖拽可改变 `status`。
- 优先级看板拖拽可改变 `priority`。
- 前端会负责不在优先级视图中改变 `status`，后端仍需校验字段合法。

### 4. 导入导出接口

需要实现：

- `POST /api/tasks/import`
- `GET /api/tasks/export`

导入要求：

- 追加导入。
- 不覆盖已有任务。
- 非法项跳过。
- 返回成功数量和跳过数量。

导出要求：

- 支持按当前筛选条件导出。
- 返回 `{ exportedAt, count, tasks }`。

### 5. 示例数据接口

建议实现：

- `POST /api/tasks/sample`

要求：

- 新用户首次登录或注册后生成示例任务。
- 用户菜单点击生成示例数据时追加任务。
- 不覆盖已有任务。

如果时间不足，该接口可降级。

## 六、校验规则

用户：

| 字段 | 规则 |
| --- | --- |
| `username` | 必填，建议 3-20 个字符，不能重复 |
| `password` | 必填，建议至少 6 个字符 |

任务：

| 字段 | 规则 |
| --- | --- |
| `title` | 必填，建议 1-50 个字符 |
| `description` | 可选，建议不超过 500 个字符 |
| `dueDate` | 可选；填写时必须是合法日期 |
| `priority` | 只能是 `high`、`medium`、`low` |
| `status` | 只能是 `todo`、`doing`、`done` |
| `order` | 必须是数字 |

错误处理：

- 参数错误返回 `400`。
- 未登录或 token 无效返回 `401`。
- 访问不存在或不属于自己的任务返回 `404` 或 `403`。
- 服务端异常返回 `500`。

## 七、测试任务

后端至少验证：

- 注册成功。
- 重复用户名注册失败。
- 登录成功。
- 密码错误登录失败。
- 未带 token 访问任务接口失败。
- 新增任务成功。
- 查询任务只返回当前用户任务。
- 编辑任务成功。
- 删除任务成功。
- 状态拖拽排序成功。
- 优先级拖拽排序成功。
- 导入合法任务成功。
- 导入非法任务跳过。
- 导出结果格式正确。

建议使用 Supertest 编写关键接口测试。

## 八、接口文档维护

后端 A 主责维护 `docs/api.md`。

需要同步更新文档的情况：

- 新增接口。
- 删除接口。
- 修改接口路径。
- 修改请求字段。
- 修改响应字段。
- 修改错误格式。
- 修改枚举值。

接口变更流程：

1. 后端 A/B 先确认改动必要性。
2. 通知前端负责人和测试与报告负责人。
3. 修改代码。
4. 更新 `docs/api.md`。
5. 自测通过后提交。

## 九、后端自测清单

提交前至少确认：

- 后端项目可以启动。
- `GET /api/tasks` 未登录时不能访问。
- 注册和登录返回格式符合文档。
- token 可访问任务接口。
- 任务 CRUD 正常。
- 不同用户任务隔离。
- 拖拽排序后刷新仍保留。
- 导入导出格式符合文档。
- `db.json` 不保存明文密码。

## 十、交付物

需要交付：

- `server/` 后端项目代码。
- `db.json` 初始结构。
- 接口说明文档更新。
- 后端启动说明。
- 后端接口测试或验证记录。
- 已知未完成问题列表。

