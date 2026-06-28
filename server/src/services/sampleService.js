import { nanoid } from 'nanoid';
import { db, saveDb } from '../db/index.js';

const sampleTasks = [
  { title: '完成项目需求分析', description: '分析用户需求，整理功能清单', dueDate: null, priority: 'high', status: 'todo' },
  { title: '整理用户手册初稿', description: '补充核心功能操作说明', dueDate: null, priority: 'medium', status: 'todo' },
  { title: '实现用户认证', description: '完成注册、登录、JWT认证功能', dueDate: null, priority: 'high', status: 'doing' },
  { title: '优化任务筛选体验', description: '调整搜索和筛选入口的位置', dueDate: null, priority: 'low', status: 'doing' },
  { title: '编写接口文档', description: '整理API接口文档', dueDate: null, priority: 'medium', status: 'done' },
  { title: '前端页面开发', description: '开发登录页和看板页', dueDate: null, priority: 'low', status: 'done' }
];

function formatTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    order: task.order,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
}

export async function createSampleTasks(userId) {
  if (!db.data) {
    await db.read();
  }
  
  const now = new Date().toISOString();
  const nextOrderByStatus = sampleTasks.reduce((orders, task) => {
    if (orders[task.status] === undefined) {
      const statusTasks = db.data.tasks.filter(t => t.userId === userId && t.status === task.status);
      orders[task.status] = statusTasks.length > 0 ? Math.max(...statusTasks.map(t => t.order)) + 1 : 0;
    }

    return orders;
  }, {});
  
  const newTasks = sampleTasks.map(task => ({
    id: `task_${nanoid(8)}`,
    userId,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    order: nextOrderByStatus[task.status]++,
    createdAt: now,
    updatedAt: now
  }));
  
  db.data.tasks.push(...newTasks);
  await saveDb();
  
  return { created: newTasks.length, tasks: newTasks.map(formatTask) };
}
