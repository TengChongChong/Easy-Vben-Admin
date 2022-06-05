import { defHttp } from '/@/utils/http/axios';
import { LoginParams, SysUser } from './model/sysUserModel';

import { ErrorMessageMode } from '/#/axios';

/**
 * 登录
 */
export function login(params: LoginParams, mode: ErrorMessageMode) {
  return defHttp.post<string>(
    {
      url: '/api/login',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getCurrentUser() {
  return defHttp.get<SysUser>({ url: '/api/auth/sys/user/current' });
}

export function doLogout() {
  return defHttp.post({ url: '/api/logout' });
}
