import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guestOnly: true } // 已登录访问会被跳到看板
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/',
    name: 'board',
    component: () => import('../views/BoardView.vue'),
    meta: { requiresAuth: true } // 未登录访问会被踢回登录页
  },
  {
    // 兜底：未知路径回首页
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局登录守卫
router.beforeEach(async (to) => {
  const auth = useAuthStore();
  // 刷新后 store 是空的，先尝试从 localStorage 恢复登录态
  if (!auth.isLoggedIn) {
    await auth.restoreSession();
  }

  // 需要登录但未登录 -> 去登录页
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' };
  }

  // 已登录却访问登录/注册页 -> 去看板
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { name: 'board' };
  }

  return true;
});

export default router;
