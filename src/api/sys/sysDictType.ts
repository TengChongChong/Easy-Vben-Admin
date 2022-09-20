import { SysDictType } from '/@/api/sys/model/sysDictTypeModel';
import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { SelectModel } from '/@/api/model/selectModel';

// base url
const BASE_URL = '/api/auth/sys/dict/type';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: SysDictType, page: Page<SysDictType>) {
  return defHttp.get<Page<SysDictType>>({
    url: BASE_URL,
    params: Object.assign(params, page),
  });
}

/**
 * 查询所有
 */
export function selectAll() {
  return defHttp.get<SelectModel[]>({
    url: `${BASE_URL}/all`,
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function get(id: string) {
  return defHttp.get<SysDictType>({
    url: `${BASE_URL}/${id}`,
  });
}

/**
 * 新增
 */
export function add() {
  return defHttp.get<SysDictType>({
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
export function save(params: SysDictType) {
  return defHttp.post<SysDictType>({
    url: BASE_URL,
    data: params,
  });
}
