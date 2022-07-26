import { defHttp } from '/@/utils/http/axios';

// base url
const BASE_URL = '/api/sys/user/retrieve/password';

/**
 * 发送重置密码邮件
 *
 * @param username 账号
 * @param email 邮箱
 */
export function sendEmail(username: string, email: string) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/email`,
    data: { username, email },
  });
}

/**
 * 发送重置密码短信
 *
 * @param username 账号
 * @param mobile 手机号码
 */
export function sendSms(username: string, mobile: string) {
  return defHttp.post<string>({
    url: `${BASE_URL}/sms`,
    data: { username, mobile },
  });
}

/**
 * 验证账号与验证码是否匹配
 *
 * @param username 账号
 * @param code     验证码
 */
export function verifiesCode(username: string, code: string) {
  return defHttp.get<boolean>({
    url: `${BASE_URL}/verifies/${username}/${code}`,
  });
}

/**
 * 重设密码
 *
 * @param username 账号
 * @param code 验证码
 * @param password
 */
export function resetPassword(username: string, code: string, password: string) {
  return defHttp.post<boolean>({
    url: `${BASE_URL}/reset/password/${username}/${code}`,
    data: { password },
  });
}
