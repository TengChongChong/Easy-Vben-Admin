import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { ActivitiProcess } from '/@/api/activiti/model/activitiProcessModel';

// base url
const BASE_URL = '/api/auth/activiti/process';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: ActivitiProcess, page: Page<ActivitiProcess>) {
  return defHttp.get<Page<ActivitiProcess>>({
    url: BASE_URL,
    params: Object.assign(params, page),
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
 * 流程转模型
 *
 * @param params 表单数据
 */
export function convertToModel(params: ActivitiProcess) {
  return defHttp.post<boolean>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 挂起流程
 *
 * @param processDefinitionId     流程id
 * @param suspendProcessInstances 如果为true，将同时挂起此流程正在进行的任务
 */
export function suspend(processDefinitionId: string, suspendProcessInstances: boolean) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/suspend/${processDefinitionId}/${suspendProcessInstances}`,
  });
}

/**
 * 激活流程
 *
 * @param processDefinitionId     流程id
 * @param suspendProcessInstances 如果为true，将同时激活此流程正在进行的任务
 */
export function activation(processDefinitionId: string, suspendProcessInstances: boolean) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/activation/${processDefinitionId}/${suspendProcessInstances}`,
  });
}
