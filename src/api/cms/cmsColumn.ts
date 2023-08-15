import { CmsColumn } from '/@/api/cms/model/cmsColumnModel';
import { Page } from '/@/api/model/pageModel';
import { TreeNodeModel } from '/@/api/model/treeModel';
import { defHttp } from '/@/utils/http/axios';

// base url
const BASE_URL = '/api/auth/cms/column';
/**
 * 查询数据（无分页）
 *
 * @param params 查询条件
 */
export function select(params: CmsColumn) {
  return defHttp.get<Page<CmsColumn>>({
    url: BASE_URL,
    params,
  });
}
/**
 * 查询所有数据（Tree）
 */
export function selectAll(params: CmsColumn) {
  return defHttp.get<TreeNodeModel[]>({
    url: `${BASE_URL}/all`,
    params,
  });
}

/**
 * 查询详情
 *
 * @param id id
 */
export function get(id: string) {
  return defHttp.get<CmsColumn>({
    url: `${BASE_URL}/${id}`,
  });
}
/**
 * 新增或新增下级
 *
 * @param parentId 父id
 */
export function add(parentId: string | undefined) {
  return defHttp.get<CmsColumn>({
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
 * 保存/修改
 *
 * @param params 表单数据
 */
export function save(params: CmsColumn) {
  return defHttp.post<CmsColumn>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 保存排序&结构
 *
 * @param params 表单数据
 */
export function saveOrder(params: CmsColumn[]) {
  return defHttp.post<CmsColumn>({
    url: `${BASE_URL}/order`,
    data: params,
  });
}

/**
 * 导出数据
 *
 * @param params 查询条件
 */
export function exportData(params: CmsColumn) {
  return defHttp.get<string>({
    url: `${BASE_URL}/export/data`,
    params,
  });
}
