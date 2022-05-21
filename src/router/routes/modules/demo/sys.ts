import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const sys: AppRouteModule = {
  path: '/sys',
  name: 'sys',
  component: LAYOUT,
  redirect: '/sys/dept/type/view',
  meta: {
    orderNo: 2000,
    icon: 'ion:settings-outline',
    title: '系统管理2',
  },
  children: [
    {
      path: 'dept/type/view',
      name: 'SysDeptTypeView',
      meta: {
        title: '部门类型管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/sys/dept/type/View.vue'),
    },
    {
      path: 'dict/type/list',
      name: 'SysDictTypeList',
      meta: {
        title: '字典类型管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/sys/dict/type/List.vue'),
    },
    {
      path: 'dict/list',
      name: 'SysDictList',
      meta: {
        title: '字典管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/sys/dict/List.vue'),
    },
  ],
};

export default sys;
