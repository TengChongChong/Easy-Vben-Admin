import { BasicModel } from '/@/api/model/baseModel';

/**
 * 系统参数
 */
export interface SysConfig extends BasicModel {
  // key
  sysKey: string;
  // value
  value: string;
  // 类型
  type: string;
  // 是否系统
  sys?: string;
}
