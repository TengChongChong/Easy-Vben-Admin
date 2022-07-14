import { defHttp } from '/@/utils/http/axios';
import { SysUser } from '/@/api/auth/model/sysUserModel';

// base url
const BASE_URL = '/api/auth/sys/user/personal/center';

/**
 * 当前用户
 */
export function currentUser() {
  return defHttp.get<SysUser>({
    url: `${BASE_URL}/current/user`,
  });
}

/**
 * 密码修改
 *
 * @param oldPassword
 * @param password
 */
export function changePassword(oldPassword: string, password: string) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/change/password`,
    data: {
      oldPassword,
      password,
    },
  });
}

/**
 * 保存用户头像
 *
 * @param path 头像路径
 */
export function saveUserAvatar(path: string) {
  return defHttp.post<string>({
    url: `${BASE_URL}/user/avatar`,
    data: {
      path,
    },
  });
}

/**
 * 保存用户信息
 *
 * @param params 用户信息
 */
export function saveUserInfo(params: SysUser) {
  return defHttp.post<SysUser>({
    url: `${BASE_URL}/user/info`,
    data: params,
  });
}

/**
 * 申请绑定密保邮箱
 *
 * @param email 邮箱
 */
export function applicationBindingEmail(email: string) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/email`,
    data: {
      email,
    },
  });
}

/**
 * 绑定密保手机
 *
 * @param phone 手机号
 * @param captcha 验证码
 */
export function bindingPhone(phone: string, captcha: string) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/phone`,
    data: {
      phone,
      captcha,
    },
  });
}
