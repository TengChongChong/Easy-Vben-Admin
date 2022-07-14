import { defHttp } from '/@/utils/http/axios';
import { TreeNodeModel } from '/@/api/model/treeModel';
import { SysRole } from '/@/api/auth/model/sysRoleModel';
import { Page } from '/@/api/model/pageModel';

// base url
const BASE_URL = '/api/auth/sys/role';

/**
 * 查询
 *
 * @param params 查询条件
 * @param pager 分页
 */
export function select(params: SysRole, pager: Page<SysRole>) {
  return defHttp.get<Page<SysRole>>({
    url: BASE_URL,
    params: Object.assign(params, pager),
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
  return defHttp.get<SysRole>({
    url: `${BASE_URL}/${id}`,
  });
}

/**
 * 新增
 */
export function add() {
  return defHttp.get<SysRole>({
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
export function save(params: SysRole) {
  return defHttp.post<SysRole>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 设置状态
 *
 * @param ids ids
 * @param status 状态
 */
export function setStatus(ids: string, status: string) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/${ids}/status/${status}`,
  });
}
