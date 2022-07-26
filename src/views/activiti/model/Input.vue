<template>
  <BasicModal v-bind="$attrs" @register="registerModel" title="流程模型">
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
      <a-button :loading="saveBtnLoading" type="primary" @click="handleSaveAndAdd">
        <Icon icon="ant-design:plus-outlined" />
        保存并新增
      </a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, nextTick, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { save } from '/@/api/activiti/activitiModel';
  import { Icon } from '/@/components/Icon';
  import { isNotBlank } from '/@/utils/is';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { ActivitiModel } from '/@/api/activiti/model/activitiModelModel';

  export default defineComponent({
    name: 'ActivitiModelInput',
    components: { BasicModal, Icon, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const saveBtnLoading = ref<boolean>(false);

      const [registerForm, { resetFields, getFieldsValue, setFieldsValue, validate }] = useForm({
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
            field: 'file',
            label: '模型文件',
            component: 'Upload',
            componentProps: {
              accept: ['xml'],
              multiple: false,
              maxNumber: 1,
              onChange: handleFileChange,
            },
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

      async function handleSubmit(callback: (res: ActivitiModel) => any) {
        try {
          saveBtnLoading.value = true;
          changeLoading(true);
          const values = await validate();
          if (values.file && values.file.length) {
            values.path = values.file[0].path;
          }
          delete values.file;
          await save(values).then((res) => {
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

      async function handleSaveAndAdd() {
        await handleSubmit(() => {
          nextTick(async () => {
            // 重置表单
            await resetFields();
            changeLoading(false);
            saveBtnLoading.value = false;
          });
        });
      }

      /**
       * 根据模型文件名称解析名称与标识
       *
       * @param files
       */
      function handleFileChange(files) {
        if (!files || files.length === 0) {
          return;
        }
        const values = getFieldsValue();
        if (isNotBlank(values.name) || isNotBlank(values.key)) {
          return;
        }
        // 请假(leave) v.14.bpmn20.xml
        const displayName = files[0].displayName;
        if (displayName.indexOf('(') > -1 && displayName.indexOf(')') > -1) {
          // 从系统中导出的xml
          setFieldsValue({
            name: displayName.substring(0, displayName.indexOf('(')),
            key: displayName.substring(displayName.indexOf('(') + 1, displayName.indexOf(')')),
          });
        }
      }

      return {
        saveBtnLoading,
        registerModel,
        registerForm,
        closeModal,
        handleSave,
        handleSaveAndAdd,
      };
    },
  });
</script>