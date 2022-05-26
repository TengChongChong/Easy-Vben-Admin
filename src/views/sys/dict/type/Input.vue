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
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { formSchema } from './dict-type.data';
  import { save } from '/@/api/sys/sysDictType';

  export default defineComponent({
    name: 'SysDictTypeInput',
    components: { BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const id = ref();
      const version = ref();

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      const [registerDrawer, { changeLoading, closeDrawer }] = useDrawerInner(async (data) => {
        changeLoading(true);
        // 重置表单
        await resetFields();
        id.value = data?.id || null;
        version.value = data?.version || 0;

        await setFieldsValue({
          ...data,
        });
        changeLoading(false);
      });

      async function handleSubmit() {
        try {
          changeLoading(true);
          const values = await validate();
          await save({ ...values, id: id.value, version: version.value }).then(() => {
            closeDrawer();
            emit('success');
          });
        } finally {
          changeLoading(false);
        }
      }

      return { registerDrawer, registerForm, handleSubmit };
    },
  });
</script>
