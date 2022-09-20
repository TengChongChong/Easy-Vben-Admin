import { defHttp } from '/@/utils/http/axios';
import { SysUser } from '/@/api/auth/model/sysUserModel';
import { Page } from '/@/api/model/pageModel';
import { isArray } from '/@/utils/is';

// base url
const BASE_URL = '/api/auth/sys/user';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: SysUser, page: Page<SysUser>) {
  return defHttp.get<Page<SysUser>>({
    url: BASE_URL,
    params: Object.assign(params, page),
  });
}

/**
 * 搜索用户
 *
 * @param keyword 关键字
 * @param range 范围
 * @param deptId 部门Id，传入此参数时将忽略`range`
 * @param page 分页
 */
export function search(keyword: string, range: string, deptId: string, page: Page<SysUser>) {
  return defHttp.get<Page<SysUser>>({
    url: `${BASE_URL}/search`,
    params: {
      keyword,
      range,
      deptId,
      ...page,
    },
  });
}
/**
 * 获取指定用户信息，用于回显已选择的用户
 *
 * @param ids ids
 */
export function selectUsersByIds(ids: string | string[]) {
  return defHttp.get<SysUser[]>({
    url: `${BASE_URL}/users/${isArray(ids) ? ids.join(',') : ids}`,
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function get(id: string) {
  return defHttp.get<SysUser>({
    url: `${BASE_URL}/${id}`,
  });
}

/**
 * 新增
 *
 * @param deptId 部门id
 */
export function add(deptId: string) {
  return defHttp.get<SysUser>({
    url: `${BASE_URL}/add/${deptId}`,
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
export function save(params: SysUser) {
  return defHttp.post<SysUser>({
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

/**
 * 重置密码
 *
 * @param ids 用户ids
 */
export function resetPassword(ids: string) {
  return defHttp.post<string>({
    url: `${BASE_URL}/reset/password/${ids}`,
  });
}
