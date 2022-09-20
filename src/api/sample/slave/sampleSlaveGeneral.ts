import { SampleSlaveGeneral } from '/@/api/sample/model/sampleSlaveGeneralModel';
import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';

// base url
const BASE_URL = '/api/auth/sample/slave/general';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: SampleSlaveGeneral, page: Page<SampleSlaveGeneral>) {
  return defHttp.get<Page<SampleSlaveGeneral>>({
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
  return defHttp.get<SampleSlaveGeneral>({
    url: `${BASE_URL}/${id}`,
  });
}

/**
 * 新增
 */
export function add() {
  return defHttp.get<SampleSlaveGeneral>({
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
export function save(params: SampleSlaveGeneral) {
  return defHttp.post<SampleSlaveGeneral>({
    url: BASE_URL,
    data: params,
  });
}
