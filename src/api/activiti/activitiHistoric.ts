import { defHttp } from '/@/utils/http/axios';
import { ActivitiTask } from '/@/api/activiti/model/activitiTaskModel';

// 流程历史活动记录

// base url
const BASE_URL = '/api/auth/activiti/historic';

/**
 * 查询数据
 *
 * @param processInstanceId 流程实例ID
 * @return List<Historic>
 */
export function selectHistoric(processInstanceId: string) {
  return defHttp.get<ActivitiTask[]>({
    url: `${BASE_URL}/processInstanceId/${processInstanceId}`,
  });
}

/**
 * 根据业务id查询流程实例
 *
 * @param businessKey 业务id
 * @return Task
 */
export function selectTask(businessKey: string) {
  return defHttp.get<ActivitiTask>({
    url: `${BASE_URL}/task`,
    params: {
      businessKey,
    },
  });
}
