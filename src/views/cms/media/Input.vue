<template>
  <BasicModal v-bind="$attrs" @register="registerModel" showFooter title="资源" :width="720">
    <BasicForm @register="registerForm">
      <template #file="{ model, field }">
        <basic-upload
          :max-size="100"
          :max-number="1"
          :accept="[
            ...fileSuffix.image,
            ...fileSuffix.audio,
            ...fileSuffix.video,
            ...fileSuffix.doc,
            ...fileSuffix.other,
          ]"
          :multiple="false"
          v-model:value="model[field]"
          @change="handleFileChange"
        />
      </template>
    </BasicForm>
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
  import { add, save } from '/@/api/cms/cmsMedia';
  import { CmsMedia } from '/@/api/cms/model/cmsMediaModel';
  import { BasicUpload } from '/@/components/Upload';
  import { SysFile } from '/@/api/sys/model/sysFileModel';
  import { fileSuffix } from '/@/views/cms/media/media.data';
  import { message } from 'ant-design-vue';
  export default defineComponent({
    name: 'CmsMediaInput',
    components: { BasicUpload, BasicModal, BasicForm, AButtonSave, AButtonCancel },
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
            slot: 'file',
            component: 'Input',
            required: true,
          },
          {
            field: 'name',
            label: '名称',
            component: 'InputTextArea',
            componentProps: {
              autoSize: {
                minRows: 2,
                maxRows: 7,
              },
            },
            required: true,
            rules: [{ max: 256, message: '名称不能超过256个字符', trigger: 'blur' }],
          },
          {
            field: 'type',
            label: '类型',
            component: 'DictRadio',
            componentProps: {
              dictType: 'cmsMediaType',
            },
            itemProps: { validateTrigger: 'blur' },
            required: true,
            show: false,
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

      function handleFileChange(file: Nullable<SysFile>) {
        if (file == null) {
          return null;
        }

        const type = file.name?.substring(file.name?.lastIndexOf('.')).toLowerCase();
        setFieldsValue({
          name: file.displayName?.substring(0, file.displayName?.lastIndexOf('.')),
          type: getFileType(type as string),
        });
      }

      async function handleSubmit(callback: (_: CmsMedia) => any) {
        try {
          saveBtnLoading.value = true;
          changeLoading(true);
          await validate();
          await save(getFieldsValue() as CmsMedia).then((res) => {
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

      function getFileType(suffix: string) {
        if (fileSuffix.image.includes(suffix)) {
          return 'image';
        } else if (fileSuffix.audio.includes(suffix)) {
          return 'audio';
        } else if (fileSuffix.video.includes(suffix)) {
          return 'video';
        } else if (fileSuffix.doc.includes(suffix)) {
          return 'doc';
        } else {
          return 'other';
        }
      }

      return {
        fileSuffix,
        saveBtnLoading,
        registerModel,
        closeModal,
        registerForm,
        handleFileChange,
        handleSave,
        handleSaveAndAdd,
      };
    },
  });
</script>
