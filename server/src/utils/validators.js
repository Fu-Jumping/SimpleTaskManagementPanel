export const PRIORITIES = ['high', 'medium', 'low'];
export const STATUSES = ['todo', 'doing', 'done'];

export function isValidPriority(priority) {
  return PRIORITIES.includes(priority);
}

export function isValidStatus(status) {
  return STATUSES.includes(status);
}

export function isValidDate(dateStr) {
  if (!dateStr) return true;
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }

  const date = new Date(`${dateStr}T00:00:00.000Z`);
  return date instanceof Date &&
    !isNaN(date) &&
    date.toISOString().slice(0, 10) === dateStr;
}

export function validateUser(user) {
  const errors = [];
  const username = typeof user?.username === 'string' ? user.username.trim() : '';
  const password = typeof user?.password === 'string' ? user.password : '';
  
  if (username.length < 3 || username.length > 20) {
    errors.push('用户名必须是3-20个字符');
  }
  
  if (password.length < 6) {
    errors.push('密码至少6个字符');
  }
  
  return errors;
}

export function validateTask(task) {
  const errors = [];
  const title = typeof task?.title === 'string' ? task.title.trim() : '';
  
  if (title.length < 1 || title.length > 50) {
    errors.push('标题必须是1-50个字符');
  }
  
  if (
    task?.description !== undefined &&
    task.description !== null &&
    typeof task.description !== 'string'
  ) {
    errors.push('描述必须是字符串');
  }
  
  if (typeof task?.description === 'string' && task.description.length > 500) {
    errors.push('描述不能超过500个字符');
  }
  
  if (task?.dueDate && !isValidDate(task.dueDate)) {
    errors.push('截止日期格式不正确');
  }
  
  if (task?.priority && !isValidPriority(task.priority)) {
    errors.push('优先级必须是 high、medium 或 low');
  }
  
  if (task?.status && !isValidStatus(task.status)) {
    errors.push('状态必须是 todo、doing 或 done');
  }
  
  return errors;
}

export function validateImportedTask(task) {
  const errors = validateTask(task);

  if (!task?.priority) {
    errors.push('优先级不能为空');
  }

  if (!task?.status) {
    errors.push('状态不能为空');
  }

  return errors;
}
