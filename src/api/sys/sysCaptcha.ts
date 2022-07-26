import { defHttp } from '/@/utils/http/axios';
import { CaptchaVO } from '/@/api/sys/model/sysCaptchaModel';
import { ErrorMessageMode } from '/#/axios';

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

/**
 * 获取验证码信息
 */
export function getCaptcha() {
  return defHttp.get<CaptchaVO>({
    url: '/api/sys/captcha',
  });
}

/**
 * 检查是否验证通过
 *
 * @param captcha CaptchaVO
 */
export function checkCaptcha(captcha: CaptchaVO, mode: ErrorMessageMode) {
  return defHttp.post<CaptchaVO>(
    {
      url: '/api/sys/captcha/check',
      data: captcha,
    },
    {
      errorMessageMode: mode,
    },
  );
}
