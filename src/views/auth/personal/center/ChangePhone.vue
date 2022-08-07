<template>
  <BasicModal @register="register" @ok="handleSave" title="修改手机号">
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { bindingPhone } from '/@/api/auth/sysUserPersonal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { bindingPhoneCaptcha } from '/@/api/sys/sysCaptcha';
  import { isBlank } from '/@/utils/is';
  import { useUserStore } from '/@/store/modules/user';
  export default defineComponent({
    components: { BasicModal, BasicForm },
    setup() {
      const userStore = useUserStore();
      const model = ref({});
      const { createMessage } = useMessage();
      const [registerForm, { validate, resetFields, getFieldsValue }] = useForm({
        labelWidth: 120,
        schemas: [
          {
            field: 'phoneNumber',
            label: '手机号',
            component: 'Input',
            required: true,
          },
          {
            field: 'captcha',
            label: '验证码',
            component: 'InputCountDown',
            componentProps: {
              sendCodeApi: async () => {
                const values = getFieldsValue();
                if (isBlank(values.phoneNumber)) {
                  createMessage.warn('请输入手机号');
                  return false;
                }
                await bindingPhoneCaptcha(values.phoneNumber).then((code) => {
                  // 注：此处仅为演示，实际场景无此提示
                  createMessage.success(`发送成功（此处仅模拟修改流程）：${code}`);
                });
                return true;
              },
            },
            required: true,
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      const [register, { changeOkLoading, closeModal }] = useModalInner(() => {
        resetFields();
      });

      async function handleSave() {
        try {
          changeOkLoading(true);
          const values = await validate();
          await bindingPhone(values.phoneNumber, values.captcha);
          createMessage.success('修改成功');
          await userStore.refreshCurrentUserAction();
          closeModal();
        } catch (e) {
          console.error(e);
        } finally {
          changeOkLoading(false);
        }
      }

      return { model, register, registerForm, handleSave };
    },
  });
</script>
