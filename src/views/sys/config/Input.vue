<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="字典"
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
  import { defineComponent, nextTick, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { save } from '/@/api/sys/sysConfig';
  import { Icon } from '/@/components/Icon';
  import { SysConfig } from '/@/api/sys/model/sysConfigModel';
  import { RoleEnum } from '/@/enums/roleEnum';

  export default defineComponent({
    name: 'SysConfigInput',
    components: { Icon, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const id = ref();
      const version = ref();

      const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
        labelWidth: 100,
        schemas: [
          {
            field: 'type',
            label: '类型',
            component: 'DictRadio',
            componentProps: {
              dictType: 'dataType',
              onChange: (value) => {
                setInputComponent(value);
              },
            },
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

        setInputComponent(data?.type);
        await setFieldsValue({
          ...data,
        });
        changeLoading(false);
      });

      function setInputComponent(type) {
        switch (type) {
          case 'text':
            updateSchema({
              field: 'value',
              component: 'Input',
              rules: [{ max: 255, message: 'value不能超过255个字符', trigger: 'blur' }],
            });
            break;
          case 'number':
            updateSchema({
              field: 'value',
              component: 'InputNumber',
              rules: [
                { type: 'number', max: 99999999, message: 'value不能大于999', trigger: 'blur' },
                { type: 'number', min: -99999999, message: 'value不能小于0', trigger: 'blur' },
              ],
            });
            break;
          case 'boolean':
            updateSchema({
              field: 'value',
              component: 'DictRadio',
              componentProps: {
                dictType: 'boolean',
                rules: [{ max: 255, message: 'value不能超过255个字符', trigger: 'blur' }],
              },
            });
        }
      }

      async function handleSave(callback: (_: SysConfig) => any) {
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
        await handleSave((res) => {
          nextTick(() => {
            // 重置表单
            resetFields();
            id.value = null;
            version.value = null;

            setFieldsValue({
              type: res.type,
              sys: res.sys,
            });

            changeLoading(false);
          });
        });
      }

      return { registerDrawer, registerForm, handleSubmit, handleSaveAndAdd };
    },
  });
</script>
