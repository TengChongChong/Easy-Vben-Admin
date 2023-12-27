/**
 * 上传文件相应对象
 */
export interface FileUploadResponse {
  // 显示名称
  displayName: string;
  // 文件名称
  name: string;
  // 根目录（local - 文件夹名称 / oss - bucket名称）
  bucketName: string;
  // local - 文件路径 /  oss - objectName
  objectName: string;
  // url
  url: string;
  // 大小
  size: number;
  // 后缀
  suffix: string;
  // 内容类型
  contentType: string;
}
