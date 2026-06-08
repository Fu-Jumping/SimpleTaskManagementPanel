<script setup>
import { ref } from 'vue';

// 搜索筛选区：关键词 + 状态 + 优先级组合筛选
// 通过事件把筛选条件交给父组件，由 tasks store 统一处理。
const props = defineProps({
  filters: { type: Object, required: true } // { keyword, status, priority }
});

const emit = defineEmits(['search', 'change', 'reset']);

// 关键词本地副本，回车或点搜索时才提交
const keyword = ref(props.filters.keyword || '');

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

function onStatusChange(value) {
  emit('change', { status: value });
}

function onPriorityChange(value) {
  emit('change', { priority: value });
}

function reset() {
  keyword.value = '';
  emit('reset');
}
</script>

<template>
  <div class="filters">
    <a-input-search
      v-model:value="keyword"
      class="search"
      placeholder="搜索任务标题或描述"
      enter-button="搜索"
      allow-clear
      @search="doSearch"
    />

    <a-select
      :value="filters.status"
      class="select"
      :options="STATUS_OPTIONS"
      @change="onStatusChange"
    />

    <a-select
      :value="filters.priority"
      class="select"
      :options="PRIORITY_OPTIONS"
      @change="onPriorityChange"
    />

    <a-button @click="reset">重置</a-button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.search {
  flex: 1;
  min-width: 220px;
  max-width: 520px;
}
.select {
  width: 140px;
}
</style>
