<template>
  <BasicModal v-bind="$attrs" @register="registerModel" title="流程转模型">
    <BasicForm @register="registerForm" />
    <template #footer>
      <a-button @click="closeModal">
        <Icon icon="ant-design:close-outlined" />
        关闭
      </a-button>
      <a-button :loading="saveBtnLoading" type="primary" @click="handleSave">
        <Icon icon="ant-design:plus-outlined" />
        保存
      </a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { convertToModel } from '/@/api/activiti/activitiProcess';
  import { Icon } from '/@/components/Icon';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  export default defineComponent({
    name: 'ActivitiProcessInput',
    components: { BasicModal, Icon, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const saveBtnLoading = ref<boolean>(false);

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        schemas: [
          { field: 'id', label: 'id', component: 'Input', ifShow: false },
          { field: 'version', label: 'version', component: 'Input', ifShow: false },
          {
            field: 'key',
            label: '标识',
            component: 'Input',
            required: true,
            rules: [{ max: 255, message: '标识不能超过255个字符', trigger: 'blur' }],
          },
          {
            field: 'name',
            label: '名称',
            component: 'Input',
            required: true,
            rules: [{ max: 255, message: '名称不能超过255个字符', trigger: 'blur' }],
          },
          {
            field: 'description',
            label: '描述',
            component: 'InputTextArea',
            rules: [{ max: 255, message: '描述不能超过255个字符', trigger: 'blur' }],
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

      async function handleSubmit(callback: (res: boolean) => any) {
        try {
          saveBtnLoading.value = true;
          changeLoading(true);
          const values = await validate();
          await convertToModel(values).then((res) => {
            emit('success');
            callback(res);
          });
        } catch (e) {
          console.error(e);
          changeLoading(false);
          saveBtnLoading.value = false;
        }
      }

      async function handleSave() {
        await handleSubmit(() => {
          changeLoading(false);
          saveBtnLoading.value = false;
          closeModal();
        });
      }

      return {
        saveBtnLoading,
        registerModel,
        registerForm,
        closeModal,
        handleSave,
      };
    },
  });
</script>