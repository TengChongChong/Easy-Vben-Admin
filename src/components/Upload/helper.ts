import { UploadFileModel } from '/@/components/Upload/type';
import { FileInfo } from '/@/api/file/model/fileInfoModel';

export function checkFileType(file: File, accepts: string[]) {
  const newTypes = accepts.join('|');
  // const reg = /\.(jpg|jpeg|png|gif|txt|doc|docx|xls|xlsx|xml)$/i;
  const reg = new RegExp('\\.(' + newTypes + ')$', 'i');

  return reg.test(file.name);
}

/**
 * 检查文件是否为图片类型
 *
 * @param file 文件
 */
export function checkImgType(file: File) {
  return isImgTypeByName(file.name);
}

/**
 * 根据文件名称验证是否为图片类型
 *
 * @param name 文件名
 */
export function isImgTypeByName(name: string) {
  return /\.(jpg|jpeg|png|gif)$/i.test(name);
}

/**
 * 获取图片Base64预览
 *
 * @param file 文件
 */
export function getBase64WithFile(file: File) {
  return new Promise<{
    result: string;
    file: File;
  }>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve({ result: reader.result as string, file });
    reader.onerror = (error) => reject(error);
  });
}

/**
 * 将UploadFile[]转为FileInfo[]
 *
 * @param fileList 文件[]
 */
export function convertToFileInfoArray(fileList: UploadFileModel[]): FileInfo[] {
  const sysFileList: FileInfo[] = [];
  if (fileList && fileList.length) {
    fileList.map((file) => {
      sysFileList.push(convertToFileInfo(file));
    });
  }
  return sysFileList;
}

export function convertToFileInfo(uploadFileModel: UploadFileModel): FileInfo {
  return {
    id: uploadFileModel.uid,
    ...uploadFileModel.response,
    status: uploadFileModel.status,
  } as FileInfo;
}

/**
 * 将FileInfo[]转为UploadFileModel[]
 *
 * @param fileList 文件[]
 */
export function convertToUploadFileModelArray(fileList: FileInfo[]): UploadFileModel[] {
  const uploadFileList: UploadFileModel[] = [];
  if (fileList && fileList.length) {
    fileList.map((file) => {
      uploadFileList.push(convertToUploadFile(file));
    });
  }
  return uploadFileList;
}

export function convertToUploadFile(sysFile: FileInfo): UploadFileModel {
  const { id, displayName, name, url, bucketName, objectName, size, status } = sysFile;
  return {
    uid: id!,
    name: displayName!,
    fileName: name,
    url,
    bucketName,
    objectName,
    size,
    status,
  } as UploadFileModel;
}
