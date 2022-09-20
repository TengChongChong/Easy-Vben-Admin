import { SysImportExcelTemporary } from '/@/api/sys/model/sysImportExcelTemporaryModel';
import { Page } from '/@/api/model/pageModel';
import { defHttp } from '/@/utils/http/axios';

// base url
const BASE_URL = '/api/auth/sys/import/excel/temporary';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: SysImportExcelTemporary, page: Page<SysImportExcelTemporary>) {
  return defHttp.get<Page<SysImportExcelTemporary>>({
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
  return defHttp.get<SysImportExcelTemporary>({
    url: `${BASE_URL}/${id}`,
  });
}

/**
 * 新增
 */
export function add() {
  return defHttp.get<SysImportExcelTemporary>({
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
export function save(params: SysImportExcelTemporary) {
  return defHttp.post<SysImportExcelTemporary>({
    url: BASE_URL,
    data: params,
  });
}

/**
 * 清空指定导入代码中数据
 *
 * @param templateId 模板id
 */
export function cleanMyImport(templateId: string) {
  return defHttp.delete<boolean>({
    url: `${BASE_URL}/clean/my/import/${templateId}`,
  });
}
