import { useMemberStore } from '@/stores/memberStore';
import { MemberType } from '@/types/member';
import BlankLayout from '@/views/layouts/BlankLayout.vue';
import SidebarLayout from '@/views/layouts/SidebarLayout.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    roles?: MemberType[];
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: BlankLayout,
    children: [
      {
        path: '/',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'first-login',
        name: 'first-login',
        component: () => import('../views/FirstLoginView.vue'),
        meta: { requiresAuth: false },
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
        component: () => import('../views/SettingsView.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN', 'MANAGER', 'USER'] },
      },
      // 담당자
      {
        path: 'manager/dashboard',
        name: 'manager-dashboard',
        component: () => import('../views/manager/DashboardView.vue'),
        meta: { requiresAuth: true, roles: ['MANAGER'] },
      },
      {
        path: 'manager/statistics',
        name: 'manager-statistics',
        component: () => import('../views/manager/ManagerStatisticsView.vue'),
        meta: { requiresAuth: true, roles: ['MANAGER'] },
      },
      // 관리자
      {
        path: 'administrator/memberManagement',
        name: 'MemberManagement',
        component: () => import('../views/Administrator/MemberManagement.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        path: 'administrator/CategoryManagement',
        name: 'CategoryManagement',
        component: () => import('../views/Administrator/CategoryManagement.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        path: 'administrator/LogPage',
        name: 'LogPage',
        component: () => import('../views/Administrator/LogPage.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        path: 'administrator/statistics',
        name: 'administrator-statistics',
        component: () => import('../views/Administrator/AdministratorStatisticsView.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'] },
      },
      // 사용자
      {
        path: 'user/ticketlist',
        name: 'user-ticketlist',
        component: () => import('../views/user/list/TicketList.vue'),
        meta: { requiresAuth: true, roles: ['USER'] },
      },
      {
        path: 'user/templatelist',
        name: 'user-templatelist',
        component: () => import('../views/user/list/TemplateList.vue'),
        meta: { requiresAuth: true, roles: ['USER'] },
      },
      {
        path: 'user/ticketcreate',
        name: 'user-ticketcreate',
        component: () => import('../views/user/create/TicketCreate.vue'),
        meta: { requiresAuth: true, roles: ['USER'] },
      },
      {
        path: 'user/templatecreate',
        name: 'user-templatecreate',
        component: () => import('../views/user/create/TemplateCreate.vue'),
        meta: { requiresAuth: true, roles: ['USER'] },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// // role에 따른 리다이렉트 경로 결정 함수
// const getRedirectPath = (role: MemberType): string => {
//   const roleRedirectMap: Record<MemberType, string> = {
//     ADMIN: '/administrator/memberManagement',
//     MANAGER: '/manager/dashboard',
//     USER: '/user/tickets',
//   };
//   return roleRedirectMap[role];
// };

// router.beforeEach((to, from, next) => {
//   const memberStore = useMemberStore();
//   // const memberRole = memberStore.role as MemberType;
//   // 임시로 항상 MANAGER
//   const memberRole = 'MANAGER';
//   // const isAuthenticated = !!memberStore.accessToken;
//   // 임시로 항상 true
//   const isAuthenticated = true;

//   // 로그인이 필요한 페이지인지 확인
//   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

//   // 특정 역할이 필요한 페이지인지 확인
//   const requiredRoles = to.matched.find((record) => record.meta.roles)?.meta.roles;

//   console.log('isAuthenticated', isAuthenticated);

//   if (to.path === '/') {
//     // 이미 로그인한 사용자가 로그인 페이지로 가려고 할 때
//     if (isAuthenticated && memberRole) {
//       const redirectPath = getRedirectPath(memberRole as MemberType);
//       return next(redirectPath);
//     }
//     return next();
//   }

//   if (requiresAuth && !isAuthenticated) {
//     // 인증이 필요한 페이지인데 로그인하지 않은 경우
//     return next('/');
//   }

//   if (requiredRoles && !requiredRoles.includes(memberRole)) {
//     // 권한이 없는 페이지에 접근하려는 경우
//     const redirectPath = getRedirectPath(memberRole);
//     return next(redirectPath);
//   }

//   // 첫 로그인 사용자의 경우 비밀번호 변경 페이지로 강제 이동
//   if (memberStore.passwordChangedAt === null && to.path !== '/first-login' && to.path !== '/') {
//     return next('/first-login');
//   }

//   next();
// });

export default router;
