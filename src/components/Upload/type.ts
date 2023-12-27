import { UploadFile } from 'ant-design-vue/es/upload/interface';

export interface UploadFileModel extends UploadFile {
  // 根目录（local - 文件夹名称 / oss - bucket名称）
  bucketName?: string;
  // local - 文件路径 /  oss - objectName
  objectName?: string;
}
