<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="数据源"
    width="60%"
    @ok="handleSubmit"
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
  import { defineComponent, nextTick, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { save, add } from '/@/api/sys/sysDataSource';
  import { Icon } from '/@/components/Icon';
  import { SysDataSource } from '/@/api/sys/model/sysDataSourceModel';

  export default defineComponent({
    name: 'SysDataSourceInput',
    components: { Icon, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const id = ref();
      const version = ref();

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        schemas: [
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
            label: '用户名',
            component: 'Input',
            required: true,
            rules: [{ max: 128, message: '用户名不能超过128个字符', trigger: 'blur' }],
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
        id.value = data?.id;
        version.value = data?.version || 0;

        await setFieldsValue({
          ...data,
        });
        changeLoading(false);
      });

      async function handleSave(callback: (_: SysDataSource) => any) {
        try {
          changeLoading(true);
          const values = await validate();
          await save({ ...values, id: id.value, version: version.value }).then((res) => {
            emit('success');
            callback(res);
          });
        } catch (e) {
          console.error(e);
          changeLoading(false);
        }
      }

      async function handleSubmit() {
        await handleSave((_) => {
          changeLoading(false);
          closeDrawer();
        });
      }

      async function handleSaveAndAdd() {
        await handleSave(() => {
          nextTick(() => {
            // 重置表单
            resetFields();
            id.value = null;
            version.value = null;

            add().then(async (data) => {
              await setFieldsValue({
                ...data,
              });
            });
            changeLoading(false);
          });
        });
      }

      return { registerDrawer, registerForm, handleSubmit, handleSaveAndAdd };
    },
  });
</script>