import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { SysLog } from '/@/api/sys/model/sysLogModel';

// base url
const BASE_URL = '/api/auth/sys/log';

/**
 * 查询
 *
 * @param params 查询条件
 * @param pager 分页
 */
export function select(params: SysLog, pager: Page<SysLog>) {
  return defHttp.get<Page<SysLog>>({
    url: BASE_URL,
    params: Object.assign(params, pager),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function get(id: string) {
  return defHttp.get<SysLog>({
    url: `${BASE_URL}/${id}`,
  });
}
