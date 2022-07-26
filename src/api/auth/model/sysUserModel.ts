import { SysRole } from './sysRoleModel';
import { BasicModel } from '/@/api/model/baseModel';
import { SysDept } from './sysDeptModel';
import { SysPermission } from './sysPermissionModel';

/**
 * 用户
 */
export interface SysUser extends BasicModel {
  // 用户名
  username?: string;
  // 昵称
  nickname?: string;
  // 密码
  password?: string;
  // 盐
  salt?: string;
  // 性别
  sex?: string;
  // 邮箱
  email?: string;
  // 手机号码
  phoneNumber?: string;
  // 生日
  birthday?: Date;
  // 头像
  avatar?: string;
  avatarLg?: string;
  avatarMd?: string;
  avatarSm?: string;
  avatarXs?: string;
  // 来源
  source?: string;
  // 岗位id
  postId?: string;
  // 最后登录时间
  lastLoginDate?: Date;
  // 所属部门Id
  deptId?: string;
  // 所属部门名称
  deptName?: string;
  // 所属部门
  dept?: SysDept;
  // 角色
  roleList?: SysRole[];
  // 权限
  permissionList?: SysPermission[];
}

/**
 * @description: 登录接口参数
 */
export interface LoginParams {
  username: string;
  password: string;
  // 记住我
  rememberMe?: boolean;
  // 服务端二次验证验证码
  captchaVerification?: string;
}
