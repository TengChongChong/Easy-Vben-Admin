<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="字典类型"
    width="30%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { formSchema } from './dict-type.data';
  import { save } from '/@/api/sys/sysDictType';

  export default defineComponent({
    name: 'SysDictTypeInput',
    components: { BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      // 数据是否更改
      const isUpdate = ref(true);
      const id = ref();
      const version = ref();

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        // 重置表单
        await resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        id.value = data.data?.id || null;
        version.value = data.data?.version || 0;

        if (unref(isUpdate)) {
          await setFieldsValue({
            ...data.data,
          });
        }
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          save({ ...values, id: id.value, version: version.value }).then(() => {
            closeDrawer();
            emit('success');
          });
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, handleSubmit };
    },
  });
</script>
