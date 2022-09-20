import { SampleWorkFlow } from '/@/api/sample/model/sampleWorkFlowModel';
import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';

// base url
const BASE_URL = '/api/auth/sample/work/flow';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: SampleWorkFlow, page: Page<SampleWorkFlow>) {
  return defHttp.get<Page<SampleWorkFlow>>({
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
  return defHttp.get<SampleWorkFlow>({
    url: `${BASE_URL}/${id}`,
  });
}

/**
 * 新增
 */
export function add() {
  return defHttp.get<SampleWorkFlow>({
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
export function save(params: SampleWorkFlow) {
  return defHttp.post<SampleWorkFlow>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 导出数据
 *
 * @param params 查询条件
 */
export function exportData(params: SampleWorkFlow) {
  return defHttp.get<string>({
    url: `${BASE_URL}/export/data`,
    data: params,
  });
}
