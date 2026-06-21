import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as apiLogin, register as apiRegister, getMe } from '../api/auth';
import { clearSession, getStoredToken, getStoredUser, saveSession } from '../utils/session';

// auth store：管理登录状态、token、当前用户
// 第一阶段使用 Mock 数据，后期把 mockLogin / mockRegister 换成真实接口即可
export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref('');
  const user = ref(null); // { id, username }

  // 计算属性：是否已登录
  const isLoggedIn = computed(() => Boolean(token.value));

  // 内部工具：把登录信息写入 state 和 localStorage
  function setSession(nextToken, nextUser) {
    token.value = nextToken;
    user.value = nextUser;
    saveSession(nextToken, nextUser);
  }

  // 登录：成功后保存 token 和用户信息
  async function login(username, password) {
    const { token: nextToken, user: nextUser } = await apiLogin(username, password);
    setSession(nextToken, nextUser);
    return nextUser;
  }

  // 注册：与后端约定一致，注册成功直接返回 token 并进入看板
  async function register(username, password) {
    const { token: nextToken, user: nextUser } = await apiRegister(username, password);
    setSession(nextToken, nextUser);
    return nextUser;
  }

  // 退出登录：清除 token 和用户信息
  function logout() {
    token.value = '';
    user.value = null;
    clearSession();
  }

  // 刷新页面后从 localStorage 恢复登录态，并通过后端校验 token
  async function restoreSession() {
    const savedToken = getStoredToken();
    const savedUser = getStoredUser();

    if (!savedToken || !savedUser) {
      logout();
      return false;
    }

    token.value = savedToken;
    user.value = savedUser;

    try {
      const { user: currentUser } = await getMe();
      setSession(savedToken, currentUser);
      return true;
    } catch {
      logout();
      return false;
    }
  }

  return {
    token,
    user,
    isLoggedIn,
    login,
    register,
    logout,
    restoreSession
  };
});
