<template>
  <BasicModal v-bind="$attrs" @register="registerModel" title="撤销">
    <BasicForm @register="registerForm" />
    <template #footer>
      <a-button @click="closeModal">
        <Icon icon="ant-design:close-outlined" />
        取消
      </a-button>
      <a-button :loading="loading" type="primary" @click="handleRevoke">
        <Icon icon="ant-design:rollback-outlined" />
        撤销
      </a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Icon } from '/@/components/Icon';
  import { formatToNow } from '/@/utils/dateUtil';
  import { revoke } from '/@/api/activiti/activitiTask';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'ActivitiProcessModal',
    components: { BasicForm, BasicModal, Icon },
    emits: ['register', 'success'],
    setup(_, { emit }) {
      const loading = ref<boolean>(false);

      let processInstanceId: Nullable<string> = null;
      const [registerModel, { closeModal }] = useModalInner(async (id) => {
        await resetFields();
        processInstanceId = id;
      });

      const [registerForm, { resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: [
          {
            field: 'reason',
            label: '撤销原因',
            component: 'InputTextArea',
            required: true,
            rules: [{ max: 255, message: '撤销原因不能超过255个字符', trigger: 'blur' }],
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      async function handleRevoke() {
        try {
          const values = await validate();
          loading.value = true;
          await revoke(processInstanceId as string, values.reason).then((res) => {
            if (res) {
              message.success('撤销成功');
              closeModal();
              emit('success');
            }
          });
        } catch (e) {
        } finally {
          loading.value = false;
        }
      }

      return {
        loading,
        registerModel,
        closeModal,
        registerForm,
        handleRevoke,
        formatToNow,
      };
    },
  });
</script>
<style scoped>
  .process-img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }
</style>
