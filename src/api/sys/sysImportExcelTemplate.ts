import { defHttp } from '/@/utils/http/axios';
import { Page } from '/@/api/model/pageModel';
import { SysImportExcelTemplate } from '/@/api/sys/model/sysImportExcelTemplateModel';

// base url
const BASE_URL = '/api/auth/sys/import/excel/template';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: SysImportExcelTemplate, page: Page<SysImportExcelTemplate>) {
  return defHttp.get<Page<SysImportExcelTemplate>>({
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
  return defHttp.get<SysImportExcelTemplate>({
    url: `${BASE_URL}/${id}`,
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
export function save(params: SysImportExcelTemplate) {
  return defHttp.post<SysImportExcelTemplate>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 下载导入模板
 *
 * @param importCode 模板代码
 * @return 文件下载id
 */
export function downloadTemplate(importCode: string) {
  return defHttp.get<string>({
    url: `${BASE_URL}/template/${importCode}`,
  });
}
