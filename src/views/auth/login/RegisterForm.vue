<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <a-form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <a-form-item name="username" class="enter-x">
        <a-input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.username"
          :placeholder="t('sys.login.userName')"
        />
      </a-form-item>
      <a-form-item name="mobile" class="enter-x">
        <a-input
          size="large"
          v-model:value="formData.mobile"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
        />
      </a-form-item>
      <a-form-item name="sms" class="enter-x">
        <CountdownInput
          size="large"
          class="fix-auto-fill"
          v-model:value="formData.sms"
          :placeholder="t('sys.login.smsCode')"
        />
      </a-form-item>
      <a-form-item name="password" class="enter-x">
        <StrengthMeter
          size="large"
          autocomplete="new-password"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </a-form-item>

      <a-form-item class="enter-x" name="policy">
        <!-- No logic, you need to deal with it yourself -->
        <a-checkbox v-model:checked="formData.policy" size="small">
          {{ t('sys.login.policy') }}
        </a-checkbox>
      </a-form-item>

      <a-button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >
        {{ t('sys.login.registerButton') }}
      </a-button>
      <a-button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </a-button>
    </a-form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { CountdownInput } from '/@/components/CountDown';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';

  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    username: '',
    password: '',
    mobile: '',
    sms: '',
    policy: false,
  });

  const { getFormRules } = useFormRules();
  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);

  async function handleRegister() {
    const data = await validForm();
    if (!data) return;
    console.log(data);
  }
</script>
