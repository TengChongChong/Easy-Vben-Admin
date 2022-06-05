import { BasicModel } from '/@/api/model/baseModel';

/**
 * 字典类型
 */
export interface SysDictType extends BasicModel {
  // 名称
  name: string;
  // 类型
  type: string;
  // 状态
  status: string;
  // 是否系统
  sys: string;
}
