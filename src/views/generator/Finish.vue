<template>
  <div class="generator-form">
    <h4>点击生成将生成以下文件</h4>
    <a-list size="small" bordered :data-source="generatorFileArray">
      <template #renderItem="{ item }">
        <a-list-item>{{ item }}</a-list-item>
      </template>
    </a-list>

    <div class="footer-button">
      <a-button @click="handleStepPrev">
        <template #icon>
          <Icon icon="ant-design:left-outlined" />
        </template>
        上一步
      </a-button>
      <a-button type="primary" @click="generateCode">
        <template #icon>
          <Icon icon="ant-design:check-outlined" />
        </template>
        生成
      </a-button>
      <a-checkbox v-model:checked="overwriteFile">
        <a-typography-text type="danger">警告：覆盖已有文件</a-typography-text>
      </a-checkbox>
    </div>

    <a-divider />
    <h3>说明</h3>
    <p>
      <a-typography-text type="danger"
        >警告：如勾选"覆盖已有文件"将会覆盖项目中已有文件，请谨慎操作</a-typography-text
      >
    </p>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { GeneratorConfig, GenFile } from '/@/views/generator/ts/generator.data';

  import { Icon } from '/@/components/Icon';
  import { firstLowerCase, getFrontEndPath } from '/@/views/generator/ts/util';
  import { generate } from '/@/api/generator/generator';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    components: { Icon },
    props: {
      generatorConfig: {
        type: Object as PropType<GeneratorConfig>,
      },
    },
    emits: ['prev'],
    setup(props, { emit }) {
      const { createMessage } = useMessage();

      const overwriteFile = ref<boolean>(false);

      const generatorFileArray = ref<string[]>([]);

      initGeneratorFileArray();

      watch(
        () => props.generatorConfig,
        () => {
          initGeneratorFileArray();
        },
        { deep: true },
      );

      /**
       * 预览生成文件列表
       */
      function initGeneratorFileArray() {
        generatorFileArray.value = [];
        const basicsConfig = props.generatorConfig?.basicsConfig;
        if (!basicsConfig || !basicsConfig.genFile || basicsConfig.genFile.length === 0) {
          return null;
        }
        basicsConfig.genFile.map((item) => {
          const packagePath = basicsConfig.packagePath?.replace(/\./g, '/');
          const backEndPathBasePath = `${basicsConfig.backEndPath}/src/main/java/`;
          switch (item) {
            case GenFile.MODEL:
              generatorFileArray.value.push(
                `${backEndPathBasePath}${packagePath}/model/${basicsConfig.modelName}.java`,
              );
              break;
            case GenFile.MAPPER:
              generatorFileArray.value.push(
                `${backEndPathBasePath}${packagePath}/dao/${basicsConfig.modelName}Mapper.java`,
              );
              break;
            case GenFile.MAPPING:
              generatorFileArray.value.push(
                `${backEndPathBasePath}${packagePath}/dao/mapping/${basicsConfig.modelName}Mapping.xml`,
              );
              break;
            case GenFile.SERVICE:
              generatorFileArray.value.push(
                `${backEndPathBasePath}${packagePath}/service/${basicsConfig.modelName}Service.java`,
              );
              break;
            case GenFile.SERVICE_IMPL:
              generatorFileArray.value.push(
                `${backEndPathBasePath}${packagePath}/service/impl/${basicsConfig.modelName}ServiceImpl.java`,
              );
              break;
            case GenFile.CONTROLLER:
              generatorFileArray.value.push(
                `${backEndPathBasePath}${packagePath}/controller/${basicsConfig.modelName}Controller.java`,
              );
              break;
            case GenFile.LIST_VUE:
              generatorFileArray.value.push(
                `${basicsConfig.frontEndPath}${basicsConfig.viewPath}/List.vue`,
              );
              break;
            case GenFile.INPUT_VUE:
              generatorFileArray.value.push(
                `${basicsConfig.frontEndPath}${basicsConfig.viewPath}/Input.vue`,
              );
              break;
            case GenFile.API_TS:
              generatorFileArray.value.push(`${basicsConfig.frontEndPath}${basicsConfig.apiPath}`);
              break;
            case GenFile.MODEL_TS:
              const modelName = `${firstLowerCase(basicsConfig.modelName as string)}Model.ts`;
              generatorFileArray.value.push(
                `${basicsConfig.frontEndPath}/src/api/${getFrontEndPath(
                  basicsConfig.table as string,
                )}/model/${modelName}`,
              );
              break;
          }
        });
      }

      function handleStepPrev() {
        emit('prev');
      }

      function generateCode() {
        const generatorConfig = cloneDeep(props.generatorConfig) as GeneratorConfig;
        if (generatorConfig.basicsConfig !== null) {
          generatorConfig.basicsConfig.overwrite = overwriteFile.value;
        }
        generatorConfig.queryConfig = generatorConfig.queryConfig?.filter((item) => item.isEnable);
        generatorConfig.tableConfig = generatorConfig.tableConfig?.filter((item) => item.isEnable);
        generatorConfig.inputConfig = generatorConfig.inputConfig?.filter((item) => item.isEnable);
        generatorConfig.importConfig = generatorConfig.importConfig?.filter(
          (item) => item.isEnable,
        );
        generatorConfig.exportConfig = generatorConfig.exportConfig?.filter(
          (item) => item.isEnable,
        );

        generate(generatorConfig as GeneratorConfig).then(() => {
          createMessage.success('生成成功');
        });
      }

      return { overwriteFile, generatorFileArray, handleStepPrev, generateCode };
    },
  });
</script>

<style scoped></style>
