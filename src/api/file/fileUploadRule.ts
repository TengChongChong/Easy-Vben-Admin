import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';
import { FileUploadRule } from '/@/api/file/model/fileUploadRuleModel';

// base url
const BASE_URL = '/api/auth/file/upload/rule';
/**
 * 查询数据
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: FileUploadRule, page: Page<FileUploadRule>) {
  return defHttp.get<Page<FileUploadRule>>({
    url: BASE_URL,
    params: Object.assign(params, page),
  });
}

/**
 * 获取上传规则
 *
 * @param slug 规则别名
 */
export function getBySlug(slug: string) {
  return defHttp.get<FileUploadRule>({
    url: `${BASE_URL}/slug/${slug}`,
  });
}

/**
 * 查询详情
 *
 * @param id id
 */
export function get(id: string) {
  return defHttp.get<FileUploadRule>({
    url: `${BASE_URL}/${id}`,
  });
}

/**
 * 新增
 */
export function add() {
  return defHttp.get<FileUploadRule>({
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
export function save(params: FileUploadRule) {
  return defHttp.post<FileUploadRule>({
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
