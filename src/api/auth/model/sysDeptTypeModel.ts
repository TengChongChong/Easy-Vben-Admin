import { BasicModel } from '/@/api/model/baseModel';

/**
 * 部门类型
 */
export interface SysDeptType extends BasicModel {
  // 名称
  name?: string;
  //代码
  code?: string;
  // 该部门类型可以选择的角色列表 1,2,3
  roleIdList?: string[];
}
