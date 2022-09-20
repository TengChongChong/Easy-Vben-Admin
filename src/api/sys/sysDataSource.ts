import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { SelectModel } from '/@/api/model/selectModel';
import { SysDataSource } from '/@/api/sys/model/sysDataSourceModel';

// base url
const BASE_URL = '/api/auth/sys/data/source';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: SysDataSource, page: Page<SysDataSource>) {
  return defHttp.get<Page<SysDataSource>>({
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
  return defHttp.get<SysDataSource>({
    url: `${BASE_URL}/${id}`,
  });
}

/**
 * 新增
 */
export function add() {
  return defHttp.get<SysDataSource>({
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
export function save(params: SysDataSource) {
  return defHttp.post<SysDataSource>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 获取数据源
 */
export function selectOptions() {
  return defHttp.get<SelectModel[]>({
    url: `${BASE_URL}/select/options`,
  });
}
