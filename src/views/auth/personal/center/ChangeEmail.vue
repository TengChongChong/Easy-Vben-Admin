<template>
  <BasicModal @register="register" @ok="handleSave" title="修改邮箱">
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { applicationBindingEmail } from '/@/api/auth/sysUserPersonal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  export default defineComponent({
    components: { BasicModal, BasicForm },
    setup() {
      const userStore = useUserStore();
      const model = ref({});
      const { createMessage } = useMessage();
      const [registerForm, { validate, resetFields }] = useForm({
        labelWidth: 120,
        schemas: [
          {
            field: 'email',
            label: '邮箱',
            component: 'Input',
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
          await applicationBindingEmail(values.email);
          createMessage.success('邮件发送成功，请前往邮箱激活邮箱');
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
