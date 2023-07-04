<template>
  <BasicModal v-bind="$attrs" @register="registerModel" title="字典类型">
    <BasicForm @register="registerForm" />
    <template #footer>
      <a-button-cancel text="关闭" @click="closeModal" />
      <a-button-save :loading="saveBtnLoading" @click="handleSave" />
      <a-button-save :loading="saveBtnLoading" @click="handleSaveAndAdd" text="保存并新增" />
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  import { formSchema } from './dict-type.data';
  import { add, save } from '/@/api/sys/sysDictType';
  import { SysDictType } from '/@/api/sys/model/sysDictTypeModel';
  import { AButtonCancel, AButtonSave } from '/@/components/Button';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'SysDictTypeInput',
    components: { AButtonSave, AButtonCancel, BasicForm, BasicModal },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const saveBtnLoading = ref<boolean>(false);

      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        schemas: formSchema,
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

      async function handleSubmit(callback: (_: SysDictType) => any) {
        try {
          saveBtnLoading.value = true;
          changeLoading(true);
          await validate();
          await save(getFieldsValue() as SysDictType).then((res) => {
            message.success('保存成功');
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
        await handleSubmit((_) => {
          changeLoading(false);
          saveBtnLoading.value = false;
          closeModal();
        });
      }

      async function handleSaveAndAdd() {
        await handleSubmit((res) => {
          add().then(async (data) => {
            // 重置表单
            await resetFields();

            await setFieldsValue({
              ...data,
              sys: res.sys,
            });
            changeLoading(false);
            saveBtnLoading.value = false;
          });
        });
      }

      return {
        saveBtnLoading,
        registerModel,
        registerForm,
        handleSaveAndAdd,
        handleSave,
        closeModal,
      };
    },
  });
</script>
