import type { AppRouteRecordRaw, Menu } from '/@/router/types';

import { defineStore } from 'pinia';
import { store } from '/@/store';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from './user';
import { transformObjToRoute, flatMultiLevelRoutes } from '/@/router/helper/routeHelper';
import {
  setCurrentActiveMenu,
  setHideChildrenInMenu,
  transformRouteToMenu,
} from '/@/router/helper/menuHelper';

import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';

import { filter, listToTree } from '/@/utils/helper/treeHelper';

import { useMessage } from '/@/hooks/web/useMessage';
import { PageEnum } from '/@/enums/pageEnum';
import { isNotBlank } from '/@/utils/is';
import { SysPermission } from '/@/api/auth/model/sysPermissionModel';
import { MenuTypeEnum } from '/@/enums/menuEnum';

interface PermissionState {
  // 权限标识
  permCodeList: string[];
  // 是否已经动态添加菜单
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  lastBuildMenuTime: number;
  // 菜单
  backMenuList: Menu[];
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [],
    isDynamicAddedRoute: false,
    lastBuildMenuTime: 0,
    backMenuList: [],
  }),
  getters: {
    getPermCodeList(): string[] {
      return this.permCodeList;
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    /**
     * 设置权限标识
     * @param codeList
     */
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },
    /**
     * 设置菜单
     * @param list
     */
    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },
    /**
     * 菜单最后更新时间
     */
    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },
    /**
     * 是否已经动态更新菜单
     * @param added
     */
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    /**
     * 重置
     */
    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.lastBuildMenuTime = 0;
    },
    /**
     * 更改权限标识
     *
     * @param permissionList 权限
     */
    changePermissionCode(permissionList: SysPermission[]) {
      const codeList: string[] = [];
      permissionList.map(({ code }) => {
        if (isNotBlank(code)) {
          // @ts-ignore
          codeList.push(code);
        }
      });
      this.setPermCodeList(codeList);
    },
    /**
     * 构建路由
     */
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const { t } = useI18n();

      let routes: AppRouteRecordRaw[] = [];

      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { ignoreRoute } = meta || {};
        return !ignoreRoute;
      };

      /**
       * 生成组件名称
       *
       * @param menu 菜单
       */
      function generatorName(menu: SysPermission): string {
        if (menu.component) {
          const paths = menu.component.replace('.vue', '').split(/\/|-/);
          let name = '';
          paths.map((item) => {
            name += item.replace(/^\S/, function (s) {
              return s.toUpperCase();
            });
          });
          return name;
        } else {
          return `${menu.name}-${menu.id}`;
        }
      }

      /**
       * 将后台返回的菜单转为路由对象
       *
       * @param permissionList 后台返回的菜单
       */
      const convertRoute = (permissionList: SysPermission[]): AppRouteRecordRaw[] => {
        let route: AppRouteRecordRaw[] = [];
        const permissionArray: AppRouteRecordRaw[] = [];
        permissionList.map((item) => {
          if (item.type != MenuTypeEnum.BUTTON) {
            const isExternal = item.external === '1';
            const isNewPageOpenMode = item.openMode === '2';
            const routeRecord: AppRouteRecordRaw = {
              // @ts-ignore
              id: item.id,
              parentId: item.parentId,
              path: item.path || `/${item.id}`,
              name: item.name || generatorName(item),
              component: isExternal ? 'IFrame' : item.component || 'LAYOUT',
              meta: {
                // @ts-ignore
                title: item.title,
                icon: item.icon,
                hideMenu: item.display === '0',
                ignoreKeepAlive: false,
              },
            };
            if (routeRecord.path.indexOf(':')) {
              // 动态参数
              routeRecord.meta.dynamicLevel = 3;
              routeRecord.meta.realPath = routeRecord.path.substring(
                0,
                routeRecord.path.indexOf(':') - 1,
              );
            }
            if (isExternal && !isNewPageOpenMode) {
              routeRecord.meta.frameSrc = item.path;
            }
            if (isExternal && !isNewPageOpenMode) {
              routeRecord.path = `/${item.id}`;
            }
            permissionArray.push(routeRecord);
          }
        });
        route = listToTree(permissionArray) as AppRouteRecordRaw[];

        setHideChildrenInMenu(route);

        setCurrentActiveMenu(route, null);

        return route;
      };

      /**
       * 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return;
        let homePath: string = PageEnum.BASE_HOME;
        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/';
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route;
            const currentPath = path.startsWith('/') ? path : parentPath + path;
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string;
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true });
                throw new Error('end');
              }
            }
            children && children.length > 0 && patcher(children, currentPath);
          });
        }

        try {
          patcher(routes);
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return;
      };
      const { createMessage } = useMessage();

      createMessage.loading({
        content: t('sys.app.menuLoading'),
        duration: 1,
      });

      let routeList: AppRouteRecordRaw[] = [];
      try {
        const userStore = useUserStore();
        const userInfo = userStore.getCurrentUser;

        this.changePermissionCode(userInfo.permissionList as SysPermission[]);

        routeList = convertRoute(userInfo.permissionList as SysPermission[]);
      } catch (error) {
        console.error(error);
      }

      // Dynamically introduce components
      routeList = transformObjToRoute(routeList);

      // 根据路由生成菜单
      const backMenuList = transformRouteToMenu(routeList);
      this.setBackMenuList(backMenuList);

      // remove meta.ignoreRoute item
      routeList = filter(routeList, routeRemoveIgnoreFilter);
      routeList = routeList.filter(routeRemoveIgnoreFilter);

      routeList = flatMultiLevelRoutes(routeList);
      routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];

      patchHomeAffix(routes);
      return routes;
    },
  },
});

// Need to be used outside the setup
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
