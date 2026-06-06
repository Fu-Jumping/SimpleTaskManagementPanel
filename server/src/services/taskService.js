import { nanoid } from 'nanoid';
import { db, saveDb } from '../db/index.js';
import { validateTask } from '../utils/validators.js';

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

export async function getTasks(userId, filters = {}) {
  if (!db.data) {
    await db.read();
  }
  
  let tasks = db.data.tasks.filter(t => t.userId === userId);
  
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    tasks = tasks.filter(t => 
      t.title.toLowerCase().includes(keyword) || 
      (t.description && t.description.toLowerCase().includes(keyword))
    );
  }
  
  if (filters.status) {
    tasks = tasks.filter(t => t.status === filters.status);
  }
  
  if (filters.priority) {
    tasks = tasks.filter(t => t.priority === filters.priority);
  }
  
  tasks.sort((a, b) => a.order - b.order);
  
  return { tasks: tasks.map(formatTask), count: tasks.length };
}

export async function getTask(userId, taskId) {
  if (!db.data) {
    await db.read();
  }
  
  const task = db.data.tasks.find(t => t.id === taskId && t.userId === userId);
  
  if (!task) {
    return null;
  }
  
  return formatTask(task);
}

export async function createTask(userId, taskData) {
  const errors = validateTask(taskData);
  if (errors.length > 0) {
    return { success: false, message: errors.join('; ') };
  }
  
  if (!db.data) {
    await db.read();
  }
  
  const now = new Date().toISOString();
  
  const userTasks = db.data.tasks.filter(t => t.userId === userId && t.status === taskData.status);
  const maxOrder = userTasks.length > 0 ? Math.max(...userTasks.map(t => t.order)) : -1;
  
  const task = {
    id: `task_${nanoid(8)}`,
    userId,
    title: taskData.title,
    description: taskData.description || '',
    dueDate: taskData.dueDate || null,
    priority: taskData.priority || 'medium',
    status: taskData.status || 'todo',
    order: maxOrder + 1,
    createdAt: now,
    updatedAt: now
  };
  
  db.data.tasks.push(task);
  await saveDb();
  
  return { success: true, data: formatTask(task) };
}

export async function updateTask(userId, taskId, taskData) {
  if (!db.data) {
    await db.read();
  }
  
  const taskIndex = db.data.tasks.findIndex(t => t.id === taskId && t.userId === userId);
  
  if (taskIndex === -1) {
    return { success: false, message: '任务不存在或无权限访问' };
  }
  
  const task = db.data.tasks[taskIndex];
  
  if (taskData.title !== undefined) {
    if (!taskData.title || taskData.title.length < 1 || taskData.title.length > 50) {
      return { success: false, message: '标题必须是1-50个字符' };
    }
    task.title = taskData.title;
  }
  
  if (taskData.description !== undefined) {
    if (taskData.description && taskData.description.length > 500) {
      return { success: false, message: '描述不能超过500个字符' };
    }
    task.description = taskData.description;
  }
  
  if (taskData.dueDate !== undefined) {
    if (taskData.dueDate) {
      const date = new Date(taskData.dueDate);
      if (!(date instanceof Date && !isNaN(date))) {
        return { success: false, message: '截止日期格式不正确' };
      }
    }
    task.dueDate = taskData.dueDate || null;
  }
  
  if (taskData.priority !== undefined) {
    if (!['high', 'medium', 'low'].includes(taskData.priority)) {
      return { success: false, message: '优先级必须是 high、medium 或 low' };
    }
    task.priority = taskData.priority;
  }
  
  if (taskData.status !== undefined) {
    if (!['todo', 'doing', 'done'].includes(taskData.status)) {
      return { success: false, message: '状态必须是 todo、doing 或 done' };
    }
    
    const oldStatus = task.status;
    if (oldStatus !== taskData.status) {
      const userTasks = db.data.tasks.filter(t => t.userId === userId && t.status === taskData.status);
      const maxOrder = userTasks.length > 0 ? Math.max(...userTasks.map(t => t.order)) : -1;
      task.order = maxOrder + 1;
      
      const oldStatusTasks = db.data.tasks.filter(t => t.userId === userId && t.status === oldStatus);
      oldStatusTasks.forEach(t => {
        if (t.order > task.order) {
          t.order--;
        }
      });
    }
    task.status = taskData.status;
  }
  
  task.updatedAt = new Date().toISOString();
  
  await saveDb();
  
  return { success: true, data: formatTask(task) };
}

export async function deleteTask(userId, taskId) {
  if (!db.data) {
    await db.read();
  }
  
  const taskIndex = db.data.tasks.findIndex(t => t.id === taskId && t.userId === userId);
  
  if (taskIndex === -1) {
    return { success: false, message: '任务不存在或无权限访问' };
  }
  
  const task = db.data.tasks[taskIndex];
  const taskStatus = task.status;
  
  db.data.tasks.splice(taskIndex, 1);
  
  const remainingTasks = db.data.tasks.filter(t => t.userId === userId && t.status === taskStatus);
  remainingTasks.forEach((t, idx) => {
    t.order = idx;
  });
  
  await saveDb();
  
  return { success: true, data: { id: taskId } };
}

export async function reorderTasks(userId, items) {
  if (!db.data) {
    await db.read();
  }
  
  const updatedTasks = [];
  const now = new Date().toISOString();
  
  for (const item of items) {
    const taskIndex = db.data.tasks.findIndex(t => t.id === item.id && t.userId === userId);
    
    if (taskIndex === -1) {
      continue;
    }
    
    const task = db.data.tasks[taskIndex];
    
    if (item.status !== undefined) {
      if (!['todo', 'doing', 'done'].includes(item.status)) {
        continue;
      }
      task.status = item.status;
    }
    
    if (item.priority !== undefined) {
      if (!['high', 'medium', 'low'].includes(item.priority)) {
        continue;
      }
      task.priority = item.priority;
    }
    
    if (item.order !== undefined && typeof item.order === 'number') {
      task.order = item.order;
    }
    
    task.updatedAt = now;
    updatedTasks.push(formatTask(task));
  }
  
  await saveDb();
  
  return { success: true, data: { tasks: updatedTasks } };
}

export async function importTasks(userId, tasksData) {
  if (!db.data) {
    await db.read();
  }
  
  const now = new Date().toISOString();
  const imported = [];
  let skipped = 0;
  
  for (const taskData of tasksData) {
    const errors = validateTask(taskData);
    if (errors.length > 0) {
      skipped++;
      continue;
    }
    
    const userTasks = db.data.tasks.filter(t => t.userId === userId && t.status === (taskData.status || 'todo'));
    const maxOrder = userTasks.length > 0 ? Math.max(...userTasks.map(t => t.order)) : -1;
    
    const task = {
      id: `task_${nanoid(8)}`,
      userId,
      title: taskData.title,
      description: taskData.description || '',
      dueDate: taskData.dueDate || null,
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now
    };
    
    db.data.tasks.push(task);
    imported.push(formatTask(task));
  }
  
  await saveDb();
  
  return { success: true, data: { imported: imported.length, skipped, tasks: imported } };
}

export async function exportTasks(userId, filters = {}) {
  const result = await getTasks(userId, filters);
  
  return {
    success: true,
    data: {
      exportedAt: new Date().toISOString(),
      count: result.count,
      tasks: result.tasks
    }
  };
}
