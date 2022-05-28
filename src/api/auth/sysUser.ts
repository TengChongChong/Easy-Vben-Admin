import { defHttp } from '/@/utils/http/axios';
import { LoginParams, SysUser } from './model/sysUserModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/auth/sys/user/current',
}

/**
 * 登录
 */
export function login(params: LoginParams, mode: ErrorMessageMode) {
  return defHttp.post<string>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getUserInfo() {
  return defHttp.get<SysUser>({ url: Api.GetUserInfo });
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}
