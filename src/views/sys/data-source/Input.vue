<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="数据源"
    width="60%"
    @ok="handleSave"
  >
    <BasicForm @register="registerForm" />

    <template #appendFooter>
      <a-button-save @click="handleSaveAndAdd" text="保存并新增" />
    </template>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { save, add } from '/@/api/sys/sysDataSource';
  import { SysDataSource } from '/@/api/sys/model/sysDataSourceModel';
  import { AButtonSave } from '/@/components/Button';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'SysDataSourceInput',
    components: { AButtonSave, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'name',
            label: '名称',
            component: 'Input',
            required: true,
            rules: [{ max: 64, message: '名称不能超过64个字符', trigger: 'blur' }],
          },
          {
            field: 'url',
            label: 'Url',
            component: 'InputTextArea',
            required: true,
            rules: [{ max: 900, message: 'Url不能超过900个字符', trigger: 'blur' }],
          },
          {
            field: 'username',
            label: '账号',
            component: 'Input',
            required: true,
            rules: [{ max: 128, message: '账号不能超过128个字符', trigger: 'blur' }],
            colProps: { xl: 12, lg: 24 },
          },
          {
            field: 'password',
            label: '密码',
            component: 'InputPassword',
            required: true,
            rules: [{ max: 128, message: '密码不能超过128个字符', trigger: 'blur' }],
            componentProps: {
              autocomplete: 'new-password',
            },
            colProps: { xl: 12, lg: 24 },
          },
          {
            field: 'status',
            label: '状态',
            required: true,
            component: 'DictRadio',
            componentProps: {
              dictType: 'commonStatus',
            },
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'remarks',
            label: '备注',
            component: 'InputTextArea',
            rules: [{ max: 900, message: '备注不能超过900个字符', trigger: 'blur' }],
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

      async function handleSubmit(callback: (_: SysDataSource) => any) {
        try {
          changeLoading(true);
          await validate();
          await save(getFieldsValue() as SysDataSource).then((res) => {
            message.success('保存成功');
            emit('success');
            callback(res);
          });
        } catch (e) {
          console.error(e);
          changeLoading(false);
        }
      }

      async function handleSave() {
        await handleSubmit((_) => {
          changeLoading(false);
          closeDrawer();
        });
      }

      async function handleSaveAndAdd() {
        await handleSubmit(() => {
          // 重置表单
          resetFields();
          add().then(async (data) => {
            await setFieldsValue(data);
          });
          changeLoading(false);
        });
      }

      return { registerDrawer, registerForm, handleSave, handleSaveAndAdd };
    },
  });
</script>
