import type { Router, RouteRecordRaw } from 'vue-router';

import { usePermissionStoreWithOut } from '/@/store/modules/permission';

import { PageEnum } from '/@/enums/pageEnum';
import { useUserStoreWithOut } from '/@/store/modules/user';

import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { useDictStoreWithOut } from '/@/store/modules/dict';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

/**
 * 无需登录即可访问的页面，path或name
 */
const whitePathList: string[] = [LOGIN_PATH];

export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut();
  const permissionStore = usePermissionStoreWithOut();
  const dictStore = useDictStoreWithOut();
  router.beforeEach(async (to, from, next) => {
    const token = userStore.getToken;

    // 白名单
    if (
      whitePathList.includes(to.path) ||
      whitePathList.includes(to.name as string) ||
      to.meta.ignoreAuth
    ) {
      if (to.path === LOGIN_PATH && token) {
        const isSessionTimeout = userStore.getSessionTimeout;
        try {
          await userStore.afterLoginAction();
          if (!isSessionTimeout) {
            next((to.query?.redirect as string) || '/');
            return;
          }
        } catch {}
      }
      next();
      return;
    }

    if (!token) {
      // 没有token
      if (to.meta.ignoreAuth) {
        // 如果设置了ignoreAuth表示页面不需要登录
        next();
        return;
      }

      // 转到登录
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }

    // Jump to the 404 page after processing the login
    if (
      from.path === LOGIN_PATH &&
      to.name === PAGE_NOT_FOUND_ROUTE.name &&
      to.fullPath !== PageEnum.BASE_HOME
    ) {
      next(PageEnum.BASE_HOME);
      return;
    }

    if (userStore.getLastUpdateTime === 0) {
      // 如果上次更新时间为空，重新获取当前用户信息
      try {
        await userStore.getCurrentUserAction();
      } catch (err) {
        next();
        return;
      }
    }
    // 初始化字典数据
    dictStore.initDict();

    if (permissionStore.getIsDynamicAddedRoute) {
      next();
      return;
    }
    // 路由
    const routes = await permissionStore.buildRoutesAction();

    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });

    router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);

    permissionStore.setDynamicAddedRoute(true);

    if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
      // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      next({ path: to.fullPath, replace: true, query: to.query });
    } else {
      const redirectPath = (from.query.redirect || to.path) as string;
      const redirect = decodeURIComponent(redirectPath);
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
      next(nextData);
    }
  });
}
