import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { ActivitiModel } from '/@/api/activiti/model/activitiModelModel';

// base url
const BASE_URL = '/api/auth/activiti/model';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: ActivitiModel, page: Page<ActivitiModel>) {
  return defHttp.get<Page<ActivitiModel>>({
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
  return defHttp.get<ActivitiModel>({
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

/**
 * 保存
 *
 * @param params 表单数据
 */
export function save(params: ActivitiModel) {
  return defHttp.post<ActivitiModel>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 部署流程
 *
 * @param id id
 */
export function deploymentProcess(id: string) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/deployment/process/${id}`,
  });
}

/**
 * 导出模型 xml
 *
 * @param id 模型id
 * @return sys download id
 */
export function exportXml(id: string) {
  return defHttp.get<string>({
    url: `${BASE_URL}/export/${id}`,
  });
}

/**
 * 根据模型标识查询流程定义ID
 *
 * @param key 模型标识
 * @return 流程定义ID
 */
export function getProcessDefinitionId(key: string) {
  return defHttp.get<string>({
    url: `${BASE_URL}/process/definition/id/${key}`,
  });
}
