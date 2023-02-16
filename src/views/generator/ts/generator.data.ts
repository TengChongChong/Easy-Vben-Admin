import { TableField, TableInfo } from '/@/api/generator/model/generatorModel';
import { ComponentType } from '/@/components/Form/src/types';

/**
 * 生成文件
 */
export enum GenFile {
  MODEL = 'model',
  MAPPER = 'mapper',
  SERVICE = 'service',
  CONTROLLER = 'controller',
  LIST_VUE = 'list.vue',
  INPUT_VUE = 'input.vue',
  API_TS = 'api.ts',
}

/**
 * 生成方法
 */
export enum GenMethod {
  ADD = 'add',
  REMOVE = 'remove',
  SAVE = 'save',
  SELECT = 'select',
  EXPORT_DATA = 'exportData',
  IMPORT_DATA = 'importData',
}

// 所有文件
const allFile = [
  GenFile.MODEL,
  GenFile.MAPPER,
  GenFile.SERVICE,
  GenFile.CONTROLLER,
  GenFile.LIST_VUE,
  GenFile.INPUT_VUE,
  GenFile.API_TS,
];

// 所有方法
const allMethod = [
  GenMethod.ADD,
  GenMethod.REMOVE,
  GenMethod.SAVE,
  GenMethod.SELECT,
  GenMethod.EXPORT_DATA,
  GenMethod.IMPORT_DATA,
];

/**
 * 生成模板 - 列表
 */
export enum ListGeneratorTemplate {
  TABLE = 'table',
  TREE_TABLE = 'tree-table',
  TREE = 'tree',
}

/**
 * 生成模板 - 表单
 */
export enum FormGeneratorTemplate {
  MODAL = 'modal',
  DRAWER = 'drawer',
  PAGE = 'page',
}

/**
 * 模板详情
 */
export const TEMPLATE = {
  table: { file: allFile, method: allMethod },
  'tree-table': { file: allFile, method: allMethod },
  tree: { file: allFile, method: allMethod },
};
// 表单类型
export type FormType = 'query' | 'input';

// 表单类型
export const FORM_TYPE = {
  QUERY: 'query',
  INPUT: 'input',
};

// 匹配方式
export enum MatchingMode {
  EQ = 'eq',
  NE = 'ne',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  LIKE = 'like',
  LEFT_LIKE = 'left_like',
  RIGHT_LIKE = 'right_like',
  DATE_RANGE = 'start_end',
}

// 代码生成全局配置
export interface GeneratorConfig {
  // 表信息
  tableInfo: Nullable<TableInfo>;
  // 基础
  basicsConfig: Nullable<BasicsConfigModel>;
  // 查询条件
  queryConfig?: FieldConfig[];
  // 列表
  tableConfig?: TableCellConfig[];
  // 表单
  inputConfig?: FieldConfig[];
  // 导入
  importConfig?: ImportCellConfig[];
  // 导出
  exportConfig?: TableCellConfig[];
}

// 表格
export interface TableCellConfig extends TableField {
  // 是否启用
  isEnable: boolean;
  // 标题
  title: string;
  // 宽度
  width?: number;
  // 字典类型
  dictType?: string;
  // 格式化
  format?: string;
  // 过滤器
  filters?: string;
  // 排序
  sorter?: boolean;
  // 固定在左侧/右侧
  fixed?: string;
}

// 导入
export interface ImportCellConfig extends TableField {
  // 是否启用
  isEnable: boolean;
  // 标题
  title: string;
  // 是否必填
  required: boolean;
  // 字典类型
  dictType?: string;
  // 宽度
  width?: number;
}

// 查询条件&表单
export interface FieldConfig extends TableField {
  // 是否启用
  isEnable: boolean;
  // Label
  label: string;
  // 组件类型
  componentType?: ComponentType;
  // 字典类型
  dictType?: string;
  // 栅格
  col?: string;
  // 匹配方式
  matchingMode?: string;
  // 是否必填
  required?: boolean;
}

// 基础信息
export interface BasicsConfigModel {
  dataSource: string;
  table?: string;
  listGeneratorTemplate: string;
  formGeneratorTemplate: string;
  genMethod: string[];
  genFile: string[];
  backEndPath?: string;
  businessName?: string;
  author?: string;
  modelName?: string;
  menuName?: string;
  permissionCode?: string;
  packagePath?: string;
  controllerMapping?: string;
  frontEndPath?: string;
  viewPath?: string;
  apiPath?: string;
  overwrite: boolean;
}
