<script setup>
import { computed, ref, watch } from 'vue';
import { message, Modal } from 'ant-design-vue';
import {
  DeleteOutlined,
  DownloadOutlined,
  SortAscendingOutlined,
  UploadOutlined
} from '@ant-design/icons-vue';
import { clearTasks as apiClearTasks } from '../api/tasks';
import { useTasksStore } from '../stores/tasks';

// 数据中心：导入 JSON / 导出可筛选、可勾选的任务
const props = defineProps({
  open: { type: Boolean, default: false }
});
const emit = defineEmits(['update:open']);

const tasksStore = useTasksStore();

const activeTab = ref('import'); // 'import' | 'export'
const importing = ref(false);
const clearing = ref(false);
const fileInput = ref(null);

const exportFilters = ref({ status: '', priority: '' });
const exportCandidates = ref([]);
const exportLoading = ref(false);
const selectedExportIds = ref([]);
const sortDesc = ref(true);
let exportLoadSeq = 0;

const STATUS_FILTERS = [
  { value: '', label: '全部' },
  { value: 'todo', label: '待处理' },
  { value: 'doing', label: '进行中' },
  { value: 'done', label: '已完成' }
];
const PRIORITY_FILTERS = [
  { value: '', label: '全部' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' }
];
const STATUS_TEXT = { todo: '待处理', doing: '进行中', done: '已完成' };
const PRIORITY_TEXT = { high: '高', medium: '中', low: '低' };

const selectedExportIdSet = computed(() => new Set(selectedExportIds.value));

const sortedExportCandidates = computed(() => {
  const getTime = (task) => {
    const raw = task.dueDate || task.updatedAt || task.createdAt || '';
    return Date.parse(raw) || 0;
  };

  return [...exportCandidates.value].sort((a, b) => {
    const diff = getTime(a) - getTime(b);
    return sortDesc.value ? -diff : diff;
  });
});

const selectedExportTasks = computed(() =>
  sortedExportCandidates.value.filter((task) => selectedExportIdSet.value.has(task.id))
);

const allVisibleSelected = computed(() =>
  sortedExportCandidates.value.length > 0 &&
  sortedExportCandidates.value.every((task) => selectedExportIdSet.value.has(task.id))
);

const partiallySelected = computed(() =>
  sortedExportCandidates.value.some((task) => selectedExportIdSet.value.has(task.id)) &&
  !allVisibleSelected.value
);

function close() {
  emit('update:open', false);
}

// 选择文件后读取并解析 JSON
function triggerPick() {
  fileInput.value?.click();
}

async function onFileChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  importing.value = true;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    // 兼容两种格式：直接是数组，或 { tasks: [...] }（导出格式）
    const list = Array.isArray(parsed) ? parsed : parsed.tasks;
    if (!Array.isArray(list)) {
      throw new Error('JSON 格式不正确，应为任务数组或包含 tasks 字段');
    }
    const { imported, skipped } = await tasksStore.importTasks(list);
    message.success(`导入完成：成功 ${imported} 条，跳过 ${skipped} 条`);
    close();
  } catch (err) {
    message.error(err.message || '导入失败，请检查文件格式');
  } finally {
    importing.value = false;
    event.target.value = ''; // 清空以便重复选同一文件
  }
}

async function loadExportCandidates() {
  const seq = ++exportLoadSeq;
  exportLoading.value = true;
  try {
    const data = await tasksStore.exportTasks(exportFilters.value);
    if (seq !== exportLoadSeq) return;
    const tasks = data.tasks || [];
    exportCandidates.value = tasks;
    selectedExportIds.value = tasks.map((task) => task.id);
  } catch (err) {
    message.error(err.message || '加载导出任务失败');
  } finally {
    if (seq === exportLoadSeq) {
      exportLoading.value = false;
    }
  }
}

function setExportFilter(type, value) {
  exportFilters.value = { ...exportFilters.value, [type]: value };
}

function isTaskSelected(id) {
  return selectedExportIdSet.value.has(id);
}

function toggleTaskSelection(id, checked) {
  const next = new Set(selectedExportIds.value);
  const shouldSelect = checked ?? !next.has(id);

  if (shouldSelect) {
    next.add(id);
  } else {
    next.delete(id);
  }

  selectedExportIds.value = [...next];
}

function toggleSelectAll(checked) {
  const currentIds = sortedExportCandidates.value.map((task) => task.id);
  const next = new Set(selectedExportIds.value);

  if (checked) {
    currentIds.forEach((id) => next.add(id));
  } else {
    currentIds.forEach((id) => next.delete(id));
  }

  selectedExportIds.value = [...next];
}

function toggleSort() {
  sortDesc.value = !sortDesc.value;
}

function formatDate(task) {
  if (task.dueDate) return task.dueDate;
  const raw = task.updatedAt || task.createdAt;
  return raw ? raw.slice(0, 10) : '无日期';
}

function downloadJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tasks-export-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleExport() {
  if (selectedExportTasks.value.length === 0) {
    message.warning('请至少选择一个任务');
    return;
  }

  const data = {
    exportedAt: new Date().toISOString(),
    count: selectedExportTasks.value.length,
    tasks: selectedExportTasks.value
  };
  downloadJson(data);
  message.success(`已导出 ${data.count} 条任务`);
  close();
}

async function handleClearAll() {
  clearing.value = true;
  try {
    const { deleted } =
      typeof tasksStore.clearTasks === 'function'
        ? await tasksStore.clearTasks()
        : await apiClearTasks();
    if (typeof tasksStore.fetchTasks === 'function') {
      await tasksStore.fetchTasks();
    }
    exportCandidates.value = [];
    selectedExportIds.value = [];
    message.success(`已清除 ${deleted} 条任务`);
  } catch (err) {
    message.error(err.message || '清除数据失败');
  } finally {
    clearing.value = false;
  }
}

function confirmClearAll() {
  Modal.confirm({
    title: '确认清除全部任务？',
    content: '此操作不可恢复，只会清除当前登录用户的任务，不会删除账号。',
    okText: '确认清除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      await handleClearAll();
    }
  });
}

watch(
  () => [props.open, activeTab.value],
  ([isOpen, tab]) => {
    if (isOpen && tab === 'export') {
      loadExportCandidates();
    }
  }
);

watch(
  exportFilters,
  () => {
    if (props.open && activeTab.value === 'export') {
      loadExportCandidates();
    }
  },
  { deep: true }
);
</script>

<template>
  <a-modal :open="open" :footer="null" :width="760" @cancel="close">
    <template #title>
      <div class="modal-title">
        <span>数据设置</span>
        <a-button danger size="small" :loading="clearing" @click.stop="confirmClearAll">
          <template #icon><DeleteOutlined /></template>
          清除全部数据
        </a-button>
      </div>
    </template>

    <a-tabs v-model:activeKey="activeTab" centered>
      <a-tab-pane key="import" tab="导入">
        <div class="import-zone" @click="triggerPick">
          <p class="hint">
            <UploadOutlined />
            点击选择 JSON 文件上传
          </p>
          <a-button type="primary" ghost :loading="importing">选择文件</a-button>
          <p class="sub">仅支持 .json 文件，导入为追加，非法项自动跳过</p>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          hidden
          @change="onFileChange"
        />
      </a-tab-pane>

      <a-tab-pane key="export" tab="导出">
        <div class="export-layout">
          <aside class="export-sidebar">
            <section>
              <p class="side-title">按状态</p>
              <button
                v-for="item in STATUS_FILTERS"
                :key="`status-${item.value}`"
                :class="['side-option', { active: exportFilters.status === item.value }]"
                type="button"
                @click="setExportFilter('status', item.value)"
              >
                <span class="status-dot" :class="`status-${item.value || 'all'}`" />
                {{ item.label }}
              </button>
            </section>

            <section>
              <p class="side-title">按优先级</p>
              <button
                v-for="item in PRIORITY_FILTERS"
                :key="`priority-${item.value}`"
                :class="['side-option', { active: exportFilters.priority === item.value }]"
                type="button"
                @click="setExportFilter('priority', item.value)"
              >
                <span class="priority-dot" :class="`priority-${item.value || 'all'}`" />
                {{ item.label }}
              </button>
            </section>
          </aside>

          <section class="export-main">
            <div class="export-tools">
              <a-checkbox
                :checked="allVisibleSelected"
                :indeterminate="partiallySelected"
                @change="toggleSelectAll($event.target.checked)"
              >
                全选当前筛选
              </a-checkbox>

              <a-button class="sort-btn" @click="toggleSort">
                <template #icon><SortAscendingOutlined /></template>
                按日期排序
              </a-button>
            </div>

            <a-spin :spinning="exportLoading">
              <div v-if="sortedExportCandidates.length > 0" class="export-list">
                <div
                  v-for="task in sortedExportCandidates"
                  :key="task.id"
                  class="export-item"
                  @click="toggleTaskSelection(task.id)"
                >
                  <a-checkbox
                    :checked="isTaskSelected(task.id)"
                    @click.stop
                    @change="toggleTaskSelection(task.id, $event.target.checked)"
                  />
                  <div class="task-info">
                    <p class="task-title">{{ task.title }}</p>
                    <p class="task-date">{{ formatDate(task) }}</p>
                  </div>
                  <span :class="['priority-chip', `priority-${task.priority}`]">
                    {{ PRIORITY_TEXT[task.priority] }}
                  </span>
                  <span :class="['status-chip', `status-${task.status}`]">
                    {{ STATUS_TEXT[task.status] }}
                  </span>
                </div>
              </div>
              <a-empty v-else description="暂无可导出的任务" />
            </a-spin>
          </section>
        </div>

        <div class="export-footer">
          <span class="selected-count">已选择 {{ selectedExportTasks.length }} 条</span>
          <div class="footer-actions">
            <a-button @click="close">取消</a-button>
            <a-button type="primary" :disabled="selectedExportTasks.length === 0" @click="handleExport">
              <template #icon><DownloadOutlined /></template>
              确认导出
            </a-button>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<style scoped>
.modal-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-right: 36px;
}
.import-zone {
  border: 2px dashed #d1d5db;
  border-radius: 16px;
  padding: 36px 16px;
  text-align: center;
  cursor: pointer;
  background: #f9fafb;
}
.import-zone:hover {
  border-color: #00bfa5;
}
.hint {
  margin: 0 0 16px;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.sub {
  margin: 16px 0 0;
  font-size: 12px;
  color: #9ca3af;
}
.export-layout {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 24px;
  min-height: 420px;
}
.export-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 4px;
}
.side-title {
  margin: 0 0 10px;
  color: #9ca3af;
  font-size: 12px;
  font-weight: 700;
}
.side-option {
  width: 100%;
  border: none;
  background: transparent;
  border-radius: 10px;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  text-align: left;
  font-size: 13px;
}
.side-option:hover {
  background: #f3f4f6;
}
.side-option.active {
  background: #ecfdf5;
  color: #00897b;
  font-weight: 600;
}
.status-dot,
.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: #cbd5e1;
  flex-shrink: 0;
}
.status-todo {
  background: #3b82f6;
}
.status-doing {
  background: #f97316;
}
.status-done {
  background: #22c55e;
}
.priority-high {
  background: #fee2e2;
  color: #dc2626;
}
.priority-medium {
  background: #ffedd5;
  color: #ea580c;
}
.priority-low {
  background: #dcfce7;
  color: #16a34a;
}
.priority-dot.priority-high {
  background: #ef4444;
}
.priority-dot.priority-medium {
  background: #f97316;
}
.priority-dot.priority-low {
  background: #22c55e;
}
.export-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.export-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}
.sort-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  border-radius: 9999px;
  border-color: #d1d5db;
  color: #6b7280;
  padding: 0 14px;
  font-weight: 500;
}
.sort-btn:hover {
  border-color: #00bfa5;
  color: #00897b;
}
.export-list {
  height: 356px;
  overflow-y: auto;
  padding: 10px 4px 0 0;
}
.export-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 12px;
  padding: 11px 10px;
  border-radius: 12px;
  cursor: pointer;
}
.export-item:hover {
  background: #f8fafc;
}
.task-info {
  min-width: 0;
}
.task-title {
  margin: 0;
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task-date {
  margin: 2px 0 0;
  color: #9ca3af;
  font-size: 12px;
}
.priority-chip,
.status-chip {
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  padding: 5px 8px;
  white-space: nowrap;
}
.status-chip.status-todo {
  background: #dbeafe;
  color: #2563eb;
}
.status-chip.status-doing {
  background: #ffedd5;
  color: #ea580c;
}
.status-chip.status-done {
  background: #dcfce7;
  color: #16a34a;
}
.export-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 18px;
}
.selected-count {
  color: #6b7280;
  font-size: 13px;
}
.footer-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
@media (max-width: 680px) {
  .export-layout {
    grid-template-columns: 1fr;
    min-height: 0;
  }
  .export-sidebar {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .export-list {
    height: 300px;
  }
  .export-item {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }
  .priority-chip {
    display: none;
  }
  .export-footer {
    align-items: stretch;
    flex-direction: column;
  }
  .footer-actions {
    justify-content: flex-end;
  }
  .modal-title {
    align-items: flex-start;
    flex-direction: column;
    padding-right: 28px;
  }
}
</style>
