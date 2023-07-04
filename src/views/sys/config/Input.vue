<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="系统参数"
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

  import { save } from '/@/api/sys/sysConfig';
  import { SysConfig } from '/@/api/sys/model/sysConfigModel';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { AButtonSave } from '/@/components/Button';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'SysConfigInput',
    components: { AButtonSave, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const [
        registerForm,
        { resetFields, setFieldsValue, validate, updateSchema, getFieldsValue },
      ] = useForm({
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'type',
            label: '类型',
            component: 'DictRadio',
            componentProps: {
              dictType: 'dataType',
              onChange: async (value) => {
                await setInputComponent(value);
              },
            },
            required: true,
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'sysKey',
            label: 'key',
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: 'key不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'value',
            label: 'value',
            component: 'Input',
            required: true,
            rules: [{ max: 255, message: 'value不能超过255个字符', trigger: 'blur' }],
          },
          {
            field: 'sys',
            label: '是否系统',
            required: true,
            auth: RoleEnum.SYS_ADMIN,
            component: 'DictRadio',
            componentProps: {
              dictType: 'whether',
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
        await setInputComponent(data?.type);
        await setFieldsValue(data);
        changeLoading(false);
      });

      async function setInputComponent(type) {
        switch (type) {
          case 'text':
            await updateSchema({
              field: 'value',
              component: 'Input',
              rules: [{ max: 255, message: 'value不能超过255个字符', trigger: 'blur' }],
            });
            break;
          case 'number':
            await updateSchema({
              field: 'value',
              component: 'InputNumber',
              rules: [],
            });
            break;
          case 'boolean':
            await updateSchema({
              field: 'value',
              component: 'DictRadio',
              componentProps: {
                dictType: 'boolean',
                rules: [],
              },
            });
        }
      }

      async function handleSubmit(callback: (_: SysConfig) => any) {
        try {
          changeLoading(true);
          await validate();
          await save(getFieldsValue() as SysConfig).then((res) => {
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
        await handleSubmit((res) => {
          // 重置表单
          resetFields();
          setFieldsValue({
            type: res.type,
            sys: res.sys,
          });

          changeLoading(false);
        });
      }

      return { registerDrawer, registerForm, handleSave, handleSaveAndAdd };
    },
  });
</script>
