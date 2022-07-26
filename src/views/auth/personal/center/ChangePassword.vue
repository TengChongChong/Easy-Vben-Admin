<template>
  <BasicModal @register="register" @ok="handleSave" title="修改密码">
    <a-alert
      :type="passwordScore < passwordSecurityLevel ? 'warning' : 'success'"
      :message="
        passwordScore < passwordSecurityLevel
          ? `密码强度不能低于${passwordSecurityLevel}级`
          : '密码符合要求'
      "
      banner
    />
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { changePassword } from '/@/api/auth/sysUserPersonal';
  import { encryptByMd5 } from '/@/utils/cipher';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getByKey } from '/@/api/sys/sysConfig';
  export default defineComponent({
    components: { BasicModal, BasicForm },
    setup() {
      const model = ref({});
      // 后台配置的密码等级
      const passwordSecurityLevel = ref<number>(3);

      const passwordScore = ref<number>(-1);

      onMounted(() => {
        getByKey('passwordSecurityLevel').then((res) => {
          if (res && res.value) {
            passwordSecurityLevel.value = Number(res.value);
          }
        });
      });

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
                passwordScore.value = score + 1;
              },
            },
            rules: [
              {
                required: true,
                message: '请输入新密码',
              },
            ],
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      const [register, { changeOkLoading, closeModal }] = useModalInner(() => {
        resetFields();
      });

      async function handleSave() {
        if (passwordScore.value < passwordSecurityLevel.value) {
          createMessage.warn(`密码强度不能低于${passwordSecurityLevel.value}级`);
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

      return { model, passwordScore, passwordSecurityLevel, register, registerForm, handleSave };
    },
  });
</script>
