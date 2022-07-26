import type { Rule } from '/@/components/Form/src/types/form';
import { ref, computed, unref, Ref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';

export enum LoginStateEnum {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  MOBILE,
  QR_CODE,
}

const currentState = ref(LoginStateEnum.LOGIN);

export function useLoginState() {
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state;
  }

  const getLoginState = computed(() => currentState.value);

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN);
  }

  return { setLoginState, getLoginState, handleBackLogin };
}

export function useFormValid<T extends Object = any>(formRef: Ref<any>) {
  async function validForm() {
    const form = unref(formRef);
    if (!form) return;
    const data = await form.validate();
    return data as T;
  }

  return { validForm };
}

export function useFormRules() {
  const { t } = useI18n();

  const getAccountFormRule = computed(() => createRule(t('sys.login.accountPlaceholder')));
  const getPasswordFormRule = computed(() => createRule(t('sys.login.passwordPlaceholder')));
  const getCodeFormRule = computed(() => createRule(t('sys.login.smsPlaceholder')));
  const getMobileFormRule = computed(() => createRule(t('sys.login.mobilePlaceholder')));

  const validatePolicy = async (_: Rule, value: boolean) => {
    return !value ? Promise.reject(t('sys.login.policyPlaceholder')) : Promise.resolve();
  };

  /**
   * 获取表单验证
   *
   * todo: 这里使用Rule会报错，暂时修改为any
   */
  const getFormRules = computed((): { [k: string]: any } => {
    const usernameFormRule = unref(getAccountFormRule);
    const passwordFormRule = unref(getPasswordFormRule);
    const codeFormRule = unref(getCodeFormRule);
    const mobileFormRule = unref(getMobileFormRule);

    const mobileRule = {
      code: codeFormRule,
      mobile: mobileFormRule,
    };
    switch (unref(currentState)) {
      case LoginStateEnum.REGISTER:
        return {
          username: usernameFormRule,
          password: passwordFormRule,
          policy: [{ validator: validatePolicy, trigger: 'change' }],
          ...mobileRule,
        };

      // 重置密码
      case LoginStateEnum.RESET_PASSWORD:
        return {
          username: usernameFormRule,
          mobile: { required: true, message: '请输入找回方式', trigger: 'change' },
          code: codeFormRule,
          password: passwordFormRule,
        };

      // 手机号登录
      case LoginStateEnum.MOBILE:
        return mobileRule;

      // 账号密码登录
      default:
        return {
          username: usernameFormRule,
          password: passwordFormRule,
        };
    }
  });
  return { getFormRules };
}
/**
 * 创建验证
 *
 * @param message 错误提示
 * @returns
 */
function createRule(message: string): Rule[] {
  return [
    {
      required: true,
      message,
      trigger: 'change',
    },
  ];
}
