<template>
  <div>
    <div class="pt-18 pb-20 mx-auto" style="width: 500px">
      <a-list>
        <a-list-item>
          <a-list-item-meta description="下载导入模板，按照模板中要求填写数据">
            <template #title>
              <a-button
                type="link"
                size="small"
                @click="handleDownload()"
                :loading="downloadBtnLoading"
              >
                1、下载模版
              </a-button>
            </template>
          </a-list-item-meta>
        </a-list-item>

        <a-list-item>
          <a-list-item-meta
            description="填写完后上传，支持xls,xlsx格式，单个文件不超过20MB，只能上传1个文件"
          >
            <template #title>
              <rule-upload upload-rule-slug="sys-import-data-excel" v-model:value="file">
                <a-button type="link" size="small"> 2、上传 </a-button>
              </rule-upload>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>

    <div class="footer-button">
      <a-button type="primary" @click="handleStepNext" :loading="nextBtnLoading">
        <template #icon>
          <Icon icon="ant-design:right-outlined" />
        </template>
        下一步
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { SysImportExcelTemplate } from '/@/api/sys/model/sysImportExcelTemplateModel';
  import { downloadTemplate } from '/@/api/sys/sysImportExcelTemplate';
  import { downloadFileById } from '/@/utils/file/download';
  import { analysis } from '/@/api/sys/sysImportExcelData';
  import { message } from 'ant-design-vue';
  import { FileInfo } from '/@/api/file/model/fileInfoModel';
  import RuleUpload from '/@/components/Upload/basic/RuleUpload.vue';

  export default defineComponent({
    components: { RuleUpload, Icon },
    props: {
      sysImportExcelTemplate: {
        type: Object as PropType<SysImportExcelTemplate>,
      },
    },
    emits: ['next'],
    setup(props, { emit }) {
      const downloadBtnLoading = ref<boolean>(false);
      const nextBtnLoading = ref<boolean>(false);
      const file = ref<Nullable<FileInfo>>();

      async function handleDownload() {
        downloadBtnLoading.value = true;
        await downloadTemplate(props.sysImportExcelTemplate?.importCode as string).then((res) => {
          downloadFileById(res);
        });
        downloadBtnLoading.value = false;
      }

      async function handleStepNext() {
        if (!file.value) {
          message.warn('请上传文件后重试');
          return;
        }
        nextBtnLoading.value = true;
        try {
          await analysis(
            props.sysImportExcelTemplate?.id as string,
            file.value?.bucketName as string,
            file.value?.objectName as string,
          ).then((res) => {
            if (res) {
              emit('next');
            }
          });
        } catch (e) {
          console.error(e);
        } finally {
          nextBtnLoading.value = false;
        }
      }

      return { downloadBtnLoading, nextBtnLoading, file, handleDownload, handleStepNext };
    },
  });
</script>

<style lang="less">
  @import '../view.less';
</style>
