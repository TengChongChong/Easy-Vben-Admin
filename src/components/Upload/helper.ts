import { SysFile } from '/@/api/sys/model/sysFileModel';
import { UploadFileModel } from '/@/components/Upload/type';
import { useGlobSetting } from '/@/hooks/setting';

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
 * 将UploadFile[]转为SysFile[]
 *
 * @param fileList 文件[]
 */
export function convertToSysFileArray(fileList: UploadFileModel[]): SysFile[] {
  const sysFileList: SysFile[] = [];
  if (fileList && fileList.length) {
    fileList.map((file) => {
      sysFileList.push(convertToSysFile(file));
    });
  }
  return sysFileList;
}

export function convertToSysFile(uploadFileModel: UploadFileModel): SysFile {
  const { apiUrl } = useGlobSetting();

  const { uid, name, size } = uploadFileModel;
  let { url, fileName, path } = uploadFileModel;
  // 获取url
  if (!url && uploadFileModel.response?.url) {
    url = uploadFileModel.response?.url;
    if (!url?.startsWith(apiUrl)) {
      url = apiUrl + url;
    }
  }
  if (!fileName && uploadFileModel.response?.name) {
    fileName = uploadFileModel.response?.name;
  }
  if (!path && uploadFileModel.response?.path) {
    path = uploadFileModel.response?.path;
  }
  return {
    id: uid,
    displayName: name,
    name: fileName,
    url,
    path,
    size,
    status: uploadFileModel.status,
  } as SysFile;
}

/**
 * 将SysFile[]转为UploadFileModel[]
 *
 * @param fileList 文件[]
 */
export function convertToUploadFileModelArray(fileList: SysFile[]): UploadFileModel[] {
  const uploadFileList: UploadFileModel[] = [];
  if (fileList && fileList.length) {
    fileList.map((file) => {
      uploadFileList.push(convertToUploadFile(file));
    });
  }
  return uploadFileList;
}

export function convertToUploadFile(sysFile: SysFile): UploadFileModel {
  const { id, displayName, name, url, path, size, status } = sysFile;
  return {
    uid: id as string,
    name: displayName as string,
    fileName: name,
    url,
    path,
    size,
    status,
  } as UploadFileModel;
}
