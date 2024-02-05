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
        :action="`${uploadUrl}/cms-media-${insertType}`"
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
  import { message } from 'ant-design-vue';
  import { save } from '/@/api/cms/cmsMedia';
  import { convertToFileInfo } from '/@/components/Upload/helper';
  import { CmsMedia } from '/@/api/cms/model/cmsMediaModel';
  import { getHtml } from './util';
  import { FileUploadRule } from '/@/api/file/model/fileUploadRuleModel';
  import { getBySlug } from '/@/api/file/fileUploadRule';

  export default defineComponent({
    components: { BasicModal, Icon },
    emits: ['register', 'uploading', 'done', 'error'],
    setup(_, { emit }) {
      const token = getToken();
      const globSetting = useGlobSetting();
      const { uploadUrl } = globSetting;
      let uploading = false;

      const insertType = ref<string>('image');
      const accept = ref<string>('');
      // 单文件最大限制
      let maxSize = 1;

      const uploadRule = ref<Nullable<FileUploadRule>>();

      const [register, { closeModal }] = useModalInner(async ({ type }) => {
        // accept.value = fileSuffix[type].join(',');
        insertType.value = type;

        uploadRule.value = await getBySlug(`cms-media-${type}`);
        accept.value = getStringAccept(uploadRule.value.suffixArray!);
        maxSize = uploadRule.value.upperLimit! / 1024;
      });

      function getStringAccept(suffixArray: string[]) {
        return suffixArray
          .map((item) => {
            if (item.indexOf('/') > 0 || item.startsWith('.')) {
              return item;
            } else {
              return `.${item}`;
            }
          })
          .join(',');
      }

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
              file: convertToFileInfo(file),
              name: file.name,
            }).then((res: CmsMedia) => {
              closeModal();
              emit(
                'done',
                res.file?.displayName,
                getHtml(
                  insertType.value,
                  res.file?.displayName as string,
                  res.file?.bucketName as string,
                  res.file?.objectName as string,
                  res.file?.url as string,
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
