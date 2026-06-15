import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
  getTasks, 
  getTask, 
  createTask, 
  updateTask, 
  deleteTask, 
  reorderTasks,
  importTasks,
  exportTasks 
} from '../services/taskService.js';
import { createSampleTasks } from '../services/sampleService.js';
import { sendSuccess, sendError, sendNotFound } from '../utils/response.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const { keyword, status, priority } = req.query;
  
  const filters = {};
  if (keyword) filters.keyword = keyword;
  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  
  const result = await getTasks(req.user.id, filters);
  sendSuccess(res, result);
});

router.get('/export', authenticate, async (req, res) => {
  const { keyword, status, priority } = req.query;
  
  const filters = {};
  if (keyword) filters.keyword = keyword;
  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  
  const result = await exportTasks(req.user.id, filters);
  
  if (result.success) {
    sendSuccess(res, result.data);
  } else {
    sendError(res, result.message, result.status || 400);
  }
});

router.post('/', authenticate, async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;
  
  if (!title) {
    return sendError(res, '标题不能为空');
  }
  
  const result = await createTask(req.user.id, {
    title,
    description,
    dueDate,
    priority: priority || 'medium',
    status: status || 'todo'
  });
  
  if (result.success) {
    sendSuccess(res, result.data);
  } else {
    sendError(res, result.message, result.status || 400);
  }
});

router.post('/import', authenticate, async (req, res) => {
  const { tasks } = req.body;
  
  if (!tasks || !Array.isArray(tasks)) {
    return sendError(res, '请提供有效的任务数据');
  }
  
  const result = await importTasks(req.user.id, tasks);
  
  if (result.success) {
    sendSuccess(res, result.data);
  } else {
    sendError(res, result.message, result.status || 400);
  }
});

router.post('/sample', authenticate, async (req, res) => {
  const result = await createSampleTasks(req.user.id);
  sendSuccess(res, { created: result.created, tasks: result.tasks });
});

router.patch('/reorder', authenticate, async (req, res) => {
  const { items } = req.body;
  
  if (!items || !Array.isArray(items)) {
    return sendError(res, '请提供有效的排序数据');
  }
  
  const result = await reorderTasks(req.user.id, items);
  
  if (result.success) {
    sendSuccess(res, result.data);
  } else {
    sendError(res, result.message, result.status || 400);
  }
});

router.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const task = await getTask(req.user.id, id);
  
  if (task) {
    sendSuccess(res, { task });
  } else {
    sendNotFound(res);
  }
});

router.patch('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, priority, status } = req.body;
  
  const result = await updateTask(req.user.id, id, {
    title,
    description,
    dueDate,
    priority,
    status
  });
  
  if (result.success) {
    sendSuccess(res, result.data);
  } else {
    sendError(res, result.message, result.status || 400);
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  
  const result = await deleteTask(req.user.id, id);
  
  if (result.success) {
    sendSuccess(res, result.data);
  } else {
    sendNotFound(res, result.message);
  }
});

export default router;
