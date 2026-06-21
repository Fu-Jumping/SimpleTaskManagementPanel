import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  fetchTasks as apiFetchTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  clearTasks as apiClearTasks,
  reorderTasks as apiReorderTasks,
  importTasks as apiImportTasks,
  exportTasks as apiExportTasks,
  generateSample as apiGenerateSample
} from '../api/tasks';

// tasks store：管理任务列表、筛选条件、加载态、选中任务
// 使用 api/tasks 的统一接口函数，根据 API_CONFIG.useMock 自动切换 mock/真实后端。
export const useTasksStore = defineStore('tasks', () => {
  // 状态
  const tasks = ref([]);
  const filters = ref({
    keyword: '',
    status: '', // '' | 'todo' | 'doing' | 'done'
    priority: '' // '' | 'high' | 'medium' | 'low'
  });
  const loading = ref(false);
  const selectedTaskId = ref(null);

  // 选中的任务对象
  const selectedTask = computed(
    () => tasks.value.find((t) => t.id === selectedTaskId.value) || null
  );

  // 按状态分组（状态看板用）
  const tasksByStatus = computed(() => ({
    todo: sortByOrder(tasks.value.filter((t) => t.status === 'todo')),
    doing: sortByOrder(tasks.value.filter((t) => t.status === 'doing')),
    done: sortByOrder(tasks.value.filter((t) => t.status === 'done'))
  }));

  // 按优先级分组（优先级看板用）
  const tasksByPriority = computed(() => ({
    high: sortByOrder(tasks.value.filter((t) => t.priority === 'high')),
    medium: sortByOrder(tasks.value.filter((t) => t.priority === 'medium')),
    low: sortByOrder(tasks.value.filter((t) => t.priority === 'low'))
  }));

  function sortByOrder(list) {
    return [...list].sort((a, b) => a.order - b.order);
  }

  // 拉取任务列表（以接口返回为准）
  async function fetchTasks() {
    loading.value = true;
    try {
      const { tasks: list } = await apiFetchTasks(filters.value);
      tasks.value = list;
    } finally {
      loading.value = false;
    }
  }

  // 设置筛选条件并刷新
  async function setFilters(patch) {
    filters.value = { ...filters.value, ...patch };
    await fetchTasks();
  }

  // 重置筛选
  async function resetFilters() {
    filters.value = { keyword: '', status: '', priority: '' };
    await fetchTasks();
  }

  async function createTask(payload) {
    await apiCreateTask(payload);
    await fetchTasks();
  }

  async function updateTask(id, payload) {
    await apiUpdateTask(id, payload);
    await fetchTasks();
  }

  async function deleteTask(id) {
    await apiDeleteTask(id);
    if (selectedTaskId.value === id) selectedTaskId.value = null;
    await fetchTasks();
  }

  async function clearTasks() {
    const result = await apiClearTasks();
    selectedTaskId.value = null;
    await fetchTasks();
    return result; // { deleted }
  }

  // 拖拽排序：items 为 [{ id, status, priority, order }]
  // 失败时重新拉取列表恢复后端状态（由调用方捕获错误并提示）
  async function reorderTasks(items) {
    try {
      await apiReorderTasks(items);
      await fetchTasks();
    } catch (err) {
      await fetchTasks();
      throw err;
    }
  }

  async function importTasks(list) {
    const result = await apiImportTasks(list);
    await fetchTasks();
    return result; // { imported, skipped, tasks }
  }

  // 导出任务；未传参时沿用当前看板筛选，导出弹窗可传入临时筛选
  async function exportTasks(exportFilters = filters.value) {
    return apiExportTasks(exportFilters);
  }

  // 生成示例数据（追加，不覆盖已有任务）
  async function generateSample() {
    const result = await apiGenerateSample();
    await fetchTasks();
    return result; // { created, tasks }
  }

  function selectTask(id) {
    selectedTaskId.value = id;
  }

  function clearSelection() {
    selectedTaskId.value = null;
  }

  return {
    tasks,
    filters,
    loading,
    selectedTaskId,
    selectedTask,
    tasksByStatus,
    tasksByPriority,
    fetchTasks,
    setFilters,
    resetFilters,
    createTask,
    updateTask,
    deleteTask,
    clearTasks,
    reorderTasks,
    importTasks,
    exportTasks,
    generateSample,
    selectTask,
    clearSelection
  };
});
