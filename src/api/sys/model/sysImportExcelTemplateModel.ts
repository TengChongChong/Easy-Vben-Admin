import { BasicModel } from '/@/api/model/baseModel';
import { SysImportExcelTemplateDetail } from '/@/api/sys/model/sysImportExcelTemplateDetailModel';

/**
 * 导入模板
 */
export interface SysImportExcelTemplate extends BasicModel {
  // 模板名称
  name?: string;
  // 表
  importTable?: string;
  // 起始行
  startRow?: number;
  // 回调
  callback?: string;
  //模板代码
  importCode?: string;
  // 权限标识，用于检查当前登录用户是否允许使用此模板
  permissionCode?: string;
  // 导入配置
  detailList?: SysImportExcelTemplateDetail[];
}
