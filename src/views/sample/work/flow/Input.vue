<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="流程示例"
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
  import { defineComponent, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Icon } from '/@/components/Icon';
  import { add, save } from '/@/api/sample/work/sampleWorkFlow';
  import { SampleWorkFlow } from '/@/api/sample/model/sampleWorkFlowModel';
  export default defineComponent({
    name: 'SampleWorkFlowInput',
    components: { Icon, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        schemas: [
          { field: 'id', label: 'id', component: 'Input', ifShow: false },
          { field: 'version', label: 'version', component: 'Input', ifShow: false },
          {
            field: 'leaveType',
            label: '请假类型',
            required: true,
            component: 'DictSelect',
            componentProps: {
              dictType: 'leaveType',
            },
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'startDate',
            label: '开始时间',
            required: true,
            component: 'DatePicker',
            componentProps: {
              showTime: true,
            },
          },
          {
            field: 'endDate',
            label: '结束时间',
            required: true,
            component: 'DatePicker',
            componentProps: {
              showTime: true,
            },
          },
          {
            field: 'reason',
            label: '原因',
            required: true,
            component: 'InputTextArea',
            rules: [{ max: 512, message: '原因不能超过512个字符', trigger: 'blur' }],
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

      async function handleSubmit(callback: (_: SampleWorkFlow) => any) {
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

      async function handleSave() {
        await handleSubmit((_) => {
          changeLoading(false);
          closeDrawer();
        });
      }

      async function handleSaveAndAdd() {
        await handleSubmit(() => {
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

      return { registerDrawer, registerForm, handleSave, handleSaveAndAdd };
    },
  });
</script>
