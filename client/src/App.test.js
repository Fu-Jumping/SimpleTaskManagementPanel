import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import App from './App.vue';
import router from './router';

describe('App', () => {
  it('renders the project skeleton landing content', async () => {
    router.push('/');
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    });

    expect(wrapper.text()).toContain('个人任务看板');
    expect(wrapper.text()).toContain('项目骨架已就绪');
  });
});
