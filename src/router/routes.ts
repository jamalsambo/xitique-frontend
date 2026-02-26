import authGuard from './authGuard';
import { RouteRecordRaw } from 'vue-router';
import { groupRoutes } from './pageRoutes';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: authGuard,
    children: [
      {
        path: '',
        component: () => import('src/pages/home/pages/HomePage.vue'),
      },
      {
        path: '/contributions',
        component: () => import('src/pages/ContributionsPage.vue'),
      },
      {
        path: '/settings',
        component: () => import('src/pages/SettingsPage.vue'),
      },
      ...groupRoutes,
    ],
  },
  {
    path: '/login',
    component: () => import('src/pages/auth/pages/LoginPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    component: () => import('src/pages/auth/pages/RegisterPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/account-verify',
    component: () => import('src/pages/auth/pages/VerifyOtpPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/forgot-password',
    component: () => import('../pages/auth/pages/ForgotPasswordPage.vue'),
    meta: { guestOnly: true },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
