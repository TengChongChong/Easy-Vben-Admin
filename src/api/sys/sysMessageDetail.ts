import { defHttp } from '/@/utils/http/axios';

// base url
const BASE_URL = '/api/auth/sys/message/detail';

/**
 * 设置消息标星/取消标星
 *
 * @param id   接受消息id
 * @param type 是否标星
 */
export function setStar(id: string, type: boolean) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/star/${id}/${type}`,
  });
}

/**
 * 根据接收消息id删除
 *
 * @param ids 消息ids
 */
export function removeByIds(ids: string) {
  return defHttp.delete<boolean>({
    url: `${BASE_URL}/${ids}`,
  });
}

/**
 * 设置消息已读
 *
 * @param ids 消息ids
 */
export function setRead(ids: Nullable<string>) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/read/${ids ? ids : ''}`,
  });
}
