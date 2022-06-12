<template>
  <BasicModal @register="register" @ok="handleSave" title="修改密码">
    <a-alert
      :type="passwordScore < 2 ? 'warning' : 'success'"
      :message="passwordScore < 2 ? '密码强度不能低于3级' : '密码符合要求'"
      banner
    />
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { changePassword } from '/@/api/auth/sysUserPersonal';
  import { encryptByMd5 } from '/@/utils/cipher';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    components: { BasicModal, BasicForm },
    setup() {
      const model = ref({});
      const passwordScore = ref<number>(-1);

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
            component: 'StrengthMeter',
            componentProps: {
              placeholder: '新密码',
              onScoreChange: (score) => {
                passwordScore.value = score;
              },
            },
            rules: [
              {
                required: true,
                message: '请输入新密码',
              },
            ],
          },
          {
            field: 'confirmPassword',
            label: '确认密码',
            component: 'InputPassword',

            dynamicRules: ({ values }) => {
              return [
                {
                  required: true,
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.reject('密码不能为空');
                    }
                    if (value !== values.passwordNew) {
                      return Promise.reject('两次输入的密码不一致!');
                    }
                    return Promise.resolve();
                  },
                },
              ];
            },
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      const [register, { changeOkLoading, closeModal }] = useModalInner(() => {
        resetFields();
      });

      async function handleSave() {
        if (passwordScore.value < 2) {
          createMessage.warn('密码强度不能低于3级');
          return;
        }
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

      return { model, passwordScore, register, registerForm, handleSave };
    },
  });
</script>
