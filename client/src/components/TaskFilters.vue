<script setup>
import { ref, watch } from 'vue';
import {
  ArrowLeftOutlined,
  FilterOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue';

// 搜索筛选区：关键词 + 状态 + 优先级组合筛选
// 通过事件把筛选条件交给父组件，由 tasks store 统一处理。
const props = defineProps({
  filters: { type: Object, required: true } // { keyword, status, priority }
});

const emit = defineEmits(['search', 'change', 'reset']);

// 关键词本地副本，回车或点搜索时才提交
const keyword = ref(props.filters.keyword || '');
const popoverOpen = ref(false);

watch(
  () => props.filters.keyword,
  (value) => {
    keyword.value = value || '';
  }
);

watch(keyword, (value) => {
  if (value === '' && props.filters.keyword) {
    emit('search', '');
  }
});

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'todo', label: '待处理' },
  { value: 'doing', label: '进行中' },
  { value: 'done', label: '已完成' }
];
const PRIORITY_OPTIONS = [
  { value: '', label: '全部优先级' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' }
];

function doSearch() {
  emit('search', keyword.value.trim());
}

function backToAll() {
  keyword.value = '';
  emit('search', '');
}

function onStatusChange(value) {
  emit('change', { status: value });
}

function onPriorityChange(value) {
  emit('change', { priority: value });
}

function reset() {
  keyword.value = '';
  popoverOpen.value = false;
  emit('reset');
}
</script>

<template>
  <div class="filters">
    <div class="search-group">
      <a-button
        :class="['back-btn', { visible: filters.keyword }]"
        :disabled="!filters.keyword"
        title="返回全部任务"
        @click="backToAll"
      >
        <template #icon><ArrowLeftOutlined /></template>
        返回
      </a-button>

      <a-input
        v-model:value="keyword"
        class="search"
        placeholder="搜索任务标题或描述"
        allow-clear
        @pressEnter="doSearch"
      >
        <template #prefix>
          <SearchOutlined class="search-icon" />
        </template>
        <template #suffix>
          <button class="search-btn" type="button" @click="doSearch">搜索</button>
        </template>
      </a-input>
    </div>

    <a-popover
      v-model:open="popoverOpen"
      trigger="click"
      placement="bottomRight"
      overlay-class-name="task-filter-popover"
    >
      <template #content>
        <div class="filter-panel">
          <label class="field">
            <span>状态</span>
            <a-select
              :value="filters.status"
              class="select"
              :options="STATUS_OPTIONS"
              @change="onStatusChange"
            />
          </label>

          <label class="field">
            <span>优先级</span>
            <a-select
              :value="filters.priority"
              class="select"
              :options="PRIORITY_OPTIONS"
              @change="onPriorityChange"
            />
          </label>

          <div class="filter-actions">
            <a-button size="small" @click="reset">
              <template #icon><ReloadOutlined /></template>
              重置
            </a-button>
          </div>
        </div>
      </template>

      <a-button class="filter-btn">
        <template #icon><FilterOutlined /></template>
        筛选
      </a-button>
    </a-popover>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  width: 100%;
}
.search-group {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 0;
}
.back-btn {
  border-radius: 9999px;
  width: 82px;
  visibility: hidden;
  pointer-events: none;
  flex-shrink: 0;
}
.back-btn.visible {
  visibility: visible;
  pointer-events: auto;
}
.search {
  flex: 1;
  min-width: 260px;
  max-width: 520px;
  border-radius: 9999px;
  padding: 5px 6px 5px 12px;
  border-color: #e5e7eb;
}
.search:focus-within,
.search:hover {
  border-color: #00bfa5;
  box-shadow: 0 0 0 2px rgba(0, 191, 165, 0.12);
}
.search-icon {
  color: #9ca3af;
}
.search-btn {
  border: none;
  background: #00bfa5;
  color: #fff;
  border-radius: 9999px;
  padding: 4px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.search-btn:hover {
  background: #00a693;
}
.filter-btn {
  border-radius: 9999px;
  border-color: #00bfa5;
  color: #00897b;
  font-weight: 500;
  flex-shrink: 0;
  min-width: 88px;
}
.filter-panel {
  width: 220px;
}
.field {
  display: block;
  margin-bottom: 14px;
}
.field span {
  display: block;
  margin-bottom: 6px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
}
.select {
  width: 100%;
}
.filter-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 2px;
}
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .search-group {
    justify-content: stretch;
  }
  .search {
    min-width: 0;
    max-width: none;
  }
  .back-btn {
    padding-inline: 12px;
  }
  .filter-btn {
    width: 100%;
  }
}
</style>
