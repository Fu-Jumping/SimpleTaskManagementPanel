# AGENTS.md

本文档用于让组员各自使用的 AI 快速接手项目。所有 AI 在修改本仓库前，应先阅读本文档，再按角色阅读对应任务单和接口文档。

## 一、通用要求

- 默认使用简体中文回复。
- 先阅读相关文档，再动代码，不要脱离项目已有规划自由发挥。
- 不要主动提交、推送或创建 PR，除非使用者明确要求。
- 不要删除或覆盖其他成员已有改动；如发现同一文件已有改动，先读懂后再继续。
- 修改接口路径、字段、响应结构或枚举值时，必须同步更新 `docs/api.md`。
- 报告和正式说明中不主动提 AI，只按成员分工描述实际工作。
- 详细实施计划文档只作为本地临时工作材料，默认放在已忽略的 `docs/计划/` 或其他被忽略路径中，不进入版本跟踪和正式提交。

## 二、项目概况

项目名称：个人任务看板。

项目类型：作业2，简易任务管理面板，功能形式接近 Trello。

核心目标：

- 完成个人待办任务管理系统。
- 保证演示链路稳定。
- 前后端同仓开发。
- 原型只作为视觉参考，正式代码从 Vue + Express 骨架继续实现。

当前完成状态：

- 已完成项目文档整理。
- 已完成前后端最小可运行骨架。
- `client/` 已有 Vue 3 + Vite 占位页。
- `server/` 已有 Express 应用和 `GET /api/health` 健康检查接口。
- 当前还没有实现登录注册、任务 CRUD、拖拽看板、搜索筛选、导入导出等业务功能。

## 三、技术栈

前端：

- Vue 3
- Vite
- Vue Router
- Pinia
- Ant Design Vue
- vuedraggable
- Vitest

后端：

- Node.js
- Express
- lowdb
- JWT
- bcrypt
- cors
- nanoid
- Vitest
- Supertest

工程：

- 根目录 npm scripts
- concurrently
- 前后端同仓，目录为 `client/` 和 `server/`

## 四、重要文档入口

所有角色都应先读：

- `README.md`：项目入口、启动方式、目录结构。
- `docs/requirements.md`：需求范围、页面范围、验收标准、降级规则。
- `docs/api.md`：接口契约、数据字段、响应格式。
- `docs/design-reference.md`：原型目录和视觉参考说明。

按角色继续阅读：

- 前端负责人：`docs/分工/frontend-tasks.md`
- 后端负责人 A/B：`docs/分工/backend-tasks.md`
- 测试与报告负责人：`docs/分工/test-report-tasks.md`
- 全组分工：`docs/分工/分工说明.md`

归档材料：

- `docs/归档/` 保存早期题目和提问记录，已被 `.gitignore` 忽略，不作为正式文档入口。

## 五、目录结构与职责边界

```text
.
├── client/                 # 前端 Vue 项目
│   └── src/
│       ├── api/            # 前端请求封装
│       ├── components/     # 公共组件
│       ├── router/         # Vue Router
│       ├── stores/         # Pinia store
│       ├── styles/         # 全局样式
│       └── views/          # 页面视图
├── server/                 # 后端 Express 项目
│   └── src/
│       ├── db/             # lowdb 数据层
│       ├── middleware/     # 鉴权等中间件
│       ├── routes/         # 路由
│       ├── services/       # 业务服务
│       └── utils/          # 工具函数
├── design/                 # 视觉原型和导出素材
├── docs/                   # 正式项目文档
└── AGENTS.md
```

边界：

- `design/` 只作为视觉参考，不直接复制为正式代码。
- 前端业务代码主要放在 `client/src/`。
- 后端业务代码主要放在 `server/src/`。
- 接口契约以 `docs/api.md` 为准，不以个人理解为准。

## 六、常用命令

首次安装：

```bash
npm install
npm run install:all
```

同时启动前后端：

```bash
npm run dev
```

分别启动：

```bash
npm run dev:client
npm run dev:server
```

测试：

```bash
npm test
```

构建前端：

```bash
npm run build
```

健康检查：

```text
GET http://localhost:3000/api/health
```

预期响应：

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

端口：

- 前端：`5173`
- 后端：`3000`

## 七、接口与数据约定

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

认证：

```text
Authorization: Bearer <token>
```

任务核心字段：

- `id`
- `title`
- `description`
- `dueDate`
- `priority`：`high`、`medium`、`low`
- `status`：`todo`、`doing`、`done`
- `order`
- `createdAt`
- `updatedAt`

重要规则：

- 字段统一使用英文驼峰。
- 任务必须按用户隔离。
- 优先级看板拖拽只改变 `priority`，不能改变 `status`。
- 导入任务为追加导入，非法项跳过，不做导入前预览。
- 导出默认导出当前筛选任务。

## 八、前端 AI 接手提示

前端开发前必须阅读：

- `docs/requirements.md`
- `docs/api.md`
- `docs/design-reference.md`
- `docs/分工/frontend-tasks.md`

前端主要任务：

- 实现登录页、注册页、主看板页、任务抽屉、数据中心。
- 使用 Vue Router 做路由和登录访问控制。
- 使用 Pinia 管理用户、token、任务列表、筛选条件、选中任务。
- 使用 vuedraggable 实现状态看板和优先级看板拖拽。
- 使用 Ant Design Vue 组件实现表单、抽屉、确认弹窗、消息提示等稳定交互。
- 封装 `client/src/api/` 请求模块，统一注入 token、处理错误和响应解包。
- 支持按钮删除和 Del 快捷键删除，二者都必须弹出确认。

前端注意：

- 可以先按 `docs/api.md` 写 Mock 数据，但字段必须和接口契约一致。
- 页面视觉参考 `design/`，但不要直接复制导出代码。
- 移动端只要求基础可用，不能明显溢出。
- 如果接口失败，需要给出提示并保持页面可恢复。

## 九、后端 AI 接手提示

后端开发前必须阅读：

- `docs/api.md`
- `docs/requirements.md`
- `docs/分工/backend-tasks.md`

后端主要任务：

- 实现注册、登录、`GET /api/auth/me`。
- 使用 bcrypt 保存密码哈希。
- 使用 JWT 做 7 天有效期认证。
- 实现任务 CRUD。
- 实现 `PATCH /api/tasks/reorder` 批量排序。
- 实现导入、导出和示例数据接口。
- 使用 lowdb 保存 `users` 和 `tasks`。
- 所有任务接口必须校验当前登录用户，只能访问自己的任务。

后端注意：

- `GET /api/health` 已实现，除非必要不要破坏。
- 错误响应必须保持 `{ success: false, message }`。
- 密码不能明文存储。
- 如果调整接口，必须同步修改 `docs/api.md` 并通知前端和测试。

## 十、测试与报告 AI 接手提示

测试与报告开发前必须阅读：

- `README.md`
- `docs/requirements.md`
- `docs/api.md`
- `docs/分工/test-report-tasks.md`

测试重点：

- 注册、登录、退出登录。
- 任务新增、编辑、删除。
- 状态看板拖拽。
- 优先级看板拖拽，尤其确认不改变 `status`。
- 搜索筛选。
- 导入导出。
- 刷新后数据保留。
- 未登录和已登录路由跳转。

报告要求：

- 截图必须来自真实运行页面。
- 报告只写实际完成且可演示的功能。
- 不写已经隐藏或未完成的功能。
- 分工按个人任务记录贡献。

## 十一、分支与协作规则

固定分支：

- `feature/client`：前端负责人
- `feature/server`：后端负责人 A/B
- `feature/test-report`：测试与报告负责人

协作规则：

- 从 `main` 拉取对应功能分支。
- 阶段完成后可合并回 `main`。
- 合并前至少确认项目能启动，无明显运行报错。
- 谁提交谁负责，提交前自行检查。
- 冲突由对应开发者处理，必要时找规划与原型负责人判断。

## 十二、提交格式

以后提交信息统一使用“英文关键词 + 中文摘要 + 中文无序列表具体内容”。

格式：

```text
keyword: 中文摘要

- 中文具体内容
- 中文具体内容
```

常用英文关键词：

- `feat`：新增功能
- `fix`：修复问题
- `docs`：文档调整
- `chore`：工程配置或杂项
- `refactor`：重构
- `test`：测试相关
- `style`：样式调整
- `build`：构建或依赖调整

示例：

```text
chore: 初始化项目骨架

- 新增前端和后端基础目录
- 增加统一启动脚本
- 补充健康检查接口
```

## 十三、开发底线

- 主链路优先：注册登录、任务 CRUD、状态看板、数据持久化。
- 如果时间不足，优先隐藏不稳定的加分功能入口。
- 不要为了美化牺牲主流程稳定性。
- 不要让报告描述和实际功能不一致。
- 骨架阶段已通过 `npm test`、`npm run build` 和 `/api/health` 验证，后续改动应尽量保持这些命令可通过。
