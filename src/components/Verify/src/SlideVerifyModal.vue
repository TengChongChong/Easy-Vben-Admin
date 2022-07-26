<template>
  <BasicModal
    wrap-class-name="slide-verify-modal"
    @register="register"
    title="请完成安全验证"
    :canFullscreen="false"
    :width="340"
  >
    <SlideVerify
      v-model:value="captchaVerification"
      ref="slideVerify"
      @success="handleSuccess"
      @change="handleChange"
    />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import SlideVerify from '/@/components/Verify/src/SlideVerify.vue';

  export default defineComponent({
    name: 'SlideVerifyModal',
    components: { SlideVerify, BasicModal },
    emits: ['register', 'success', 'change'],
    setup(_, { emit }) {
      const slideVerify = ref();
      const [register, { closeModal }] = useModalInner();

      const captchaVerification = ref<string>();

      function handleSuccess() {
        setTimeout(() => {
          closeModal();
          slideVerify.value.handleRefresh();
        }, 500);
        // 服务端二次验证所需参数
        emit('success', captchaVerification.value);
      }

      function handleChange(isPassing) {
        emit('change', isPassing);
      }

      return { register, slideVerify, captchaVerification, handleSuccess, handleChange };
    },
  });
</script>
<style lang="less">
  .slide-verify-modal {
    .ant-modal-footer {
      display: none;
    }

    .scroll-container {
      .scrollbar__wrap {
        margin-bottom: 0 !important;
      }
    }
  }
</style>
