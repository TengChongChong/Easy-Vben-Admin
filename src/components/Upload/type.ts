import { UploadFile } from 'ant-design-vue/es/upload/interface';

export interface UploadFileModel extends UploadFile {
  // 文件路径
  path?: string;
}
