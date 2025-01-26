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
  // 관리자
  {
    path: '/administrator/memberManagement',
    name: 'MemberManagement',
    component: () => import('../views/Administrator/MemberManagement.vue'),
  },
  {
    path: '/administrator/CategoryManagement',
    name: 'CategoryManagement',
    component: () => import('../views/Administrator/CategoryManagement.vue'),
  },
  {
    path: '/administrator/LogPage',
    name: 'LogPage',
    component: () => import('../views/Administrator/LogPage.vue'),
  },
  // 사용자
  {
    path: '/user/tickets',
    name: 'user-tickets',
    component: () => import('../views/user/TicketView.vue'),
  },
  {
    path: '/user/templates',
    name: 'user-templates',
    component: () => import('../views/user/TemplateLists.vue'),
  },
  {
    path: '/user/addticket',
    name: 'user-addticket',
    component: () => import('../views/user/AddTicket.vue'),
  },
  {
    path: '/user/addtemplate',
    name: 'user-addtemplate',
    component: () => import('../views/user/AddTemplate.vue'),
  },
  {
    path: '/user/usersettings',
    name: 'user-usersettings',
    component: () => import('../views/user/UserSettings.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
