/**
 * @description: 登录接口参数
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * @description 角色
 */
export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: 登录接口返回信息
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: 获取用户信息接口返回信息
 */
export interface GetUserInfoModel {
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
  // 角色
  roles: RoleInfo[];
}
