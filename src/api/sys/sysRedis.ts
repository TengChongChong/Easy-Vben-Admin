import { defHttp } from '/@/utils/http/axios';
import { SysRedisVO } from '/@/api/sys/model/sysRedisModel';

// base url
const BASE_URL = '/api/auth/sys/redis';

/**
 * 根据前缀查询redis列表
 *
 * @param prefix 前缀
 */
export function selectByPrefix(prefix: string) {
  return defHttp.get<string[]>({
    url: `${BASE_URL}/prefix/${prefix}`,
  });
}

/**
 * 详情
 *
 * @param key key
 */
export function get(key: string) {
  return defHttp.get<SysRedisVO>({
    url: `${BASE_URL}/key/${key}`,
  });
}

/**
 * 删除
 *
 * @param key key
 */
export function remove(key: string) {
  return defHttp.delete<boolean>({
    url: `${BASE_URL}/${key}`,
  });
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function save(params: SysRedisVO) {
  return defHttp.post<boolean>({
    url: BASE_URL,
    data: params,
  });
}
