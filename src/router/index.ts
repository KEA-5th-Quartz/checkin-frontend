import { useMemberStore } from '@/stores/memberStore';
import { MemberType } from '@/types/member';
import BlankLayout from '@/views/layouts/BlankLayout.vue';
import SidebarLayout from '@/views/layouts/SidebarLayout.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    roles?: MemberType[];
    redirectMode?: boolean;
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
        meta: { requiresAuth: false, redirectMode: true },
      },
      {
        path: 'password-reset',
        name: 'password-reset',
        component: () => import('../views/account/PasswordResetView.vue'),
        meta: { requiresAuth: false, redirectMode: true },
      },
      {
        path: '/password-reset-email',
        name: 'password-reset-email',
        component: () => import('../views/account/PasswordResetEmailView.vue'),
        meta: { requiresAuth: false, redirectMode: true },
      },
    ],
  },
  {
    path: '/',
    component: SidebarLayout,
    children: [
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/SettingsView.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN', 'MANAGER', 'USER'] },
      },

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

      {
        path: '/admin/members',
        name: 'MemberManagement',
        component: () => import('../views/Administrator/MemberManagement.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        path: 'admin/deletedMembers',
        name: 'deletedMemberManagement',
        component: () => import('../views/Administrator/DeletedMemberView.vue'),
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
      {
        path: 'user/trash',
        name: 'user-trash',
        component: () => import('../views/user/list/TrashListView.vue'),
        meta: { requiresAuth: true, roles: ['USER'] },
      },
    ],
  },
];

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

  const isRedirectModePage = to.matched.some((record) => record.meta.redirectMode);
  if (isRedirectModePage && !from.name) {
    if (to.path === '/password-reset' && to.query.memberId && to.query.passwordResetToken) {
      return next();
    }

    return next('/');
  }

  if (isLoginPage) {
    if (memberStore.accessToken) {
      return next(getRedirectPath(memberStore.role as MemberType));
    }
    return next();
  }

  if (!memberStore.accessToken && !memberStore.isLoggedOut) {
    await memberStore.restoreAuth();
  }

  if (requiresAuth && !memberStore.accessToken) {
    return next('/');
  }

  if (!hasRequiredRole(memberStore.role as MemberType, requiredRoles)) {
    return next(getRedirectPath(memberStore.role as MemberType));
  }

  if (memberStore.passwordResetToken && to.path !== '/first-login') {
    return next('/first-login');
  }

  next();
});

export default router;
