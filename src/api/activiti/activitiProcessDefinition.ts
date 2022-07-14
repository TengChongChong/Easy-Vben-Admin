import { defHttp } from '/@/utils/http/axios';
import {
  ActivitiProcessDefinition,
  ProcessDefinitionStartResult,
} from '/@/api/activiti/model/activitiProcessDefinition';

// base url
const BASE_URL = '/api/auth/activiti/process/definition';

/**
 * 启动流程
 *
 * @param params 流程数据
 */
export function startProcessInstance(params: ActivitiProcessDefinition) {
  return defHttp.post<ProcessDefinitionStartResult>({
    url: `${BASE_URL}/process/instance`,
    data: params,
  });
}
