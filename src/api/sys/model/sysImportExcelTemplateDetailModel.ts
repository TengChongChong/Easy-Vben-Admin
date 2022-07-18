import { BasicModel } from '/@/api/model/baseModel';

/**
 * 导入模板详情
 */
export interface SysImportExcelTemplateDetail extends BasicModel {
  // 模板id
  templateId?: string;
  // 数据库字段名
  fieldName?: string;
  // 标题
  title?: string;
  // 字段长度
  fieldLength?: number;
  // 字段类型
  fieldType?: string;
  // 替换表表名
  replaceTable?: string;
  // 替换表 - 名称
  replaceTableFieldName?: string;
  // 替换表 - 值
  replaceTableFieldValue?: string;
  // 替换表 - 字典类型
  replaceTableDictType?: string;
  // 是否需要导入
  needImport?: boolean;
  // 是否需要替换
  needReplace?: boolean;
  // 是否必填
  required?: boolean;
  // 是否唯一
  only?: boolean;
}
