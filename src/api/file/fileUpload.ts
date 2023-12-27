import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { FileUploadResponse } from '/@/api/file/model/fileUploadModel';

/**
 * 文件上传
 *
 * @param uploadRuleSlug 文件上传策略
 * @param params 参数
 */
export function fileUpload(uploadRuleSlug: string, params: UploadFileParams) {
  return defHttp.uploadFile<FileUploadResponse>(
    {
      url: `/api/auth/file/upload/${uploadRuleSlug}`,
    },
    params,
  );
}
