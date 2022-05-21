import { SysRole } from './sysRoleModel';
import { BasicModel } from '/@/api/model/baseModel';
import { SysDept } from './sysDeptModel';
import { SysPermission } from './sysPermissionModel';

/**
 * 用户
 */
export interface SysUser extends BasicModel {
  // 岗位id
  postId: string;
  // 用户名
  username: string;
  // 昵称
  nickname: string;
  // 性别
  sex: string;
  // 邮箱
  email: string;
  // 手机号码
  phoneNumber: string;
  // 生日
  birthday: Date;
  // 最后登录时间
  lastLoginDate: Date;
  // 头像
  avatar: string;
  avatarLg: string;
  avatarMd: string;
  avatarSm: string;
  avatarXs: string;
  // 来源
  source: string;
  // 所属部门
  dept: SysDept;
  // 角色
  roleList: SysRole[];
  // 权限
  permissionList: SysPermission[];
}

/**
 * @description: 登录接口参数
 */
export interface LoginParams {
  username: string;
  password: string;
  // 记住我
  rememberMe?: boolean;
  // 验证码id
  codeId?: string;
  // 验证码
  verificationCode?: string;
}
