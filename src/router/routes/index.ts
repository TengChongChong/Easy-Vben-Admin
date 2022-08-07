import type { AppRouteRecordRaw } from '/@/router/types';

import {
  MAIL_VERIFIES,
  PAGE_NOT_FOUND_ROUTE,
  REDIRECT_ROUTE,
  SYS_FUNCTION,
  EXCEPTION_PAGE,
} from '/@/router/routes/basic';

import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};
// 登录
export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/auth/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

// Basic routing without permission
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  REDIRECT_ROUTE,
  SYS_FUNCTION,
  MAIL_VERIFIES,
  ...EXCEPTION_PAGE,
  PAGE_NOT_FOUND_ROUTE,
];
