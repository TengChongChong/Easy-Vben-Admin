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
  import { defineComponent, ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { add, save } from '/@/api/sys/sysDict';
  import { formSchema } from '/@/views/sys/dict/dict.data';
  import Icon from '/@/components/Icon/src/Icon.vue';

  export default defineComponent({
    name: 'SysDictInput',
    components: { Icon, BasicForm, BasicDrawer },
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

      async function handleSave(callback: (SysDict) => any) {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          save({ ...values, id: id.value, version: version.value }).then((res) => {
            emit('success');
            callback(res);
          });
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      async function handleSubmit() {
        await handleSave((_) => {
          closeDrawer();
        });
      }

      async function handleSaveAndAdd() {
        await handleSave((res) => {
          nextTick(() => {
            add(res.parentId, res.dictType).then(async (data) => {
              // 重置表单
              await resetFields();
              id.value = null;
              await setFieldsValue({
                ...data,
              });
            });
          });
        });
      }

      return { registerDrawer, registerForm, handleSubmit, handleSaveAndAdd };
    },
  });
</script>
