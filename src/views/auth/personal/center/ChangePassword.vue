<template>
  <BasicModal @register="register" @ok="handleSave" title="修改密码">
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { changePassword } from '/@/api/auth/sysUserPersonal';
  import { encryptByMd5 } from '/@/utils/cipher';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { checkPassword } from '/@/utils/validator';
  export default defineComponent({
    components: { BasicModal, BasicForm },
    setup() {
      const model = ref({});

      const { createMessage } = useMessage();
      const [registerForm, { validate, resetFields }] = useForm({
        labelWidth: 120,
        schemas: [
          {
            field: 'passwordOld',
            label: '当前密码',
            component: 'InputPassword',
            required: true,
          },
          {
            field: 'passwordNew',
            label: '新密码',
            component: 'InputPassword',
            componentProps: {
              autocomplete: 'new-password',
            },
            rules: [{ required: true, validator: checkPassword, trigger: 'change' }],
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
          await changePassword(
            encryptByMd5(values.passwordOld.trim()),
            encryptByMd5(values.passwordNew.trim()),
          );
          createMessage.success('修改成功');
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
