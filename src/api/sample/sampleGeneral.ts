import { SampleGeneral } from '/@/api/sample/model/sampleGeneralModel';
import { Page } from '/@/api/model/pageModel';
import { TreeNodeModel } from '/@/api/model/treeModel';
import { defHttp } from '/@/utils/http/axios';

// base url
const BASE_URL = '/api/auth/sample/general';
/**
 * 查询
 *
 * @param params 查询条件
 */
export function select(params: SampleGeneral) {
  return defHttp.get<Page<SampleGeneral>>({
    url: BASE_URL,
    params: params,
  });
}
/**
 * 查询所有
 */
export function selectAll() {
  return defHttp.get<TreeNodeModel[]>({
    url: `${BASE_URL}/all`,
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function get(id: string) {
  return defHttp.get<SampleGeneral>({
    url: `${BASE_URL}/${id}`,
  });
}
/**
 * 新增
 *
 * @param parentId 父id
 */
export function add(parentId: string | undefined) {
  return defHttp.get<SampleGeneral>({
    url: `${BASE_URL}/add/${parentId || ''}`,
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
export function save(params: SampleGeneral) {
  return defHttp.post<SampleGeneral>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 保存排序
 *
 * @param params 表单数据
 */
export function saveOrder(params: SampleGeneral[]) {
  return defHttp.post<SampleGeneral>({
    url: `${BASE_URL}/order`,
    data: params,
  });
}

/**
 * 导出数据
 *
 * @param params 查询条件
 */
export function exportData(params: SampleGeneral) {
  return defHttp.get<string>({
    url: `${BASE_URL}/export/data`,
    params,
  });
}
