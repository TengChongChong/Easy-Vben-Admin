import { CmsPage } from '/@/api/cms/model/cmsPageModel';
import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { SelectModel } from '/@/api/model/selectModel';

// base url
const BASE_URL = '/api/auth/cms/page';
/**
 * 查询数据
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: CmsPage, page: Page<CmsPage>) {
  return defHttp.get<Page<CmsPage>>({
    url: BASE_URL,
    params: Object.assign(params, page),
  });
}

/**
 * 查询详情
 *
 * @param id id
 */
export function get(id: string) {
  return defHttp.get<CmsPage>({
    url: `${BASE_URL}/${id}`,
  });
}
/**
 * 新增
 */
export function add() {
  return defHttp.get<CmsPage>({
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
 * 保存/修改
 *
 * @param params 表单数据
 */
export function save(params: CmsPage) {
  return defHttp.post<CmsPage>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 新增
 */
export function selectThemePageTemplate() {
  return defHttp.get<SelectModel[]>({
    url: `${BASE_URL}/theme/page/template`,
  });
}
