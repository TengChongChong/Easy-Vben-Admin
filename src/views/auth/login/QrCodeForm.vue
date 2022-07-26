<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <div class="enter-x min-w-64 min-h-64">
      <QrCode
        :value="qrCodeUrl"
        class="enter-x flex justify-center xl:justify-start"
        :width="280"
      />
      <a-divider class="enter-x">{{ t('sys.login.scanSign') }}</a-divider>
      <a-button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </a-button>
    </div>
  </template>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { QrCode } from '/@/components/Qrcode';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, LoginStateEnum } from './useLogin';

  const qrCodeUrl = 'https://vvbin.cn/next/login';

  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.QR_CODE);
</script>
