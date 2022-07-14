<template>
  <PageWrapper>
    <a-card :title="`导入数据 - ${sysImportExcelTemplate?.name}`" :bordered="false">
      <a-steps :current="current">
        <a-step title="上传数据" description="下载模版，填写后上传" />
        <a-step title="查看数据" description="预览解析数据" />
        <a-step title="导入数据" description="保存" />
      </a-steps>

      <Upload
        v-if="current === 0"
        :sys-import-excel-template="sysImportExcelTemplate"
        @next="handleStepNext"
      />
      <Preview
        v-if="current === 1"
        :sys-import-excel-template="sysImportExcelTemplate"
        @next="handleStepNext"
        @prev="handleStepPrev"
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
  import { checkLastData, getImportExcelTemplate } from '/@/api/sys/sysImportExcelData';
  import Upload from './components/Upload.vue';
  import Preview from './components/Preview.vue';

  export default defineComponent({
    name: 'SysImportExcelDataView',
    components: {
      PageWrapper,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
      Upload,
      Preview,
    },
    setup() {
      const { currentRoute } = useRouter();
      const importCode = ref<string>(unref(currentRoute).params?.importCode as string);

      // 导入模板
      const sysImportExcelTemplate = ref<SysImportExcelTemplate>();

      onMounted(async () => {
        // 模板
        sysImportExcelTemplate.value = await getImportExcelTemplate(importCode.value);
        // 检查是否有上次未保存的数据
        const isHas = await checkLastData(sysImportExcelTemplate.value.id as string);
        if (isHas) {
          current.value = 1;
        }
      });

      // 当前步骤
      const current = ref<number>(0);

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
        current,
        sysImportExcelTemplate,
        handleStepPrev,
        handleStepNext,
      };
    },
  });
</script>
