<template>
  <BasicModal @register="register" title="添加图片" :showOkBtn="false">
    <a-upload-dragger
      name="file"
      :headers="headers"
      @change="handleChange"
      :action="uploadUrl"
      :showUploadList="false"
      accept=".jpg,.jpeg,.gif,.png,.webp"
    >
      <p class="ant-upload-drag-icon">
        <Icon icon="ant-design:inbox-outlined" />
      </p>
      <p class="ant-upload-text">将文件拖至此处或点击上传</p>
      <p class="ant-upload-hint"> 支持常见图片格式（.jpg,.jpeg,.gif,.png,.webp） </p>
    </a-upload-dragger>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useGlobSetting } from '/@/hooks/setting';
  import { Icon } from '/@/components/Icon';
  import { getToken } from '/@/utils/auth';
  export default defineComponent({
    components: { BasicModal, Icon },
    emits: ['register', 'uploading', 'done', 'error'],
    setup(_, { emit }) {
      const token = getToken();
      const globSetting = useGlobSetting();
      const { uploadUrl } = globSetting;

      let uploading = false;

      const [register, { closeModal }] = useModalInner();

      function handleChange(info: Recordable) {
        closeModal();
        const file = info.file;
        const status = file?.status;
        const url = file?.response?.url;
        const name = file?.name;

        if (status === 'uploading') {
          if (!uploading) {
            emit('uploading', name);
            uploading = true;
          }
        } else if (status === 'done') {
          emit(
            'done',
            name,
            `<img class="editor-media editor-image" alt="${name}" style="max-width: 100%" src="${
              globSetting.apiUrl + url
            }"/>`,
          );
          uploading = false;
        } else if (status === 'error') {
          emit('error');
          uploading = false;
        }
      }

      return {
        handleChange,
        uploadUrl,
        register,
        closeModal,
        setModalProps: () => {},
        headers: {
          Authorization: token,
        },
      };
    },
  });
</script>
