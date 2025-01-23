import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  // 공통
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/HomeView.vue'),
  },
  // 담당자
  {
    path: '/manager/dashboard',
    name: 'manager-dashboard',
    component: () => import('../views/manager/DashboardView.vue'),
  },
  {
    path: '/manager/statistics',
    name: 'manager-statistics',
    component: () => import('../views/manager/ManagerStatisticsView.vue'),
  },
  // 사용자
  {
    path: '/user/tickets',
    name: 'user-tickets',
    component: () => import('../views/user/TicketView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
