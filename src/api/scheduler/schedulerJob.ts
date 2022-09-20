import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { SchedulerJob } from '/@/api/scheduler/model/SchedulerJobModel';

// base url
const BASE_URL = '/api/auth/scheduler/job';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: SchedulerJob, page: Page<SchedulerJob>) {
  return defHttp.get<Page<SchedulerJob>>({
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
  return defHttp.get<SchedulerJob>({
    url: `${BASE_URL}/${id}`,
  });
}

/**
 * 新增
 */
export function add() {
  return defHttp.get<SchedulerJob>({
    url: `${BASE_URL}/add`,
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
export function save(params: SchedulerJob) {
  return defHttp.post<SchedulerJob>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 开启
 *
 * @param id 数据id
 */
export function start(id) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/start/${id}`,
  });
}

/**
 * 暂停
 *
 * @param id 数据id
 */
export function pause(id) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/pause/${id}`,
  });
}

/**
 * 全部开启
 */
export function startAll() {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/start/all`,
  });
}

/**
 * 全部暂停
 */
export function pauseAll() {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/pause/all`,
  });
}

/**
 * 立即执行指定任务
 *
 * @param id 数据id
 */
export function immediateExecution(id) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/immediate/execution/${id}`,
  });
}
