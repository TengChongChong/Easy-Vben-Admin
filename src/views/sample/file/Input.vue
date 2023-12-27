<template>
  <BasicModal v-bind="$attrs" @register="registerModel" showFooter title="文件示例" :width="720">
    <BasicForm @register="registerForm" />
    <template #footer>
      <a-button-cancel text="关闭" @click="closeModal" />
      <a-button-save :loading="saveBtnLoading" @click="handleSave" />
      <a-button-save :loading="saveBtnLoading" @click="handleSaveAndAdd" text="保存并新增" />
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, nextTick, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { AButtonSave, AButtonCancel } from '/@/components/Button';
  import { add, save } from '/@/api/sample/sampleFile';
  import { SampleFile } from '/@/api/sample/model/sampleFileModel';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'SampleFileInput',
    components: { BasicModal, BasicForm, AButtonSave, AButtonCancel },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const saveBtnLoading = ref<boolean>(false);

      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        labelWidth: 100,
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'file',
            label: '文件',
            component: 'RuleUpload',
            componentProps: {
              uploadRuleSlug: 'sample-file',
              // ruleSlug: 'sample-file',
              // ruleSlug: 'sample-file',
            },
            required: true,
          },
          {
            field: 'remarks',
            label: '备注',
            component: 'InputTextArea',
            componentProps: {
              autoSize: {
                minRows: 2,
                maxRows: 7,
              },
            },
            rules: [{ max: 900, message: '备注不能超过900个字符', trigger: 'blur' }],
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

      async function handleSubmit(callback: (_: SampleFile) => any) {
        try {
          saveBtnLoading.value = true;
          changeLoading(true);
          await validate();
          await save(getFieldsValue() as SampleFile).then((res) => {
            message.success('保存成功');
            emit('success');
            callback(res);
          });
        } catch (e) {
          console.error(e);
          saveBtnLoading.value = false;
          changeLoading(false);
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
        await handleSubmit(() => {
          nextTick(() => {
            add().then(async (data) => {
              // 重置表单
              await resetFields();
              await setFieldsValue(data);
              changeLoading(false);
            });
          });
        });
      }

      return {
        saveBtnLoading,
        registerModel,
        closeModal,
        registerForm,
        handleSave,
        handleSaveAndAdd,
      };
    },
  });
</script>
