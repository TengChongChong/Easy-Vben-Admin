import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { SysMessage } from '/@/api/sys/model/sysMessageModel';

// base url
const BASE_URL = '/api/auth/sys/message';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: SysMessage, page: Page<SysMessage>) {
  return defHttp.get<Page<SysMessage>>({
    url: BASE_URL,
    params: Object.assign(params, page),
  });
}

/**
 * 收信列表
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectReceive(params: SysMessage, page: Page<SysMessage>) {
  return defHttp.get<Page<SysMessage>>({
    url: `${BASE_URL}/receive`,
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function get(id: string) {
  return defHttp.get<SysMessage>({
    url: `${BASE_URL}/${id}`,
  });
}

/**
 * 阅读消息
 *
 * @param id        消息 id
 * @param messageId 收信id
 */
export function info(id: Nullable<string>, messageId: string) {
  return defHttp.get<SysMessage>({
    url: `${BASE_URL}/info`,
    params: {
      id,
      messageId,
    },
  });
}

/**
 * 新增
 */
export function add() {
  return defHttp.get<SysMessage>({
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
export function save(params: SysMessage) {
  return defHttp.post<SysMessage>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 发送
 * @param ids ids
 */
export function send(ids) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/send`,
    data: { ids },
  });
}

/**
 * 获取当前登录用户查询未读消息数量
 *
 * @return 未读消息数量
 */
export function selectUnreadCount() {
  return defHttp.get<number>({
    url: `${BASE_URL}/unread/count`,
  });
}
