import { CmsReleaseQueue } from '/@/api/cms/model/cmsReleaseQueueModel';
import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';

// base url
const BASE_URL = '/api/auth/cms/release/queue';
/**
 * 查询数据
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: CmsReleaseQueue, page: Page<CmsReleaseQueue>) {
  return defHttp.get<Page<CmsReleaseQueue>>({
    url: BASE_URL,
    params: Object.assign(params, page),
  });
}
