import BlankLayout from '@/views/layouts/BlankLayout.vue';
import SidebarLayout from '@/views/layouts/SidebarLayout.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: BlankLayout,
    children: [
      {
        path: '/',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
      },
      {
        path: 'first-login',
        name: 'first-login',
        component: () => import('../views/FirstLoginView.vue'),
      },
    ],
  },
  {
    path: '/',
    component: SidebarLayout,
    children: [
      // 공통
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/LoginView.vue'),
      },
      // 담당자
      {
        path: 'manager/dashboard',
        name: 'manager-dashboard',
        component: () => import('../views/manager/DashboardView.vue'),
      },
      {
        path: 'manager/statistics',
        name: 'manager-statistics',
        component: () => import('../views/manager/ManagerStatisticsView.vue'),
      },
      // 관리자
      {
        path: 'administrator/memberManagement',
        name: 'MemberManagement',
        component: () => import('../views/Administrator/MemberManagement.vue'),
      },
      {
        path: 'administrator/CategoryManagement',
        name: 'CategoryManagement',
        component: () => import('../views/Administrator/CategoryManagement.vue'),
      },
      // 사용자
      {
        path: 'user/tickets',
        name: 'user-tickets',
        component: () => import('../views/user/TicketView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
