<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const form = ref({ username: '', password: '' });
const loading = ref(false);

async function handleLogin() {
  if (!form.value.username || !form.value.password) {
    message.warning('请输入用户名和密码');
    return;
  }
  loading.value = true;
  try {
    await auth.login(form.value.username, form.value.password);
    message.success('登录成功');
    router.push({ name: 'board' });
  } catch (err) {
    message.error(err.message || '登录失败');
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
      <h1 class="auth-title">用户登录</h1>
      <p class="auth-subtitle">欢迎回来</p>

      <a-form layout="vertical" @submit.prevent="handleLogin">
        <a-form-item>
          <a-input
            v-model:value="form.username"
            size="large"
            placeholder="用户名或邮箱"
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
        <a-button
          type="primary"
          size="large"
          block
          html-type="submit"
          :loading="loading"
        >
          登录
        </a-button>
      </a-form>

      <p class="auth-foot">
        还没有账号？
        <RouterLink to="/register">立即注册</RouterLink>
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
  margin: 0;
  font-size: 24px;
  color: #00897b;
}
.auth-subtitle {
  margin: 8px 0 24px;
  color: #6b7280;
}
.auth-foot {
  margin-top: auto;
  padding-top: 20px;
  color: #6b7280;
}
</style>
