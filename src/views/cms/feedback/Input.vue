<template>
  <BasicModal v-bind="$attrs" @register="registerModel" showFooter title="用户反馈" :width="720">
    <BasicForm @register="registerForm" />
    <template #footer>
      <a-button-cancel text="关闭" @click="closeModal" />
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { AButtonCancel } from '/@/components/Button';

  export default defineComponent({
    name: 'CmsFeedbackInput',
    components: { BasicModal, BasicForm, AButtonCancel },
    emits: ['register'],
    setup() {
      const saveBtnLoading = ref<boolean>(false);

      const [registerForm, { resetFields, setFieldsValue }] = useForm({
        labelWidth: 100,
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'nickname',
            label: '昵称',
            required: true,
            component: 'Input',
            rules: [{ max: 32, message: '昵称不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'email',
            label: '邮箱',
            component: 'Input',
            rules: [{ max: 32, message: '邮箱不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'phoneNumber',
            label: '手机号',
            component: 'Input',
            rules: [{ max: 32, message: '手机号不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'content',
            label: '内容',
            required: true,
            component: 'InputTextArea',
            componentProps: {
              autoSize: {
                minRows: 2,
                maxRows: 7,
              },
            },
            rules: [{ max: 256, message: '内容不能超过256个字符', trigger: 'blur' }],
          },
          {
            field: 'status',
            label: '状态',
            component: 'DictRadio',
            componentProps: {
              dictType: 'commonStatus',
            },
            itemProps: { validateTrigger: 'blur' },
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      const [registerModel, { changeLoading, closeModal }] = useModalInner(async (data) => {
        changeLoading(true);
        // 重置表单
        await resetFields();
        await setFieldsValue(data);
        changeLoading(false);
      });

      return {
        saveBtnLoading,
        registerModel,
        closeModal,
        registerForm,
      };
    },
  });
</script>
