import type { AppRouteRecordRaw } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
import {
  REDIRECT_NAME,
  LAYOUT,
  EXCEPTION_COMPONENT,
  PAGE_NOT_FOUND_NAME,
} from '/@/router/constant';
import { ExceptionEnum } from '/@/enums/exceptionEnum';

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: PAGE_NOT_FOUND_NAME,
  component: LAYOUT,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: PAGE_NOT_FOUND_NAME,
      component: EXCEPTION_COMPONENT,
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
  ],
};

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: '/redirect',
  component: LAYOUT,
  name: 'RedirectTo',
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: REDIRECT_NAME,
      component: () => import('/@/views/sys/redirect/index.vue'),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
      },
    },
  ],
};

// 公共路由
export const SYS_FUNCTION: AppRouteRecordRaw = {
  path: '/sys-function',
  name: 'SysFunction',
  component: LAYOUT,
  redirect: '/auth/personal/center/view',
  meta: {
    title: '系统功能',
  },
  children: [
    {
      path: '/auth/personal/center/view',
      name: 'AuthPersonalCenterView',
      component: () => import('/@/views/auth/personal/center/View.vue'),
      meta: {
        title: '个人中心',
      },
    },
    {
      path: '/sys/message/view/:key',
      name: 'SysMessageView',
      component: () => import('/@/views/sys/message/View.vue'),
      meta: {
        title: '消息',
      },
    },
    {
      path: '/sys/import/excel/data/view/:importCode',
      name: 'SysImportExcelDataView',
      component: () => import('/@/views/sys/import/excel/data/View.vue'),
      meta: {
        title: '导入数据',
      },
    },
  ],
};

// 邮箱验证
export const MAIL_VERIFIES: AppRouteRecordRaw = {
  path: '/auth/personal/center/mail-verifies/:code',
  name: 'AuthPersonalSettingMailVerifies',
  component: () => import('/@/views/auth/personal/center/MailVerifies.vue'),
  meta: {
    title: '邮箱验证',
    ignoreAuth: true,
  },
};

export const EXCEPTION_PAGE: AppRouteRecordRaw[] = [
  {
    path: '/exception/403',
    name: 'PageNotAccess',
    component: EXCEPTION_COMPONENT,
    props: {
      status: ExceptionEnum.PAGE_NOT_ACCESS,
    },
    meta: {
      title: '403',
      ignoreAuth: true,
    },
  },
  {
    path: '/exception/404',
    name: 'AssetsNotFound',
    component: EXCEPTION_COMPONENT,
    props: {
      status: ExceptionEnum.PAGE_NOT_FOUND,
    },
    meta: {
      title: '404',
      ignoreAuth: true,
    },
  },
  {
    path: '/exception/500',
    name: 'ServiceError',
    component: EXCEPTION_COMPONENT,
    props: {
      status: ExceptionEnum.ERROR,
    },
    meta: {
      title: '500',
      ignoreAuth: true,
    },
  },
  {
    path: '/exception/net-work-error',
    name: 'NetWorkError',
    component: EXCEPTION_COMPONENT,
    props: {
      status: ExceptionEnum.NET_WORK_ERROR,
    },
    meta: {
      title: t('routes.demo.page.netWorkError'),
      ignoreAuth: true,
    },
  },
  {
    path: '/exception/not-data',
    name: 'NotData',
    component: EXCEPTION_COMPONENT,
    props: {
      status: ExceptionEnum.PAGE_NOT_DATA,
    },
    meta: {
      title: t('routes.demo.page.notData'),
      ignoreAuth: true,
    },
  },
];
