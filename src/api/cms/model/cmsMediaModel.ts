import { BasicModel } from '/@/api/model/baseModel';
import { FileInfo } from '/@/api/file/model/fileInfoModel';

/**
 * 资源
 */
export interface CmsMedia extends BasicModel {
  // 站点id
  siteId?: string;
  // 名称
  name?: string;
  // 类型
  type?: string;
  // 附件路径
  fileUrl?: string;
  // local - 文件夹名称 / oss - bucket名称
  fileBucketName?: string;
  // local - 文件路径 /  oss - objectName
  fileObjectName?: string;
  // 文件
  file?: FileInfo;
}
