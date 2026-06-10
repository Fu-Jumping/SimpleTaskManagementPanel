<script setup>
import { computed } from 'vue';
import { highlight } from '../utils/highlight';

// 任务卡片：展示单个任务，支持关键词高亮、选中态、编辑/删除/完成操作
const props = defineProps({
  task: { type: Object, required: true },
  keyword: { type: String, default: '' },
  selected: { type: Boolean, default: false }
});

const emit = defineEmits(['select', 'edit', 'delete', 'toggle-done']);

const PRIORITY_TEXT = { high: '高优先', medium: '中优先', low: '低优先' };
const STATUS_TEXT = { todo: '待处理', doing: '进行中', done: '已完成' };

const titleHtml = computed(() => highlight(props.task.title, props.keyword));
const descHtml = computed(() => highlight(props.task.description, props.keyword));
const isDone = computed(() => props.task.status === 'done');
</script>

<template>
  <article
    :class="['task-card', { selected, done: isDone }]"
    @click="emit('select', task.id)"
  >
    <div class="card-top">
      <!-- 标题支持关键词高亮，已用 highlight 工具转义，安全 -->
      <h3 class="task-title" v-html="titleHtml" />
      <div class="card-actions" @click.stop>
        <button class="icon-btn" title="标记完成" @click="emit('toggle-done', task)">✓</button>
        <button class="icon-btn" title="编辑" @click="emit('edit', task)">✎</button>
        <button class="icon-btn danger" title="删除" @click="emit('delete', task)">🗑</button>
      </div>
    </div>

    <p v-if="task.description" class="task-desc" v-html="descHtml" />

    <div class="task-foot">
      <span :class="['tag', `tag-${task.priority}`]">
        {{ PRIORITY_TEXT[task.priority] }}
      </span>
      <span class="task-meta">
        <span v-if="task.dueDate" class="due">📅 {{ task.dueDate }}</span>
        <span class="status">{{ STATUS_TEXT[task.status] }}</span>
      </span>
    </div>
  </article>
</template>

<style scoped>
.task-card {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.task-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}
.task-card.selected {
  border-color: #00bfa5;
}
.task-card.done .task-title {
  color: #9ca3af;
  text-decoration: line-through;
}
.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.task-title {
  margin: 0 0 6px;
  font-size: 15px;
  color: #1f2937;
  word-break: break-word;
}
.card-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}
.icon-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  color: #9ca3af;
  font-size: 13px;
  padding: 2px 5px;
  border-radius: 6px;
}
.icon-btn:hover {
  background: #f3f4f6;
  color: #4b5563;
}
.icon-btn.danger:hover {
  background: #fee2e2;
  color: #dc2626;
}
.task-desc {
  margin: 0 0 12px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  word-break: break-word;
}
.task-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.tag {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 9999px;
  white-space: nowrap;
}
.tag-high {
  background: #fee2e2;
  color: #dc2626;
}
.tag-medium {
  background: #ffedd5;
  color: #ea580c;
}
.tag-low {
  background: #dcfce7;
  color: #16a34a;
}
.task-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #9ca3af;
}
/* 关键词高亮样式（来自 highlight 工具的 <mark class="hl">） */
:deep(mark.hl) {
  background: transparent;
  color: #2563eb;
  font-weight: 600;
}
</style>
