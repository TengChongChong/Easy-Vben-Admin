<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="从库示例"
    width="30%"
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
  import { defineComponent, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { add, save } from '/@/api/sample/slave/sampleSlaveGeneral';
  import { Icon } from '/@/components/Icon';
  import { SampleSlaveGeneral } from '/@/api/sample/model/sampleSlaveGeneralModel';

  export default defineComponent({
    name: 'SampleSlaveGeneralInput',
    components: { Icon, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        schemas: [
          { field: 'id', label: 'id', component: 'Input', ifShow: false },
          { field: 'version', label: 'version', component: 'Input', ifShow: false },
          {
            field: 'name',
            label: '姓名',
            component: 'Input',
            rules: [{ max: 50, message: '姓名不能超过50个字符', trigger: 'blur' }],
          },
          {
            field: 'sex',
            label: '性别',
            component: 'DictRadio',
            componentProps: {
              dictType: 'sex',
            },
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'age',
            label: '年龄',
            component: 'InputNumber',
            rules: [
              { type: 'number', max: 9999, message: '年龄不能大于9999', trigger: 'blur' },
              { type: 'number', min: 0, message: '年龄不能小于0', trigger: 'blur' },
            ],
          },
          {
            field: 'phone',
            label: '手机号码',
            component: 'Input',
            rules: [{ max: 20, message: '手机号码不能超过20个字符', trigger: 'blur' }],
          },
          {
            field: 'status',
            label: '状态',
            component: 'DictRadio',
            componentProps: {
              dictType: 'commonStatus',
            },
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'address',
            label: '地址',
            component: 'Input',
            rules: [{ max: 255, message: '地址不能超过255个字符', trigger: 'blur' }],
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

      async function handleSave(callback: (_: SampleSlaveGeneral) => any) {
        try {
          changeLoading(true);
          await validate();
          await save(getFieldsValue()).then((res) => {
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
            add().then(async (data) => {
              // 重置表单
              await resetFields();
              await setFieldsValue(data);
              changeLoading(false);
            });
          });
        });
      }

      return { registerDrawer, registerForm, handleSubmit, handleSaveAndAdd };
    },
  });
</script>
