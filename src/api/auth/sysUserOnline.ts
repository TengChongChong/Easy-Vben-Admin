import { defHttp } from '/@/utils/http/axios';
import { SysUserOnline } from '/@/api/auth/model/sysUserOnlineModel';

// base url
const BASE_URL = '/api/auth/sys/online';

/**
 * 获取在线用户
 *
 * @param params 查询条件
 */
export function select(params: SysUserOnline) {
  return defHttp.get<SysUserOnline[]>({
    url: BASE_URL,
    params: params,
  });
}

/**
 * 踢出用户
 *
 * @param token token
 */
export function forceLogin(token: string) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/force/logout/${token}`,
  });
}
