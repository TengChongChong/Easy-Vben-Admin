<template>
  <div>
    <a-upload
      :accept="getStringAccept"
      :action="uploadUrl"
      :multiple="multiple"
      :headers="headers"
      :file-list="displayFileList"
      list-type="picture-card"
      :before-upload="beforeUpload"
      @change="handleChange"
      @preview="handlePreview"
    >
      <template v-if="maxNumber > displayFileList.length">
        <Icon icon="ant-design:upload-outlined" />
        上传
      </template>
    </a-upload>

    <a-modal :visible="previewVisible" title="预览" :footer="null" @cancel="handleCancel">
      <div class="preview-wrapper">
        <video
          loop
          controls
          playsinline
          webkit-playsinline
          x5-video-player-type="h5-page"
          v-if="previewVisible && previewUrl.endsWith('.mp4')"
          :src="previewUrl"
        ></video>
        <img v-if="!previewUrl.endsWith('.mp4')" alt="" :src="previewUrl" />
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, toRefs, watch } from 'vue';
  import type { UploadChangeParam } from 'ant-design-vue';
  import { getToken } from '/@/utils/auth';
  import { useGlobSetting } from '/@/hooks/setting';
  import { basicProps } from '/@/components/Upload/props';
  import { UploadFileModel } from '/@/components/Upload/type';
  import { SysFile } from '/@/api/sys/model/sysFileModel';
  import { isArray, isString } from '/@/utils/is';
  import { convertToSysFile, convertToUploadFileModelArray } from '/@/components/Upload/helper';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUploadType } from '/@/components/Upload/useUpload';
  import { propTypes } from '/@/utils/propTypes';
  import Icon from '/@/components/Icon/src/Icon.vue';

  export default defineComponent({
    name: 'BasicUpload',
    components: { Icon },
    props: {
      value: propTypes.any,
      showHelpText: propTypes.bool.def(true),
      ...basicProps,
    },
    emits: ['change', 'update:value'],
    setup(props, { emit }) {
      const { createMessage } = useMessage();
      const { t } = useI18n();

      const token = getToken();
      const { uploadUrl } = useGlobSetting();
      // 已上传文件
      let uploadedFileList: SysFile[] = [];
      // 未上传文件
      let uploadingFileList: UploadFileModel[] = [];
      // 用于显示的文件列表 已上传 + 未上传
      const displayFileList = ref<UploadFileModel[]>([]);

      const previewVisible = ref(false);
      const previewUrl = ref('');

      watch(
        () => props.value,
        (value = []) => {
          if (props.value == null || props.value === '' || isString(props.value)) {
            uploadedFileList = [];
            refreshDisplayFileList();
            return;
          }
          if (isArray(props.value)) {
            uploadedFileList = initValue(value);
          } else {
            uploadedFileList = initValue([value]);
          }
          refreshDisplayFileList();
        },
        { deep: true },
      );
      const { accept, maxNumber, maxSize } = toRefs(props);
      const { getStringAccept, getHelpText } = useUploadType({
        acceptRef: accept,
        helpTextRef: null,
        maxNumberRef: maxNumber,
        maxSizeRef: maxSize,
      });

      const { apiUrl } = useGlobSetting();

      function initValue(value: SysFile[]): SysFile[] {
        if (!isArray(value)) {
          return [];
        }
        value.map((item) => {
          if (!item.url?.startsWith(apiUrl)) {
            item.url = apiUrl + item.url;
          }
          item.status = 'done';
        });
        return value;
      }

      /**
       * 检查是否允许上传
       *
       * @param file 文件
       */
      const beforeUpload = (file: File) => {
        const { maxNumber, maxSize } = props;

        // 上传数量是否超出，此时当前选择的文件尚未添加到上传中数组，所以使用 >=
        if ((uploadedFileList.length + uploadingFileList?.length ?? 0) >= maxNumber) {
          createMessage.warning(t('component.upload.maxNumber', [maxNumber]));
          return false;
        }

        // 单文件大小是否超出
        if (maxSize && file.size / 1024 / 1024 >= maxSize) {
          createMessage.error(t('component.upload.maxSizeMultiple', [maxSize]));
          return false;
        }
        return true;
      };

      /**
       * 文件状态变更
       *
       * @param info info
       */
      const handleChange = (info: UploadChangeParam) => {
        const { file, fileList } = info;
        if (!info.file.status) {
          // 如果状态为空，说明在beforeUpload返回了false
          return;
        }
        uploadedFileList = [];
        uploadingFileList = [];
        fileList.map((item) => {
          if (item.status === 'success' || item.status === 'done') {
            uploadedFileList.push(convertToSysFile(item));
          } else {
            uploadingFileList.push(item);
          }
        });
        if (file.status === 'success' || file.status === 'done' || file.status === 'removed') {
          handleValueChange();
        }
        refreshDisplayFileList();
      };

      /**
       * 已上传文件值改变
       */
      function handleValueChange() {
        if (props.multiple) {
          emit('change', uploadedFileList);
          emit('update:value', uploadedFileList);
        } else {
          if (uploadedFileList.length > 0) {
            emit('change', uploadedFileList[0]);
            emit('update:value', uploadedFileList[0]);
          } else {
            emit('change', null);
            emit('update:value', null);
          }
        }
      }

      /**
       * 刷新显示的文件列表
       */
      function refreshDisplayFileList() {
        displayFileList.value =
          convertToUploadFileModelArray(uploadedFileList).concat(uploadingFileList);
      }

      const handleCancel = () => {
        previewVisible.value = false;
      };
      const handlePreview = async (file) => {
        previewVisible.value = true;
        if (!file.url?.startsWith(apiUrl)) {
          previewUrl.value = apiUrl + file.url;
        } else {
          previewUrl.value = file.url;
        }
      };

      function previewFile(file) {
        console.log(file);
      }

      return {
        headers: {
          Authorization: token,
        },
        getStringAccept,
        getHelpText,
        uploadUrl,
        displayFileList,
        previewVisible,
        previewUrl,
        beforeUpload,
        handleChange,
        handlePreview,
        handleCancel,
        previewFile,
      };
    },
  });
</script>
<style lang="less">
  .preview-wrapper {
    padding: 15px;

    img,
    video {
      display: block;
      max-width: 100%;
      max-height: 300px;
      margin: 0 auto;
    }
  }
</style>
