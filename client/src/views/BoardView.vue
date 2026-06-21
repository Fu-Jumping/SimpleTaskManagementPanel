<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import draggable from 'vuedraggable';
import { useAuthStore } from '../stores/auth';
import { useTasksStore } from '../stores/tasks';
import TaskCard from '../components/TaskCard.vue';
import TaskDrawer from '../components/TaskDrawer.vue';
import TaskFilters from '../components/TaskFilters.vue';
import DataCenter from '../components/DataCenter.vue';

const router = useRouter();
const auth = useAuthStore();
const tasksStore = useTasksStore();

// 看板视图：'status' | 'priority'
const boardMode = ref('status');

const STATUS_COLUMNS = [
  { key: 'todo', label: '待处理' },
  { key: 'doing', label: '进行中' },
  { key: 'done', label: '已完成' }
];
const PRIORITY_COLUMNS = [
  { key: 'high', label: '高优先级' },
  { key: 'medium', label: '中优先级' },
  { key: 'low', label: '低优先级' }
];
const columns = computed(() =>
  boardMode.value === 'status' ? STATUS_COLUMNS : PRIORITY_COLUMNS
);

// 本地看板数据：{ 列key: [task...] }，供 vuedraggable 直接拖拽
const localColumns = ref({});

// 把 store 的分组数据同步到本地（拖拽组件需要可变数组）
function syncLocal() {
  const grouped =
    boardMode.value === 'status'
      ? tasksStore.tasksByStatus
      : tasksStore.tasksByPriority;
  const next = {};
  columns.value.forEach((col) => {
    next[col.key] = [...(grouped[col.key] || [])];
  });
  localColumns.value = next;
}

watch(
  () => [tasksStore.tasks, boardMode.value],
  () => syncLocal(),
  { deep: true }
);

const totalCount = computed(() => tasksStore.tasks.length);

// ===== 抽屉（新建/编辑）=====
const drawerOpen = ref(false);
const editingTask = ref(null);

function openCreate() {
  editingTask.value = null;
  drawerOpen.value = true;
}
function openEdit(task) {
  editingTask.value = task;
  drawerOpen.value = true;
}
async function handleSubmit({ id, payload }) {
  try {
    if (id) {
      await tasksStore.updateTask(id, payload);
      message.success('任务已更新');
    } else {
      await tasksStore.createTask(payload);
      message.success('任务已创建');
    }
    drawerOpen.value = false;
  } catch (err) {
    message.error(err.message || '保存失败');
  }
}

// ===== 删除（按钮 / Del 快捷键共用，统一确认）=====
function confirmDelete(task) {
  if (!task) return;
  Modal.confirm({
    title: '确认删除任务',
    content: `确定要删除「${task.title}」吗？此操作不可恢复。`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      try {
        await tasksStore.deleteTask(task.id);
        message.success('任务已删除');
        if (drawerOpen.value && editingTask.value?.id === task.id) {
          drawerOpen.value = false;
        }
      } catch (err) {
        message.error(err.message || '删除失败');
      }
    }
  });
}

// ===== 标记完成（卡片上的 ✓）=====
async function toggleDone(task) {
  try {
    const nextStatus = task.status === 'done' ? 'todo' : 'done';
    await tasksStore.updateTask(task.id, { status: nextStatus });
  } catch (err) {
    message.error(err.message || '操作失败');
  }
}

// ===== 选中 =====
function selectTask(id) {
  tasksStore.selectTask(id);
}

// ===== 拖拽结束：根据当前视图组装 reorder 载荷 =====
// 状态看板：跨列改 status+order；优先级看板：跨列改 priority+order，绝不改 status
async function onDragEnd() {
  const items = [];
  Object.entries(localColumns.value).forEach(([colKey, list]) => {
    list.forEach((task, index) => {
      const item = { id: task.id, order: index };
      if (boardMode.value === 'status') {
        item.status = colKey;
      } else {
        item.priority = colKey;
      }
      items.push(item);
    });
  });
  try {
    await tasksStore.reorderTasks(items);
  } catch {
    message.error('排序同步失败，已恢复');
    syncLocal();
  }
}

// ===== 筛选 =====
async function onSearch(keyword) {
  await tasksStore.setFilters({ keyword });
}
async function onFilterChange(patch) {
  await tasksStore.setFilters(patch);
}
async function onFilterReset() {
  await tasksStore.resetFilters();
}

// ===== 数据中心 =====
const dataCenterOpen = ref(false);

async function handleGenerateSample() {
  try {
    const { created } = await tasksStore.generateSample();
    message.success(`已生成 ${created} 条示例任务`);
  } catch (err) {
    message.error(err.message || '生成示例数据失败');
  }
}

// ===== 退出登录 =====
function handleLogout() {
  auth.logout();
  router.push({ name: 'login' });
}

// ===== Del 快捷键删除选中任务 =====
function onKeydown(e) {
  if (e.key !== 'Delete') return;
  // 输入框/文本域聚焦时不触发
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  const task = tasksStore.selectedTask;
  if (!task) return; // 未选中不操作
  confirmDelete(task);
}

onMounted(async () => {
  await tasksStore.fetchTasks();
  syncLocal();
  window.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <div class="board-wrap">
    <!-- 顶部栏 -->
    <header class="board-header">
      <div class="header-left">
        <div class="brand">任务管理</div>

        <div :class="['mode-switch', `mode-${boardMode}`]">
          <span class="mode-indicator" />
          <button
            :class="['mode-btn', { active: boardMode === 'status' }]"
            @click="boardMode = 'status'"
          >
            状态
          </button>
          <button
            :class="['mode-btn', { active: boardMode === 'priority' }]"
            @click="boardMode = 'priority'"
          >
            优先级
          </button>
        </div>
      </div>

      <div class="header-search">
        <TaskFilters
          :filters="tasksStore.filters"
          @search="onSearch"
          @change="onFilterChange"
          @reset="onFilterReset"
        />
      </div>

      <div class="header-right">
        <a-button type="primary" @click="openCreate">+ 新建任务</a-button>
        <a-dropdown>
          <a-avatar
            :src="`https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(auth.user?.username || 'U')}`"
            :size="36"
            style="cursor: pointer; border: 2px solid #e5e7eb;"
          />
          <template #overlay>
            <a-menu>
              <a-menu-item key="data" @click="dataCenterOpen = true">
                数据设置
              </a-menu-item>
              <a-menu-item key="sample" @click="handleGenerateSample">
                生成示例数据
              </a-menu-item>
              <a-menu-item key="logout" @click="handleLogout">
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </header>

    <div class="board-summary">
      <p class="result-count">共 {{ totalCount }} 个任务</p>
    </div>

    <!-- 看板三列 -->
    <main class="board-body">
      <a-spin :spinning="tasksStore.loading">
        <div class="columns">
          <section v-for="col in columns" :key="col.key" class="column">
            <div class="column-head">
              <span class="column-title">{{ col.label }}</span>
              <span class="column-count">
                {{ (localColumns[col.key] || []).length }}
              </span>
            </div>

            <div class="column-content">
              <!-- vuedraggable：group 相同的列之间可互相拖拽 -->
              <draggable
                v-model="localColumns[col.key]"
                :group="boardMode"
                item-key="id"
                class="column-body"
                ghost-class="drag-ghost"
                @end="onDragEnd"
              >
                <template #item="{ element }">
                  <div>
                    <TaskCard
                      :task="element"
                      :keyword="tasksStore.filters.keyword"
                      :selected="tasksStore.selectedTaskId === element.id"
                      @select="selectTask"
                      @edit="openEdit"
                      @delete="confirmDelete"
                      @toggle-done="toggleDone"
                    />
                  </div>
                </template>
              </draggable>

              <a-empty
                v-if="(localColumns[col.key] || []).length === 0"
                class="empty"
                description="暂无任务"
              />
            </div>
          </section>
        </div>
      </a-spin>
    </main>

    <!-- 新建/编辑抽屉 -->
    <TaskDrawer
      v-model:open="drawerOpen"
      :task="editingTask"
      @submit="handleSubmit"
      @delete="confirmDelete"
    />

    <!-- 数据中心 -->
    <DataCenter v-model:open="dataCenterOpen" />
  </div>
</template>

<style scoped>
.board-wrap {
  height: 100vh;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.board-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: minmax(250px, 1fr) minmax(360px, 560px) minmax(250px, 1fr);
  align-items: center;
  gap: 18px;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 0;
}
.brand {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  white-space: nowrap;
}
.mode-switch {
  position: relative;
  display: inline-flex;
  background: #f3f4f6;
  border-radius: 9999px;
  padding: 4px;
  flex-shrink: 0;
}
.mode-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc((100% - 8px) / 2);
  border-radius: 9999px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.22s ease;
}
.mode-priority .mode-indicator {
  transform: translateX(100%);
}
.mode-btn {
  position: relative;
  z-index: 1;
  border: none;
  background: transparent;
  padding: 6px 18px;
  border-radius: 9999px;
  cursor: pointer;
  color: #6b7280;
}
.mode-btn.active {
  color: #00897b;
  font-weight: 600;
}
.header-search {
  display: flex;
  justify-content: center;
  min-width: 0;
}
.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-width: 0;
}
.board-summary {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 24px 0;
}
.result-count {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  white-space: nowrap;
}
.board-body {
  flex: 1;
  min-height: 0;
  padding: 16px 24px 24px;
  overflow: hidden;
}
.board-body :deep(.ant-spin-nested-loading),
.board-body :deep(.ant-spin-container) {
  height: 100%;
  min-height: 0;
}
.columns {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  align-items: stretch;
}
.column {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.column-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.column-title {
  font-weight: 600;
  color: #1f2937;
}
.column-count {
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 9999px;
  background: #e5e7eb;
  color: #4b5563;
  font-size: 12px;
  display: inline-grid;
  place-items: center;
}
.column-content {
  position: relative;
  flex: 1;
  min-height: 0;
}
.column-body {
  position: relative;
  z-index: 1;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}
.drag-ghost {
  opacity: 0.4;
}
.empty {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
}
.empty :deep(.ant-empty-description) {
  color: #9ca3af;
  font-size: 13px;
}
@media (max-width: 768px) {
  .columns {
    grid-template-columns: 1fr;
    height: auto;
  }
  .board-wrap {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }
  .board-body {
    overflow: visible;
  }
  .column {
    max-height: none;
  }
  .column-body {
    max-height: none;
    overflow: visible;
  }
  .board-header {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .header-left {
    justify-content: space-between;
    gap: 12px;
  }
  .brand {
    width: auto;
  }
  .header-search {
    width: 100%;
  }
  .header-right {
    justify-content: flex-end;
  }
}
</style>
