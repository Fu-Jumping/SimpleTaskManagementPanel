import { mount } from '@vue/test-utils';
import { describe, expect, it, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import { useAuthStore } from './stores/auth';

function createTestRouter() {
  const routes = [
    {
      path: '/login',
      name: 'login',
      component: { template: '<div>login</div>' },
      meta: { guestOnly: true }
    },
    {
      path: '/',
      name: 'board',
      component: { template: '<div>board</div>' },
      meta: { requiresAuth: true }
    }
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes
  });

  router.beforeEach(async (to) => {
    const auth = useAuthStore();
    if (!auth.isLoggedIn) {
      await auth.restoreSession();
    }

    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      return { name: 'login' };
    }

    if (to.meta.guestOnly && auth.isLoggedIn) {
      return { name: 'board' };
    }

    return true;
  });

  return router;
}

describe('App 路由与登录守卫', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('未登录访问看板首页时会被守卫重定向到登录页', async () => {
    const router = createTestRouter();
    await router.push('/');
    await router.isReady();

    mount(App, {
      global: {
        plugins: [router]
      }
    });

    expect(router.currentRoute.value.name).toBe('login');
  });

  it('本地登录信息损坏时访问首页会被重定向到登录页', async () => {
    const router = createTestRouter();
    localStorage.setItem('tb_token', 'mock-token-test');
    localStorage.setItem('tb_user', '{bad json');

    await router.push('/');
    await router.isReady();

    mount(App, {
      global: {
        plugins: [router]
      }
    });

    expect(router.currentRoute.value.name).toBe('login');
  });

  it('已登录时访问首页可以进入看板', async () => {
    const router = createTestRouter();
    localStorage.setItem('tb_token', 'mock-token-test');
    localStorage.setItem(
      'tb_user',
      JSON.stringify({ id: 'user_mock_001', username: 'tester' })
    );

    await router.push('/');
    await router.isReady();

    mount(App, {
      global: {
        plugins: [router]
      }
    });

    expect(router.currentRoute.value.name).toBe('board');
  });
});
