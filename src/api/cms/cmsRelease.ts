import { CmsRelease, ReleaseProgressVO } from '/@/api/cms/model/cmsReleaseModel';
import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { TreeNodeModel } from '/@/api/model/treeModel';

// base url
const BASE_URL = '/api/auth/cms/release';
/**
 * 查询数据
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: CmsRelease, page: Page<CmsRelease>) {
  return defHttp.get<Page<CmsRelease>>({
    url: BASE_URL,
    params: Object.assign(params, page),
  });
}

/**
 * 获取发布资源
 */
export function selectReleaseAssets() {
  return defHttp.get<TreeNodeModel[]>({
    url: `${BASE_URL}/assets`,
  });
}

/**
 * 保存/修改
 *
 * @param params 表单数据
 */
export function save(params: CmsRelease) {
  return defHttp.post<CmsRelease>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 开始发布
 *
 * @param id id
 * @return true/false
 */
export function startRelease(id: string) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/start/${id}`,
  });
}

/**
 * 取消发布
 *
 * @param id id
 * @return 发布进度
 */
export function cancelRelease(id: string) {
  return defHttp.post<ReleaseProgressVO>({
    url: `${BASE_URL}/cancel/${id}`,
  });
}

/**
 * 获取已发布数量
 *
 * @param id id
 * @return 发布进度
 */
export function getReleaseProgress(id: string) {
  return defHttp.get<ReleaseProgressVO>({
    url: `${BASE_URL}/progress/${id}`,
  });
}

/**
 * 发布单个列队数据
 *
 * @param id id
 * @return true/false
 */
export function releaseQueue(id: string) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/release/queue/${id}`,
  });
}
