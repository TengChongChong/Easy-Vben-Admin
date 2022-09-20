import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { ActivitiTask } from '/@/api/activiti/model/activitiTaskModel';
import { ActivitiTaskInfo } from '/@/api/activiti/model/activitiTaskInfoModel';

// base url
const BASE_URL = '/api/auth/activiti/task';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: ActivitiTask, page: Page<ActivitiTask>) {
  return defHttp.get<Page<ActivitiTask>>({
    url: `${BASE_URL}/status/${params.status}`,
    params: Object.assign(params, page),
  });
}

/**
 * 签收任务
 *
 * @param taskId 任务id
 */
export function claimTask(taskId: string) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}claim/task/${taskId}`,
  });
}

/**
 * 获取任务信息
 *
 * @param taskId 任务Id
 */
export function getTaskInfo(taskId: string) {
  return defHttp.get<ActivitiTaskInfo>({
    url: `${BASE_URL}/${taskId}`,
  });
}

/**
 * 流转任务
 *
 * @param taskId  任务Id
 * @param params params
 */
export function completeTask(taskId: string, params: any) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/complete/task/${taskId}`,
    data: params,
  });
}

/**
 * 撤销申请
 *
 * @param processInstanceId 流程实例ID
 * @param deleteReason 撤销原因
 */
export function revoke(processInstanceId: string, deleteReason: string | null) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/revoke/${processInstanceId}`,
    data: { deleteReason },
  });
}
