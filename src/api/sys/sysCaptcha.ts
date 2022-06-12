import { defHttp } from '/@/utils/http/axios';

/**
 * 绑定手机短信验证码
 *
 * @param phone 手机号
 */
export function bindingPhoneCaptcha(phone: string) {
  // 注：此处仅为演示，实际场景勿返回验证码
  return defHttp.get<string>({
    url: '/api/auth/sys/binding/phone/captcha',
    params: {
      phone,
    },
  });
}
