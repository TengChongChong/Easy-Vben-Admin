import { AppRouteModule } from '/@/router/types';
import type { MenuModule, Menu, AppRouteRecordRaw } from '/@/router/types';
import { findPath, treeMap } from '/@/utils/helper/treeHelper';
import { cloneDeep } from 'lodash-es';
import { RouteParams } from 'vue-router';
import { toRaw } from 'vue';

export function getAllParentPath<T = Recordable>(treeData: T[], path: string) {
  const menuList = findPath(treeData, (n) => n.path === path) as Menu[];
  return (menuList || []).map((item) => item.path);
}

// Parsing the menu module
export function transformMenuModule(menuModule: MenuModule): Menu {
  const { menu } = menuModule;

  const menuList = [menu];

  return menuList[0];
}

/**
 * 清除隐藏的菜单项
 *
 * @param routeModList 路由
 */
function clearHideMenu(routeModList: AppRouteModule[]) {
  for (let i = 0; i < routeModList.length; i++) {
    if (routeModList[i].meta.hideMenu) {
      // 不显示的菜单
      routeModList.splice(i, 1);
      i--;
    }

    if (routeModList[i]?.children) {
      // @ts-ignore
      clearHideMenu(routeModList[i].children);
    }
  }
}

/**
 * 将路由转为菜单
 *
 * @param routeModList 路由
 * @param routerMapping
 */
export function transformRouteToMenu(routeModList: AppRouteModule[], routerMapping = false) {
  const cloneRouteModList = cloneDeep(routeModList);
  clearHideMenu(cloneRouteModList);
  const routeList: AppRouteRecordRaw[] = [];

  cloneRouteModList.forEach((item) => {
    if (routerMapping && item.meta.hideChildrenInMenu && typeof item.redirect === 'string') {
      item.path = item.redirect;
    }
    if (item.meta?.single) {
      const realItem = item?.children?.[0];
      realItem && routeList.push(realItem);
    } else {
      routeList.push(item);
    }
  });
  const list = treeMap(routeList, {
    conversion: (node: AppRouteRecordRaw) => {
      const { meta: { title, hideMenu = false } = {} } = node;

      return {
        ...(node.meta || {}),
        meta: node.meta,
        name: title,
        hideMenu,
        path: node.path,
        ...(node.redirect ? { redirect: node.redirect } : {}),
      };
    },
  });
  return cloneDeep(list);
}

/**
 * config menu with given params
 */
const menuParamRegex = /(?::)([\s\S]+?)((?=\/)|$)/g;
export function configureDynamicParamsMenu(menu: Menu, params: RouteParams) {
  const { path, paramPath } = toRaw(menu);
  let realPath = paramPath ? paramPath : path;
  const matchArr = realPath.match(menuParamRegex);

  matchArr?.forEach((it) => {
    const realIt = it.substr(1);
    if (params[realIt]) {
      realPath = realPath.replace(`:${realIt}`, params[realIt] as string);
    }
  });
  // save original param path.
  if (!paramPath && matchArr && matchArr.length > 0) {
    menu.paramPath = path;
  }
  menu.path = realPath;
  // children
  menu.children?.forEach((item) => configureDynamicParamsMenu(item, params));
}
