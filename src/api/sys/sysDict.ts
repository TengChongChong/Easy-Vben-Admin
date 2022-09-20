import { SysDict } from '/@/api/sys/model/sysDictModel';
import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { SelectModel } from '/@/api/model/selectModel';

// base url
const BASE_URL = '/api/auth/sys/dict';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: SysDict, page: Page<SysDict>) {
  return defHttp.get<Page<SysDict>>({
    url: BASE_URL,
    params: Object.assign(params, page),
  });
}

/**
 * 查询所有，请勿频繁调用，应缓存此数据
 */
export function selectAll() {
  return defHttp.get<SysDict[]>({
    url: `${BASE_URL}/all`,
  });
}

/**
 * 根据字典类型获取字典
 *
 * @param params params
 */
export function selectByDictType(params) {
  return defHttp.get<SelectModel[]>({
    url: `${BASE_URL}/dict-type`,
    params,
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function get(id: string) {
  return defHttp.get<SysDict>({
    url: `${BASE_URL}/${id}`,
  });
}

/**
 * 新增
 *
 * @param id 父id
 * @param dictType 字典类型
 */
export function add(id: string | undefined, dictType: string | undefined) {
  return defHttp.get<SysDict>({
    url: `${BASE_URL}/add/${id || ''}`,
    params: {
      dictType,
    },
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
export function save(params: SysDict) {
  return defHttp.post<SysDict>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 刷新缓存数据
 */
export function refresh() {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/refresh`,
  });
}
