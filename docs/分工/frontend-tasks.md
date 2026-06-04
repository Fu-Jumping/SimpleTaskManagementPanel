# 前端任务单

本文档给前端负责人使用。前端开发以 `docs/requirements.md` 和 `docs/api.md` 为准，前期可以使用 Mock 数据，后期必须接入真实后端接口。页面视觉实现前需要参考根目录 `design/` 和 `docs/design-reference.md`。

## 一、职责范围

前端负责人负责完整前端：

- Vue 项目初始化
- 路由
- Pinia 状态管理
- 页面和组件
- 看板拖拽
- 快捷键
- API 接入
- 错误提示
- 基础响应式适配

开发分支：

```text
feature/client
```

## 二、技术要求

必须使用：

- Vue 3
- Vite
- Vue Router
- Pinia
- Ant Design Vue
- vuedraggable

建议：

- 使用统一主题变量控制绿色主色、圆角、按钮风格和卡片样式。
- 使用 Ant Design Vue 的表单、抽屉、弹窗、消息提示等组件保证稳定性。
- 任务拖拽逻辑集中封装，避免状态看板和优先级看板重复实现过多。
- `design/` 中的 `.figma/` 和 `.stitch/` 导出内容只作为视觉参考，正式代码在 `client/` 中用 Vue 重新实现。

## 三、建议目录

```text
client/
├── src/
│   ├── api/
│   │   ├── auth.js
│   │   ├── request.js
│   │   └── tasks.js
│   ├── components/
│   │   ├── AppHeader.vue
│   │   ├── TaskCard.vue
│   │   ├── TaskDrawer.vue
│   │   ├── TaskFilters.vue
│   │   ├── StatusBoard.vue
│   │   ├── PriorityBoard.vue
│   │   └── DataCenter.vue
│   ├── router/
│   ├── stores/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── styles/
│   └── views/
│       ├── LoginView.vue
│       ├── RegisterView.vue
│       └── BoardView.vue
```

可根据实际实现调整，但必须保持结构清晰。

## 四、页面任务

### 1. 登录页

功能：

- 用户名输入
- 密码输入
- 登录按钮
- 跳转注册页
- 登录失败提示

要求：

- 登录成功后保存 token 和用户信息。
- 登录成功后跳转主看板页。

### 2. 注册页

功能：

- 用户名输入
- 密码输入
- 确认密码输入，前端可选
- 注册按钮
- 跳转登录页
- 注册失败提示

要求：

- 注册成功后可以直接进入看板，或跳转登录页，需与后端接口保持一致。

### 3. 主看板页

功能：

- 顶部标题和用户菜单
- 搜索筛选区
- 状态看板和优先级看板切换
- 新建任务入口
- 任务结果数量展示

要求：

- 页面默认展示状态看板。
- 筛选条件变化后更新任务列表。
- 支持标题和描述关键词高亮。

### 4. 任务抽屉

功能：

- 新增任务
- 编辑任务
- 标题、描述、截止日期、优先级、状态字段
- 保存和取消

要求：

- 标题必填。
- 优先级和状态只能选择固定值。
- 新建和编辑可以共用同一抽屉组件。

### 5. 数据中心

入口：

- 放在用户菜单中。

功能：

- 导入 JSON
- 导出当前筛选任务
- 显示导入成功数量和跳过数量

要求：

- 导入前不做预览。
- 导入后刷新任务列表或同步 store。

## 五、状态管理任务

### 1. auth store

建议状态：

- `token`
- `user`
- `isLoggedIn`

建议方法：

- `login`
- `register`
- `logout`
- `restoreSession`

要求：

- token 可存储在 `localStorage`。
- 退出登录时清除 token 和用户信息。

### 2. tasks store

建议状态：

- `tasks`
- `filters`
- `loading`
- `selectedTaskId`

建议方法：

- `fetchTasks`
- `createTask`
- `updateTask`
- `deleteTask`
- `reorderTasks`
- `importTasks`
- `exportTasks`
- `createSampleTasks`

要求：

- 所有任务数据以接口返回为准。
- 新增、编辑、删除、拖拽、导入后需要刷新或同步本地任务列表。

## 六、拖拽规则

状态看板：

- 列为 `todo`、`doing`、`done`。
- 同列拖拽只改变 `order`。
- 跨列拖拽改变 `status` 和 `order`。

优先级看板：

- 列为 `high`、`medium`、`low`。
- 同列拖拽只改变 `order`。
- 跨列拖拽改变 `priority` 和 `order`。
- 不能改变任务原有 `status`。

同步方式：

- 拖拽结束后调用 `PATCH /api/tasks/reorder`。
- 如果接口失败，需要提示用户，并重新拉取任务列表恢复后端状态。

## 七、快捷键规则

要求：

- 点击任务卡片后，该任务进入选中状态。
- 按 Del 时弹出删除确认。
- 确认后调用删除接口。
- 取消后不删除。

注意：

- 输入框、文本域聚焦时不要触发 Del 删除任务。
- 未选中任务时按 Del 不做操作。

## 八、API 接入要求

统一封装请求模块：

- 自动拼接后端基础地址。
- 自动注入 token。
- 统一处理 `{ success, data }` 和 `{ success, message }`。
- 统一处理 `401`，必要时退出登录并跳转登录页。

前期 Mock：

- Mock 数据字段必须与 `docs/api.md` 一致。
- 不使用中文字段名。

后期真实接口：

- 登录、注册、任务列表、任务新增、任务编辑、任务删除、排序、导入、导出都需要接入真实接口。

## 九、前端自测清单

提交前至少确认：

- 前端项目可以启动。
- 登录页可以正常输入。
- 注册页可以正常输入。
- 看板页无明显报错。
- 新增任务后页面显示。
- 编辑任务后页面更新。
- 删除任务前有确认框。
- 状态看板拖拽后位置变化。
- 优先级看板拖拽不改变任务状态。
- 搜索筛选结果正确。
- 导入导出入口可用。
- 刷新页面后登录状态和任务数据处理正常。
- 移动端宽度下无明显横向溢出。

## 十、交付物

需要交付：

- `client/` 前端项目代码。
- 前端启动说明。
- 已接入的接口说明或注意事项。
- 已知未完成问题列表。
