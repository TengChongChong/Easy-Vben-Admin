<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="代码生成示例"
    width="30%"
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
  import { add, save } from '/@/api/sample/sampleGeneral';
  import { SampleGeneral } from '/@/api/sample/model/sampleGeneralModel';
  import { AButtonSave } from '/@/components/Button';
  export default defineComponent({
    name: 'SamplePageGeneralInput',
    components: { AButtonSave, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        labelWidth: 100,
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'name',
            label: '姓名',
            component: 'Input',
            rules: [{ max: 32, message: '姓名不能超过32个字符', trigger: 'blur' }],
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
            rules: [{ max: 32, message: '手机号码不能超过32个字符', trigger: 'blur' }],
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

      async function handleSubmit(callback: (_: SampleGeneral) => any) {
        try {
          changeLoading(true);
          await validate();
          await save(getFieldsValue() as SampleGeneral).then((res) => {
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
          add().then(async (data) => {
            // 重置表单
            await resetFields();
            await setFieldsValue(data);
            changeLoading(false);
          });
        });
      }

      return { registerDrawer, registerForm, handleSave, handleSaveAndAdd };
    },
  });
</script>
