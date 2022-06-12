import { defHttp } from '/@/utils/http/axios';

/**
 * 验证邮箱
 *
 * @param code 验证码
 */
export function verifies(code: string) {
  return defHttp.post<boolean>(
    {
      url: `/api/mail/verification`,
      data: {
        code,
      },
    },
    {
      errorMessageMode: 'none',
    },
  );
}
