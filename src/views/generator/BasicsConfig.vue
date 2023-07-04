<template>
  <div class="generator-form">
    <a-alert
      v-if="tableInfo && !tableInfo?.havePrimaryKey"
      :message="`注意：${tableInfo?.name}表无主键`"
      banner
    />

    <BasicForm @register="registerForm">
      <template #listGeneratorTemplate="{ model, field }">
        <chose-button-group
          :options="[
            { name: '表格 - Table', label: '展示行列数据', value: 'table' },
            {
              name: '树表格 - TreeTable',
              label: '树形数据展示，可拖动调整排序或结构',
              value: 'tree-table',
              tips: '默认使用id作为主键，parent_id作为父id，order_no作为排序值，如需修改请生成后调整',
            },
          ]"
          v-model:value="model[field]"
        />
      </template>
      <template #formGeneratorTemplate="{ model, field }">
        <chose-button-group
          :options="[
            { name: '对话框 - Modal', label: '适用于简单表单，1 ~ 8 个字段', value: 'modal' },
            {
              name: '抽屉 - Drawer',
              label: '适用于常规表单，6个及以上字段',
              value: 'drawer',
            },
            {
              name: '页面 - Page',
              label: '适用于复杂表单，使用新标签页打开',
              value: 'page',
            },
          ]"
          v-model:value="model[field]"
        />
      </template>
      <template #backEndPath="{ model, field }">
        <a-input v-model:value="model[field]">
          <template #addonBefore>
            <a-select
              v-model:value="moduleValue"
              :options="modules"
              @change="handleModuleChange"
              style="width: 260px"
            />
          </template>
        </a-input>
      </template>
    </BasicForm>

    <div class="footer-button">
      <a-button type="primary" @click="handleStepNext">
        <template #icon>
          <Icon icon="ant-design:right-outlined" />
        </template>
        下一步
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import {
    BasicsConfigModel,
    GenFile,
    FormGeneratorTemplate,
    ListGeneratorTemplate,
    TEMPLATE,
  } from '/@/views/generator/ts/generator.data';
  import { Icon } from '/@/components/Icon';
  import { BasicForm, useForm } from '/@/components/Form';
  import { selectOptions } from '/@/api/sys/sysDataSource';
  import { getTableInfo, selectModules, selectTable } from '/@/api/generator/generator';
  import { SelectModel } from '/@/api/model/selectModel';
  import { isArray } from '/@/utils/is';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useUserStore } from '/@/store/modules/user';
  import {
    firstLowerCase,
    getControllerMapping,
    getFrontEndApiPath,
    getPermissionCode,
  } from '/@/views/generator/ts/util';
  import { TableInfo } from '/@/api/generator/model/generatorModel';
  import ChoseButtonGroup from '/@/views/generator/components/ChoseButtonGroup.vue';

  export default defineComponent({
    components: { ChoseButtonGroup, BasicForm, Icon },
    emits: ['next', 'prev', 'update-config'],
    setup(_, { emit }) {
      const globSetting = useGlobSetting();
      const userStore = useUserStore();

      // 表信息
      const tableInfo = ref<TableInfo>();
      // 默认设置
      const defaultConfig: BasicsConfigModel = {
        listGeneratorTemplate: ListGeneratorTemplate.TABLE,
        formGeneratorTemplate: FormGeneratorTemplate.DRAWER,
        dataSource: 'master',
        author: userStore.getCurrentUser?.nickname,
        frontEndPath: globSetting.projectPath,
        genMethod: [],
        genFile: [],
        overwrite: false,
      };
      // 后端模块列表
      const modules = ref<SelectModel[]>([]);
      // 后端模块
      const moduleValue = ref<string | number | undefined>();

      onMounted(() => {
        selectModules().then((res) => {
          modules.value = res;
        });

        setFieldsValue({ ...defaultConfig });
        handleGeneratorTemplateChange(defaultConfig.listGeneratorTemplate);
        handleDataSourceChange(defaultConfig.dataSource);
      });

      const [registerForm, { updateSchema, setFieldsValue, getFieldsValue, validate }] = useForm({
        labelWidth: 180,
        schemas: [
          {
            field: 'divider-template',
            component: 'Divider',
            label: '模板',
            colProps: { xxl: 24, xl: 24, lg: 24 },
          },
          {
            field: 'genMethod',
            label: '生成方法',
            helpMessage: '需要生成的方法',
            component: 'DictCheckbox',
            required: true,
            componentProps: {
              dictType: 'genMethod',
            },
            colProps: { xxl: 24, xl: 24, lg: 24 },
          },
          {
            field: 'genFile',
            label: '生成文件',
            helpMessage: '需要生成的文件',
            component: 'DictCheckbox',
            required: true,
            componentProps: {
              dictType: 'genFile',
            },
            colProps: { xxl: 24, xl: 24, lg: 24 },
          },
          {
            field: 'listGeneratorTemplate',
            label: '列表模板',
            component: 'InputGroup',
            slot: 'listGeneratorTemplate',
            required: true,
            ifShow: ({ values }) => needShow(values.genFile, [GenFile.LIST_VUE]),
            colProps: { xxl: 24, xl: 24, lg: 24 },
          },
          {
            field: 'formGeneratorTemplate',
            label: '表单模板',
            component: 'InputGroup',
            slot: 'formGeneratorTemplate',
            required: true,
            ifShow: ({ values }) => needShow(values.genFile, [GenFile.INPUT_VUE]),
            itemProps: { validateTrigger: 'blur' },
            colProps: { xxl: 24, xl: 24, lg: 24 },
          },
          {
            field: 'divider-db',
            component: 'Divider',
            label: '基础信息',
            colProps: { xxl: 24, xl: 24, lg: 24 },
          },
          {
            field: 'dataSource',
            label: '数据源',
            component: 'ApiSelect',
            componentProps: {
              api: selectOptions,
              onChange: (value) => {
                handleDataSourceChange(value);
              },
            },
            required: true,
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'table',
            label: '表',
            component: 'Select',
            componentProps: {
              api: selectTable,
              afterFetch: (result) => {
                result.map((item) => {
                  item.label = `${item.value} - ${item.label}`;
                });
                return result;
              },
              onChange: (value) => {
                handleTableChange(value);
              },
            },
            required: true,
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'modelName',
            label: 'Model 名称',
            component: 'Input',
            helpMessage: '用于前后端Model命名',
            required: true,
          },
          {
            field: 'businessName',
            label: '业务名称',
            component: 'Input',
            helpMessage: '用于controller/entity/dao/service/ts文件注释',
            required: true,
          },
          {
            field: 'controllerMapping',
            label: 'Api Url前缀',
            helpMessage: '用于Controller中@RequestMapping与Api.ts中BASE_URL',
            component: 'Input',
            required: true,
          },
          {
            field: 'divider-java',
            component: 'Divider',
            label: '后端',
            colProps: { xxl: 24, xl: 24, lg: 24 },
            ifShow: ({ values }) =>
              needShow(values.genFile, [
                GenFile.MODEL,
                GenFile.MAPPER,
                GenFile.SERVICE,
                GenFile.CONTROLLER,
              ]),
          },
          {
            field: 'backEndPath',
            label: '后端项目路径',
            component: 'InputGroup',
            slot: 'backEndPath',
            helpMessage: 'idea中的项目绝对路径，无需/结尾',
            required: true,
            colProps: { xxl: 24, xl: 24, lg: 24 },
            ifShow: ({ values }) =>
              needShow(values.genFile, [
                GenFile.MODEL,
                GenFile.MAPPER,
                GenFile.SERVICE,
                GenFile.CONTROLLER,
              ]),
          },
          {
            field: 'author',
            label: '作者',
            component: 'Input',
            helpMessage: '注释中的 @author',
            required: true,
            ifShow: ({ values }) =>
              needShow(values.genFile, [
                GenFile.MODEL,
                GenFile.MAPPER,
                GenFile.SERVICE,
                GenFile.CONTROLLER,
              ]),
          },
          {
            field: 'menuName',
            label: '菜单名称',
            helpMessage: '如填写会自动添加菜单及权限',
            component: 'Input',
            ifShow: ({ values }) => needShow(values.genFile, [GenFile.CONTROLLER]),
          },
          {
            field: 'permissionCode',
            label: '权限标识',
            helpMessage: 'Controller方法中的@RequiresPermissions值前缀',
            component: 'Input',
            ifShow: ({ values }) => needShow(values.genFile, [GenFile.CONTROLLER]),
          },
          {
            field: 'packagePath',
            label: 'package',
            helpMessage: 'package 路径',
            component: 'Input',
            required: true,
            ifShow: ({ values }) =>
              needShow(values.genFile, [
                GenFile.MODEL,
                GenFile.MAPPER,
                GenFile.SERVICE,
                GenFile.CONTROLLER,
              ]),
          },
          {
            field: 'divider-front-end',
            component: 'Divider',
            label: '前端',
            colProps: { xxl: 24, xl: 24, lg: 24 },
            ifShow: ({ values }) =>
              needShow(values.genFile, [GenFile.LIST_VUE, GenFile.INPUT_VUE, GenFile.API_TS]),
          },
          {
            field: 'frontEndPath',
            label: '前端项目路径',
            helpMessage: 'idea中的项目绝对路径，无需/结尾',
            component: 'Input',
            required: true,
            colProps: { xxl: 24, xl: 24, lg: 24 },
            ifShow: ({ values }) =>
              needShow(values.genFile, [GenFile.LIST_VUE, GenFile.INPUT_VUE, GenFile.API_TS]),
          },
          {
            field: 'viewPath',
            label: '页面路径',
            helpMessage: '*.vue存放路径',
            component: 'Input',
            componentProps: {
              prefix: '前端项目路径+',
            },
            required: true,
            colProps: { xxl: 12, xl: 12, md: 24 },
            ifShow: ({ values }) => needShow(values.genFile, [GenFile.LIST_VUE, GenFile.INPUT_VUE]),
          },
          {
            field: 'apiPath',
            label: 'api路径',
            helpMessage: 'api.ts存放路径',
            component: 'Input',
            componentProps: {
              prefix: '前端项目路径+',
            },
            required: true,
            colProps: { xxl: 12, xl: 12, md: 24 },
            ifShow: ({ values }) => needShow(values.genFile, [GenFile.API_TS]),
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { xxl: 6, xl: 8, lg: 12, md: 24 },
      });

      /**
       * 更改表
       *
       * @param table
       */
      function handleTableChange(table: string) {
        const values = getFieldsValue() as BasicsConfigModel;
        // @ts-ignore
        if (values.dataSource && table) {
          getTableInfo(values.dataSource, table).then((info) => {
            tableInfo.value = info;
            const { comment, entityName } = info;
            let packagePath = table;
            if (table.indexOf('_') > -1) {
              packagePath = table.substring(0, table.indexOf('_'));
            }
            // 设置一些默认值
            setFieldsValue({
              businessName: comment,
              menuName: comment,
              modelName: entityName,
              permissionCode: getPermissionCode(table),
              packagePath: `com.easy.admin.${packagePath}`,
              controllerMapping: `/auth/${getControllerMapping(table)}`,
              viewPath: `/src/views/${getControllerMapping(table)}`,
              apiPath: `/src/api/${getFrontEndApiPath(table)}/${firstLowerCase(entityName)}.ts`,
            });
            // 设置模块
            setModules(table);
          });
        }
      }

      function setModules(table: string) {
        let prefix = table;
        if (table.indexOf('_') > -1) {
          prefix = table.substring(0, table.indexOf('_'));
        }

        for (let i = 0; i < modules.value.length; i++) {
          if (modules.value[i].label.indexOf(prefix) > -1) {
            moduleValue.value = modules.value[i].value;
            setFieldsValue({
              backEndPath: moduleValue.value,
            });
            return;
          }
        }
      }

      /**
       * 更改生成模板
       *
       * @param generatorTemplate 模板
       */
      function handleGeneratorTemplateChange(generatorTemplate) {
        const config = TEMPLATE[generatorTemplate];
        if (config) {
          setFieldsValue({
            genFile: config.file,
            genMethod: config.method,
          });
        }
      }

      function handleDataSourceChange(dataSource) {
        updateSchema({
          field: 'table',
          component: dataSource ? 'ApiSelect' : 'Select',
          componentProps: {
            params: {
              dataSource,
            },
          },
        });
      }

      /**
       * 更改后端模块
       *
       * @param path 模块路径
       */
      function handleModuleChange(path) {
        setFieldsValue({
          backEndPath: path,
        });
      }

      /**
       * 是否需要显示
       *
       * @param files 当前选中生成文件
       * @param file 需要显示的文件
       */
      function needShow(files: string[], file: string[] | string): boolean {
        if (!files || !files.length) {
          return false;
        }
        if (isArray(file)) {
          for (let i = 0; i < file.length; i++) {
            if (files.indexOf(file[i]) > -1) {
              return true;
            }
          }
          return false;
        } else {
          return files.indexOf(file) > -1;
        }
      }

      async function handleStepNext() {
        try {
          const values = await validate();
          emit('update-config', 'tableInfo', unref(tableInfo));
          emit('update-config', 'basicsConfig', values);
          emit('next');
        } catch (e) {
          console.error(e);
        }
      }

      return {
        tableInfo,
        handleModuleChange,
        handleStepNext,
        registerForm,
        modules,
        moduleValue,
      };
    },
  });
</script>

<style scoped></style>
