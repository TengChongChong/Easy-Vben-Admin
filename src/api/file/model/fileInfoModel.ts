import { BasicModel } from '/@/api/model/baseModel';

/**
 * 文件
 */
export interface FileInfo extends BasicModel {
  // 类型
  type?: string;
  // 名称
  displayName?: string;
  // 文件名称
  name?: string;
  // 根目录（local - 文件夹名称 / oss - bucket名称）
  bucketName?: string;
  // local - 文件路径 /  oss - objectName
  objectName?: string;
  // url
  url?: string;
  // 文件大小
  size?: number;
  // 内容类型
  contentType?: string;
}
