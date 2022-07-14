<template>
  <div>
    <a-upload
      :accept="getStringAccept"
      :action="uploadUrl"
      :multiple="multiple"
      :headers="headers"
      :file-list="displayFileList"
      :before-upload="beforeUpload"
      @change="handleChange"
    >
      <slot>
        <a-button-upload />
      </slot>
      <br />
      <a-typography-text type="secondary" v-if="showHelpText">
        {{ getHelpText }}
      </a-typography-text>
    </a-upload>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, toRefs, watch } from 'vue';
  import AButtonUpload from '/@/components/Button/src/ButtonUpload.vue';
  import type { UploadChangeParam } from 'ant-design-vue';
  import { getToken } from '/@/utils/auth';
  import { useGlobSetting } from '/@/hooks/setting';
  import { basicProps } from '/@/components/Upload/props';
  import { UploadFileModel } from '/@/components/Upload/type';
  import { SysFile } from '/@/api/sys/model/sysFileModel';
  import { isArray } from '/@/utils/is';
  import { convertToSysFile, convertToUploadFileModelArray } from '/@/components/Upload/helper';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUploadType } from '/@/components/Upload/useUpload';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'BasicUpload',
    components: { AButtonUpload },
    props: {
      value: {
        type: Array as PropType<SysFile[]>,
        default: () => [],
      },
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

      watch(
        () => props.value,
        (value = []) => {
          uploadedFileList = initValue(value);
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

      function initValue(value: SysFile[]): SysFile[] {
        if (!isArray(value)) {
          return [];
        }
        value.map((item) => {
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
        emit('change', uploadedFileList);
        emit('update:value', uploadedFileList);
      }

      /**
       * 刷新显示的文件列表
       */
      function refreshDisplayFileList() {
        displayFileList.value =
          convertToUploadFileModelArray(uploadedFileList).concat(uploadingFileList);
      }

      return {
        headers: {
          Authorization: token,
        },
        getStringAccept,
        getHelpText,
        uploadUrl,
        displayFileList,
        beforeUpload,
        handleChange,
      };
    },
  });
</script>
