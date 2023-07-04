<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="导入模板"
    width="30%"
    @ok="handleSave"
  >
    <BasicForm @register="registerForm" />
    <template #appendFooter>
      <a-button type="primary" @click="handleSaveAndAdd">
        <Icon icon="ant-design:plus-outlined" />
        保存并新增
      </a-button>
    </template>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Icon } from '/@/components/Icon';
  import { save } from '/@/api/sys/sysImportExcelTemplate';
  import { SysImportExcelTemplate } from '/@/api/sys/model/sysImportExcelTemplateModel';
  import { selectTable } from '/@/api/generator/generator';
  import { SelectModel } from '/@/api/model/selectModel';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'SysImportExcelTemplateInput',
    components: { Icon, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      let tableArray: SelectModel[] = [];
      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'importTable',
            label: '表',
            required: true,
            component: 'ApiSelect',
            componentProps: {
              api: selectTable,
              params: {
                dataSource: 'master',
              },
              afterFetch: (result) => {
                tableArray = cloneDeep(result);
                result.map((item) => {
                  item.label = `${item.value} - ${item.label}`;
                });
                return result;
              },
              onChange: (value) => {
                handleTableChange(value);
              },
            },
            itemProps: { validateTrigger: 'blur' },
            rules: [{ max: 64, message: '表不能超过64个字符', trigger: 'blur' }],
          },
          {
            field: 'name',
            label: '模板名称',
            required: true,
            component: 'Input',
            rules: [{ max: 64, message: '模板名称不能超过64个字符', trigger: 'blur' }],
          },
          {
            field: 'startRow',
            label: '起始行',
            required: true,
            component: 'InputNumber',
            rules: [
              { type: 'number', max: 99, message: '起始行不能大于99', trigger: 'blur' },
              { type: 'number', min: 0, message: '起始行不能小于0', trigger: 'blur' },
            ],
          },
          {
            field: 'callback',
            label: '回调',
            required: true,
            component: 'Input',
            rules: [{ max: 255, message: '回调不能超过255个字符', trigger: 'blur' }],
          },
          {
            field: 'importCode',
            label: '模板代码',
            required: true,
            component: 'Input',
            rules: [{ max: 64, message: '模板代码不能超过64个字符', trigger: 'blur' }],
          },
          {
            field: 'permissionCode',
            label: '权限代码',
            component: 'Input',
            rules: [{ max: 64, message: '权限代码不能超过64个字符', trigger: 'blur' }],
          },
          {
            field: 'remarks',
            label: '备注',
            component: 'InputTextArea',
            rules: [{ max: 1024, message: '备注不能超过1024个字符', trigger: 'blur' }],
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      const [registerDrawer, { changeLoading, closeDrawer }] = useDrawerInner(async (data) => {
        changeLoading(true);
        // 重置表单
        await resetFields();
        await setFieldsValue(data);
        changeLoading(false);
      });

      function handleTableChange(table) {
        const tableInfo = tableArray.filter((item) => item.value === table);

        const importCode = table.replace(new RegExp('_', 'g'), ':');

        setFieldsValue({
          importCode,
          name: tableInfo && tableInfo.length ? tableInfo[0].label : '',
          callback: `${underlineToHump(table)}ServiceImpl`,
          permissionCode: `${importCode}:import:data`,
        });
      }

      /**
       * 下换下转驼峰
       *
       * @param tableName {string} 表名
       * @return {string} 驼峰命名
       */
      function underlineToHump(tableName: string) {
        const temp = tableName.split('_');
        let modelName;
        if (temp.length === 1) {
          modelName = tableName;
        } else {
          modelName = '';
          temp.map((item, index) => {
            if (index !== 0) {
              modelName +=
                item.substring(0, 1).toLocaleUpperCase() + item.substring(1, item.length);
            } else {
              modelName += item;
            }
          });
        }
        return modelName;
      }

      async function handleSubmit(callback: (_: SysImportExcelTemplate) => any) {
        try {
          changeLoading(true);
          await validate();
          await save(getFieldsValue() as SysImportExcelTemplate).then((res) => {
            message.success('保存成功');
            emit('success');
            callback(res);
          });
        } catch (e) {
          console.error(e);
          changeLoading(false);
        } finally {
          changeLoading(false);
        }
      }

      async function handleSave() {
        await handleSubmit((_) => {
          closeDrawer();
        });
      }

      async function handleSaveAndAdd() {
        await handleSubmit(async () => {
          // 重置表单
          await resetFields();
          await setFieldsValue({ startRow: 1 });
        });
      }

      return { registerDrawer, registerForm, handleSave, handleSaveAndAdd };
    },
  });
</script>
