import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import './styles/global.css';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import { UNAUTHORIZED_EVENT } from './utils/session';

const pinia = createPinia();
const app = createApp(App);

window.addEventListener(UNAUTHORIZED_EVENT, () => {
  const auth = useAuthStore(pinia);
  auth.logout();
  if (router.currentRoute.value.name !== 'login') {
    router.push({ name: 'login' });
  }
});

app.use(pinia).use(Antd).use(router).mount('#app');
