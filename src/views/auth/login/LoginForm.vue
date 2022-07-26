<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <a-form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLoginClick()"
  >
    <a-alert v-if="hasError" type="error" :message="errorMessage" :banner="true" />

    <a-form-item name="username" class="enter-x">
      <a-input
        size="large"
        v-model:value="formData.username"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </a-form-item>
    <a-form-item name="password" class="enter-x">
      <a-input-password
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </a-form-item>

    <a-row class="enter-x">
      <a-col :span="12">
        <a-form-item>
          <!-- 记住我 -->
          <a-checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </a-checkbox>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :style="{ 'text-align': 'right' }">
          <!-- 忘记密码 -->
          <a-button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </a-button>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item class="enter-x">
      <a-button type="primary" size="large" block @click="handleLoginClick" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </a-button>
    </a-form-item>
    <a-row class="enter-x">
      <a-col :md="8" :xs="24">
        <a-button block @click="setLoginState(LoginStateEnum.MOBILE)">
          {{ t('sys.login.mobileSignInFormTitle') }}
        </a-button>
      </a-col>
      <a-col :md="8" :xs="24" class="!my-2 !md:my-0 xs:mx-0 md:mx-2">
        <a-button block @click="setLoginState(LoginStateEnum.QR_CODE)">
          {{ t('sys.login.qrSignInFormTitle') }}
        </a-button>
      </a-col>
      <a-col :md="7" :xs="24">
        <a-button block @click="setLoginState(LoginStateEnum.REGISTER)">
          {{ t('sys.login.registerButton') }}
        </a-button>
      </a-col>
    </a-row>

    <a-divider class="enter-x">{{ t('sys.login.otherSignIn') }}</a-divider>

    <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
      <GithubFilled />
      <WechatFilled />
      <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled />
    </div>

    <SlideVerifyModal @register="registerModal" @success="handleVerifySuccess" />
  </a-form>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';

  import {
    GithubFilled,
    WechatFilled,
    AlipayCircleFilled,
    GoogleCircleFilled,
    TwitterCircleFilled,
  } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { encryptByMd5 } from '/@/utils/cipher';
  import { useModal } from '/@/components/Modal';
  import SlideVerifyModal from '/@/components/Verify/src/SlideVerifyModal.vue';
  import { getByKey } from '/@/api/sys/sysConfig';

  const { t } = useI18n();
  const { notification } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref<boolean>(false);
  const hasError = ref<boolean>(false);
  const errorMessage = ref();
  const rememberMe = ref<boolean>(false);
  // 是否开启登录验证码
  let loginVerificationCode = true;
  getByKey('loginVerificationCode').then((res) => {
    if (res && res.value) {
      loginVerificationCode = res.value === 'true';
    }
  });

  const formData = reactive({
    username: '',
    password: '',
  });

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  const [registerModal, { openModal: openVerifyModal }] = useModal();

  function handleVerifySuccess(captchaVerification) {
    handleLogin(captchaVerification);
  }

  /**
   * 点击登录按钮
   */
  function handleLoginClick() {
    if (loginVerificationCode) {
      // 开启了登录验证码
      openVerifyModal();
    } else {
      handleLogin(null);
    }
  }

  async function handleLogin(captchaVerification: Nullable<string>) {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        password: encryptByMd5(data.password.trim()),
        username: data.username.trim(),
        rememberMe: rememberMe.value,
        captchaVerification: captchaVerification!,
        mode: 'none',
      });
      if (userInfo) {
        hasError.value = false;
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.nickname}`,
          duration: 3,
        });
      }
    } catch (error: any) {
      errorMessage.value = error.response?.data?.errorMessage;
      if (errorMessage.value) {
        hasError.value = true;
      }
    } finally {
      loading.value = false;
    }
  }
</script>
<style>
  .ant-alert {
    margin-bottom: 10px;
  }
</style>
