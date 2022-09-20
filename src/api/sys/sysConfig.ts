import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { SysConfig } from '/@/api/sys/model/sysConfigModel';

// base url
const BASE_URL = '/api/auth/sys/config';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: SysConfig, page: Page<SysConfig>) {
  return defHttp.get<Page<SysConfig>>({
    url: BASE_URL,
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function get(id: string) {
  return defHttp.get<SysConfig>({
    url: `${BASE_URL}/${id}`,
  });
}

/**
 * 根据key获取配置
 *
 * @param key key
 */
export function getByKey(key: string) {
  return defHttp.get<SysConfig>({
    url: `/api/sys/config/key/${key}`,
  });
}

/**
 * 删除
 *
 * @param ids ids
 */
export function remove(ids: string) {
  return defHttp.delete<boolean>({
    url: `${BASE_URL}/${ids}`,
  });
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function save(params: SysConfig) {
  return defHttp.post<SysConfig>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 刷新缓存数据
 */
export function refresh() {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/refresh`,
  });
}
