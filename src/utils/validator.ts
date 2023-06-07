/**
 * 手机号验证
 *
 * @param _rule
 * @param value
 */
import { isBlank } from '/@/utils/is';

export function checkPhone(_rule, value: string) {
  if (isBlank(value)) {
    return Promise.reject('请输入手机号');
  }
  if (!value.match(/^1[3456789]\d{9}$/)) {
    return Promise.reject('请输入正确的手机号');
  } else {
    return Promise.resolve();
  }
}

/**
 * 检查密码强度
 *
 * @param _rule
 * @param value
 */
export function checkPassword(_rule, value: string) {
  if (
    isBlank(value) ||
    !value.match(
      /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,18}$/,
    )
  ) {
    return Promise.reject('请输入8~18位数字、大小写字母、特殊符号任意三种组合');
  }
  return Promise.resolve();
}
