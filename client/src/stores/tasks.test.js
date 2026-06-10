import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTasksStore } from './tasks';

describe('tasks store（基于 Mock 数据）', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('fetchTasks 能拉到内置示例任务', async () => {
    const store = useTasksStore();
    await store.fetchTasks();
    expect(store.tasks.length).toBeGreaterThan(0);
  });

  it('按状态分组正确', async () => {
    const store = useTasksStore();
    await store.fetchTasks();
    const todoCount = store.tasksByStatus.todo.length;
    const all = store.tasks.filter((t) => t.status === 'todo').length;
    expect(todoCount).toBe(all);
  });

  it('关键词筛选只保留命中任务', async () => {
    const store = useTasksStore();
    await store.setFilters({ keyword: '数据库' });
    expect(store.tasks.every((t) =>
      (t.title + t.description).includes('数据库')
    )).toBe(true);
  });

  it('导入时跳过非法项', async () => {
    const store = useTasksStore();
    await store.fetchTasks();
    const result = await store.importTasks([
      { title: '合法任务', priority: 'low', status: 'todo' },
      { title: '缺优先级' }, // 非法，应跳过
      { priority: 'high', status: 'doing' } // 缺标题，应跳过
    ]);
    expect(result.imported).toBe(1);
    expect(result.skipped).toBe(2);
  });
});
