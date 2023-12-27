<template>
  <div v-if="uploadRule">
    <BasicUpload
      v-bind="$attrs"
      v-model:value="uploadedFileList"
      :name="name"
      :filename="filename"
      :maxNumber="maxNumber"
      :multiple="multiple"
      :maxSize="uploadRule.upperLimit / 1024"
      :showHelpText="showHelpText"
      :uploadParams="uploadParams"
      :accept="uploadRule.suffixArray"
      :url="`${uploadUrl}/${uploadRule.slug}`"
      @change="handleValueChange"
    />
  </div>
  <div v-else> 获取文件上传策略[{{ uploadRuleSlug }}]失败 </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  import { useGlobSetting } from '/@/hooks/setting';
  import BasicUpload from './BasicUpload.vue';
  import { FileUploadRule } from '/@/api/file/model/fileUploadRuleModel';
  import { FileInfo } from '/@/api/file/model/fileInfoModel';
  import { getBySlug } from '/@/api/file/fileUploadRule';

  export default defineComponent({
    name: 'RuleUpload',
    components: { BasicUpload },
    props: {
      uploadRuleSlug: propTypes.string,
      value: propTypes.any,
      showHelpText: propTypes.bool.def(true),
      maxNumber: propTypes.number.def(1),
      multiple: propTypes.bool.def(false),
      uploadParams: propTypes.any,
      name: propTypes.string.def('file'),
      filename: propTypes.string,
    },
    emits: ['change', 'update:value'],
    setup(props, { emit }) {
      const uploadRule = ref<Nullable<FileUploadRule>>();

      // 已上传文件
      let uploadedFileList = ref<FileInfo[]>([]);

      const { uploadUrl } = useGlobSetting();

      watch(
        () => props.value,
        () => {
          uploadedFileList.value = props.value;
        },
        { deep: true },
      );

      onMounted(async () => {
        if (props.uploadRuleSlug) {
          uploadRule.value = await getBySlug(props.uploadRuleSlug);
        }

        uploadedFileList.value = props.value;
      });

      function handleValueChange(value: FileInfo[] | FileInfo) {
        emit('change', value);
        emit('update:value', value);
      }

      return { uploadUrl, uploadRule, uploadedFileList, handleValueChange };
    },
  });
</script>
