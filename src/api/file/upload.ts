import { defHttp } from '/@/utils/http/axios';
import { FileModel } from '/@/api/file/model/fileModel';
import { UploadFileParams } from '/#/axios';

// base url
const BASE_URL = '/api/auth/file/upload';

export function upload(file: UploadFileParams) {
  return defHttp.uploadFile<FileModel>(
    {
      url: BASE_URL,
    },
    file,
  );
}
