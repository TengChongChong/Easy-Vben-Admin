import { CmsArticle } from '/@/api/cms/model/cmsArticleModel';
import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';

// base url
const BASE_URL = '/api/auth/cms/article';
/**
 * 查询数据
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: CmsArticle, page: Page<CmsArticle>) {
  return defHttp.get<Page<CmsArticle>>({
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
  return defHttp.get<CmsArticle>({
    url: `${BASE_URL}/${id}`,
  });
}
/**
 * 新增
 */
export function add() {
  return defHttp.get<CmsArticle>({
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
export function save(params: CmsArticle) {
  return defHttp.post<CmsArticle>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 发布
 *
 * @param ids 文章ids
 */
export function release(ids: string[]) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/release/${ids.join(',')}`,
  });
}

/**
 * 撤销
 *
 * @param ids 文章ids
 */
export function revoke(ids: string[]) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/revoke/${ids.join(',')}`,
  });
}
