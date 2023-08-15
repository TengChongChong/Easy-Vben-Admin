<template>
  <BasicModal
    @register="register"
    :title="`添加${
      insertType === 'image'
        ? '图片'
        : insertType === 'video'
        ? '视频'
        : insertType === 'audio'
        ? '音频'
        : insertType === 'doc'
        ? '文档'
        : '附件'
    }`"
    :showOkBtn="false"
  >
    <a-form-item-rest>
      <a-upload-dragger
        name="file"
        :headers="headers"
        :action="uploadUrl"
        :showUploadList="false"
        :multiple="false"
        :accept="accept"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <p class="ant-upload-drag-icon">
          <Icon icon="ant-design:inbox-outlined" />
        </p>
        <p class="ant-upload-text">将文件拖至此处或点击上传</p>
        <p class="ant-upload-hint"> 支持（{{ accept }}） </p>
      </a-upload-dragger>
    </a-form-item-rest>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useGlobSetting } from '/@/hooks/setting';
  import { Icon } from '/@/components/Icon';
  import { getToken } from '/@/utils/auth';
  import { fileSuffix } from '/@/views/cms/media/media.data';
  import { message } from 'ant-design-vue';
  import { save } from '/@/api/cms/cmsMedia';
  import { convertToSysFile } from '/@/components/Upload/helper';
  import { CmsMedia } from '/@/api/cms/model/cmsMediaModel';
  import { getHtml } from './util';

  export default defineComponent({
    components: { BasicModal, Icon },
    emits: ['register', 'uploading', 'done', 'error'],
    setup(_, { emit }) {
      const token = getToken();
      const globSetting = useGlobSetting();
      const { uploadUrl } = globSetting;
      let uploading = false;

      const insertType = ref<string>('image');
      const accept = ref<string>(fileSuffix.image.join(','));
      // 单文件最大限制
      let maxSize = 1;

      const [register, { closeModal }] = useModalInner(({ type, size }) => {
        accept.value = fileSuffix[type].join(',');
        insertType.value = type;
        maxSize = size;
      });

      function beforeUpload(file) {
        if (file.size / 1024 / 1024 > maxSize) {
          message.error(`上传的文件不能超过${maxSize}MB`);
          return false;
        }
        return true;
      }

      function handleChange(info: Recordable) {
        const file = info.file;
        const status = file?.status;
        if (status === 'uploading') {
          if (!uploading) {
            emit('uploading', file.name);
            uploading = true;
          }
        } else if (status === 'done') {
          // 保存到资源库
          try {
            save({
              type: insertType.value,
              file: convertToSysFile(file),
              name: file.name,
            }).then((res: CmsMedia) => {
              closeModal();
              emit(
                'done',
                res.file?.displayName,
                getHtml(
                  insertType.value,
                  res.file?.displayName as string,
                  globSetting.apiUrl + res.file?.url,
                ),
              );
              uploading = false;
            });
          } catch (e) {
            console.error(e);
            uploading = false;
          }
        } else if (status === 'error') {
          emit('error');
          uploading = false;
        }
      }

      return {
        accept,
        insertType,
        beforeUpload,
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
