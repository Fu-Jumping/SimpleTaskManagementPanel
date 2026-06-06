import { nanoid } from 'nanoid';
import { db, saveDb } from '../db/index.js';

const sampleTasks = [
  { title: '完成项目需求分析', description: '分析用户需求，整理功能清单', dueDate: null, priority: 'high', status: 'todo' },
  { title: '设计数据库结构', description: '设计用户表和任务表结构', dueDate: null, priority: 'high', status: 'todo' },
  { title: '实现用户认证', description: '完成注册、登录、JWT认证功能', dueDate: null, priority: 'medium', status: 'doing' },
  { title: '任务CRUD接口', description: '实现任务的增删改查接口', dueDate: null, priority: 'medium', status: 'doing' },
  { title: '前端页面开发', description: '开发登录页和看板页', dueDate: null, priority: 'low', status: 'done' },
  { title: '编写接口文档', description: '整理API接口文档', dueDate: null, priority: 'low', status: 'done' }
];

export async function createSampleTasks(userId) {
  if (!db.data) {
    await db.read();
  }
  
  const now = new Date().toISOString();
  const userTasks = db.data.tasks.filter(t => t.userId === userId);
  
  let order = userTasks.length;
  
  const newTasks = sampleTasks.map(task => ({
    id: `task_${nanoid(8)}`,
    userId,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    order: order++,
    createdAt: now,
    updatedAt: now
  }));
  
  db.data.tasks.push(...newTasks);
  await saveDb();
  
  return { created: newTasks.length, tasks: newTasks };
}
