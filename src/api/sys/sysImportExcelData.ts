import { defHttp } from '/@/utils/http/axios';
import { SysImportExcelTemplate } from '/@/api/sys/model/sysImportExcelTemplateModel';

// base url
const BASE_URL = '/api/auth/sys/import/excel/data';

/**
 * 导入汇总，用于显示导入到临时表后的汇总信息
 */
export interface SysImportSummary {
  total: number;
  success: number;
  fail: number;
}

/**
 * 获取导入模板信息
 *
 * @param importCode 模板代码
 */
export function getImportExcelTemplate(importCode: string) {
  return defHttp.get<SysImportExcelTemplate>({
    url: `${BASE_URL}/${importCode}`,
  });
}

/**
 * 检查上次导入数据
 *
 * @param templateId 模板id
 */
export function checkLastData(templateId: string) {
  return defHttp.get<boolean>({
    url: `${BASE_URL}/check/last/data/${templateId}`,
  });
}

/**
 * 验证并解析文件
 *
 * @param templateId 模板id
 * @param path       文件路径
 * @return true/false
 */
export function analysis(templateId: string, path: string) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/analysis/${templateId}`,
    data: { path },
  });
}

/**
 * 查询指定导入汇总信息
 *
 * @param templateId 模板id
 */
export function selectSummary(templateId: string) {
  return defHttp.get<SysImportSummary>({
    url: `${BASE_URL}/summary/${templateId}`,
  });
}

/**
 * 插入数据
 *
 * @param templateId 模板id
 */
export function insertData(templateId: string) {
  return defHttp.post<number>({
    url: `${BASE_URL}/data/${templateId}`,
  });
}

/**
 * 导出验证失败数据
 *
 * @param templateId 模板id
 */
export function exportVerificationFailData(templateId: string) {
  return defHttp.get<string>({
    url: `${BASE_URL}/export/verification/fail/data/${templateId}`,
  });
}
