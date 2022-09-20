import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { SchedulerJobLog } from '/@/api/scheduler/model/SchedulerJobModelLog';

// base url
const BASE_URL = '/api/auth/scheduler/job/log';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: SchedulerJobLog, page: Page<SchedulerJobLog>) {
  return defHttp.get<Page<SchedulerJobLog>>({
    url: BASE_URL,
    params: Object.assign(params, page),
  });
}
