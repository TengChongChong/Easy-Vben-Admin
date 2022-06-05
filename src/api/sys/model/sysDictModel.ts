import { BasicModel } from '/@/api/model/baseModel';

/**
 * 字典
 */
export interface SysDict extends BasicModel {
  // 名称
  name: string;
  // 编码
  code: string;
  // 父编码
  parentCode: string | string[];
  // 字典类型
  dictType: string;
  // 图标
  icon?: string;
  // 显示方式
  displayType?: string;
  // 父字典名称
  parentName: string;
  // 字典类型名称
  dictTypeName: string;
}

/**
 * 字典树
 */
export interface SysDictTree extends SysDict {
  children?: SysDict[];
}
