<script setup>
import { ref, watch, computed } from 'vue';
import { message } from 'ant-design-vue';

// 任务抽屉：新建和编辑共用。通过 task prop 是否有 id 区分模式。
const props = defineProps({
  open: { type: Boolean, default: false },
  task: { type: Object, default: null } // null=新建；有值=编辑
});

const emit = defineEmits(['update:open', 'submit', 'delete']);

const STATUS_OPTIONS = [
  { value: 'todo', label: '待处理' },
  { value: 'doing', label: '进行中' },
  { value: 'done', label: '已完成' }
];
const PRIORITY_OPTIONS = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' }
];

const isEdit = computed(() => Boolean(props.task && props.task.id));

function emptyForm() {
  return {
    title: '',
    description: '',
    dueDate: '',
    status: 'todo',
    priority: 'medium'
  };
}

const form = ref(emptyForm());

// 打开抽屉时，根据传入 task 回填表单
watch(
  () => [props.open, props.task],
  ([open]) => {
    if (!open) return;
    if (props.task) {
      form.value = {
        title: props.task.title || '',
        description: props.task.description || '',
        dueDate: props.task.dueDate || '',
        status: props.task.status || 'todo',
        priority: props.task.priority || 'medium'
      };
    } else {
      form.value = emptyForm();
    }
  },
  { immediate: true }
);

function close() {
  emit('update:open', false);
}

function handleSubmit() {
  if (!form.value.title.trim()) {
    message.warning('任务标题必填');
    return;
  }
  // 提交载荷字段严格对应 docs/api.md
  emit('submit', {
    id: props.task?.id || null,
    payload: {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      dueDate: form.value.dueDate || '',
      status: form.value.status,
      priority: form.value.priority
    }
  });
}

function handleDelete() {
  if (props.task?.id) emit('delete', props.task);
}
</script>

<template>
  <a-drawer
    :open="open"
    :title="isEdit ? '编辑任务' : '新建任务'"
    width="420"
    @close="close"
  >
    <a-form layout="vertical">
      <a-form-item label="任务标题" required>
        <a-input v-model:value="form.title" placeholder="输入任务名称..." />
      </a-form-item>

      <a-form-item label="任务描述">
        <a-textarea
          v-model:value="form.description"
          :rows="4"
          placeholder="输入任务描述..."
        />
      </a-form-item>

      <a-form-item label="截止日期">
        <a-input v-model:value="form.dueDate" type="date" />
      </a-form-item>

      <a-form-item label="状态">
        <a-radio-group
          v-model:value="form.status"
          button-style="solid"
          option-type="button"
          :options="STATUS_OPTIONS"
        />
      </a-form-item>

      <a-form-item label="优先级">
        <a-radio-group
          v-model:value="form.priority"
          button-style="solid"
          option-type="button"
          :options="PRIORITY_OPTIONS"
        />
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="drawer-foot">
        <a-button v-if="isEdit" danger type="text" @click="handleDelete">
          删除
        </a-button>
        <span class="spacer" />
        <a-button @click="close">取消</a-button>
        <a-button type="primary" @click="handleSubmit">
          {{ isEdit ? '更新任务' : '保存任务' }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>

<style scoped>
.drawer-foot {
  display: flex;
  align-items: center;
  gap: 8px;
}
.spacer {
  flex: 1;
}
</style>
