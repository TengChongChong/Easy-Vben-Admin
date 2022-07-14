import { BasicModel } from '/@/api/model/baseModel';

/**
 * 文件
 */
export interface SysFile extends BasicModel {
  // 类型
  type?: string;
  // 名称
  displayName?: string;
  // 文件名称
  name?: string;
  // 路径
  path?: string;
  // url
  url?: string;
  // 文件大小
  size?: number;
}
