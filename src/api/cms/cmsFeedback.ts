import { CmsFeedback } from '/@/api/cms/model/cmsFeedbackModel';
import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';

// base url
const BASE_URL = '/api/auth/cms/feedback';
/**
 * 查询数据
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: CmsFeedback, page: Page<CmsFeedback>) {
  return defHttp.get<Page<CmsFeedback>>({
    url: BASE_URL,
    params: Object.assign(params, page),
  });
}

/**
 * 查询详情
 *
 * @param id id
 */
export function get(id: string) {
  return defHttp.get<CmsFeedback>({
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
 * 导出数据
 *
 * @param params 查询条件
 */
export function exportData(params: CmsFeedback) {
  return defHttp.get<string>({
    url: `${BASE_URL}/export/data`,
    params,
  });
}
