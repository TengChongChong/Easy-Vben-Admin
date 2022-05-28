import { BasicModel } from '/@/api/model/baseModel';

/**
 * 角色
 */
export interface SysRole extends BasicModel {
  // 名称
  name: string;
  // 角色标识
  code: string;
  // 备注
  remarks: string;
  // 权限ids
  permissionIds: string[];
}
