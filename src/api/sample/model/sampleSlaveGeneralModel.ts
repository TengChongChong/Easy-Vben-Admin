import { BasicModel } from '/@/api/model/baseModel';

/**
 * 从库示例
 */
export interface SampleSlaveGeneral extends BasicModel {
  // 姓名
  name?: string;
  // 性别
  sex?: string;
  // 年龄
  age?: number;
  // 手机号码
  phone?: string;
  // 地址
  address?: string;
}
