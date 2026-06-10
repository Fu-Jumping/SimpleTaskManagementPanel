// 任务相关请求
// 提供两套实现：
//   1. mockXxx() — 本地模拟，前端独立开发时用
//   2. fetchTasks/createTask/... — 根据 API_CONFIG.useMock 自动切换 mock/真实后端
// 所有字段严格遵守 docs/api.md。

import { API_CONFIG } from './config';
import { api } from './request';

// ===== Mock 实现 =====

function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function now() {
  return new Date().toISOString();
}

// 内存 Mock 任务表
let mockTasks = [
  {
    id: 'task_001',
    title: '数据库迁移方案',
    description: '规划并执行生产环境 MySQL 数据库向云服务端的整体迁移与优化。',
    dueDate: '2026-10-25',
    priority: 'high',
    status: 'todo',
    order: 0,
    createdAt: '2026-06-04T10:00:00.000Z',
    updatedAt: '2026-06-04T10:00:00.000Z'
  },
  {
    id: 'task_002',
    title: '用户手册编写',
    description: '完成 2.0 版本的核心功能操作指南，包含截图与常见问题解答。',
    dueDate: '2026-11-02',
    priority: 'medium',
    status: 'todo',
    order: 1,
    createdAt: '2026-06-04T10:05:00.000Z',
    updatedAt: '2026-06-04T10:05:00.000Z'
  },
  {
    id: 'task_003',
    title: 'API 性能优化',
    description: '正在优化鉴权模块与数据流响应速度，目前完成度 60%。',
    dueDate: '2026-10-28',
    priority: 'high',
    status: 'doing',
    order: 0,
    createdAt: '2026-06-04T10:10:00.000Z',
    updatedAt: '2026-06-04T10:10:00.000Z'
  },
  {
    id: 'task_004',
    title: '图标库更新',
    description: 'Material Design 图标库整体替换与适配。',
    dueDate: '2026-10-15',
    priority: 'low',
    status: 'done',
    order: 0,
    createdAt: '2026-06-04T10:15:00.000Z',
    updatedAt: '2026-06-04T10:15:00.000Z'
  }
];

let idSeed = 100;
function nextId() {
  idSeed += 1;
  return `task_${idSeed}`;
}

function applyFilters(list, filters = {}) {
  const { keyword = '', status = '', priority = '' } = filters;
  const kw = keyword.trim().toLowerCase();
  return list.filter((task) => {
    if (status && task.status !== status) return false;
    if (priority && task.priority !== priority) return false;
    if (kw) {
      const inTitle = task.title.toLowerCase().includes(kw);
      const inDesc = (task.description || '').toLowerCase().includes(kw);
      if (!inTitle && !inDesc) return false;
    }
    return true;
  });
}

export async function mockFetchTasks(filters = {}) {
  await delay();
  const tasks = applyFilters(mockTasks, filters).map((t) => ({ ...t }));
  return { tasks, count: tasks.length };
}

export async function mockCreateTask(payload) {
  await delay();
  const task = {
    id: nextId(),
    title: payload.title,
    description: payload.description || '',
    dueDate: payload.dueDate || '',
    priority: payload.priority || 'medium',
    status: payload.status || 'todo',
    order: 0,
    createdAt: now(),
    updatedAt: now()
  };
  mockTasks
    .filter((t) => t.status === task.status)
    .forEach((t) => { t.order += 1; });
  mockTasks.push(task);
  return { task: { ...task } };
}

export async function mockUpdateTask(id, payload) {
  await delay();
  const target = mockTasks.find((t) => t.id === id);
  if (!target) throw new Error('任务不存在');
  Object.assign(target, payload, { updatedAt: now() });
  return { task: { ...target } };
}

export async function mockDeleteTask(id) {
  await delay();
  mockTasks = mockTasks.filter((t) => t.id !== id);
  return { id };
}

export async function mockReorderTasks(items = []) {
  await delay();
  items.forEach((item) => {
    const target = mockTasks.find((t) => t.id === item.id);
    if (!target) return;
    if (item.status !== undefined) target.status = item.status;
    if (item.priority !== undefined) target.priority = item.priority;
    if (item.order !== undefined) target.order = item.order;
    target.updatedAt = now();
  });
  return { tasks: mockTasks.map((t) => ({ ...t })) };
}

export async function mockImportTasks(tasks = []) {
  await delay();
  let imported = 0;
  let skipped = 0;
  const created = [];
  const validPriority = ['high', 'medium', 'low'];
  const validStatus = ['todo', 'doing', 'done'];
  tasks.forEach((raw) => {
    if (!raw || !raw.title || !validPriority.includes(raw.priority) || !validStatus.includes(raw.status)) {
      skipped += 1;
      return;
    }
    const task = {
      id: nextId(),
      title: raw.title,
      description: raw.description || '',
      dueDate: raw.dueDate || '',
      priority: raw.priority,
      status: raw.status,
      order: 0,
      createdAt: now(),
      updatedAt: now()
    };
    mockTasks.push(task);
    created.push({ ...task });
    imported += 1;
  });
  return { imported, skipped, tasks: created };
}

export async function mockExportTasks(filters = {}) {
  await delay();
  const tasks = applyFilters(mockTasks, filters).map((t) => ({ ...t }));
  return { exportedAt: now(), count: tasks.length, tasks };
}

// 示例数据（5 条覆盖不同状态和优先级）
const SAMPLE_TASKS = [
  { title: '完成接口文档', description: '整理前后端需要共同遵守的接口字段', priority: 'high', status: 'todo' },
  { title: '实现用户认证模块', description: '登录、注册、JWT 签发与验证', priority: 'high', status: 'doing' },
  { title: '编写单元测试', description: '为核心逻辑补充单元测试覆盖', priority: 'medium', status: 'todo' },
  { title: '数据库表结构设计', description: '设计 users 和 tasks 表的字段与索引', priority: 'medium', status: 'done' },
  { title: '优化首屏加载速度', description: '代码分割与懒加载策略调整', priority: 'low', status: 'todo' },
];

export async function mockGenerateSample() {
  await delay();
  let created = 0;
  const tasks = [];
  SAMPLE_TASKS.forEach((tpl) => {
    const task = {
      id: nextId(),
      ...tpl,
      description: tpl.description || '',
      dueDate: '',
      order: 0,
      createdAt: now(),
      updatedAt: now()
    };
    mockTasks.push(task);
    tasks.push({ ...task });
    created += 1;
  });
  return { created, tasks };
}

// ===== 统一导出的接口函数（自动切换 mock/真实） =====

export async function fetchTasks(filters = {}) {
  if (API_CONFIG.useMock) return mockFetchTasks(filters);
  return api.get('/tasks', filters);
}

export async function createTask(payload) {
  if (API_CONFIG.useMock) return mockCreateTask(payload);
  return api.post('/tasks', payload);
}

export async function updateTask(id, payload) {
  if (API_CONFIG.useMock) return mockUpdateTask(id, payload);
  return api.patch(`/tasks/${id}`, payload);
}

export async function deleteTask(id) {
  if (API_CONFIG.useMock) return mockDeleteTask(id);
  return api.delete(`/tasks/${id}`);
}

export async function reorderTasks(items) {
  if (API_CONFIG.useMock) return mockReorderTasks(items);
  return api.patch('/tasks/reorder', { items });
}

export async function importTasks(tasks) {
  if (API_CONFIG.useMock) return mockImportTasks(tasks);
  return api.post('/tasks/import', { tasks });
}

export async function exportTasks(filters = {}) {
  if (API_CONFIG.useMock) return mockExportTasks(filters);
  return api.get('/tasks/export', filters);
}

export async function generateSample() {
  if (API_CONFIG.useMock) return mockGenerateSample();
  return api.post('/tasks/sample');
}
