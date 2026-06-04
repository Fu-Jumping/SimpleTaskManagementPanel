import { createRouter, createWebHistory } from 'vue-router';
import SkeletonView from '../views/SkeletonView.vue';

const routes = [
  {
    path: '/',
    name: 'skeleton',
    component: SkeletonView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

