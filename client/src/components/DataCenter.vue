<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { useTasksStore } from '../stores/tasks';

// 数据中心：导入 JSON / 导出当前筛选任务
const props = defineProps({
  open: { type: Boolean, default: false }
});
const emit = defineEmits(['update:open']);

const tasksStore = useTasksStore();

const activeTab = ref('import'); // 'import' | 'export'
const importing = ref(false);
const fileInput = ref(null);

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

// 导出当前筛选任务为 JSON 文件
async function handleExport() {
  try {
    const data = await tasksStore.exportTasks();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    message.success(`已导出 ${data.count} 条任务`);
  } catch (err) {
    message.error(err.message || '导出失败');
  }
}
</script>

<template>
  <a-modal :open="open" title="数据设置" :footer="null" @cancel="close">
    <a-tabs v-model:activeKey="activeTab" centered>
      <a-tab-pane key="import" tab="导入">
        <div class="import-zone" @click="triggerPick">
          <p class="hint">📄 点击选择 JSON 文件上传</p>
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
        <div class="export-zone">
          <p>将按当前筛选条件导出任务为 JSON 文件。</p>
          <a-button type="primary" @click="handleExport">确认导出</a-button>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<style scoped>
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
}
.sub {
  margin: 16px 0 0;
  font-size: 12px;
  color: #9ca3af;
}
.export-zone {
  text-align: center;
  padding: 24px 0;
}
.export-zone p {
  color: #6b7280;
  margin-bottom: 20px;
}
</style>
