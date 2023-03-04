import { defHttp } from '/@/utils/http/axios';
import { SysPermission } from '/@/api/auth/model/sysPermissionModel';
import { TreeNodeModel } from '/@/api/model/treeModel';

// base url
const BASE_URL = '/api/auth/sys/permission';

/**
 * 查询
 *
 * @param params 查询条件
 */
export function select(params: SysPermission) {
  return defHttp.get<SysPermission[]>({
    url: BASE_URL,
    params,
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
  return defHttp.get<SysPermission>({
    url: `${BASE_URL}/${id}`,
  });
}

/**
 * 新增
 *
 * @param id 父id
 */
export function add(id: string | undefined) {
  return defHttp.get<SysPermission>({
    url: `${BASE_URL}/add/${id || ''}`,
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
export function save(params: SysPermission) {
  return defHttp.post<SysPermission>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 保存排序
 *
 * @param params 表单数据
 */
export function saveOrder(params: SysPermission[]) {
  return defHttp.post<SysPermission>({
    url: `${BASE_URL}/order`,
    data: params,
  });
}

/**
 * 设置状态
 *
 * @param ids ids
 * @param status 状态
 * @param type 类型
 */
export function setStatus(ids: string, status: string, type: string) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/${ids}/status/${status}/type/${type}`,
  });
}
