import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { SysException } from '/@/api/sys/model/sysExceptionModel';

// base url
const BASE_URL = '/api/auth/sys/exception';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: SysException, page: Page<SysException>) {
  return defHttp.get<Page<SysException>>({
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
  return defHttp.get<SysException>({
    url: `${BASE_URL}/${id}`,
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
