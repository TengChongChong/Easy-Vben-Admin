import { BasicModel } from '/@/api/model/baseModel';

/**
 * 权限
 */
export interface SysPermission extends BasicModel {
  // 类型
  type?: string;
  // 标题
  title?: string;
  // 组件名称
  name?: string;
  // 标识
  code?: string;
  // 图标
  icon?: string;
  // path
  path?: string;
  // 组件路径
  component?: string;
  // 是否外链
  external?: string;
  // 是否显示
  display?: string;
  // 打开方式
  openMode?: string;
  // 父权限&菜单名称
  parentName?: string;
}
