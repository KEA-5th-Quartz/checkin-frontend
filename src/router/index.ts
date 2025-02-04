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
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
      },
      {
        path: '/',
        name: 'login',
        component: () => import('../views/account/LoginView.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'first-login',
        name: 'first-login',
        component: () => import('../views/account/FirstLoginView.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'password-reset',
        name: 'password-reset',
        component: () => import('../views/account/PasswordResetView.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: '/password-reset-email',
        name: 'password-reset-email',
        component: () => import('../views/account/PasswordResetEmailView.vue'),
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
        path: '/admin/members',
        name: 'MemberManagement',
        component: () => import('../views/Administrator/MemberManagement.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        path: 'admin/categories',
        name: 'CategoryManagement',
        component: () => import('../views/Administrator/CategoryManagement.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        path: 'admin/log',
        name: 'LogPage',
        component: () => import('../views/Administrator/LogPage.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        path: 'admin/statistics',
        name: 'administrator-statistics',
        component: () => import('../views/Administrator/AdministratorStatisticsView.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        path: 'admin',
        name: 'administrator-main',
        component: () => import('../views/Administrator/AdminMainView.vue'),
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

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });
// role에 따른 리다이렉트 경로 결정 함수
const getRedirectPath = (role: MemberType): string => {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'MANAGER':
      return '/manager/dashboard';
    case 'USER':
      return '/user/ticketlist';
    default:
      return '/';
  }
};

// 권한 검사 함수
const hasRequiredRole = (userRole: MemberType | '', requiredRoles?: MemberType[]): boolean => {
  if (!requiredRoles) return true;
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
};

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  const memberStore = useMemberStore();
  const isLoginPage = to.path === '/';
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiredRoles = to.matched.find((record) => record.meta.roles)?.meta.roles;

  // 1. 로그인 페이지로 가는 경우
  if (isLoginPage) {
    if (memberStore.accessToken) {
      // 이미 로그인된 경우 역할에 맞는 페이지로 리다이렉트
      return next(getRedirectPath(memberStore.role as MemberType));
    }
    return next();
  }

  // 2. 토큰이 없는 경우 토큰 복구 시도
  if (!memberStore.accessToken && !memberStore.isLoggedOut) {
    await memberStore.restoreAuth();
  }

  // 3. 인증이 필요한 페이지 체크
  if (requiresAuth && !memberStore.accessToken) {
    return next('/');
  }

  // 4. 권한 체크
  if (!hasRequiredRole(memberStore.role as MemberType, requiredRoles)) {
    return next(getRedirectPath(memberStore.role as MemberType));
  }

  // 5. 첫 로그인 사용자의 비밀번호 변경 페이지 리다이렉트
  if (memberStore.passwordResetToken && to.path !== '/first-login') {
    return next('/first-login');
  }

  next();
});

export default router;
