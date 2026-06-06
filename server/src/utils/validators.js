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
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
}

export function validateUser(user) {
  const errors = [];
  
  if (!user.username || user.username.length < 3 || user.username.length > 20) {
    errors.push('用户名必须是3-20个字符');
  }
  
  if (!user.password || user.password.length < 6) {
    errors.push('密码至少6个字符');
  }
  
  return errors;
}

export function validateTask(task) {
  const errors = [];
  
  if (!task.title || task.title.length < 1 || task.title.length > 50) {
    errors.push('标题必须是1-50个字符');
  }
  
  if (task.description && task.description.length > 500) {
    errors.push('描述不能超过500个字符');
  }
  
  if (task.dueDate && !isValidDate(task.dueDate)) {
    errors.push('截止日期格式不正确');
  }
  
  if (task.priority && !isValidPriority(task.priority)) {
    errors.push('优先级必须是 high、medium 或 low');
  }
  
  if (task.status && !isValidStatus(task.status)) {
    errors.push('状态必须是 todo、doing 或 done');
  }
  
  return errors;
}
