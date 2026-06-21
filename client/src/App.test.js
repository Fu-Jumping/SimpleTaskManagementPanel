import { mount } from '@vue/test-utils';
import { describe, expect, it, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import App from './App.vue';
import router from './router';

describe('App 路由与登录守卫', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('未登录访问看板首页时会被守卫重定向到登录页', async () => {
    router.push('/');
    await router.isReady();

    mount(App, {
      global: {
        plugins: [router]
      }
    });

    expect(router.currentRoute.value.name).toBe('login');
  });

  it('已登录时访问首页可以进入看板', async () => {
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
