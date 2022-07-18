import { SysImportExcelTemplateDetail } from '/@/api/sys/model/sysImportExcelTemplateDetailModel';
import { defHttp } from '/@/utils/http/axios';

// base url
const BASE_URL = '/api/auth/sys/import/excel/template/details';

/**
 * 获取已配置字段
 *
 * @param templateId 导入模板id
 * @return List<SysImportExcelTemplateDetails>
 */
export function selectDetails(templateId: string) {
  return defHttp.get<SysImportExcelTemplateDetail[]>({
    url: `${BASE_URL}/details/${templateId}`,
  });
}

/**
 * 保存
 *
 * @param templateId 导入模板id
 * @param list       表单内容
 * @return true/false
 */
export function saveData(templateId: string, list: SysImportExcelTemplateDetail[]) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/${templateId}`,
    data: list,
  });
}
