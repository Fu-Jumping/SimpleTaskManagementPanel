# 个人任务看板

本项目是作业2的个人任务看板系统，功能形式接近简易 Trello。项目从零开始实现，前后端同仓管理，重点保证注册登录、任务管理、看板拖拽、搜索筛选、导入导出和数据持久化等演示链路稳定可用。

## 一、项目功能

核心功能：

- 用户注册、登录、退出登录
- 任务新增、编辑、删除、查看
- 状态看板：待处理、进行中、已完成
- 优先级看板：高、中、低
- 拖拽修改任务状态、优先级和列内排序
- 关键词、状态、优先级组合搜索筛选
- 任务 JSON 导入和导出
- 登录后数据持久化，刷新页面后保留

加分功能：

- JWT 登录认证
- 用户任务数据隔离
- 搜索与筛选
- 数据持久化
- 示例任务数据
- Del 快捷键删除任务

## 二、技术栈

前端：

- Vue 3
- Vite
- Vue Router
- Pinia
- Ant Design Vue
- vuedraggable

后端：

- Node.js
- Express
- lowdb
- JWT
- bcrypt

工程辅助：

- npm scripts
- concurrently
- Vitest
- Supertest

## 三、当前骨架状态

当前仓库已经完成最小可运行骨架：

- 根目录提供统一安装、启动、测试和构建脚本。
- `client/` 已初始化 Vue 3 + Vite，占位页可访问。
- `server/` 已初始化 Express，提供 `/api/health` 健康检查接口。
- 前端和后端都已有最小测试，方便后续开发时继续补充。
- 当前不包含登录注册、任务 CRUD、拖拽看板、导入导出等业务实现。

## 四、目录结构

```text
.
├── client/                 # 前端项目
│   ├── src/
│   │   ├── api/            # 前端 API 封装占位
│   │   ├── components/     # 公共组件占位
│   │   ├── router/         # Vue Router
│   │   ├── stores/         # Pinia store 占位
│   │   ├── styles/         # 全局样式
│   │   └── views/          # 页面视图
├── server/                 # 后端项目
│   └── src/
│       ├── db/             # lowdb 数据层占位
│       ├── middleware/     # 中间件占位
│       ├── routes/         # 路由占位
│       ├── services/       # 服务层占位
│       └── utils/          # 工具函数占位
├── design/                 # 视觉原型和参考素材
├── docs/                   # 项目文档
│   ├── api.md              # 接口契约
│   ├── requirements.md     # 需求与验收说明
│   ├── design-reference.md # 原型参考说明
│   ├── 分工/               # 分工和角色任务单
│   │   ├── 分工说明.md
│   │   ├── frontend-tasks.md
│   │   ├── backend-tasks.md
│   │   └── test-report-tasks.md
│   └── 归档/               # 前期材料归档，被 .gitignore 忽略
├── .gitignore
├── AGENTS.md
├── package.json
└── README.md
```

说明：

- `client/` 和 `server/` 目前只包含最小骨架，业务功能由对应负责人继续开发。
- `design/` 是视觉原型和参考素材目录，导出代码只作为视觉参考，不作为正式 Vue 代码起点。
- `docs/api.md` 是前后端联调的主要依据。
- 如接口路径、字段或响应格式变化，必须同步更新 `docs/api.md`。
- `docs/归档/` 用于保存早期题目和提问记录，不作为正式文档入口。

## 五、启动方式

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
npm run dev:server
```

```bash
npm run dev:client
```

端口约定：

- 前端：`http://localhost:5173`
- 后端：`http://localhost:3000`
- 健康检查：`http://localhost:3000/api/health`

测试和构建：

```bash
npm test
npm run build
```

## 六、协作分支

| 分支 | 使用人 | 用途 |
| --- | --- | --- |
| `main` | 全组 | 主分支，保存阶段性可运行版本 |
| `feature/client` | 前端负责人 | 前端功能开发 |
| `feature/server` | 后端负责人 A/B | 后端功能开发 |
| `feature/test-report` | 测试与报告负责人 | 测试记录、报告、截图等材料 |

协作规则：

- 所有人从 `main` 拉取自己的功能分支。
- 模块完成后提交代码。
- 阶段完成后可自行合并回 `main`。
- 合并前至少确认自己负责的项目能启动，无明显运行报错。
- 修改接口时必须同步更新 `docs/api.md`。
- 发生冲突时由对应开发者处理，必要时找规划与原型负责人统一判断。

## 七、文档入口

- [接口契约](./docs/api.md)
- [需求与验收说明](./docs/requirements.md)
- [原型参考说明](./docs/design-reference.md)
- [分工说明](./docs/分工/分工说明.md)
- [前端任务单](./docs/分工/frontend-tasks.md)
- [后端任务单](./docs/分工/backend-tasks.md)
- [测试与报告任务单](./docs/分工/test-report-tasks.md)

## 八、最低验收标准

最终演示至少需要完成：

- 注册、登录、退出登录
- 任务新增、编辑、删除
- 状态看板三列展示和拖拽
- 优先级看板三列展示和拖拽
- 搜索筛选
- 导入导出
- 刷新后数据保留

如果时间不足，优先保证注册登录、任务 CRUD、状态看板和数据持久化。
