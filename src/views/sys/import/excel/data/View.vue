<template>
  <PageWrapper>
    <a-card
      :title="`导入数据 - ${sysImportExcelTemplate?.name ? sysImportExcelTemplate?.name : '错误'}`"
      :bordered="false"
    >
      <a-steps :current="current" v-if="isHav">
        <a-step title="上传数据" description="下载模版，填写后上传" />
        <a-step title="查看数据" description="预览解析数据" />
        <a-step title="导入数据" description="保存" />
      </a-steps>

      <div class="step-container" v-if="isHav">
        <Upload
          v-if="current === 0"
          :sys-import-excel-template="sysImportExcelTemplate"
          @next="handleStepNext"
        />
        <Preview
          v-if="current === 1"
          :sys-import-excel-template="sysImportExcelTemplate"
          @update="updateResult"
          @next="handleStepNext"
          @prev="handleStepPrev"
        />
        <Result
          v-if="current === 2"
          :sys-import-excel-template="sysImportExcelTemplate"
          :import-summary="importSummary"
          @continue="continueImport"
        />
      </div>
      <a-result
        v-else
        title="未找到导入模版"
        :sub-title="`我们未找到当前请求的模版信息（${importCode}），请刷新页面重试或联系管理员`"
        status="error"
      />
    </a-card>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Steps } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { SysImportExcelTemplate } from '/@/api/sys/model/sysImportExcelTemplateModel';
  import {
    checkLastData,
    getImportExcelTemplate,
    SysImportSummary,
  } from '/@/api/sys/sysImportExcelData';
  import Upload from './components/Upload.vue';
  import Preview from './components/Preview.vue';
  import Result from './components/Result.vue';

  export default defineComponent({
    name: 'SysImportExcelDataView',
    components: {
      PageWrapper,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
      Upload,
      Preview,
      Result,
    },
    setup() {
      const { currentRoute } = useRouter();
      // 模版标识
      const importCode = ref<string>(unref(currentRoute).params?.importCode as string);

      const isHav = ref<boolean>(true);

      // 导入模板
      const sysImportExcelTemplate = ref<SysImportExcelTemplate>();

      // 结果汇总
      const importSummary = ref<SysImportSummary>();

      onMounted(async () => {
        // 模板
        sysImportExcelTemplate.value = await getImportExcelTemplate(importCode.value);
        if (sysImportExcelTemplate.value) {
          // 检查是否有上次未保存的数据
          const isHas = await checkLastData(sysImportExcelTemplate.value.id as string);
          if (isHas) {
            current.value = 1;
          }
        } else {
          isHav.value = false;
        }
      });

      // 当前步骤
      const current = ref<number>(0);

      /**
       * 更新结果
       */
      function updateResult(result) {
        importSummary.value = result;
      }

      function continueImport() {
        current.value = 0;
      }

      /**
       * 上一步
       */
      function handleStepPrev() {
        current.value--;
      }

      /**
       * 下一步
       */
      function handleStepNext() {
        current.value++;
      }

      return {
        isHav,
        importCode,
        current,
        sysImportExcelTemplate,
        importSummary,
        updateResult,
        continueImport,
        handleStepPrev,
        handleStepNext,
      };
    },
  });
</script>
<style scoped>
  .step-container {
    padding-top: 2rem;
  }
</style>
