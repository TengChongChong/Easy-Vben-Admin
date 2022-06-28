<template>
  <PageWrapper contentBackground>
    <div class="generator p-4">
      <a-steps :current="current">
        <a-step title="基本信息" description="基本信息设置" />
        <a-step title="列表页面" description="查询条件与表格排序" />
        <a-step title="详情页面" description="录入页面组件排序" />
        <a-step title="导入&导出" description="导入及导出字段排序" />
        <a-step title="完成" description="生成文件" />
      </a-steps>

      <BasicsConfig @update-config="updateConfig" @next="handleStepNext" v-show="current === 0" />
      <ListConfig
        @update-config="updateConfig"
        @prev="handleStepPrev"
        @next="handleStepNext"
        :generator-config="generatorConfig"
        v-show="current === 1"
      />
      <InputConfig
        @update-config="updateConfig"
        @prev="handleStepPrev"
        @next="handleStepNext"
        :generator-config="generatorConfig"
        v-show="current === 2"
      />
      <ImportAndExportConfig
        @update-config="updateConfig"
        @prev="handleStepPrev"
        @next="handleStepNext"
        :generator-config="generatorConfig"
        v-show="current === 3"
      />
      <Finish
        @update-config="updateConfig"
        @prev="handleStepPrev"
        :generator-config="generatorConfig"
        v-show="current === 4"
      />
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Steps } from 'ant-design-vue';
  import BasicsConfig from '/@/views/generator/BasicsConfig.vue';
  import ListConfig from '/@/views/generator/ListConfig.vue';
  import InputConfig from '/@/views/generator/InputConfig.vue';
  import ImportAndExportConfig from '/@/views/generator/ImportAndExportConfig.vue';
  import Finish from '/@/views/generator/Finish.vue';
  import {
    BasicsConfigModel,
    FieldConfig,
    FORM_TYPE,
    FormType,
    GeneratorConfig,
    ImportCellConfig,
    TableCellConfig,
  } from '/@/views/generator/ts/generator.data';
  import { TableInfo } from '/@/api/generator/model/generatorModel';
  import {
    getDefaultExport,
    getDefaultForm,
    getDefaultImport,
    getDefaultTable,
    needGeneratorImportOrExport,
    needGeneratorInput,
    needGeneratorList,
    toDictTypeArray,
  } from '/@/views/generator/ts/util';
  import { selectAll } from '/@/api/sys/sysDictType';
  import { SelectModel } from '/@/api/model/selectModel';

  export default defineComponent({
    name: 'GeneratorView',
    components: {
      Finish,
      ImportAndExportConfig,
      InputConfig,
      ListConfig,
      BasicsConfig,
      PageWrapper,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
    },
    setup() {
      // 字典类型
      const dictTypeSelectModelArray = ref<SelectModel[]>([]);
      // 生成配置
      const generatorConfig = ref<GeneratorConfig>({
        // 表信息
        tableInfo: null,
        // 基础
        basicsConfig: null,
      });

      // 当前步骤
      const current = ref<number>(0);

      onMounted(() => {
        selectAll().then((res) => {
          dictTypeSelectModelArray.value = res;
        });
      });

      /**
       * 更新配置
       *
       * @param property 属性
       * @param config 配置
       */
      function updateConfig(
        property: string,
        config:
          | TableInfo
          | BasicsConfigModel
          | FieldConfig[]
          | TableCellConfig[]
          | ImportCellConfig[],
      ) {
        const isChangeTable =
          property === 'tableInfo' &&
          unref(generatorConfig).tableInfo?.name != (config as TableInfo).name;
        generatorConfig.value[property] = config;
        if (isChangeTable) {
          setDefault();
        }
      }

      /**
       * 根据表信息设置默认值
       */
      function setDefault() {
        const dictTypeArray = toDictTypeArray(unref(dictTypeSelectModelArray));
        const tableInfo = unref(generatorConfig).tableInfo as TableInfo;
        // 更改了表，重新设置默认值
        generatorConfig.value.queryConfig = getDefaultForm(
          tableInfo,
          dictTypeArray,
          FORM_TYPE.QUERY as FormType,
        );
        generatorConfig.value.inputConfig = getDefaultForm(
          tableInfo,
          dictTypeArray,
          FORM_TYPE.INPUT as FormType,
        );
        generatorConfig.value.tableConfig = getDefaultTable(tableInfo, dictTypeArray);
        generatorConfig.value.exportConfig = getDefaultExport(tableInfo, dictTypeArray);
        generatorConfig.value.importConfig = getDefaultImport(tableInfo, dictTypeArray);
      }
      /**
       * 上一步
       */
      function handleStepPrev() {
        current.value--;
        const basicsConfig = unref(generatorConfig).basicsConfig as BasicsConfigModel;
        if (current.value >= 3) {
          if (needGeneratorImportOrExport(basicsConfig)) {
            return;
          } else {
            current.value--;
          }
        }
        if (current.value >= 2) {
          if (needGeneratorInput(basicsConfig)) {
            return;
          } else {
            current.value--;
          }
        }
        if (current.value >= 1) {
          if (needGeneratorList(basicsConfig)) {
            return;
          } else {
            current.value--;
          }
        }
      }

      /**
       * 下一步
       */
      function handleStepNext() {
        const basicsConfig = unref(generatorConfig).basicsConfig as BasicsConfigModel;
        current.value++;
        if (current.value < 2) {
          if (needGeneratorList(basicsConfig)) {
            return;
          } else {
            current.value++;
          }
        }
        if (current.value < 3) {
          if (needGeneratorInput(basicsConfig)) {
            return;
          } else {
            current.value++;
          }
        }
        if (current.value < 4) {
          if (needGeneratorImportOrExport(basicsConfig)) {
            return;
          } else {
            current.value++;
          }
        }
      }

      return {
        current,
        generatorConfig,
        updateConfig,
        handleStepPrev,
        handleStepNext,
      };
    },
  });
</script>

<style lang="less">
  @import 'generator.less';
</style>
