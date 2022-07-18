<template>
  <div>
    <div class="pt-18 pb-20 mx-auto" style="width: 500px">
      <a-result
        :title="`成功导入${importSummary.success}条数据`"
        :sub-title="
          importSummary.fail
            ? `${importSummary.fail}条数据由于验证失败未导入，你可以下载验证失败数据修改后重新导入。`
            : null
        "
        :status="
          importSummary.total === importSummary.success
            ? 'success'
            : importSummary.success > 0
            ? 'warning'
            : 'error'
        "
      >
        <template #extra>
          <a-button type="primary" :loading="continueBtnLoading" @click="handleContinueImport">
            <template #icon> <Icon icon="ant-design:upload-outlined" /> </template> 继续导入
          </a-button>
          <a-button
            v-if="importSummary.fail > 0"
            :loading="downloadBtnLoading"
            @click="handleExportVerificationFailData"
          >
            <template #icon>
              <Icon icon="ant-design:download-outlined" />
            </template>
            下载验证失败数据
          </a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { SysImportExcelTemplate } from '/@/api/sys/model/sysImportExcelTemplateModel';
  import { exportVerificationFailData, SysImportSummary } from '/@/api/sys/sysImportExcelData';
  import { downloadFileById } from '/@/utils/file/download';
  import { cleanMyImport } from '/@/api/sys/sysImportExcelTemporary';

  export default defineComponent({
    components: { Icon },
    props: {
      sysImportExcelTemplate: {
        type: Object as PropType<SysImportExcelTemplate>,
      },
      importSummary: {
        type: Object as PropType<SysImportSummary>,
      },
    },
    emits: ['continue'],
    setup(props, { emit }) {
      const downloadBtnLoading = ref<boolean>(false);
      const continueBtnLoading = ref<boolean>(false);

      /**
       * 继续导入
       */
      async function handleContinueImport() {
        continueBtnLoading.value = true;
        try {
          await cleanMyImport(props.sysImportExcelTemplate?.id as string);
        } catch (e) {
          console.error(e);
        } finally {
          emit('continue');
          continueBtnLoading.value = false;
        }
      }

      /**
       * 下载验证失败数据
       */
      async function handleExportVerificationFailData() {
        downloadBtnLoading.value = true;
        try {
          await exportVerificationFailData(props.sysImportExcelTemplate?.id as string).then(
            (id) => {
              downloadFileById(id);
            },
          );
        } catch (e) {
          console.error(e);
        } finally {
          downloadBtnLoading.value = false;
        }
      }

      return {
        downloadBtnLoading,
        continueBtnLoading,
        handleContinueImport,
        handleExportVerificationFailData,
      };
    },
  });
</script>

<style lang="less">
  @import '../view.less';
</style>
