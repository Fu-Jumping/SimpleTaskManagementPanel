<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const form = ref({ username: '', password: '', confirm: '' });
const loading = ref(false);

async function handleRegister() {
  const { username, password, confirm } = form.value;
  if (!username || !password) {
    message.warning('请输入用户名和密码');
    return;
  }
  if (!confirm) {
    message.warning('请确认密码');
    return;
  }
  if (password !== confirm) {
    message.warning('两次输入的密码不一致');
    return;
  }
  loading.value = true;
  try {
    await auth.register(username, password);
    message.success('注册成功');
    router.push({ name: 'board' });
  } catch (err) {
    message.error(err.message || '注册失败');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <div class="auth-logo" aria-label="任务看板">
        <span class="logo-column">
          <i />
          <i />
        </span>
        <span class="logo-column">
          <i />
        </span>
        <span class="logo-column">
          <i />
          <i />
        </span>
      </div>
      <h1 class="auth-title">创建新账号</h1>

      <a-form layout="vertical" @submit.prevent="handleRegister">
        <a-form-item>
          <a-input
            v-model:value="form.username"
            size="large"
            placeholder="用户名"
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-input-password
            v-model:value="form.password"
            size="large"
            placeholder="密码"
          />
        </a-form-item>
        <a-form-item>
          <a-input-password
            v-model:value="form.confirm"
            size="large"
            placeholder="确认密码"
          />
        </a-form-item>
        <a-button
          type="primary"
          size="large"
          block
          html-type="submit"
          :loading="loading"
        >
          注册
        </a-button>
      </a-form>

      <p class="auth-foot">
        已有账号？
        <RouterLink to="/login">立即登录</RouterLink>
      </p>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #f0f2f5;
}
.auth-card {
  width: min(420px, 100%);
  min-height: 480px;
  padding: 40px 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 18px 50px rgba(31, 41, 51, 0.08);
  text-align: center;
  display: flex;
  flex-direction: column;
}
.auth-logo {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 10px;
  border-radius: 16px;
  background: linear-gradient(135deg, #00bfa5, #00897b);
  box-shadow: 0 10px 24px rgba(0, 137, 123, 0.22);
}
.logo-column {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.logo-column i {
  display: block;
  height: 10px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.92);
}
.logo-column:nth-child(2) i {
  height: 24px;
}
.auth-title {
  margin: 0 0 24px;
  font-size: 24px;
  color: #1f2937;
}
.auth-foot {
  margin-top: auto;
  padding-top: 20px;
  color: #6b7280;
}
</style>
