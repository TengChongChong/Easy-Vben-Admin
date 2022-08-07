<template>
  <PageWrapper>
    <a-card title="滑块验证码" :bordered="false">
      <a-button @click="openVerifyModal">点击完成验证</a-button>

      <br />
      <br />

      <template v-if="captchaVerification">
        <a-alert show-icon message="请将下方验证码传到后端进行二次验证" />
        <a-tag>{{ captchaVerification }}</a-tag>
      </template>
    </a-card>

    <SlideVerifyModal @register="registerModal" @success="handleVerifySuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import SlideVerifyModal from '/@/components/Verify/src/SlideVerifyModal.vue';
  import { useModal } from '/@/components/Modal';

  export default defineComponent({
    components: { PageWrapper, SlideVerifyModal },
    setup() {
      const [registerModal, { openModal: openVerifyModal }] = useModal();

      const captchaVerification = ref<string>();

      function handleVerifySuccess(code) {
        captchaVerification.value = code;
      }

      return { captchaVerification, registerModal, handleVerifySuccess, openVerifyModal };
    },
  });
</script>
