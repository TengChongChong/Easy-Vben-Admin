<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <a-form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <a-form-item name="username" class="enter-x">
        <a-input
          size="large"
          v-model:value="formData.username"
          :placeholder="t('sys.login.userName')"
        />
      </a-form-item>

      <a-form-item name="mobile" class="enter-x">
        <a-input-group compact>
          <a-form-item-rest>
            <a-select size="large" v-model:value="formData.type" class="!w-1/3">
              <a-select-option value="mobile">手机号</a-select-option>
              <a-select-option value="mail">邮箱</a-select-option>
            </a-select>
          </a-form-item-rest>
          <div class="!w-2/3">
            <a-input
              class="my-input"
              v-model:value="formData.mobile"
              size="large"
              :placeholder="formData.type === 'mobile' ? '手机号码' : '邮箱'"
            />
          </div>
        </a-input-group>
      </a-form-item>

      <a-form-item name="code" class="enter-x">
        <CountdownInput
          size="large"
          v-model:value="formData.code"
          placeholder="验证码"
          :sendCodeApi="sendCode"
        />
      </a-form-item>

      <a-form-item name="password" class="enter-x">
        <StrengthMeter
          size="large"
          autocomplete="new-password"
          @score-change="onScoreChange"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </a-form-item>
      <a-form-item class="enter-x">
        <a-button type="primary" size="large" block @click="handleReset" :loading="loading">
          {{ t('common.resetText') }}
        </a-button>
        <a-button size="large" block class="mt-4" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </a-button>
      </a-form-item>
    </a-form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref, onMounted } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { CountdownInput } from '/@/components/CountDown';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, useFormRules, LoginStateEnum } from './useLogin';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { resetPassword, sendEmail, sendSms } from '/@/api/auth/sysUserRetrievePassword';
  import { message } from 'ant-design-vue';
  import { encryptByMd5 } from '/@/utils/cipher';
  import { getByKey } from '/@/api/sys/sysConfig';

  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  // 后台配置的密码等级
  const passwordSecurityLevel = ref<number>(3);
  const passwordScore = ref<number>(-1);

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    type: 'mobile',
    username: '',
    mobile: '',
    code: '',
    password: '',
  });

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);

  onMounted(() => {
    getByKey('passwordSecurityLevel').then((res) => {
      if (res && res.value) {
        passwordSecurityLevel.value = Number(res.value);
      }
    });
  });

  async function sendCode() {
    try {
      await formRef.value.validateFields(['username', 'mobile']);
      let api = 'mobile' === formData.type ? sendSms : sendEmail;
      await api(formData.username, formData.mobile).then((res) => {
        if ('mobile' === formData.type) {
          message.success(`发送成功（此处仅模拟找回流程）：${res}`);
        } else {
          message.success('发送成功');
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  function onScoreChange(score) {
    passwordScore.value = score + 1;
  }

  async function handleReset() {
    const form = unref(formRef);
    if (!form) return;
    try {
      await form.validateFields();
      if (passwordScore.value < passwordSecurityLevel.value) {
        message.warn(`密码强度不能低于${passwordSecurityLevel.value}级`);
        return;
      }
      const { username, password, code } = formData;
      resetPassword(username, code, encryptByMd5(password.trim())).then(() => {
        message.success('重置成功');
        handleBackLogin();
      });
    } catch (e) {}
  }
</script>
<style lang="less" scoped>
  .my-input {
    min-width: auto !important;
    @media (max-width: @screen-xl) {
      min-width: auto !important;
    }

    @media (max-width: @screen-lg) {
      min-width: auto !important;
    }

    @media (max-width: @screen-md) {
      min-width: auto !important;
    }

    @media (max-width: @screen-sm) {
      min-width: auto !important;
    }
  }
</style>
