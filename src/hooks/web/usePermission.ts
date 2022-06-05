import { usePermissionStore } from '/@/store/modules/permission';
import { RoleEnum } from '/@/enums/roleEnum';

import { intersection } from 'lodash-es';
import { isArray } from '/@/utils/is';
import { useUserStore } from '/@/store/modules/user';

export function usePermission() {
  const permissionStore = usePermissionStore();
  const userStore = useUserStore();

  /**
   * 当前登录用户是否有某权限或角色标识
   */
  function hasPermission(value?: RoleEnum | RoleEnum[] | string | string[], def = true): boolean {
    if (!value) {
      return def;
    }

    const allCodeList = permissionStore.getPermCodeList.concat(userStore.getRoleList);
    if (!isArray(value)) {
      return allCodeList.includes(value);
    }
    return (intersection(value, allCodeList) as string[]).length > 0;
  }

  return { hasPermission };
}
